// const blockName = "creditScoreForm";

// function createElement(tag, { classes = "", attrs = {}, text = "" } = {}) {
//   const el = document.createElement(tag);
//   if (classes) el.className = classes;
//   if (text) el.textContent = text;
//   Object.entries(attrs).forEach(([key, value]) => {
//     el.setAttribute(key, value);
//   });
//   return el;
// }

// export default function decorate(block) {
//   const tabItems = block.querySelectorAll(":scope > div");
//   const getDescription = block.querySelector("p");

//   // Remove original tab divs
//   tabItems.forEach((item) => item.remove());

//   const dataValue = block.parentElement.parentElement.dataset;

//   const {
//     asperdocumentlabel,
//     buttonlabel,
//     contactlabel,
//     dateofbirthlabel,
//     emaillabel,
//     fullnamelabel,
//     genderlabel,
//     gendertype,
//     pannumberlabel,
//     countrycode,
//   } = dataValue;

//   const genderOptions = gendertype
//     ? gendertype.split(",").map((s) => s.trim())
//     : [];
//   const countryCodeOptions = countrycode
//     ? countrycode.split(",").map((s) => s.trim())
//     : [];

//   const mainFormContainer = createElement("div", {
//     classes: `${blockName}__container`,
//   });

//   const form = createElement("form", {
//     classes: `${blockName}__form`,
//   });

//   function createField({ label, name, type = "text", options = [] }) {
//     const fieldWrapper = createElement("div", {
//       classes: `${blockName}__field`,
//     });

//     const fieldLabel = createElement("label", {
//       attrs: { for: name },
//       text: label,
//     });

//     let fieldInput;

//     if (type === "select") {
//       fieldInput = createElement("select", {
//         attrs: { id: name, name, required: true },
//       });
//       options.forEach((opt) => {
//         const option = createElement("option", {
//           attrs: { value: opt },
//           text: opt,
//         });
//         fieldInput.append(option);
//       });
//     } else {
//       fieldInput = createElement("input", {
//         attrs: {
//           type,
//           id: name,
//           name,
//           required: true,
//         },
//       });
//     }

//     fieldWrapper.append(fieldLabel, fieldInput);
//     return fieldWrapper;
//   }

//   // Full Name ((As Per Pan Card)) combined field
//   const fullNameWrapper = createElement("div", {
//     classes: `${blockName}__field`,
//   });
//   const fullNameLabel = createElement("label", {
//     attrs: { for: "fullname" },
//     text: `${fullnamelabel} ((${asperdocumentlabel}))`,
//   });
//   const fullNameInput = createElement("input", {
//     attrs: {
//       type: "text",
//       id: "fullname",
//       name: "fullname",
//       required: true,
//     },
//   });
//   fullNameWrapper.append(fullNameLabel, fullNameInput);
//   form.append(fullNameWrapper);

//   // Date of Birth and Gender in same row container
//   const dobGenderRow = createElement("div", {
//     classes: `${blockName}__row`,
//   });

//   // Date of Birth field with calendar icon trigger
//   const dobWrapper = createElement("div", {
//     classes: `${blockName}__field`,
//   });
//   const dobLabel = createElement("label", {
//     attrs: { for: "dob" },
//     text: `${dateofbirthlabel} ((${asperdocumentlabel}))`,
//   });
//   const dobInput = createElement("input", {
//     attrs: {
//       type: "text",
//       id: "dob",
//       name: "dob",
//       required: true,
//       placeholder: "Select Date of Birth",
//     },
//   });
//   dobWrapper.append(dobLabel, dobInput);

//   // Initialize Flatpickr after input is added to DOM
//   setTimeout(() => {
//     if (window.flatpickr) {
//       flatpickr("#dob", {
//         dateFormat: "d-m-Y",
//         maxDate: "today",
//         altInput: true,
//         altFormat: "F j, Y",
//       });
//     }
//   }, 0);

//   // Gender field
//   const genderWrapper = createElement("div", {
//     classes: `${blockName}__field`,
//   });
//   const genderLabel = createElement("label", {
//     attrs: { for: "gender" },
//     text: genderlabel,
//   });
//   const genderSelect = createElement("select", {
//     attrs: { id: "gender", name: "gender", required: true },
//   });
//   genderOptions.forEach((opt) => {
//     const option = createElement("option", {
//       attrs: { value: opt },
//       text: opt,
//     });
//     genderSelect.append(option);
//   });
//   genderWrapper.append(genderLabel, genderSelect);

//   dobGenderRow.append(dobWrapper, genderWrapper);
//   form.append(dobGenderRow);

//   // Email field
//   form.append(createField({ label: emaillabel, name: "email", type: "email" }));

//   // Contact field with country code select inline
//   const contactWrapper = createElement("div", {
//     classes: `${blockName}__field`,
//   });

//   const contactLabelEl = createElement("label", {
//     attrs: { for: "contact" },
//     text: contactlabel,
//   });

//   const contactInputWrapper = createElement("div", {
//     classes: `${blockName}__contactInputWrapper`,
//   });

//   const countrySelect = createElement("select", {
//     attrs: { id: "countrycode", name: "countrycode", required: true },
//     classes: `${blockName}__countrycode`,
//   });
//   countryCodeOptions.forEach((code) => {
//     const option = createElement("option", {
//       attrs: { value: code },
//       text: code,
//     });
//     countrySelect.append(option);
//   });

//   const contactInput = createElement("input", {
//     attrs: {
//       type: "tel",
//       id: "contact",
//       name: "contact",
//       required: true,
//       placeholder: "Enter contact number",
//     },
//     classes: `${blockName}__contactInput`,
//   });

//   contactInputWrapper.append(countrySelect, contactInput);
//   contactWrapper.append(contactLabelEl, contactInputWrapper);
//   form.append(contactWrapper);

//   // PAN Number field
//   form.append(createField({ label: pannumberlabel, name: "pannumber" }));

//   // Terms and conditions checkbox with existing <p>
//   const termsWrapper = createElement("div", {
//     classes: `${blockName}__terms`,
//   });

//   const termsCheckbox = createElement("input", {
//     attrs: {
//       type: "checkbox",
//       id: "terms",
//       name: "terms",
//       required: true,
//     },
//   });

//   const termsLabel = createElement("label", {
//     attrs: { for: "terms" },
//   });

//   if (getDescription) {
//     termsLabel.append(getDescription);
//   }

//   termsWrapper.append(termsCheckbox, termsLabel);
//   form.append(termsWrapper);

//   // Submit button
//   const submitButton = createElement("button", {
//     classes: `${blockName}__submit`,
//     attrs: { type: "submit" },
//     text: buttonlabel || "Get OTP",
//   });

//   form.append(submitButton);

//   mainFormContainer.append(form);
//   block.append(mainFormContainer);
// }

const blockName = "creditScoreForm";

function createElement(tag, { classes = "", attrs = {}, text = "" } = {}) {
  const el = document.createElement(tag);
  if (classes) el.className = classes;
  if (text) el.textContent = text;
  Object.entries(attrs).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
}

export default function decorate(block) {
  const tabItems = block.querySelectorAll(":scope > div");
  const getDescription = block.querySelector("p");

  tabItems.forEach((item) => item.remove());

  const dataValue = block.parentElement.parentElement.dataset;

  const {
    asperdocumentlabel,
    buttonlabel,
    contactlabel,
    dateofbirthlabel,
    emaillabel,
    fullnamelabel,
    genderlabel,
    gendertype,
    pannumberlabel,
    countrycode,
  } = dataValue;

  const genderOptions = gendertype
    ? gendertype.split(",").map((s) => s.trim())
    : [];
  const countryCodeOptions = countrycode
    ? countrycode.split(",").map((s) => s.trim())
    : [];

  const mainFormContainer = createElement("div", {
    classes: `${blockName}__container`,
  });

  const form = createElement("form", {
    classes: `${blockName}__form`,
  });

  function createField({ label, name, type = "text", options = [] }) {
    const fieldWrapper = createElement("div", {
      classes: `${blockName}__field`,
    });

    const fieldLabel = createElement("label", {
      attrs: { for: name },
      text: label,
    });

    let fieldInput;

    if (type === "select") {
      fieldInput = createElement("select", {
        attrs: { id: name, name, required: true },
      });
      options.forEach((opt) => {
        const option = createElement("option", {
          attrs: { value: opt },
          text: opt,
        });
        fieldInput.append(option);
      });
    } else {
      fieldInput = createElement("input", {
        attrs: {
          type,
          id: name,
          name,
          required: true,
        },
      });
    }

    fieldWrapper.append(fieldLabel, fieldInput);
    return fieldWrapper;
  }

  const fullNameWrapper = createElement("div", {
    classes: `${blockName}__field`,
  });
  const fullNameLabel = createElement("label", {
    attrs: { for: "fullname" },
    text: `${fullnamelabel} ((${asperdocumentlabel}))`,
  });
  const fullNameInput = createElement("input", {
    attrs: {
      type: "text",
      id: "fullname",
      name: "fullname",
      required: true,
    },
  });
  fullNameWrapper.append(fullNameLabel, fullNameInput);
  form.append(fullNameWrapper);

  const dobGenderRow = createElement("div", {
    classes: `${blockName}__row`,
  });

  const dobWrapper = createElement("div", {
    classes: `${blockName}__field ${blockName}__dob-split`,
  });
  const dobLabel = createElement("label", {
    attrs: { for: "dobDay" },
    text: `${dateofbirthlabel} ((${asperdocumentlabel}))`,
  });
  const daySelect = createElement("select", {
    attrs: { id: "dobDay", name: "dobDay", required: true },
  });
  for (let i = 1; i <= 31; i++) {
    daySelect.append(
      createElement("option", {
        attrs: { value: i },
        text: i.toString().padStart(2, "0"),
      })
    );
  }
  const monthSelect = createElement("select", {
    attrs: { id: "dobMonth", name: "dobMonth", required: true },
  });
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  months.forEach((m, i) => {
    monthSelect.append(
      createElement("option", {
        attrs: { value: i + 1 },
        text: m,
      })
    );
  });
  const yearSelect = createElement("select", {
    attrs: { id: "dobYear", name: "dobYear", required: true },
  });
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1900; y--) {
    yearSelect.append(
      createElement("option", {
        attrs: { value: y },
        text: y.toString(),
      })
    );
  }
  dobWrapper.append(dobLabel, daySelect, monthSelect, yearSelect);

  const genderWrapper = createElement("div", {
    classes: `${blockName}__field`,
  });
  const genderLabel = createElement("label", {
    attrs: { for: "gender" },
    text: genderlabel,
  });
  const genderSelect = createElement("select", {
    attrs: { id: "gender", name: "gender", required: true },
  });
  genderOptions.forEach((opt) => {
    const option = createElement("option", {
      attrs: { value: opt },
      text: opt,
    });
    genderSelect.append(option);
  });
  genderWrapper.append(genderLabel, genderSelect);

  dobGenderRow.append(dobWrapper, genderWrapper);
  form.append(dobGenderRow);

  form.append(createField({ label: emaillabel, name: "email", type: "email" }));

  const contactWrapper = createElement("div", {
    classes: `${blockName}__field`,
  });
  const contactLabelEl = createElement("label", {
    attrs: { for: "contact" },
    text: contactlabel,
  });
  const contactInputWrapper = createElement("div", {
    classes: `${blockName}__contactInputWrapper`,
  });
  const countrySelect = createElement("select", {
    attrs: { id: "countrycode", name: "countrycode", required: true },
    classes: `${blockName}__countrycode`,
  });
  countryCodeOptions.forEach((code) => {
    const option = createElement("option", {
      attrs: { value: code },
      text: code,
    });
    countrySelect.append(option);
  });
  const contactInput = createElement("input", {
    attrs: {
      type: "tel",
      id: "contact",
      name: "contact",
      required: true,
      placeholder: "Enter contact number",
    },
    classes: `${blockName}__contactInput`,
  });
  contactInputWrapper.append(countrySelect, contactInput);
  contactWrapper.append(contactLabelEl, contactInputWrapper);
  form.append(contactWrapper);

  form.append(createField({ label: pannumberlabel, name: "pannumber" }));

  const termsWrapper = createElement("div", {
    classes: `${blockName}__terms`,
  });
  const termsCheckbox = createElement("input", {
    attrs: {
      type: "checkbox",
      id: "terms",
      name: "terms",
      required: true,
    },
  });
  const termsLabel = createElement("label", {
    attrs: { for: "terms" },
  });
  if (getDescription) {
    termsLabel.append(getDescription);
  }
  termsWrapper.append(termsCheckbox, termsLabel);
  form.append(termsWrapper);

  const submitButton = createElement("button", {
    classes: `${blockName}__submit`,
    attrs: { type: "submit" },
    text: buttonlabel || "Get OTP",
  });
  form.append(submitButton);

  mainFormContainer.append(form);
  block.append(mainFormContainer);
}
