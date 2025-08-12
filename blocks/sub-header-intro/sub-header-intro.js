export default async function decorate(block) {
  const childDivs = block.querySelectorAll(':scope > div');

  if (childDivs.length > 1) {
    childDivs[0].classList.add('picture-container');
    childDivs.forEach((div, index) => {
      if (index !== 0) {
        div.classList.add('content-container');
      }
    });
  } else if (childDivs.length === 1) {
    const firstChild = childDivs[0];
    const hasPicture = firstChild.querySelector('picture') !== null;

    if (hasPicture) {
      firstChild.classList.add('picture-container');
    } else {
      firstChild.classList.add('content-container');
    }
  }
}
