import { createElement, getTextLabel } from './utills.js';
import { loadScript } from './aem.js';

// videoURLRegex: verify if a given string follows a specific pattern indicating it is a video URL
// videoIdRegex: extract the video ID from the URL
export const AEM_ASSETS = {
  aemCloudDomain: '.adobeaemcloud.com',
  videoURLRegex: /\/assets\/urn:aaid:aem:[\w-]+\/play/,
  videoIdRegex: /urn:aaid:aem:[0-9a-fA-F-]+/,
};

export const youtubeVideoRegex = /^(?:(?:https?:)?\/\/)?(?:(?:(?:www|m(?:usic)?)\.)?youtu(?:\.be|be\.com)\/(?:shorts\/|live\/|v\/|e(?:mbed)?\/|watch(?:\/|\?(?:\S+=\S+&)*v=)|oembed\?url=https?%3A\/\/(?:www|m(?:usic)?)\.youtube\.com\/watch\?(?:\S+=\S+&)*v%3D|attribution_link\?(?:\S+=\S+&)*u=(?:\/|%2F)watch(?:\?|%3F)v(?:=|%3D))?|www\.youtube-nocookie\.com\/embed\/)([\w-]{11})[?&#]?\S*$/;

const { aemCloudDomain, videoURLRegex } = AEM_ASSETS;

export const standardVideoConfig = {
  autoplay: false,
  muted: true,
  controls: true,
  disablePictureInPicture: false,
  currentTime: 0,
  playsinline: true,
};

export const videoConfigs = {};

export function getDeviceSpecificVideoUrl(videoUrl) {
  const { userAgent } = navigator;
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isSafari = /Safari/i.test(userAgent)
    && !/Chrome/i.test(userAgent)
    && !/CriOs/i.test(userAgent)
    && !/Android/i.test(userAgent)
    && !/Edg/i.test(userAgent);

  const manifest = isIOS || isSafari ? 'manifest.m3u8' : 'manifest.mpd';
  return videoUrl.replace(/manifest\.mpd|manifest\.m3u8|play/, manifest);
}

export const getVideoConfig = (videoId) => videoConfigs[videoId];

export function isLowResolutionVideoUrl(url) {
  return typeof url === 'string' && url.split('?')[0].endsWith('.mp4');
}

export function isAEMVideoUrl(url) {
  return videoURLRegex.test(url);
}

export function isYoutubeVideoUrl(url) {
  return youtubeVideoRegex.test(url);
}

export function getYoutubeVideoId(url) {
  const match = url.match(youtubeVideoRegex);

  return match?.length >= 2 ? match[1] : '';
}

export function isVideoLink(link) {
  const linkString = link.getAttribute('href');
  return (
    (linkString.includes('youtube.com/embed/')
      || videoURLRegex.test(linkString)
      || isLowResolutionVideoUrl(linkString))
    && link.closest('.block.embed') === null
  );
}

export function selectVideoLink(links) {
  const linksArray = Array.isArray(links) ? links : [...links];

  const findLinkByCondition = (conditionFn) => linksArray.find((link) => conditionFn(link.getAttribute('href')));

  const aemVideoLink = findLinkByCondition((href) => videoURLRegex.test(href));
  const localMediaLink = findLinkByCondition((href) => href.split('?')[0].endsWith('.mp4'));

  if (aemVideoLink) {
    return aemVideoLink;
  }
  return localMediaLink;
}

function getVideoLinkContainer(link, usePosterAutoDetection) {
  if (!usePosterAutoDetection) {
    return link;
  }

  let poster = null;
  let level = 2;
  let parent = link;
  while (parent !== null && level >= 0) {
    poster = parent.querySelector('picture');
    if (poster) {
      break;
    }

    parent = parent.parentElement;
    level -= 1;
  }

  return poster ? parent : link;
}

function parseVideoLink(link, usePosterAutoDetection) {
  const isVideo = link ? isVideoLink(link) : false;
  if (!isVideo) {
    return null;
  }

  const container = getVideoLinkContainer(link, usePosterAutoDetection);
  const poster = container.querySelector('picture')?.cloneNode(true);

  return {
    url: link.href,
    poster,
  };
}

export function cleanupVideoLink(block, link, hasPoster) {
  const container = getVideoLinkContainer(link, hasPoster);
  // Remove empty ancestor nodes after removing video container containing link and poster image
  if (container) {
    let parent = container;
    while (
      parent?.parentElement?.children.length === 1
      && parent?.parentElement !== block
    ) {
      parent = parent.parentElement;
    }

    parent.remove();
  }
}

export function createLowResolutionBanner() {
  const lowResolutionMessage = getTextLabel('Low resolution video message');
  const changeCookieSettings = getTextLabel('Change cookie settings');
  let banner;

  if (document.documentElement.classList.contains('redesign-v2')) {
    banner = createElement('div', { classes: 'low-resolution-banner' });
    const bannerText = createElement('p');
    const bannerButton = createElement('button', {
      classes: ['button', 'secondary', 'dark'],
    });

    bannerText.textContent = lowResolutionMessage;
    bannerButton.textContent = changeCookieSettings;

    banner.appendChild(bannerText);
    banner.appendChild(bannerButton);

    bannerButton.addEventListener('click', () => {
      window.OneTrust.ToggleInfoDisplay();
    });
  } else {
    banner = document.createElement('div');
    banner.classList.add('low-resolution-banner');
    banner.innerHTML = `${lowResolutionMessage} <button class="low-resolution-banner-cookie-settings">${changeCookieSettings}</button>`;
    banner.querySelector('button').addEventListener('click', () => {
      window.OneTrust.ToggleInfoDisplay();
    });
  }

  return banner;
}

export function addVideoShowHandler(link) {
  link.classList.add('text-link-with-video');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    const variantClasses = ['black', 'gray', 'reveal'];
    const modalClasses = [...event.target.closest('.section').classList].filter(
      (el) => el.startsWith('modal-'),
    );
    // changing the modal variants classes to BEM naming
    variantClasses.forEach((variant) => {
      const index = modalClasses.findIndex((el) => el === `modal-${variant}`);

      if (index >= 0) {
        modalClasses[index] = modalClasses[index].replace('modal-', 'modal--');
      }
    });
  });
}

export function isSoundcloudLink(link) {
  return (
    link.getAttribute('href').includes('soundcloud.com/player')
    && link.closest('.block.embed') === null
  );
}

export function addSoundcloudShowHandler(link) {
  link.classList.add('text-link-with-soundcloud');

  link.addEventListener('click', (event) => {
    event.preventDefault();
  });
}

export function addPlayIcon(parent) {
  const playButton = document.createRange().createContextualFragment(`
    <span class="icon icon-play-video">
      <svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="30" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3312 35.9998L29.3312 24.4528L29.3312 47.5468L49.3312 35.9998ZM44.3312 35.9998L31.8312 28.7829L31.8312 43.2167L44.3312 35.9998Z" fill="#141414"/>
      </svg>
    </span>`);

  parent.appendChild(playButton);
}

export function wrapImageWithVideoLink(videoLink, image) {
  videoLink.innerText = '';
  videoLink.appendChild(image);
  videoLink.classList.add('link-with-video');
  videoLink.classList.remove('button', 'primary', 'text-link-with-video');
  addPlayIcon(videoLink);
}

export function createIframe(url, { parentEl, classes = [], props = {} }) {
  // iframe must be recreated every time otherwise the new history record would be created
  const iframe = createElement('iframe', {
    classes: Array.isArray(classes) ? classes : [classes],
    props: {
      frameborder: '0',
      allowfullscreen: 'allowfullscreen',
      src: url,
      ...props,
    },
  });

  if (parentEl) {
    parentEl.appendChild(iframe);
  }

  return iframe;
}

export function setPlaybackControls(container) {
  // Playback controls - play and pause button
  const playPauseButton = createElement('button', {
    props: { type: 'button', class: 'v2-video-playback-button' },
  });

  const videoControls = document.createRange().createContextualFragment(`
    <span class="icon icon-pause-video">
      <svg width="27" height="27" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="36" cy="36" r="30" fill="white"/>
          <rect x="28.25" y="24.45" width="2.75" height="23.09" fill="#141414"/>
          <rect x="41" y="24.45" width="2.75" height="23.09" fill="#141414"/>
      </svg>
    </span>
    <span class="icon icon-play-video">
      <svg width="27" height="27" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="30" fill="white"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M49.3312 35.9998L29.3312 24.4528L29.3312 47.5468L49.3312 35.9998ZM44.3312 35.9998L31.8312 28.7829L31.8312 43.2167L44.3312 35.9998Z" fill="#141414"/>
      </svg>
    </span>`);

  playPauseButton.append(...videoControls.children);
  container.appendChild(playPauseButton);

  const playIcon = container.querySelector('.icon-play-video');
  const pauseIcon = container.querySelector('.icon-pause-video');

  const pauseVideoLabel = getTextLabel('Pause video');
  const playVideoLabel = getTextLabel('Play video');

  playPauseButton.setAttribute('aria-label', pauseVideoLabel);

  const togglePlayPauseIcon = (isPaused) => {
    if (isPaused) {
      pauseIcon.style.display = 'none';
      playIcon.style.display = 'flex';
      playPauseButton.setAttribute('aria-label', playVideoLabel);
    } else {
      pauseIcon.style.display = 'flex';
      playIcon.style.display = 'none';
      playPauseButton.setAttribute('aria-label', pauseVideoLabel);
    }
  };

  const video = container.querySelector('video');
  const poster = container.querySelector('picture');
  togglePlayPauseIcon(video.paused);

  const togglePlayPause = (el) => {
    if (el.paused) {
      if (poster) {
        poster.remove();
        video.parentElement.style.display = '';
        video.style.display = '';
      }
      el.play();
    } else {
      el.pause();
    }
  };

  playPauseButton.addEventListener('click', () => {
    togglePlayPause(video);
  });
  video.addEventListener('playing', () => {
    togglePlayPauseIcon(video.paused);
  });
  video.addEventListener('pause', () => {
    togglePlayPauseIcon(video.paused);
  });
}

function createProgressivePlaybackVideo(src, className = '', props = {}) {
  const video = createElement('video', {
    classes: className,
  });

  if (props.muted || props.autoplay) {
    video.muted = true;
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      const value = props[propName];
      if (typeof value !== 'boolean') {
        video.setAttribute(propName, value);
      } else if (value) {
        video.setAttribute(propName, '');
      }
    });
  }

  const source = createElement('source', {
    props: {
      src,
      type: 'video/mp4',
    },
  });

  // If the video is not playing, we’ll try to play again
  if (props.autoplay) {
    video.addEventListener(
      'loadedmetadata',
      () => {
        setTimeout(() => {
          if (video.paused) {
            try {
              video.play();
            } catch (error) {
              console.error(error);
            }
          }
        }, 500);
      },
      { once: true },
    );
  }

  // set playback controls after video container is attached to dom
  if (!props.controls) {
    setTimeout(() => {
      setPlaybackControls(video.parentElement);
    }, 0);
  }

  video.appendChild(source);

  return video;
}

export function getDynamicVideoHeight(video) {
  // Get the element's height(use requestAnimationFrame to get actual height instead of 0)
  requestAnimationFrame(() => {
    const height = video.offsetHeight - 60;
    const playbackControls = video.parentElement?.querySelector(
      '.v2-video__playback-button',
    );
    if (!playbackControls) {
      return;
    }

    playbackControls.style.top = `${height.toString()}px`;
  });

  // Get the element's height on resize
  const getVideoHeight = (entries) => {
    entries.forEach((entry) => {
      const height = entry.target.offsetHeight - 60;
      const playbackControls = video.parentElement?.querySelector(
        '.v2-video__playback-button',
      );

      if (!playbackControls) return;

      playbackControls.style.top = `${height}px`;
    });
  };

  const resizeObserver = new ResizeObserver(getVideoHeight);
  resizeObserver.observe(video);
}

export const createVideo = (
  link,
  className = '',
  videoParams = {},
  configs = {},
) => {
  let src;
  // let poster;

  const { usePosterAutoDetection } = configs;
  if (link instanceof HTMLAnchorElement) {
    const config = parseVideoLink(link, usePosterAutoDetection);
    if (!config) {
      return null;
    }

    src = config.url;
    // poster = config.poster;
  } else {
    src = link;
  }

  if (isLowResolutionVideoUrl(src)) {
    return createProgressivePlaybackVideo(src, className, videoParams);
  }

  const container = document.createElement('div');
  container.classList.add(className);

  return container;
};

export const addMuteControls = (section) => {
  const controls = createElement('button', {
    props: { type: 'button', class: 'v2-video__mute-controls' },
  });

  section.appendChild(controls);

  const video = section.querySelector('video');
  const muteIcon = section.querySelector('.icon-mute');
  const unmuteIcon = section.querySelector('.icon-unmute');
  const muteIconLabel = getTextLabel('Mute video');
  const unmuteIconLabel = getTextLabel('Unmute video');

  controls.setAttribute('aria-label', unmuteIconLabel);

  if (!video) {
    return;
  }

  const showHideMuteIcon = (isMuted) => {
    if (isMuted) {
      muteIcon.style.display = 'flex';
      unmuteIcon.style.display = 'none';
      controls.setAttribute('aria-label', muteIconLabel);
    } else {
      muteIcon.style.display = 'none';
      unmuteIcon.style.display = 'flex';
      controls.setAttribute('aria-label', unmuteIconLabel);
    }
  };

  const toggleMute = (el) => {
    el.muted = !el.muted;
  };

  controls.addEventListener('click', () => {
    toggleMute(video);
  });
  video.addEventListener('volumechange', () => {
    showHideMuteIcon(video.muted);
  });
};

export function loadYouTubeIframeAPI() {
  return loadScript('https://www.youtube.com/iframe_api');
}

const logVideoEvent = (eventName, videoId, timeStamp, blockName = 'video') => {
  console.info(`[${blockName}] ${eventName} for ${videoId} at ${timeStamp}`);
};

const formatDebugTime = (date) => {
  const timeOptions = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return `${formattedTime}.${milliseconds}`;
};

export const handleVideoMessage = (event, videoId, blockName = 'video') => {
  if (!event.origin.endsWith(aemCloudDomain)) {
    return;
  }
  if (event.data.type === 'embedded-video-player-event') {
    const timeStamp = formatDebugTime(new Date());

    logVideoEvent(event.data.name, event.data.videoId, timeStamp, blockName);

    if (event.data.name === 'video-config' && event.data.videoId === videoId) {
      console.info('Sending video config:', getVideoConfig(videoId), timeStamp);
      event.source.postMessage(JSON.stringify(getVideoConfig(videoId)), '*');
    }

    // TODO: handle events when needed in a block
    // switch (event.data.name) {
    //   case 'video-playing':
    //   case 'video-play':
    //   case 'video-ended':
    //   case 'video-loadedmetadata':
    //     logVideoEvent(event.data.name, event.data.videoId, timeStamp, blockName);
    //     break;
    //   default:
    //     break;
    // }
  }
};

class VideoEventManager {
  constructor() {
    this.registrations = [];
    window.addEventListener('message', this.handleMessage.bind(this));
  }

  register(videoId, blockName, callback) {
    this.registrations.push({ videoId, blockName, callback });
  }

  unregister(videoId, blockName) {
    this.registrations = this.registrations.filter(
      (reg) => reg.videoId !== videoId || reg.blockName !== blockName,
    );
  }

  handleMessage(event) {
    this.registrations.forEach(({ videoId, blockName, callback }) => {
      if (
        event.data.type === 'embedded-video-player-event'
        && event.data.videoId === videoId
      ) {
        callback(event, videoId, blockName);
      }
    });
  }
}

export { VideoEventManager };
