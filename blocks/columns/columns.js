export default function decorate(block) {
  const insideCol = block.querySelectorAll(".columns > div ");

  insideCol.forEach((el) => {
    el.classList.add("col-main-container");
  });

  const get = block.querySelectorAll(".columns > div > div");

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
}
