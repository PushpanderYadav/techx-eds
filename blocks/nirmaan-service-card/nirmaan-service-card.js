const blockName = 'nirmaan-service-card';
function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}
export default function decorate(block) {
    const section = block.parentElement.parentElement;
    const sectionCategory = section.getAttribute('data-category');
    block.setAttribute('data-category', sectionCategory);
    updateCardStructure(block);

}
function updateCardStructure(block) {
    const sectionAvail=block.parentElement.parentElement;
    const allCard = block.querySelectorAll(":scope>div");
    allCard.forEach((elem) => {
        elem.classList.add(`${blockName}__item`);
        elem.querySelectorAll(':scope>div').forEach((innerElm) => {
            innerElm.classList.add('card-content');
            updateTableStrucure(innerElm);
        })
    })
}

function updateTableStrucure(innerElm) {
    const getTable = innerElm.querySelector('table');
    const [firstTr, secondTr, thirdTr, fourthTr,fifthTr] = getTable.querySelectorAll('tr');
    const featureContent = secondTr.querySelectorAll('td>*');


    const mainContent = createElement('div', { classes: 'main-content' });

    //featureRatingContainer div
    const [firstTd, secTd] = firstTr.querySelectorAll('td');

    const featureRatingContainer = createElement('div', { classes: 'feature-rating-logo-container' });
    const featureRating = createElement('div', { classes: 'feature-rating' });
    const topContent = createElement('div', { classes: 'top-contnet' });
    const bottomContent = createElement('div', { classes: 'bottom-content' });
    featureRating.append(topContent, bottomContent);


    const featureLogo = createElement('div', { classes: 'feature-logo' });

    firstTd.querySelectorAll(':scope>*').forEach((elem) => {
        topContent.append(elem);
    })
    featureContent.forEach((elem) => {
        bottomContent.append(elem);
    })
    featureLogo.append(secTd.querySelector('*'));
    featureRatingContainer.append(featureRating, featureLogo);




    //know more container 
    const knowMoreContiner= createElement('div',{classes:'know-more-container'});
    const knowMoreLink = thirdTr.querySelector('td>*');
    knowMoreContiner.append(knowMoreLink);


    const applyNowConainer= createElement('div',{classes:'apply-now-container'});
    const applyDesc = createElement('div',{classes:'apply-now-descripion'});
    const applyNowBtn = createElement('div',{classes:'apply-now-btn-div'});

    const[des,btn]=fourthTr.querySelectorAll('td');

    des.querySelectorAll(":scope>*").forEach((elem)=>{
        applyDesc.append(elem);
    })
    applyNowBtn.append(btn.querySelector('*'));
    applyNowConainer.append(applyDesc,applyNowBtn);


    mainContent.append(featureRatingContainer,knowMoreContiner,applyNowConainer);
    innerElm.append(mainContent);
    if(fifthTr){
        const getTd= fifthTr.querySelector('td');
        const dataTitle = getTd.querySelectorAll('p')[0].innerHTML;
        const dataTitleLink=getTd.querySelectorAll('p')[1];
        const cardParent=mainContent.parentElement.parentElement;
        cardParent.setAttribute('data-title',dataTitle);
    }
    getTable.remove();

}