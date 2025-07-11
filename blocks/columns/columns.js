export default function decorate(block) {
  const insideCol = block.querySelectorAll(".columns.addclass > div");

  insideCol.forEach((el) => {
    el.classList.add("col-main-container");
  });

  const get = block.querySelectorAll(".columns.addclass > div > div");

  const classArray = ["left-col", "right-col"];
  get.forEach((el, index) => {
    if (classArray[index]) {
      el.classList.add(classArray[index]);
    }
  });

  const getTr = block.querySelectorAll("tr");

  getTr.forEach((el) => {
    const hue = Math.floor(Math.random() * 360);
    const pastelColor = `hsl(${hue}, 70%, 95%)`;
    el.style.backgroundColor = pastelColor;
  });

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector("picture");
      if (pic) {
        const picWrapper = pic.closest("div");
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add("columns-img-col");
        }
      }
    });
  });

  // variation-2
  const blockName = "leadContainer";
  let leadBtnContainer = block.classList.contains("leadgeneratecontainer");
  console.log(leadBtnContainer);

  const backgroundColor = initBgColor(block.classList);
  if (leadBtnContainer) {
    const blockBEM = block.querySelector(":scope > div");
    blockBEM.classList.add(`${blockName}__flex`);
    console.log(blockBEM);
    block.style.backgroundColor = backgroundColor;
  }
}

// function to retriev bg color
function initBgColor(classList) {
  console.log([...classList]);
  const bgClass = [...classList].find((item) => item.startsWith("bgcolor"));
  console.log(bgClass);
  let bgColorValue = "inherit";
  if (bgClass) {
    const [colorName, colorValue] = bgClass.split("-");
    console.log(colorName, colorValue);
    bgColorValue = colorValue.startsWith("#") ? colorValue : `#${colorValue}`;
  }
  return bgColorValue;
}
