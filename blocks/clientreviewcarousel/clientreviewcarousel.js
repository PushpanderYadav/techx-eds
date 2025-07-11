const blockName = "client-carousel-v";

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

  // Identify the heading wrapper and keep it
  const headingWrapper = Array.from(tabItems).find((div) =>
    div.querySelector("h2")
  );
  if (headingWrapper) {
    headingWrapper.classList.add(`${blockName}__heading-wrapper`);
    const h2 = headingWrapper.querySelector("h2");
    if (h2) h2.classList.add(`${blockName}__title`);
  }

  // Create carousel container
  const carouselContainer = createElement("div", {
    classes: `${blockName}__container  client-container-v`,
  });
  const carouselItems = createElement("ul", {
    classes: `${blockName}__items`,
  });
  carouselContainer.append(carouselItems);

  const rawBlocks = Array.from(tabItems).filter(
    (div) => div !== headingWrapper
  );

  rawBlocks.forEach((block) => {
    const columns = block.querySelectorAll(":scope > div");
    if (columns.length < 3) return;

    const pictureDiv = columns[0];
    const nameDiv = columns[1];
    const textDiv = columns[2];

    const picture = pictureDiv.querySelector("picture")?.cloneNode(true);
    const name = nameDiv.querySelector("p")?.textContent?.trim();
    const loanType = nameDiv.querySelector("p + p")?.textContent?.trim();
    const testimonial = textDiv.querySelector("p")?.textContent?.trim();

    const li = createElement("li", { classes: `${blockName}__item` });

    // Profile row (image + info side by side)
    const profileRow = createElement("div", {
      classes: `${blockName}__profile`,
    });

    if (picture) {
      profileRow.append(picture);
    }

    const infoBox = createElement("div", {
      classes: `${blockName}__info`,
    });

    if (name) {
      const figcaption = createElement("figcaption");
      figcaption.textContent = name;
      infoBox.append(figcaption);
    }

    if (loanType) {
      const loanEl = createElement("p", {
        classes: `${blockName}__description`,
      });
      loanEl.textContent = loanType;
      infoBox.append(loanEl);
    }

    profileRow.append(infoBox);
    li.append(profileRow);

    // Testimonial below
    if (testimonial) {
      const para = createElement("p", {
        classes: `${blockName}__text`,
      });
      para.textContent = testimonial;
      li.append(para);
    }

    carouselItems.appendChild(li);
  });

  // Remove the original raw blocks (except heading)
  rawBlocks.forEach((div) => div.remove());

  block.append(carouselContainer);

  // Add Swiper classes
  carouselItems.classList.add("swiper-wrapper");
  carouselContainer.classList.add("swiper");
  carouselItems
    .querySelectorAll("li")
    .forEach((li) => li.classList.add("swiper-slide"));

  // Create arrows and dots
  const prevBtn = createElement("div", { classes: "swiper-button-prev prv" });
  const nextBtn = createElement("div", { classes: "swiper-button-next nxt" });
  const pagination = createElement("div", { classes: "swiper-pagination" });

  const arrowWrapper = createElement("div", {
    classes: "swiper-arrows",
  });

  // 👇 Insert nav in heading
  if (headingWrapper) {
    const navWrapper = createElement("div", {
      classes: `${blockName}__nav-wrapper`,
    });

    headingWrapper.append(navWrapper);
    navWrapper.append(pagination, arrowWrapper);
    arrowWrapper.append(prevBtn, nextBtn);
  }

  // Swiper initialization
  requestAnimationFrame(() => {
    new Swiper(`.${blockName}__container.swiper`, {
      loop: true,
      spaceBetween: 10,
      slidesPerView: 1,
      breakpoints: {
        768: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1200: {
          slidesPerView: 2.1,
          spaceBetween: 30,
        },
        1400: {
          slidesPerView: 2.1,
          spaceBetween: 50,
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        type: "custom",
        renderCustom: (swiper, current, total) => {
          const pad = (num) => (num < 10 ? `0${num}` : `${num}`);
          return `
          <span class="swiper-pagination-current">${pad(current)}</span>
          <span class="slash">/</span>
          <span class="swiper-pagination-total">${pad(total)}</span>
        `;
        },
      },
    });
  });
}
