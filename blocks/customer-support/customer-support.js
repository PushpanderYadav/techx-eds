const blockName = "customerSupport";

function createElement(tag, { classes = "", attrs = {}, props = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  Object.entries(props).forEach(([key, value]) => (el[key] = value));
  return el;
}

export default function decorate(block) {
  // Wrap all blocks into a single .customer-support-wrapper per container
  const container = block.closest(".customer-support-container");
  if (container) {
    let wrapper = container.querySelector(".customer-support-wrapper");
    if (!wrapper) {
      wrapper = createElement("div", { classes: "customer-support-wrapper" });
      container.append(wrapper);
    }
    wrapper.append(block);
    // After appending all, remove any empty wrappers
    container.querySelectorAll(".customer-support-wrapper").forEach((w) => {
      if (w.children.length === 0) w.remove();
    });
  }

  // Now process each block as before
  if (block.classList.contains("grid-row-col-1")) {
    // handle single-column layout
  } else if (block.classList.contains("grid-row-col-2")) {
    const items = block.querySelectorAll(":scope > div");
    const first = items[0];
    const bgSrc = first.querySelector("img")?.src;
    first.remove();

    const mainWrapper = createElement("div", {
      classes: `${blockName}__main-wrapper`,
    });
    const bgWrapper = createElement("div", {
      classes: `${blockName}__bg-wrapper`,
    });
    if (bgSrc) {
      Object.assign(bgWrapper.style, {
        backgroundImage: `url(${bgSrc})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      });
    }
    // move remaining children into bgWrapper
    Array.from(block.children).forEach((div) => {
      const clone = div.cloneNode(true);
      bgWrapper.append(clone);
      div.remove();
    });
    mainWrapper.append(bgWrapper);
    block.append(mainWrapper);
    childDetermination(bgWrapper);
  } else if (block.classList.contains("grid-row-2")) {
    console.log("grid-row-2");
  }
  const allItems = block;
  console.log(allItems);
  childDetermination(allItems);
}

function childDetermination(wrapper) {
  Array.from(wrapper.children).forEach((elm) => {
    if (elm.children.length > 1) {
      elm.classList.add(`${blockName}__flexBox`);
    } else {
      elm.classList.add(`${blockName}__notFlexBox`);
    }
  });
}
