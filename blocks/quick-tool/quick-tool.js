export default async function decorate(block) {
  const sectionParent = block.parentElement.parentElement;
  const whatsappNumber = parseInt(sectionParent.getAttribute('data-whatsapp-number'), 10);
  const mobileNumber = parseInt(sectionParent.getAttribute('data-mobile-number'), 10);
  const customClass = ['whatsAppImgWrapper', 'contactPhoneImgWrapper'];
  const allquickDiv = block.querySelectorAll(':scope>div');
  allquickDiv.forEach((elem, index) => {
    elem.classList.add(customClass[index]);
    const innerDiv = elem.querySelectorAll(':scope>div');
    innerDiv.forEach((elemSec) => {
      elemSec.classList.add('innerDiv');
    });
  });

  const whatsAppImgWrapper = block.querySelector('.whatsAppImgWrapper');
  const mobileNumberWrapper = block.querySelector('.contactPhoneImgWrapper');

  whatsAppImgWrapper.addEventListener('click', () => {
    const message = 'Hello! I want to connect with you.';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });

  mobileNumberWrapper.addEventListener('click', () => {
    window.location.href = `tel:${mobileNumber}`;
  });
}
