let blockName = 'nirmaan-work-step';

function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

export default function decorate(block) {
    formateStructure(block);
}
function formateStructure(block) {
    const nirmaanCardContainer = createElement('div', { classes: `${blockName}__cardContainer` });
    const allNirmaanCard = block.querySelectorAll(":scope>div:not(:last-child)");
    allNirmaanCard.forEach((elem) => {
        elem.classList.add(`${blockName}__card`);
        const innerclass=['imageContainer','contentContainer'];
        elem.querySelectorAll('div').forEach((elem,index)=>{
            elem.classList.add(`${blockName}_${innerclass[index]}`)
        })
        nirmaanCardContainer.appendChild(elem);
    })
    const circleCard = block.querySelector(":scope>div:last-child");
    if (circleCard.children.length < 2) {
        circleCard.classList.add(`${blockName}_circlecard`);
    }
    block.innerHTML = '';
    block.append(nirmaanCardContainer, circleCard);
}