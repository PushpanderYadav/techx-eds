import { loadFragment } from '../fragment/fragment.js';
const blockName = 'nirmaan-sub-header';

function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

async function getItemNav(api) {
    try {
        const response = await fetch(api);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Failed to fetch nav data:", error);
        return null;
    }
}

async function getLastContent(firstContent, secContent) {
    if (firstContent.classList.contains('has-further-container')) {

        const partnerBlock = firstContent.querySelector('.partner');
        const allNaviagte = partnerBlock.querySelectorAll('.partner__navigate-item');
        allNaviagte.forEach((elem) => {
            elem.addEventListener('click', async () => {
                try {
                    secContent.innerHTML = '';
                    const lastpage = elem.getAttribute('data-last-page');
                    if (lastpage) {
                        const pageData = await loadFragment(lastpage);
                        const pageDataBlock = pageData.querySelector('.section');
                        secContent.append(pageDataBlock);
                    }
                }
                catch (err) {
                    console.warn('failed to fetch data')
                }
            })
        })
    }


}
async function getnavItemPage(listContainer, contentContainer) {
    const getInnerItem = listContainer.querySelectorAll('ul >li');
    getInnerItem.forEach((elem) => {
        elem.addEventListener('mouseenter', async () => {
            try {
                contentContainer.innerHTML = ''
                const childPath = elem.getAttribute('data-innerpage-path');
                const headingNavStep = elem.getAttribute('data-further-step');
                const pageData = await loadFragment(childPath);
                const pageDataBlock = pageData.querySelector('.section');
                const firstContent = createElement('div', { classes: `${blockName}__first-content-container` });
                firstContent.append(pageDataBlock);
                contentContainer.append(firstContent);
                if (headingNavStep == 'true') {
                    firstContent.classList.add('has-further-container');
                    const secContent = createElement('div', { classes: `${blockName}__sec-content-container` });
                    contentContainer.append(secContent);
                    await getLastContent(firstContent, secContent);
                } else {
                    firstContent.classList.remove('has-further-container');
                }
            }
            catch (err) {
                console.warn('failed to fetch the inner Page');
            }
        })
    })
}

function bottominitializeStructure(navItemContainer, bottomNavItemContainer) {
    const headerBlock = bottomNavItemContainer.parentElement;
    const headingContainer = bottomNavItemContainer.querySelector(`.${blockName}__heading-container`);
    const listContainer = bottomNavItemContainer.querySelector(`.${blockName}__inner-item-container`);
    const contentContainer = bottomNavItemContainer.querySelector(`.${blockName}__content-container`);

    const getAllList = navItemContainer.querySelectorAll('ul > li');

    getAllList.forEach((elem) => {
        elem.addEventListener('mouseenter', async () => {
            try {
                getAllList.forEach((elem) => { elem.classList.remove('selected-item') });
                elem.classList.add('selected-item');
                bottomNavItemContainer.classList.add('show-bottom-container');
                // Clear previous content
                headingContainer.innerHTML = "";
                listContainer.innerHTML = "";
                contentContainer.innerHTML = "";

                // Get attributes
                const headingNav = elem.getAttribute('data-heading-nav');
                const headingPath = await loadFragment(headingNav);
                const headingSection =headingPath.querySelector('.section');
                headingContainer.appendChild(headingSection);
                const childPath = elem.getAttribute('data-child-path');
                const data = await getItemNav(childPath);
                // const h1 = createElement('h2', { classes: `${blockName}__heading-content` });
                // h1.textContent = headingNav;
                
                const itemContainer = createElement('ul', { classes: `${blockName}__inner-item` })
                if (data) {
                    data.forEach(innerElm => {
                        const innerpage = innerElm['inner-page-path'];
                        const furtherStep = innerElm['further-two-step'];
                        const li = createElement('li', { classes: `${blockName}__list-item` });
                        li.textContent = innerElm['child-title'];
                        li.setAttribute('data-innerpage-path', innerpage);
                        li.setAttribute('data-further-step', furtherStep);
                        itemContainer.appendChild(li);

                    });
                    listContainer.appendChild(itemContainer);

                }

            } catch (err) {
                console.warn('Failed to fetch child data...');
            }
            await getnavItemPage(listContainer, contentContainer);
        });
    });
    // headerBlock.addEventListener('mouseleave', () => {
    //     if (bottomNavItemContainer.classList.contains('show-bottom-container')) {
    //         bottomNavItemContainer.classList.remove('show-bottom-container');
    //         headingContainer.innerHTML = "";
    //         listContainer.innerHTML = "";
    //         contentContainer.innerHTML = "";
    //         getAllList.forEach((elem) => { elem.classList.remove('selected-item') });
    //     }
    // });

}

async function initializeStructure(block, dataSet) {
    block.innerHTML = '';
    const navItemContainer = createElement('div', {
        classes: `${blockName}__nav-item-container`
    });
    const api = dataSet.navApi;
    const bottomNavItemContainer = createElement('div', { classes: `${blockName}__bottom-nav-content` });
    const navList = createElement('ul', {
        classes: `${blockName}__nav-list`
    });
    const navResponse = await getItemNav(api);
    console.log("Fetched nav response:", navResponse);

    if (navResponse) {
        navResponse.forEach(item => {
            const li = createElement('li', {
                classes: `${blockName}__nav-item`
            });
            if (item['nav-title-icon']) {
                const icon = createElement('img', {
                    attrs: {
                        src: item['nav-title-icon'],
                        alt: item['nav-title'] || ''
                    }
                });
                li.append(icon);
            }
            const titleSpan = createElement('span', {
                classes: `${blockName}__nav-title`
            });
            titleSpan.textContent = item['nav-title'] || '';
            li.setAttribute('data-child-path', item['child-page-path']);
            li.setAttribute('data-heading-nav', item['heading-title']);
            li.append(titleSpan);

            navList.append(li);
        });
    } else {
        console.warn("No navigation data available.");
    }

    navItemContainer.append(navList);

    const headingContainer = createElement('div', { classes: `${blockName}__heading-container` });
    const listContainer = createElement('div', { classes: `${blockName}__inner-item-container` });
    const contentContainer = createElement('div', { classes: `${blockName}__content-container` });
    bottomNavItemContainer.append(headingContainer, listContainer, contentContainer);
    block.append(navItemContainer, bottomNavItemContainer);
    bottominitializeStructure(navItemContainer, bottomNavItemContainer);
}

export default async function decorate(block) {
    const dataSet = block.parentElement.parentElement.dataset;
    await initializeStructure(block, dataSet);

}
