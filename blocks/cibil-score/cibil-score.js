const blockName = "cibilScore";

function createElement(tag, { classes = "", attrs = {}, text = "" } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  if (text) el.textContent = text;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

function getColorByAngle(score) {
  if (score >= 300 && score <= 579) return "red";
  if (score >= 580 && score <= 669) return "#ee993f";
  if (score >= 670 && score <= 749) return "#f3cc5a";
  if (score >= 750 && score <= 799) return "#60b263";
  if (score >= 800 && score <= 900) return "green";
  return "black";
}

export default function decorate(block) {
  const outerWrapper = createElement("div", {
    classes: `${blockName}__outer`,
  });

  const frameWrapper = createElement("div", {
    classes: `${blockName}__frame`,
  });

  const scaleWrapper = createElement("div", {
    classes: `${blockName}__scale-wrapper`,
  });

  const meterWrapper = createElement("div", {
    classes: `${blockName}__meter-wrapper`,
  });

  const meter = createElement("div", {
    classes: `${blockName}__meter`,
  });

  const rotator = createElement("div", {
    classes: `${blockName}__needle-rotator`,
  });

  const arc = createElement("div", {
    classes: `${blockName}__arc`,
  });

  const needle = createElement("div", {
    classes: `${blockName}__needle`,
  });

  const centerCircle = createElement("div", {
    classes: `${blockName}__center-circle`,
  });

  const rangeValues = createElement("div", {
    classes: `${blockName}__range-values`,
  });

  const minLabel = createElement("span", {
    classes: `${blockName}__min-label`,
    text: "300",
  });

  const maxLabel = createElement("span", {
    classes: `${blockName}__max-label`,
    text: "900",
  });

  rangeValues.append(minLabel, maxLabel);
  rotator.append(arc, needle, centerCircle);
  meter.append(rotator, rangeValues);
  meterWrapper.append(meter);
  scaleWrapper.append(meterWrapper);
  frameWrapper.append(scaleWrapper);

  // Input UI
  const inputBox = createElement("div", {
    classes: `${blockName}__input-box`,
  });

  const scoreInput = createElement("input", {
    classes: `${blockName}__input`,
    attrs: {
      type: "number",
      min: "300",
      max: "900",
      value: "300",
      step: "1",
      placeholder: "Enter score (300–900)",
    },
  });

  inputBox.appendChild(scoreInput);
  outerWrapper.appendChild(frameWrapper);
  outerWrapper.appendChild(inputBox);

  block.textContent = "";
  block.appendChild(outerWrapper);

  rotator.style.transition = "transform 0.5s ease-in-out";

  // 👉 Add rotation logic based on input
  scoreInput.addEventListener("input", () => {
    let score = parseInt(scoreInput.value, 10);
    score = Math.max(300, Math.min(900, score));
    const baseOffset = 225;
    const angle = ((score - 300) / 600) * 270;
    rotator.style.transform = `rotate(${angle + baseOffset}deg)`;

    const color = getColorByAngle(score);
    centerCircle.style.borderColor = color;
  });
}
