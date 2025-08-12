import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia("(min-width: 1200px)");

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      const navMobile = nav.querySelector('.nav-mobile');
      toggleMenu(nav, navSections, navMobile, false); // close
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      const navMobile = nav.querySelector('.nav-mobile');
      toggleMenu(nav, navSections, navMobile, false); // close
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.classList.contains('nav-drop');
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {Element} navMobile The mobile nav container
 * @param {Boolean|null} forceOpen Optional param to force menu open or close
 */
let isNavOpen = false; // Track mobile menu state

function toggleMenu(nav, navSections, navMobile, forceOpen = null) {
  const isCurrentlyOpen = nav.getAttribute('aria-expanded') === 'true';
  const willOpen = forceOpen !== null ? forceOpen : !isCurrentlyOpen;

  // toggle aria-expanded on nav
  nav.setAttribute('aria-expanded', willOpen ? 'true' : 'false');

  // toggle body scroll
  document.body.style.overflowY = willOpen && !isDesktop.matches ? 'hidden' : '';

  // toggle mobile nav visibility with animation
  if (isDesktop.matches) {
    navMobile.style.display = 'none';
    navMobile.classList.remove('animation-triggered', 'open-nav-mobile');
    navSections.classList.remove('hide-nav-header');
    isNavOpen = false;
  } else {
    if (willOpen && !isNavOpen) {
      // Open with animation
      navMobile.style.display = 'block';
      navMobile.classList.add('open-nav-mobile');
      navSections.classList.add('hide-nav-header');

      requestAnimationFrame(() => {
        navMobile.classList.add('animation-triggered');
      });

      isNavOpen = true;
    } else if (!willOpen && isNavOpen) {
      // Close with animation
      navMobile.classList.remove('animation-triggered', 'open-nav-mobile');
      navSections.classList.remove('hide-nav-header');

      navMobile.addEventListener('transitionend', function hideNav() {
        navMobile.style.display = 'none';
        navMobile.removeEventListener('transitionend', hideNav);
      });

      isNavOpen = false;
    }
  }

  // update all nav sections (close them if menu closed)
  toggleAllNavSections(navSections, willOpen ? 'true' : 'false');

  // update button aria-label
  const button = nav.querySelector('.nav-hamburger button');
  button.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');

  // enable or disable escape key listener
  if (willOpen || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }

  // adjust nav drops for desktop
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('role', 'button');
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('role');
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }
}


export default async function decorate(block) {
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      header.classList.add('hide');
    } else {
      header.classList.remove('hide');
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'mobile', 'tools','tools-desktop'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  const navMobile = nav.querySelector('.nav-mobile');
  const navTool = nav.querySelector('.nav-tools');
  const navToolDesktop = nav.querySelector('.nav-tools-desktop')
  if(navTool){
    const navToolClass=['nav-user-contact','nav-user-icon'];
    navTool.querySelectorAll('.default-content-wrapper > p').forEach((elem,index)=>{
      elem.classList.add(navToolClass[index]);
    })
  }

    if(navToolDesktop){
    const navToolDesktopClass=['nav-tool-contact','nav-tool-signup','nav-tool-login'];
    navToolDesktop.querySelectorAll('.default-content-wrapper > p').forEach((elem,index)=>{
      elem.classList.add(navToolDesktopClass[index]);
    })
  }
  if (navSections) {
    navSections
      .querySelectorAll(':scope .default-content-wrapper > ul > li')
      .forEach((navSection) => {
        if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
        navSection.addEventListener('click', () => {
          if (isDesktop.matches) {
            const expanded = navSection.getAttribute('aria-expanded') === 'true';
            toggleAllNavSections(navSections);
            navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<div class="nav-tool-mobile">${navTool.innerHTML}</div>
  <button type="button" aria-controls="nav" aria-label="Open navigation">
          <span class="nav-hamburger-icon"></span>
        </button>`;
  const hamburgerButton = hamburger.querySelector('button');
  hamburgerButton.addEventListener('click', () => toggleMenu(nav, navSections, navMobile));
  nav.prepend(hamburger);

  nav.setAttribute('aria-expanded', 'false');

  // update menu state on resize
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, navMobile, false));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
