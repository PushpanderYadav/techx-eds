const blockName = 'nirmaan-card-collection';
function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

function customDropDown(dropdownContainer, bottomContent, block) {
    const mainBlock = block.getRootNode();
    const sections = mainBlock.querySelectorAll('.section.nirmaan-service-card-container');
    const categories = [...new Set(
        Array.from(sections).map(section => section.getAttribute('data-category'))
    )];
    const selectCategoery = document.createElement('div');
    selectCategoery.classList.add(`${blockName}__select-category`);
    selectCategoery.textContent = 'Select Category';

    const customSelect = document.createElement('div');
    customSelect.classList.add(`${blockName}__custom-select`)
    dropdownContainer.append(selectCategoery, customSelect);

    categories.forEach((elem) => {
        const selectInner = document.createElement('div');
        selectInner.classList.add(`${blockName}__custom-option`);
        selectInner.textContent = elem;
        customSelect.append(selectInner);
    })

    selectCategoery.addEventListener('click', (elem) => {
        selectCategoery.classList.toggle('arrow-turn');
        customSelect.classList.toggle('show');
    })

    document.addEventListener('click', (e) => {
        if (!dropdownContainer.contains(e.target)) {
            customSelect.classList.remove('show');
            selectCategoery.classList.remove('arrow-turn');
        }
    })


    const allCustomDiv = customSelect.querySelectorAll('div');
    const allSection = mainBlock.querySelectorAll('.section.nirmaan-service-card-container');
    allCustomDiv.forEach((elem) => {
        elem.addEventListener('click', () => {
            allCustomDiv.forEach(b => b.classList.remove('select'));
            elem.classList.toggle('select');
            selectCategoery.textContent = elem.textContent;
            selectCategoery.setAttribute('data-select-category', elem.textContent);
            customSelect.classList.remove('show');
            selectCategoery.classList.remove('arrow-turn');

            // add the activeSection class based on dropdown click
            let category = elem.textContent;
            allSection.forEach(b => b.classList.remove('selectSection'));
            allSection.forEach((elem) => {
                const elemDataCat = elem.getAttribute('data-category');
                if (category == elemDataCat) {
                    elem.classList.add('selectSection');
                }
            });

            // Remove old pagination controls
            const oldPagination = bottomContent.querySelector('.pagination-controls');
            if (oldPagination) oldPagination.remove();

            // Re-create pagination
            createPagination(bottomContent, block);
        });

    })
    const firstDrop = allCustomDiv[1];
    firstDrop.click();

}
function updatecardStructure(bottomContent, block) {
    //append all cardSection in bottomContent
    const mainBlock = block.getRootNode();
    const allcardSection = mainBlock.querySelectorAll('.section.nirmaan-service-card-container');
    allcardSection.forEach((elem) => {
        bottomContent.append(elem);
    })
}

function getAllSuggestedList(allItems, searchBoxContainer) {
    const itemContainer = createElement('div', { classes: 'item-container' });
    const seenTitles = new Set();

    allItems.forEach((elem) => {
        const title = elem.getAttribute('data-title');
        if (title && !seenTitles.has(title)) {
            seenTitles.add(title);

            const itemDiv = createElement('div', { classes: 'item-div' });
            itemDiv.setAttribute('data-suggest', title);

            const itemLabel = createElement('p', { classes: 'item-label' });
            itemLabel.textContent = title;

            const viewabel = createElement('p', { classes: 'view-label' });
            viewabel.textContent = 'View More';

            itemDiv.append(itemLabel, viewabel);
            itemContainer.append(itemDiv);
        }
    });

    const noResultDiv = createElement('div', { classes: 'no-result-conainer' });
    const noResultContent = createElement('p', { classes: 'no-result-label' });
    noResultContent.textContent = 'No Result Found';
    noResultDiv.append(noResultContent);

    searchBoxContainer.append(itemContainer, noResultDiv);
}

function createPagination(bottomContent, block) {
    //  const mainBlock=block.getRootNode();
    const section = bottomContent.querySelector('.section.selectSection');
    if (!section) return;

    const blocknirmaan = section.querySelector('.nirmaan-service-card.block');
    const allItems = Array.from(blocknirmaan.children);
    let filteredItems = [...allItems];
    const itemsPerPage = 3;
    let currentPage = 1;

    const container = bottomContent;
    if (!container) return;

    function isMobile() {
        return window.innerWidth < 768;
    }

    function showPage(page) {
        if (isMobile()) {
            // On mobile, always show all filtered cards
            allItems.forEach(item => item.style.display = 'none');
            filteredItems.forEach(item => item.style.display = 'block');
            return;
        }

        // Desktop: Show only items for the current page
        allItems.forEach(item => item.style.display = 'none');
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        filteredItems.slice(start, end).forEach(item => item.style.display = 'block');
    }

    function createPaginationControls() {
        // Remove old pagination if exists
        let paginationContainer = container.querySelector('.pagination-container');
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.classList.add('pagination-container');
            container.appendChild(paginationContainer);
        }
        paginationContainer.innerHTML = ''; // Clear old content

        // No pagination on mobile or if only one page
        const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
        if (isMobile() || totalPages <= 1) return;

        const pagination = document.createElement('div');
        pagination.classList.add('pagination-controls');

        // Prev button
        const prevBtn = document.createElement('div');
        prevBtn.classList.add('previous-btn');
        if (currentPage === 1) {
            prevBtn.classList.add('disabled-button');
        }
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                createPaginationControls();
            }
        });
        pagination.appendChild(prevBtn);

        // Numbered buttons
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('span');
            btn.innerText = i < 10 ? `0${i}` : i;
            btn.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                createPaginationControls();
            });
            if (i === currentPage) btn.classList.add('active');
            pagination.appendChild(btn);
        }

        // Next button
        const nextBtn = document.createElement('div');
        nextBtn.classList.add('next-button');
        if (currentPage === totalPages) {
            nextBtn.classList.add('disabled-button');
        }
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                createPaginationControls();
            }
        });
        pagination.appendChild(nextBtn);

        paginationContainer.appendChild(pagination);
    }

    function applyFilter(searchText) {
        filteredItems = allItems.filter(item => {
            const title = item.getAttribute('data-title')?.toLowerCase() || '';
            return title.includes(searchText.toLowerCase());
        });

        currentPage = 1;
        showPage(currentPage);
        createPaginationControls();
    }
    // Initialize
    showPage(currentPage);
    createPaginationControls();

    // Attach search filter
    const searchInputButton = block.querySelector('.nirmaan-card-collection__search-button');
    const searchInputVal = block.querySelector('#search-input');

    if (searchInputVal) {
        const searchContainer = searchInputButton.nextElementSibling;

        searchInputVal.addEventListener('click', () => {
            searchContainer.classList.add('show-search-box');
            if (searchContainer.children.length < 1) {
                getAllSuggestedList(allItems, searchContainer);
                const item = searchContainer.querySelectorAll('.item-div');
                item.forEach((elem) => {
                    elem.addEventListener('click', (e) => {
                        const itemLabel = elem.querySelector('.item-label').textContent;
                        applyFilter(itemLabel);
                        searchContainer.classList.remove('show-search-box');
                        searchInputVal.value = itemLabel;
                    })
                })
            }
            searchInputVal.addEventListener('input', (e) => {
                const noReult = searchContainer.querySelector('.no-result-conainer');
                const searchTerm = searchInputVal.value.toLowerCase().trim();
                const itemDivs = searchContainer.querySelectorAll('.item-div');

                let anyVisible = false;

                itemDivs.forEach(item => {
                    const suggest = item.getAttribute('data-suggest')?.toLowerCase() || '';
                    if (suggest.includes(searchTerm)) {
                        item.style.display = 'flex';
                        item.parentElement.classList.remove('hide-list');
                        anyVisible = true;
                    } else {
                        item.style.display = 'none';
                    }
                });

                // Toggle "no result" based on visibility
                if (anyVisible) {
                    noReult.classList.remove('show-no-result');
                } else {
                    noReult.classList.add('show-no-result');
                    itemDivs[0]?.parentElement.classList.add('hide-list');
                }

                // Restore default if input is cleared
                if (searchTerm === '') {
                    applyFilter(searchInputVal.value);
                }
            });


        })
        document.addEventListener('mousedown', (e) => {
            const isClickInside = searchContainer.contains(e.target) || searchInputVal.contains(e.target);
            if (!isClickInside) {
                searchContainer.classList.remove('show-search-box');
            }
        })
    }

    if (searchInputButton && searchInputVal) {
        searchInputButton.addEventListener('click', (e) => {

            applyFilter(searchInputVal.value);
        });
    }

    // Handle screen resize (mobile <-> desktop switch)
    window.addEventListener('resize', () => {
        showPage(currentPage);
        createPaginationControls();
    });
}

export default function decorate(block) {

    const nirmaanContainer = block.querySelector(':scope>div');
    nirmaanContainer.classList.add(`${blockName}__container`);

    const topContiner = nirmaanContainer.querySelector(':scope>div');
    topContiner.classList.add(`${blockName}__top-filter-container`);

    const headingContainer = createElement('div', { classes: `${blockName}__heading-container` });
    const headingtitle = topContiner.querySelector('*');
    headingContainer.append(headingtitle);

    const dropSearchContainer = createElement('div', { classes: `${blockName}__drop-search-container` });
    const dropdownContainer = createElement('div', { classes: `${blockName}__dropdown-container` });


    const searchContainer = createElement('div', { classes: `${blockName}__search-container` });
    const iconContianer = createElement('div', { classes: `${blockName}__search-icon-container` });
    const searchIcon = createElement('img', { classes: `${blockName}__search-icon` });
    // searchIcon.src='/'

    const inputSearch = createElement('input', { classes: `${blockName}__input-search` });
    inputSearch.type = 'text';
    inputSearch.id = 'search-input';
    inputSearch.setAttribute('autocomplete','off');
    inputSearch.placeholder = 'Search for specific vendor or categories';
    iconContianer.append(searchIcon);
    const searchButton = createElement('button', { classes: `${blockName}__search-button` });
    searchButton.textContent = 'Search';

    const searchBoxResult = createElement('div', { classes: `${blockName}__search-result` });

    searchContainer.append(searchIcon, inputSearch, searchButton, searchBoxResult);

    dropSearchContainer.append(dropdownContainer, searchContainer);

    topContiner.append(headingContainer, dropSearchContainer);

    const bottomContent = createElement('div', { classes: `${blockName}__bottom-content-container` });
    block.append(bottomContent);



    customDropDown(dropdownContainer, bottomContent, block);
    updatecardStructure(bottomContent, block)

    const allSection = document.querySelector('.section[data-category="All"]');
    const allSectionBlock = allSection.querySelector('.block');
    allSectionBlock.innerHTML = '';
    const sectionsOther = document.querySelectorAll('.section[data-category]:not([data-category="All"])');
    sectionsOther.forEach((elem) => {
        const block = elem.querySelector('.nirmaan-service-card.block');
        Array.from(block.children).forEach((item) => {
            allSectionBlock.append(item.cloneNode(true));
        })
    })
    createPagination(bottomContent, block)
}

