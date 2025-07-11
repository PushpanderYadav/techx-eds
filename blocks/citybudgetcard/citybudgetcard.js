const blockName = "cityBudgetCard";

function createElement(tag, { classes = "", attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

export default function decorate(block) {
  const items = block.querySelectorAll(":scope > div");

  // Find heading wrapper (contains h2)
  const headingWrapper = Array.from(items).find((div) =>
    div.querySelector("h2")
  );
  if (headingWrapper) {
    headingWrapper.classList.add(`${blockName}__heading-wrapper`);
    const h2 = headingWrapper.querySelector("h2");
    if (h2) h2.classList.add(`${blockName}__title`);
  }

  // Create the outer container
  const cardContainer = createElement("div", {
    classes: `${blockName}__container`,
  });

  const cardItems = createElement("ul", {
    classes: `${blockName}__items`,
  });

  cardContainer.append(cardItems);

  // Exclude heading block from processing
  const rawBlocks = Array.from(items).filter((div) => div !== headingWrapper);
  rawBlocks.forEach((block, i) => {
    const columns = block.querySelectorAll(":scope > div");

    if (columns.length < 2) return; // we need at least picture + name

    const pictureDiv = columns[0];
    const nameDiv = columns[1];
    const linkDiv = columns[2]; // might be undefined

    const picture = pictureDiv.querySelector("picture")?.cloneNode(true);
    const name = nameDiv.querySelector("p")?.textContent?.trim();

    // Extract link safely
    const linkText = linkDiv?.innerText?.trim();
    const hasValidLink = !!linkText;
    const link = hasValidLink
      ? linkText.startsWith("http")
        ? linkText
        : `https://${linkText}`
      : "";

    // Create <li>
    const li = createElement("li", { classes: `${blockName}__item` });

    // Create content block
    const profile = createElement("div", {
      classes: `${blockName}__profile`,
    });

    const figure = createElement("figure");
    if (picture) figure.append(picture);

    if (name) {
      const figcaption = createElement("figcaption");
      figcaption.textContent = name;
      figure.append(figcaption);
    }

    profile.append(figure);

    // Use <a> if valid link, otherwise <div>
    const wrapperTag = hasValidLink ? "a" : "div";
    const wrapper = createElement(wrapperTag, {
      classes: `${blockName}__link-wrapper`,
      attrs: hasValidLink ? { href: link } : {},
    });

    wrapper.append(profile);
    li.append(wrapper);
    cardItems.appendChild(li);
  });

  // Remove raw DOM blocks
  rawBlocks.forEach((div) => div.remove());

  // Append the final constructed container to the block
  block.append(cardContainer);
}
