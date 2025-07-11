const blockName = "seo-carousel";

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

  const headingWrapper = Array.from(items).find((div) =>
    div.querySelector("h2")
  );
  if (headingWrapper) {
    headingWrapper.classList.add(`${blockName}__heading-wrapper`);
    const h2 = headingWrapper.querySelector("h2");
    if (h2) h2.classList.add(`${blockName}__title`);
  }

  // SWIPER STRUCTURE
  const swiperWrapper = createElement("div", {
    classes: `swiper ${blockName}__swiper`,
  });
  const swiperTrack = createElement("ul", {
    classes: `swiper-wrapper ${blockName}__items`,
  });
  swiperWrapper.append(swiperTrack);

  const rawBlocks = Array.from(items).filter((div) => div !== headingWrapper);

  rawBlocks.forEach((block) => {
    const columns = block.querySelectorAll(":scope > div");
    if (columns.length < 3) return;

    const imageElement = columns[0].querySelector("img");

    const imageElement2 = columns[1].querySelector("img");

    const imageUrl = imageElement?.getAttribute("src");
    const imageUrlMobile = imageElement2?.getAttribute("src");
    const content = columns[2].cloneNode(true);

    const li = createElement("li", {
      classes: `swiper-slide ${blockName}__item`,
    });

    const bgDiv = createElement("div", {
      classes: `${blockName}__bg_picture`,
    });

    // Attach both desktop and mobile image URLs as data attributes
    if (imageUrl) {
      bgDiv.setAttribute("data-bg-desktop", imageUrl);
    }
    if (imageUrlMobile) {
      bgDiv.setAttribute("data-bg-mobile", imageUrlMobile);
    }

    // Choose background based on current screen size
    const isMobile = window.innerWidth <= 768;
    const selectedImage = isMobile ? imageUrlMobile : imageUrl;
    if (selectedImage) {
      bgDiv.style.backgroundImage = `url(${selectedImage})`;
    }

    const overlayContent = createElement("div", {
      classes: `${blockName}__content`,
    });

    [...content.children].forEach((child) => {
      overlayContent.appendChild(child);
    });

    const button = createElement("div", {
      classes: `${blockName}__buttons`,
    });

    const navPrev = createElement("div", {
      classes: "swiper-button-prev seo-btn-prv",
    });
    const navNext = createElement("div", {
      classes: "swiper-button-next seo-btn-nxt",
    });

    button.append(navPrev, navNext);
    bgDiv.append(overlayContent, button);
    li.appendChild(bgDiv);
    swiperTrack.appendChild(li);
  });

  rawBlocks.forEach((div) => div.remove());

  block.append(swiperWrapper);

  requestAnimationFrame(() => {
    new Swiper(`.${blockName}__swiper`, {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: false,
    });
  });
}
