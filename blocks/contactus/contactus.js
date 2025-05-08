// Helper function to generate a div with a class name
function createDiv(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}

// Validate Input field after input
function fieldValidate(block, target) {
  const nameInput = block.querySelector('#contact-name');
  const emailInput = block.querySelector('#contact-email');
  const phoneInput = block.querySelector('#contact-phone');
  const locationInput = block.querySelector('#user-location');
  const reasonSelect = block.querySelector('#contact-reason');
  const messageTextarea = block.querySelector('#contact-message');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  switch (target) {
    case 'name':
      if (nameInput && !nameInput.value.trim()) {
        nameInput.classList.add('error');
      } else {
        nameInput.classList.remove('error');
      }
      break;

    case 'email':
      if (
        emailInput
                && (!emailInput.value.trim() || !emailPattern.test(emailInput.value.trim()))
      ) {
        emailInput.classList.add('error');
      } else {
        emailInput.classList.remove('error');
      }
      break;

    case 'phone':
      if (phoneInput) {
        const phoneVal = phoneInput.value.trim();
        if (phoneVal.length < 4 || phoneVal.length > 15) {
          phoneInput.classList.add('error');
        } else {
          phoneInput.classList.remove('error');
        }
      }
      break;

    case 'location':
      if (
        locationInput
                && (!locationInput.value.trim() || locationInput.value.trim().length < 3)
      ) {
        locationInput.classList.add('error');
      } else {
        locationInput.classList.remove('error');
      }
      break;

    case 'reason':
      if (reasonSelect && (!reasonSelect.value || reasonSelect.value === 'Select')) {
        reasonSelect.classList.add('error');
      } else {
        reasonSelect.classList.remove('error');
      }
      break;

    case 'message':
      if (messageTextarea && !messageTextarea.value.trim()) {
        messageTextarea.classList.add('error');
      } else {
        messageTextarea.classList.remove('error');
      }
      break;

    default:
      break;
  }
}

// Function to Validate form after submit
function isValidate(block) {
  const name = block.querySelector('#contact-name');
  const email = block.querySelector('#contact-email');
  const phone = block.querySelector('#contact-phone');
  const location = block.querySelector('#user-location');
  const reason = block.querySelector('#contact-reason');
  const message = block.querySelector('#contact-message');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isValid = true;

  if (!name.value.trim()) {
    fieldValidate(block, name.name);
    isValid = false;
  }

  if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
    fieldValidate(block, email.name);
    isValid = false;
  }

  const phoneVal = phone.value.trim();
  if (!phoneVal || phoneVal.length < 4 || phoneVal.length > 15) {
    fieldValidate(block, phone.name);
    isValid = false;
  }

  if (!location.value.trim() || location.value.trim().length < 3) {
    fieldValidate(block, location.name);
    isValid = false;
  }

  if (!reason.value || reason.value === 'Select') {
    fieldValidate(block, reason.name);
    isValid = false;
  }

  if (!message.value.trim()) {
    fieldValidate(block, message.name);
    isValid = false;
  }

  return isValid;
}

// Helper Function to generate Select Option Field
function optionConverter(optVal, reasondroplabel, reasondropplaceholder) {
  const optArr = optVal.split(',').map((opt) => opt.trim()).filter((opt) => opt);

  const selectLabel = document.createElement('label');
  selectLabel.textContent = reasondroplabel;
  selectLabel.setAttribute('for', 'contact-reason');

  const selectInput = document.createElement('select');
  selectInput.id = 'contact-reason';
  selectInput.name = 'reason';

  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = reasondropplaceholder;
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectInput.appendChild(defaultOption);

  optArr.forEach((element) => {
    const option = document.createElement('option');
    option.value = element;
    option.textContent = element;
    selectInput.appendChild(option);
  });

  const wrapper = createDiv('contact-reason-parent');
  wrapper.append(selectLabel, selectInput);
  return wrapper;
}

// Function to generate Form Fields
function createContactForm(block) {
  const parentSection = block.parentElement.parentElement;
  const dataSet = parentSection.dataset;

  const {
    namelabel, nameplaceholder, emaillabel, emailplaceholder,
    phonelabel, phoneplaceholder, locationlabel, locationplaceholder, weburllabel,
    weburlplaceholder, messagelabel, messageplaceholder, submitbtnlabel,
    reasondropvalue, reasondroplabel, reasondropplaceholder,
  } = dataSet;
  const formContainer = createDiv('custom-contact-form');

  // Name
  const nameLabel = document.createElement('label');
  nameLabel.textContent = namelabel;
  nameLabel.setAttribute('for', 'contact-name');
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.id = 'contact-name';
  nameInput.name = 'name';
  nameInput.placeholder = nameplaceholder;
  const nameDiv = createDiv('contact-name-parent');
  nameDiv.append(nameLabel, nameInput);

  // Email
  const emailLabel = document.createElement('label');
  emailLabel.textContent = emaillabel;
  emailLabel.setAttribute('for', 'contact-email');
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'contact-email';
  emailInput.name = 'email';
  emailInput.placeholder = emailplaceholder;
  const emailDiv = createDiv('contact-email-parent');
  emailDiv.append(emailLabel, emailInput);

  // Contact Number
  const phoneLabel = document.createElement('label');
  phoneLabel.textContent = phonelabel;
  phoneLabel.setAttribute('for', 'contact-phone');
  const phoneInput = document.createElement('input');
  phoneInput.type = 'tel';
  phoneInput.id = 'contact-phone';
  phoneInput.name = 'phone';
  phoneInput.placeholder = phoneplaceholder;
  const phoneDiv = createDiv('contact-phone-parent');
  phoneDiv.append(phoneLabel, phoneInput);

  // Location
  const locationLabel = document.createElement('label');
  locationLabel.textContent = locationlabel;
  locationLabel.setAttribute('for', 'user-location');
  const locationInput = document.createElement('input');
  locationInput.type = 'text';
  locationInput.id = 'user-location';
  locationInput.name = 'location';
  locationInput.placeholder = locationplaceholder;
  const locationDiv = createDiv('user-loaction-parent');
  locationDiv.append(locationLabel, locationInput);

  // Company Website
  const websiteLabel = document.createElement('label');
  websiteLabel.textContent = weburllabel;
  websiteLabel.setAttribute('for', 'company-website');
  const websiteUrl = document.createElement('input');
  websiteUrl.type = 'text';
  websiteUrl.id = 'company-website';
  websiteUrl.name = 'company';
  websiteUrl.placeholder = weburlplaceholder;
  const websiteDiv = createDiv('company-website-parent');
  websiteDiv.append(websiteLabel, websiteUrl);

  // Message
  const messageLabel = document.createElement('label');
  messageLabel.textContent = messagelabel;
  messageLabel.setAttribute('for', 'contact-message');
  const messageTextarea = document.createElement('textarea');
  messageTextarea.id = 'contact-message';
  messageTextarea.name = 'message';
  messageTextarea.placeholder = messageplaceholder;
  const messageDiv = createDiv('contact-message-parent');
  messageDiv.append(messageLabel, messageTextarea);

  // Submit Button
  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.id = 'sub-btn';
  sendButton.textContent = submitbtnlabel;
  messageDiv.append(sendButton);
  const messBtnDiv = createDiv('message-btn');
  messBtnDiv.append(messageDiv, sendButton);

  // Append all elements
  formContainer.append(
    nameDiv,
    emailDiv,
    phoneDiv,
    locationDiv,
    optionConverter(reasondropvalue, reasondroplabel, reasondropplaceholder),
    websiteDiv,
    messBtnDiv,
  );

  return formContainer;
}

function showPopup(message) {
  const thankuDiv = document.createElement('div');
  thankuDiv.className = 'thanku-div';
  thankuDiv.textContent = message;

  const container = document.querySelector('.contactus');
  if (container) {
    container.prepend(thankuDiv);
    setTimeout(() => {
      thankuDiv.remove();
    }, 3000);
  }
}

// Submit button functionality after click
async function formFunctionality(block) {
  const submitBtn = block.querySelector('#sub-btn');
  const nameInput = block.querySelector('#contact-name');
  const emailInput = block.querySelector('#contact-email');
  const phoneInput = block.querySelector('#contact-phone');
  const locationInput = block.querySelector('#user-location');
  const reasonSelect = block.querySelector('#contact-reason');
  const messageTextarea = block.querySelector('#contact-message');
  const webURLInput = block.querySelector('#company-website');
  const parentSection = block.parentElement.parentElement;
  const dataSet = parentSection.dataset;
  const {
    formsheeturl, submitpopup, apierrormessage,
  } = dataSet;
  nameInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    value = value.replace(/\b\w/g, (char) => char.toUpperCase());
    e.target.value = value;
    fieldValidate(block, nameInput.name);
  });

  emailInput.addEventListener('input', () => {
    emailInput.value = emailInput.value.trimStart();
    fieldValidate(block, emailInput.name);
  });

  phoneInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 15);
    fieldValidate(block, phoneInput.name);
  });

  locationInput.addEventListener('input', () => {
    fieldValidate(block, locationInput.name);
  });

  reasonSelect.addEventListener('click', () => {
    fieldValidate(block, reasonSelect.name);
  });

  messageTextarea.addEventListener('input', () => {
    fieldValidate(block, messageTextarea.name);
  });

  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (isValidate(block)) {
      submitBtn.disabled = true;

      const date = new Date();
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const finalDate = `${day}/${month}/${year}`;

      const data = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageTextarea.value.trim(),
        phone: phoneInput.value.trim(),
        location: locationInput.value.trim(),
        reason: reasonSelect.value,
        weburl: webURLInput ? webURLInput.value.trim() : '',
        date: finalDate,
      };

      try {
        const response = await fetch(formsheeturl, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('API response not OK');

        // Clear form only on success
        nameInput.value = '';
        emailInput.value = '';
        phoneInput.value = '';
        locationInput.value = '';
        reasonSelect.selectedIndex = 0;
        messageTextarea.value = '';
        if (webURLInput) webURLInput.value = '';

        // Show success popup
        showPopup(submitpopup); // success message
      } catch (error) {
        console.error('Error!', error);
        // Show error popup
        showPopup(apierrormessage);
      } finally {
        submitBtn.disabled = false;
      }
    }
  });
}

// Decorate Main function
export default function decorate(block) {
  const formChildren = block.children;
  const [firstDIV, secondDIV] = formChildren;

  // Create heading section
  const contactUsHeading = createDiv('contact-us-heading');
  contactUsHeading.appendChild(firstDIV);
  block.prepend(contactUsHeading);
  const officeImg = createDiv('office-img');
  officeImg.appendChild(secondDIV);
  const contactUsForm = createDiv('contact-us-form');
  contactUsForm.appendChild(createContactForm(block));
  const formDiv = createDiv('img-formdiv');
  formDiv.append(officeImg, contactUsForm);
  block.appendChild(formDiv);
  formFunctionality(block);
}
