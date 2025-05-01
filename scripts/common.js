import { createVideo, isVideoLink } from './video-helper.js';
import { createElement } from './utills.js';

export function createNewSection(blockName, sectionName, node) {
  const section = createElement('div', {
    classes: `${blockName}__${sectionName}-section`,
  });
  section.append(node);
  return section;
}

export function addVideoToSection(blockName, section, link) {
  const isVideo = link ? isVideoLink(link) : false;
  if (isVideo) {
    const video = createVideo(
      link.getAttribute('href'),
      `${blockName}__video`,
      {
        muted: true,
        autoplay: true,
        loop: true,
        playsinline: true,
      },
    );
    link.remove();
    section.append(video);
  }
  return section;
}

export async function decorateIcons() {
  // Prepare the inline sprite
  let svgSprite = document.getElementById('franklin-svg-sprite');
  if (!svgSprite) {
    const div = document.createElement('div');
    div.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" id="franklin-svg-sprite" style="display: none"></svg>';
    svgSprite = div.firstElementChild;
    document.body.append(div.firstElementChild);
  }
}

export const removeEmptyTags = (block, isRecursive) => {
  const isEmpty = (node) => {
    const tagName = `</${node.tagName}>`;

    // exclude iframes
    if (node.tagName.toUpperCase() === 'IFRAME') {
      return false;
    }
    // checking that the tag is not autoclosed to make sure we don't remove <meta />
    // checking the innerHTML and trim it to make sure the content inside the tag is 0
    return (
      node.outerHTML.slice(tagName.length * -1).toUpperCase() === tagName
      && node.innerHTML.trim().length === 0
    );
  };

  if (isRecursive) {
    block.querySelectorAll(':scope > *').forEach((node) => {
      if (node.children.length > 0) {
        removeEmptyTags(node, true);
      }

      if (isEmpty(node)) {
        node.remove();
      }
    });
    return;
  }

  block.querySelectorAll('*').forEach((node) => {
    if (isEmpty(node)) {
      node.remove();
    }
  });
};

export const variantsClassesToBEM = (
  blockClasses,
  expectedVariantsNames,
  blockName,
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
