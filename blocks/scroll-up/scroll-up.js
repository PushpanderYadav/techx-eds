function scrollUp(block) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      block.style.display = 'block';
      block.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
    } else {
      block.style.display = 'none';
    }
  });
}
export default async function decorate(block) {
  scrollUp(block);
}
