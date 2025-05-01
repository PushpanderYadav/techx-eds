const placeholders = null;
export function createElement(tagName, options = {}) {
  const { classes = [], props = {} } = options;
  const elem = document.createElement(tagName);
  const isString = typeof classes === 'string';
  if (
    classes
    || (isString && classes !== '')
    || (!isString && classes.length > 0)
  ) {
    const classesArr = isString ? [classes] : classes;
    elem.classList.add(...classesArr);
  }
  if (!isString && classes.length === 0) {
    elem.removeAttribute('class');
  }

  if (props) {
    Object.keys(props).forEach((propName) => {
      const value = propName === props[propName] ? '' : props[propName];
      elem.setAttribute(propName, value);
    });
  }

  return elem;
}
export function getTextLabel(key) {
  return placeholders?.data.find((el) => el.Key === key)?.Text || key;
}
