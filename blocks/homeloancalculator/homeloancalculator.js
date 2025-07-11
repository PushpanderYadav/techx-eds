const blockName = "home-loan__calculator";

function createElement(tag, { classes = "", attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

export default function decorate(block) {
  const items = block.querySelectorAll(":scope > div");

  const headingWrapper = Array.from(items).find((div) =>
    div.querySelector("h2")
  );
  if (headingWrapper) {
    headingWrapper.classList.add(`${blockName}__heading-wrapper`);
    const h2 = headingWrapper.querySelector("h2");
    if (h2) h2.classList.add(`${blockName}__title`);
  }

  const data = block.parentElement.parentElement.dataset;
  const {
    amountValue,
    interestRateLabel,
    interestValue,
    loanAmountLabel,
    maximumInterestValue,
    maximumLoanValue,
    maximumYearValue,
    minimumInterestValue,
    minimumLoanValue,
    minimumYearValue,
    tenureLabel,
    tenureValue,
  } = data;

  // ✅ Main container to hold all group sections
  const mainContainer = createElement("div", {
    classes: `${blockName}__main-container`,
  });

  // Loan Amount Group
  const loanGroup = createInputGroup({
    label: loanAmountLabel,
    value: amountValue,
    min: minimumLoanValue,
    max: maximumLoanValue,
    name: "loan",
  });

  // Interest Rate Group
  const interestGroup = createInputGroup({
    label: interestRateLabel,
    value: interestValue,
    min: minimumInterestValue,
    max: maximumInterestValue,
    name: "interest",
  });

  // Tenure Group
  const tenureGroup = createInputGroup({
    label: tenureLabel,
    value: tenureValue,
    min: minimumYearValue,
    max: maximumYearValue,
    name: "tenure",
  });

  mainContainer.append(loanGroup, interestGroup, tenureGroup);

  block.append(mainContainer);
}

function createInputGroup({ label, value, min, max, name }) {
  const group = createElement("div", { classes: `${blockName}__group` });

  const headerRow = createElement("div", { classes: `${blockName}__header` });

  const labelEl = createElement("span", {
    classes: `${blockName}__label`,
  });
  labelEl.textContent = label;

  const valueEl = createElement("span", {
    classes: `${blockName}__value`,
  });
  valueEl.textContent = value;

  headerRow.append(labelEl, valueEl);

  const range = createElement("input", {
    classes: `${blockName}__range`,
    attrs: {
      type: "range",
      min: min,
      max: max,
      value: value,
      step: name === "interest" ? "0.1" : "1",
    },
  });
  const minMaxRow = createElement("div", {
    classes: `${blockName}__minmax`,
  });

  const minEl = createElement("span", { classes: `${blockName}__min` });
  minEl.textContent = min;

  const maxEl = createElement("span", { classes: `${blockName}__max` });
  maxEl.textContent = max;

  minMaxRow.append(minEl, maxEl);
  group.append(headerRow, range, minMaxRow);

  return group;
}
