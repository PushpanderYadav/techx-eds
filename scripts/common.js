import { createVideo, isVideoLink } from "./video-helper.js";

let placeholders = null;

export function createElement(tagName, options = {}) {
  const { classes = [], props = {} } = options;
  const elem = document.createElement(tagName);
  const isString = typeof classes === "string";
  if (
    classes ||
    (isString && classes !== "") ||
    (!isString && classes.length > 0)
  ) {
    const classesArr = isString ? [classes] : classes;
    elem.classList.add(...classesArr);
  }
  if (!isString && classes.length === 0) {
    elem.removeAttribute("class");
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      const value = propName === props[propName] ? "" : props[propName];
      elem.setAttribute(propName, value);
    });
  }

  return elem;
}

export function createNewSection(blockName, sectionName, node) {
  const section = createElement("div", {
    classes: `${blockName}__${sectionName}-section`,
  });
  section.append(node);
  return section;
}

export function addVideoToSection(blockName, section, link) {
  const isVideo = link ? isVideoLink(link) : false;
  if (isVideo) {
    const video = createVideo(
      link.getAttribute("href"),
      `${blockName}__video`,
      {
        muted: true,
        autoplay: true,
        loop: true,
        playsinline: true,
      }
    );
    link.remove();
    section.append(video);
  }
  return section;
}

export async function decorateIcons(element) {
  // Prepare the inline sprite
  let svgSprite = document.getElementById("franklin-svg-sprite");
  if (!svgSprite) {
    const div = document.createElement("div");
    div.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
    svgSprite = div.firstElementChild;
    document.body.append(div.firstElementChild);
  }

  // Download all new icons
  const icons = [...element.querySelectorAll("span.icon")];
  await Promise.all(
    icons.map(async (span) => {
      const iconName = Array.from(span.classList)
        .find((c) => c.startsWith("icon-"))
        .substring(5);
      if (!ICONS_CACHE[iconName]) {
        ICONS_CACHE[iconName] = true;
        try {
          const response = await fetch(
            `${window.hlx.codeBasePath}/icons/${iconName}.svg`
          );
          if (!response.ok) {
            ICONS_CACHE[iconName] = false;
            return;
          }
          // Styled icons don't play nice with the sprite approach because of shadow dom isolation
          const svg = await response.text();
          if (svg.match(/(<style | class=)/)) {
            ICONS_CACHE[iconName] = { styled: true, html: svg };
          } else {
            ICONS_CACHE[iconName] = {
              html: svg
                .replace("<svg", `<symbol id="icons-sprite-${iconName}"`)
                .replace(/ width=".*?"/, "")
                .replace(/ height=".*?"/, "")
                .replace("</svg>", "</symbol>"),
            };
          }
        } catch (error) {
          ICONS_CACHE[iconName] = false;

          console.error(error);
        }
      }
    })
  );

  const symbols = Object.keys(ICONS_CACHE)
    .filter((k) => !svgSprite.querySelector(`#icons-sprite-${k}`))
    .map((k) => ICONS_CACHE[k])
    .filter((v) => !v.styled)
    .map((v) => v.html)
    .join("\n");
  svgSprite.innerHTML += symbols;

  icons.forEach((span) => {
    const iconName = Array.from(span.classList)
      .find((c) => c.startsWith("icon-"))
      .substring(5);
    const parent =
      span.firstElementChild?.tagName === "A" ? span.firstElementChild : span;
    // Styled icons need to be inlined as-is, while unstyled ones can leverage the sprite
    if (ICONS_CACHE[iconName].styled) {
      parent.innerHTML = ICONS_CACHE[iconName].html;
    } else {
      parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"><use href="#icons-sprite-${iconName}"/></svg>`;
    }
  });
}

export const removeEmptyTags = (block, isRecursive) => {
  const isEmpty = (node) => {
    const tagName = `</${node.tagName}>`;

    // exclude iframes
    if (node.tagName.toUpperCase() === "IFRAME") {
      return false;
    }
    // checking that the tag is not autoclosed to make sure we don't remove <meta />
    // checking the innerHTML and trim it to make sure the content inside the tag is 0
    return (
      node.outerHTML.slice(tagName.length * -1).toUpperCase() === tagName &&
      node.innerHTML.trim().length === 0
    );
  };

  if (isRecursive) {
    block.querySelectorAll(":scope > *").forEach((node) => {
      if (node.children.length > 0) {
        removeEmptyTags(node, true);
      }

      if (isEmpty(node)) {
        node.remove();
      }
    });
    return;
  }

  block.querySelectorAll("*").forEach((node) => {
    if (isEmpty(node)) {
      node.remove();
    }
  });
};

export const variantsClassesToBEM = (
  blockClasses,
  expectedVariantsNames,
  blockName
) => {
  expectedVariantsNames.forEach((variant) => {
    if (blockClasses.contains(variant)) {
      blockClasses.remove(variant);
      blockClasses.add(`${blockName}--${variant}`);
    }
  });
};

export function debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export async function getPlaceholders() {
  const url = `${getLanguagePath()}placeholder.json`;
  placeholders = await fetch(url).then((resp) => resp.json());
}

export function getTextLabel(key) {
  return placeholders?.data.find((el) => el.Key === key)?.Text || key;
}
