const blockName = 'partner';

function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}
export default function decorate(block) {
    const allDiv = block.querySelectorAll(':scope > div');
    const firstDiv = allDiv[0];
    firstDiv.classList.add(`${blockName}__heading-container`);

    // only get direct children except first
    const divsNotFirst = block.querySelectorAll(':scope > div:not(:first-child)');

    const partnerContainer = createElement('div', { classes: `${blockName}__container` });
    partnerContainer.append(firstDiv);

    const naviagteContainer = createElement('div', { classes: `${blockName}__navigate-container` });

    block.innerHTML = '';

    divsNotFirst.forEach((elem) => {
        console.log(elem);
        elem.classList.add(`${blockName}__navigate-item`);
        naviagteContainer.append(elem);
        if(elem.children.length>1){
            const secDiv = elem.querySelectorAll(':scope>div')[1];
           const link = secDiv.querySelector('p').textContent;
           elem.setAttribute('data-last-page',link);
           secDiv.remove();
        }
    });

    block.append(partnerContainer, naviagteContainer);


}
