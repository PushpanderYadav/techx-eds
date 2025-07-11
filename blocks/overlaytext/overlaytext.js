const blockName = "overlay-container";

function createElement(tag, { classes = "", attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

export default function decorate(block) {
  const tabItems = block.querySelectorAll(":scope > div");
  const rawBlocks = Array.from(tabItems);

  rawBlocks.forEach((blockItem) => {
    const columns = blockItem.querySelectorAll(":scope > div");
    if (columns.length < 2) return;

    const columnContent = columns[0];
    const imageSrc = columns[1].querySelector("img")?.getAttribute("src");

    const contentClone = columnContent.cloneNode(true);

    // Create wrapper div with background image
    const wrapper = createElement("div", {
      classes: "overlay-wrapper",
    });
    wrapper.style.backgroundImage = `linear-gradient(45deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0)),url(${imageSrc})`;

    // Append content to the wrapper
    wrapper.appendChild(contentClone);
    block.appendChild(wrapper);
  });

  // Clean original blocks
  rawBlocks.forEach((div) => div.remove());
}
