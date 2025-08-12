function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

function createCommonTab(tabWrapper, contentContainer) {
    const getAllSectionTab = document.querySelectorAll('.common-fragment.fragment-container');
    getAllSectionTab.forEach((elem) => {
        const tabButton = createElement('button', { classes: 'common-tab-button' });
        tabButton.textContent = elem.getAttribute('data-tab-title-text');
        tabWrapper.append(tabButton);
        contentContainer.append(elem);
    })
    const tabWrapperButton = tabWrapper.querySelectorAll('.common-tab-button');
    tabWrapperButton.forEach((button) => {
        button.addEventListener('click', () => {
            const tabText = button.textContent.trim();
                getAllSectionTab.forEach(section => {
                    if (section.classList.contains('show-section')) {
                        section.classList.remove('show-section');
                    }
                    if (section.getAttribute('data-tab-title-text') === tabText) {
                        section.classList.add('show-section');
                    }
                });

            tabWrapperButton.forEach(btn => btn.classList.remove('active-tab-button'));

            // Add 'active' to clicked button
            button.classList.add('active-tab-button');
        })
    })
    const firstButton = tabWrapperButton[0];
    firstButton.click();

}
export default function decorate(block) {
    block.innerHTML = '';

    const tabWrapper = createElement('div', { classes: 'common-tab-conainer' });
    const contentContainer = createElement('div', { classes: 'common-tab-content-container' });
    block.append(tabWrapper, contentContainer);
    createCommonTab(tabWrapper, contentContainer)
}