export default async function decorate(block) {
  const sectionParent = block.parentElement.parentElement;
  const whatsappNumber = parseInt(
    sectionParent.getAttribute('data-whatsapp-number'),
    10,
  );
  const mobileNumber = parseInt(
    sectionParent.getAttribute('data-mobile-number'),
    10,
  );
  const customClass = ['whatsapp-img-wrapper', 'contact-phone-img-wrapper'];
  const allDiv = block.querySelectorAll(':scope>div');
  allDiv.forEach((elem, index) => {
    elem.classList.add(customClass[index]);
    const innerDiv = elem.querySelectorAll(':scope>div');
    innerDiv.forEach((elemSec) => {
      elemSec.classList.add('inner-div');
    });
  });

  const whatsAppImgWrapper = block.querySelector('.whatsapp-img-wrapper');
  const mobileNumberWrapper = block.querySelector('.contact-phone-img-wrapper');

  whatsAppImgWrapper.addEventListener('click', () => {
    const message = 'Hello! I want to connect with you.';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message,
    )}`;
    window.open(url, '_blank');
  });

  mobileNumberWrapper.addEventListener('click', () => {
    window.location.href = `tel:${mobileNumber}`;
  });
}
