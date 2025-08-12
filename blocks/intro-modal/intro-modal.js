const blockName = 'intro-modal';
function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}
export default function decorate(block) {
    const sectionIntro = block.parentElement.parentElement;
    const applySection = sectionIntro.nextElementSibling;
    const innerDiv = Array.from(block.children);
    const innerDivClass = ['image-container', 'content-container', 'redirect-container'];
    innerDiv.forEach((elem, index) => {
        elem.classList.add(`${blockName}__${innerDivClass[index]}`)
    })

    const redirect = block.querySelector(`.${blockName}__redirect-container`);

    redirect.addEventListener('click', (e) => {
        if(!block.classList.contains('sub-header-intro')){
        e.preventDefault();
        sectionIntro.classList.add('hide-intro');
        applySection.classList.add('show-apply-modal');
        }
        const root = block.getRootNode();
        const main = root.querySelector('main');
        const dialog = main.querySelector('dialog');
        if(dialog.open){
            block.classList.remove('sub-header-intro');
        }
    })
    const closeButton = createElement('div', { classes: 'close-button-modal' });
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.type = 'button';
    closeButton.innerHTML = '<span class="close-icon">X</span>';
    closeButton.addEventListener('click', () => {
        const dioloag = document.querySelector('dialog');
        dioloag.close();
    });
    block.append(closeButton);
}