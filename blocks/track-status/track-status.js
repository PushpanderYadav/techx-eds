const blockName = "track-status";

function createElement(tag, { classes = "", attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

const nextButton = createElement("button", {
  classes: "btn-next btn-primary",
});

nextButton.textContent = "next";

const cancelBtn = createElement("button", {
  classes: "cancel-btn",
});

cancelBtn.textContent = "cancel";

// const button = createElement("button", {
//   classes: "btn btn-primary",// → el.className = "btn btn-primary"
//   attrs: {// → each key-value becomes setAttribute
//     type: "submit",// → el.setAttribute("type", "submit")
//     id: "saveBtn", // → el.setAttribute("id", "saveBtn")
//     "data-role": "admin" // → el.setAttribute("id", "saveBtn")
//   }
// });

// document.body.appendChild(button);

//<button class="btn btn-primary" type="submit" id="saveBtn" data-role="admin"></button>

export default function decorate(block) {
  console.log(block);
  //   only the direct <div>, not the nested one
  const items = block.querySelectorAll(":scope > div");
  //   here scope means that block class example .track-status or block

  //   it gives nodelist
  console.log(items);
  //   NodeList [div]

  //   This would select ALL nested <div>s inside, not just direct ones.
  const divs = block.querySelectorAll("div");
  console.log(divs);
  // NodeList(2) [div, div]

  //   convert nodelist into array --> array.from and we use spread opertor to do the same
  const new1 = Array.from(items);
  //   const new1 = [...items];
  console.log(new1);
  const headingWrapper = new1.find((div) => div.querySelector("h2"));
  console.log(headingWrapper);

  if (headingWrapper) {
    headingWrapper.classList.add(`${blockName}__heading-wrapper`);
    const h2 = headingWrapper.querySelector("h2");
    if (h2) h2.classList.add(`${blockName}__title`);
  }

  //   get data attribute values
  const data = block.parentElement.parentElement.dataset;
  console.log(data);
  const { step1label, step2label, step3label, step4label } = data;

  const mainContainerText = createElement("ul", {
    classes: `${blockName}__containerText`,
  });

  const mainContainerWrapper = createElement("div", {
    classes: `${blockName}__container`,
  });

  const nextPreContainer = createElement("div", {
    classes: `${blockName}__nextPrevBtn`,
  });

  const mainContainerBox = createElement("ul", {
    classes: `${blockName}__container_Box `,
  });

  const stepLabels = [step1label, step2label, step3label, step4label];
  stepLabels.forEach((label, i) => {
    const li = createElement("li", { classes: `${blockName}__item` });
    li.textContent = label;

    const joint = createElement("li", {
      classes: `${blockName}__joint`,
      attrs: { id: i, "data-status": "" },
    });

    const li1 = createElement("li", {
      classes: `${blockName}__itemBox`,
      attrs: { id: i, "data-status": "" },
    });

    li.textContent = label;
    mainContainerBox.append(li1);
    if (i < stepLabels.length - 1) {
      mainContainerBox.append(joint);
    }
    mainContainerText.append(li);
  });
  mainContainerWrapper.append(mainContainerBox, mainContainerText);

  nextPreContainer.append(cancelBtn, nextButton);
  block.append(mainContainerWrapper, nextPreContainer);

  const btnNext = block.querySelector(".btn-next");
  const btnCancel = block.querySelector(".cancel-btn");
  const trackBox = block.querySelectorAll(".track-status__itemBox");
  const joint = block.querySelectorAll(".track-status__joint");

  joint.forEach(() => {
    let index = 0;
    let newIndex = 0;
    btnNext.addEventListener("click", () => {
      if (index > 0) {
        joint.forEach((elm) => {
          elm.classList.remove("activeJoint");
        });
        joint[newIndex].classList.add("activeJoint");
        joint[newIndex].setAttribute("data-status", "in-progress");
        newIndex++;
      }
      index++;
    });
  });

  trackBox.forEach(() => {
    let index = 0;
    btnNext.addEventListener("click", () => {
      trackBox.forEach((elm) => {
        elm.classList.remove("active");
      });
      trackBox[index].setAttribute("data-status", "in-progress");
      trackBox[index].classList.add("active");
      index++;
    });
  });

  btnCancel.addEventListener("click", () => {
    let activeClass = block.querySelector(".active");
    let activeJoint = block.querySelector(".activeJoint");
    activeClass.classList.toggle("cancel");
    activeJoint.classList.toggle("cancel");
  });
}
