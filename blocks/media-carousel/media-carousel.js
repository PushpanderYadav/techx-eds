const blockName = "media-carousel";
const placeholders = null;
function createElement(tag, { classes = "", attrs = {}, props = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  // Set HTML attributes (e.g., class, src, etc.)
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });

  // Set DOM properties (e.g., el.src, el.type, etc.)
  Object.entries(props).forEach(([key, value]) => {
    el[key] = value;
  });

  return el;
}

function isMobileCheck() {
  return window.innerWidth <= 767;
}

function formatSlideNumber(n) {
  return n.toString().padStart(2, "0");
}

function createVideo(link, className, options = {}, config = {}) {
  const src = link?.href;
  if (!src) return null;

  const video = document.createElement("video");
  video.className = className;
  video.setAttribute("playsinline", "");
  video.setAttribute("muted", "");
  video.setAttribute("loop", "");
  video.setAttribute("autoplay", "");
  video.setAttribute("preload", "metadata");

  const source = document.createElement("source");
  source.src = src;
  source.type = "video/mp4";

  video.appendChild(source);

  return video;
}

function setPlaybackControls(container) {
  const playPauseButton = createElement("button", {
    classes: "v2-video-playback-button",
    props: { type: "button" },
  });

  const videoControls = document.createRange().createContextualFragment(`
    <span class="icon icon-pause-video" style="display:none;">
      <svg width="27" height="27" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="30" fill="white"/>
          <rect x="28.25" y="24.45" width="2.75" height="23.09" fill="#141414"/>
          <rect x="41" y="24.45" width="2.75" height="23.09" fill="#141414"/>
      </svg>
    </span>
    <span class="icon icon-play-video" style="display:flex;">
      <svg width="27" height="27" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="30" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3312 35.9998L29.3312 24.4528L29.3312 47.5468L49.3312 35.9998ZM44.3312 35.9998L31.8312 28.7829L31.8312 43.2167L44.3312 35.9998Z" fill="#141414"/>
      </svg>
    </span>`);

  playPauseButton.append(...videoControls.children);
  container.appendChild(playPauseButton);

  const playIcon = container.querySelector(".icon-play-video");
  const pauseIcon = container.querySelector(".icon-pause-video");

  const video = container.querySelector("video");
  if (!video) {
    console.warn("No video element found in container", container);
    return;
  }

  // Initially hide the video
  video.classList.add("is-hidden");

  // Show/hide helpers
  const showVideo = () => {
    video.classList.add("is-visible");
    video.classList.remove("is-hidden");
  };

  const hideVideo = () => {
    video.classList.remove("is-visible");
    video.classList.add("is-hidden");
  };

  // Initial button aria-label
  playPauseButton.setAttribute("aria-label", "Play video");

  // Update icons & aria-label based on pause/play state
  const toggleIcons = (isPaused) => {
    if (isPaused) {
      pauseIcon.style.display = "none";
      playIcon.style.display = "block";
      playPauseButton.setAttribute("aria-label", "Play video");
      hideVideo();
    } else {
      pauseIcon.style.display = "block";
      playIcon.style.display = "none";
      playPauseButton.setAttribute("aria-label", "Pause video");
      showVideo();
    }
  };

  // Play/pause toggle handler
  const togglePlayPause = () => {
    if (video.paused) {
      video.play().catch(console.warn);
    } else {
      video.pause();
    }
  };

  // Button click toggles play/pause
  playPauseButton.addEventListener("click", togglePlayPause);

  // Video events to update UI
  video.addEventListener("playing", () => toggleIcons(false));
  video.addEventListener("pause", () => toggleIcons(true));

  // Set initial state
  toggleIcons(true);
}

export default function decorate(block) {
  const items = block.querySelectorAll(":scope > div");
  const LastItem = items.length - 1;
  const termAndCondition = items[LastItem].querySelector("p");
  const children = Array.from(items);
  const headingWrapper = children.find((div) => div.querySelector("h2"));

  if (headingWrapper) {
    headingWrapper.classList.add(`${blockName}__heading-wrapper`);
    const h2 = headingWrapper.querySelector("h2");
    if (h2) h2.classList.add(`${blockName}__title`);
  }

  const swiperContainer = createElement("div", {
    classes: `swiper ${blockName}__swiper`,
  });

  const swiperWrapper = createElement("div", {
    classes: "swiper-wrapper",
  });

  const bottomContainer = createElement("div", {
    classes: `${blockName}__bottomContainer`,
  });

  const termAndConditionBtnContainer = createElement("div", {
    classes: `${blockName}__terms-btns`,
  });

  const buttonsContainer = createElement("div", {
    classes: `${blockName}__buttons`,
  });

  const progressBar = createElement("div", {
    classes: `${blockName}__progressBar`,
  });
  const progressFill = createElement("div", {
    classes: `${blockName}__progressFill`,
  });
  progressBar.append(progressFill);

  const termAndConditionDivision = createElement("div", {
    classes: `${blockName}__term-condition`,
  });

  const navPrev = createElement("div", {
    classes: "media-prv swiper-button-prev",
  });
  const navNext = createElement("div", {
    classes: "media-nxt swiper-button-next",
  });

  const slideCounterList = createElement("div", {
    classes: `${blockName}__slide-counter-list`,
  });

  termAndConditionDivision.append(termAndCondition);
  buttonsContainer.append(navPrev, slideCounterList, navNext);
  if (isMobileCheck()) {
    termAndConditionBtnContainer.append(
      termAndConditionDivision,
      buttonsContainer
    );
  } else {
    termAndConditionBtnContainer.append(
      termAndConditionDivision,
      buttonsContainer
    );
  }

  if (isMobileCheck()) {
    bottomContainer.append(termAndConditionBtnContainer);
  } else {
    bottomContainer.append(progressBar, termAndConditionBtnContainer);
  }

  if (!isMobileCheck()) {
    swiperContainer.append(swiperWrapper, bottomContainer);
    console.log("desktop");
  } else {
    swiperContainer.append(swiperWrapper, bottomContainer);
  }

  const childrenBlock = Array.from(items).filter(
    (div) => div !== headingWrapper
  );

  childrenBlock.forEach((block, video) => {
    const columns = block.querySelectorAll(":scope > div");
    if (columns.length < 4) return;

    const desktopImg = columns[0].querySelector("img")?.getAttribute("src");
    const mobileImg = columns[1].querySelector("img")?.getAttribute("src");
    const contentClone = columns[2].cloneNode(true);
    // extract video link
    const videoWrapper = createElement("div", {
      classes: `${blockName}__video-wrapper`,
    });

    // Always append the wrapper
    columns[3]?.append(videoWrapper); // or wherever it belongs

    const videoLink = columns[3]?.querySelector("a");

    if (videoLink) {
      const video = createVideo(
        videoLink,
        `${blockName}-video`,
        {
          fill: true,
        },
        { usePosterAutoDetection: true }
      );

      videoWrapper.append(video);
      setPlaybackControls(videoWrapper);
    }

    const slide = createElement("div", {
      classes: `swiper-slide ${blockName}__item`,
    });

    const bgDesktop = createElement("div", {
      classes: `${blockName}__bg_picture`,
    });

    const bgMobileWrapper = createElement("div", {
      classes: `${blockName}__bg_pictureMobile`,
    });

    const mobileBackground = createElement("div", {
      classes: `${blockName}__bgParallelMobile`,
    });

    const contentOverlay = createElement("div", {
      classes: `${blockName}__content`,
    });

    const contentMobileOverlay = createElement("div", {
      classes: `${blockName}__contentMobile`,
    });

    const isMobile = isMobileCheck();
    const selectedImage = isMobile ? mobileImg : desktopImg;

    if (selectedImage) {
      if (isMobile) {
        mobileBackground.style.backgroundImage = `url(${selectedImage})`;
        mobileBackground.style.backgroundRepeat = "no-repeat";
      } else {
        bgDesktop.style.backgroundImage = `url(${selectedImage})`;
        bgDesktop.style.backgroundRepeat = "no-repeat";
        bgDesktop.style.backgroundPosition = "center";
      }
    }

    [...contentClone.children].forEach((child) => {
      (isMobile ? contentMobileOverlay : contentOverlay).appendChild(child);
    });

    if (isMobile) {
      bgMobileWrapper.append(mobileBackground, contentMobileOverlay);
      mobileBackground.append(videoWrapper);
      slide.appendChild(bgMobileWrapper);
    } else {
      bgDesktop.append(videoWrapper, contentOverlay);
      slide.appendChild(bgDesktop);
    }

    swiperWrapper.append(slide);
  });

  childrenBlock.forEach((div) => div.remove());

  if (isMobileCheck()) {
    block.append(buttonsContainer, swiperContainer);
  } else {
    block.append(swiperContainer);
  }

  //  colored astermark
  let getStar = block.querySelector(".media-carousel__term-condition p");
  let star2 = getStar.innerHTML.slice(0, 1);
  let title = getStar.innerHTML.slice(1);
  getStar.innerHTML = `<span class='active-star'>${star2}</span>${title}`;

  setTimeout(() => {
    const swiperInstance = new Swiper(`.${blockName}__swiper`, {
      loop: false,
      autoplay: {
        delay: 100000, // Delay between transitions in milliseconds
        disableOnInteraction: false, // Autoplay won't stop after user interaction
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      slidesPerView: 1,
      spaceBetween: 10,
      on: {
        init(swiper) {
          const currentSlide = swiper.realIndex + 1;
          const totalSlides = swiper.slides.length;

          // Create numbered slide indicators
          slideCounterList.innerHTML = "";
          for (let i = 1; i <= totalSlides; i++) {
            const numberSpan = document.createElement("span");
            numberSpan.textContent = formatSlideNumber(i);
            if (i === currentSlide) {
              numberSpan.classList.add("active");
            }

            // Add click-to-jump functionality
            numberSpan.addEventListener("click", () => {
              swiper.slideTo(i - 1); // Swiper is 0-based
            });

            slideCounterList.appendChild(numberSpan);
          }

          // Set progress bar
          const percentage = (currentSlide / totalSlides) * 100;
          const progressFillEl = document.querySelector(
            `.${blockName}__progressFill`
          );
          if (progressFillEl) {
            progressFillEl.style.width = `${percentage}%`;
          }
        },
        slideChange(swiper) {
          const currentSlide = swiper.realIndex + 1;
          const totalSlides = swiper.slides.length;

          const allSpans = slideCounterList.querySelectorAll("span");
          allSpans.forEach((span, index) => {
            span.classList.toggle("active", index === swiper.realIndex);
          });

          const percentage = (currentSlide / totalSlides) * 100;
          const progressFillEl = document.querySelector(
            `.${blockName}__progressFill`
          );
          if (progressFillEl) {
            progressFillEl.style.width = `${percentage}%`;
          }
        },
      },
    });
  }, 0);
}
