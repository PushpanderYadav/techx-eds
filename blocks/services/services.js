import { createOptimizedPicture } from '../../scripts/aem.js';

const loadSwiper = () => new Promise((resolve) => {
  if (window.Swiper) {
    resolve(window.Swiper);
  } else {
    const swiperCss = document.createElement('link');
    swiperCss.rel = 'stylesheet';
    swiperCss.href = 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css';
    document.head.appendChild(swiperCss);

    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js';
    swiperScript.onload = () => resolve(window.Swiper);
    document.head.appendChild(swiperScript);
  }
});

export default async function decorate(block) {
  const mainContainer = block.parentElement.parentElement;

  const defaultContainer = mainContainer.querySelector(
    '.default-content-wrapper',
  );

  // Generate unique identifiers for each slider instance
  const uniqueId = `swiper-${Math.random().toString(36).substr(2, 9)}`;

  // Slider Elements
  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('swiper-container', uniqueId);

  const sliderWrapper = document.createElement('div');
  sliderWrapper.classList.add('swiper-wrapper');

  [...block.children].forEach((row) => {
    const slide = document.createElement('div');
    slide.classList.add('swiper-slide');

    while (row.firstElementChild) slide.append(row.firstElementChild);

    [...slide.children].forEach((div) => {
      if (div.querySelector('picture')) div.className = 'awards-card-image';
      else div.className = 'awards-card-body';
    });

    sliderWrapper.append(slide);
  });

  sliderWrapper.querySelectorAll('img').forEach((img) => {
    const picture = img.closest('picture');
    if (picture) {
      picture.replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]),
      );
    }
  });

  sliderContainer.append(sliderWrapper);

  // Button Elements with both unique and swiper-specific classes
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container-navigation');

  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', `${uniqueId}-prev`);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', `${uniqueId}-next`);

  buttonContainer.append(prevButton, nextButton);

  const heading = defaultContainer.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const headerContainer = document.createElement('div');
    headerContainer.classList.add('header-container');
    const headingWrapper = document.createElement('div');
    headingWrapper.classList.add('heading-wrapper');

    headingWrapper.append(heading);
    headerContainer.appendChild(headingWrapper);

    headerContainer.appendChild(buttonContainer);
    if (mainContainer.classList.contains('award-list-home-v2')) {
      headingWrapper.append(defaultContainer);
    }
    mainContainer.prepend(headerContainer);
  }

  mainContainer.appendChild(sliderContainer);

  const Swiper = await loadSwiper();

  // Ensure buttons exist before initializing Swiper
  if (!prevButton || !nextButton) {
    console.error('Swiper navigation buttons are missing.');
    return;
  }
  if (!mainContainer.classList.contains('award-list-home-v2')) {
    // Initialize Swiper using both unique and default classes with infinite scrolling
    setTimeout(() => {
      const swiper = new Swiper(`.${uniqueId}`, {
        slidesPerView: 1,
        spaceBetween: 20,
        mousewheel: {
          forceToAxis: true,
        },
        watchOverflow: true,
        loop: false,
        navigation: {
          nextEl: `.swiper-button-next.${uniqueId}-next`,
          prevEl: `.swiper-button-prev.${uniqueId}-prev`,
        },
        breakpoints: {
          0: { slidesPerView: 1.6 },
          769: { slidesPerView: 3.2 },
          1200: { slidesPerView: 3.8 },
          1440: { slidesPerView: 3 },
        },
      });
      console.error(`Swiper initialized for ${uniqueId}${swiper}`);
    }, 100);
  } else {
    setTimeout(() => {
      const swiper = new Swiper(`.${uniqueId}`, {
        slidesPerView: 1,
        spaceBetween: 20,
        mousewheel: {
          forceToAxis: true,
        },
        watchOverflow: true,
        loop: false,
        navigation: {
          nextEl: `.swiper-button-next.${uniqueId}-next`,
          prevEl: `.swiper-button-prev.${uniqueId}-prev`,
        },
        breakpoints: {
          0: { slidesPerView: 1.6 },
          769: { slidesPerView: 3.2 },
          1200: { slidesPerView: 3.2 },
          1440: { slidesPerView: 3.5 },
        },
      });
      console.log(`Swiper initialized for ${uniqueId}${swiper}`);
    }, 100);
  }
  setTimeout(() => {
    const allSlider = mainContainer.querySelectorAll(
      '.swiper-wrapper .swiper-slide',
    );
    allSlider.forEach((elem) => {
      const widthSlide = elem.style.width;
      elem.style.setProperty('--slideWidth', widthSlide);
    });
  }, 200);
}
