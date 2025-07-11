const blockName = "lead-generation-container";

function createElement(tag, { classes = "", attrs = {}, props = {} } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  Object.entries(props).forEach(([k, v]) => (el[k] = v));
  return el;
}

export default function decorate(block) {
  const items = block.querySelector(":scope > div");
  items.classList.add(`${blockName}-li`);
  const listItems = Array.from(items.querySelectorAll("li"));

  // 1) Build the step circles dynamically, marking active vs inactive
  const circleSteps = createElement("div", { classes: "circle-steps" });
  listItems.forEach((_, i) => {
    const isActive = i === 0;
    const stepEl = createElement("div", {
      classes: `step step--${i + 1} ${isActive ? "active" : "inactive"}`,
      props: { textContent: String(i + 1) },
    });
    circleSteps.append(stepEl);
  });
  block.append(circleSteps);

  // 2) Initialize listItems with active/inactive classes
  listItems.forEach((li, i) => {
    li.classList.add(i === 0 ? "active" : "inactive");
  });

  // 3) Every 10 seconds advance the active index
  let currentIndex = 0;
  setInterval(() => {
    // turn old one to inactive
    listItems[currentIndex].classList.replace("active", "inactive");
    circleSteps.children[currentIndex].classList.replace("active", "inactive");

    // next index (wrap around)
    currentIndex = (currentIndex + 1) % listItems.length;

    // turn new one to active
    listItems[currentIndex].classList.replace("inactive", "active");
    circleSteps.children[currentIndex].classList.replace("inactive", "active");
  }, 5_000);
}
