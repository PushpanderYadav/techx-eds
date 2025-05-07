import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);

  const getFooter = block.querySelectorAll('div >.section');
  getFooter.forEach((el) => {
    el.classList.add('mobileAccordion');
  });
  const getH4 = block.querySelectorAll('div > h4');
  getH4.forEach((el) => {
    el.classList.add('createAccordion');
  });

  const getP = block.querySelectorAll('div > h4 ~ p');
  getP.forEach((elm) => {
    elm.classList.add('show');
  });

  getH4.forEach((h4) => {
    h4.addEventListener('click', () => {
      h4.classList.toggle('focus-with-in');
      let next = h4.nextElementSibling;
      while (next && next.tagName.toLowerCase() === 'p') {
        next.classList.toggle('active');
        next = next.nextElementSibling;
      }
    });
  });
}
