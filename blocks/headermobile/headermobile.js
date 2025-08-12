function addInitialStrurcture(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (summary.querySelector(' p >picture img')) {
      summary.classList.add('accordian-item-label-pictuire');
    }
    let body = row.children[1];
    if (body) {
      body.className = 'header-accordion-item-body';
      if (!body.hasChildNodes()) {
        body.classList.add('no-children-inside');
      }
    }
    const details = document.createElement('details');
    details.className = 'header-accordion-item';
    if (body === undefined) {
      body = '';
    }
    details.append(summary, body);
    row.replaceWith(details);
  });
}

function addingHeaderMobFunctionlity(block) {
     const accordionItems = block.querySelectorAll('.header-accordion-item');

      accordionItems.forEach((details) => {
        if(details.children.length>1){
            details.classList.add('element-available')
        }else{
            details.classList.add('redirect-item')
        }
        const summary = details.querySelector('summary');
        const summeryAnchor = summary.querySelector('a');
        if(summeryAnchor) {
          return
        } else {
        summary.addEventListener('click', (event) => {
          event.preventDefault();
          const isOpen = details.hasAttribute('open');
          accordionItems.forEach((item) => {
            if (item !== details) {
              item.removeAttribute('open');
            }
          });
          if (isOpen) {
            details.removeAttribute('open');
          } else {
            details.setAttribute('open', '');
          }
        });
      }
      });
  const accordionBodies = block.querySelectorAll('.header-accordion-item-body > ol > li , .header-accordion-item-body > ul > li');
  accordionBodies.forEach((item) => {
    const childOl = item.querySelector('ol, ul');
    if (childOl) {
      item.classList.add('has-children');
      childOl.style.display = 'none';
      item.addEventListener('click', (event) => {
        event.stopPropagation();
        const isActive = childOl.style.display === 'block';
        item.parentElement.querySelectorAll('.has-children').forEach((activeItem) => {
          activeItem.classList.remove('active');
          activeItem.querySelector('ol, ul').style.display = 'none';
        })
        item.parentElement.querySelectorAll('.has-children .active').forEach((activeItem) => {
          if (activeItem !== item) {
            activeItem.querySelector('ol, ul').style.display = 'none';
            activeItem.classList.remove('active');
          }
        });
        childOl.style.display = isActive ? 'none' : 'block';
        item.classList.toggle('active', !isActive);
      });
    } else {
      item.classList.add('no-children');
      item.classList.add('redirect-childeren');
    }
  });
}


export default async function decorate(block) {
  addInitialStrurcture(block);
  addingHeaderMobFunctionlity(block);
//  addingAccordianFunctionality(block)
}
