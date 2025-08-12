const blockName = 'apply-now-modal';
function createElement(tag, { classes = "", attrs = {} } = {}) {
    const el = document.createElement(tag);
    if (classes) el.className = classes;
    Object.entries(attrs).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
}

let interval = null;
function startCountdown(selector, duration, resendOtp) {
  const timerElement = selector;
  let timeLeft = duration;

  // Clear any running interval before starting a new one
  clearInterval(interval);

  // Show the countdown immediately
  timerElement.textContent = `${timeLeft} Seconds`;

  interval = setInterval(() => {
    timeLeft--;
    if (timeLeft < 0) {
      resendOtp.removeAttribute('disabled'); // enable resend button
      clearInterval(interval);
    } else {
      timerElement.textContent = `${timeLeft} Seconds`;
    }
  }, 1000);
}

function validateOTPForm(container) {
    const nameInput = container.querySelector(`.${blockName}__first-name`);
    const emailInput = container.querySelector(`.${blockName}__email`);
    const phoneInput = container.querySelector(`.${blockName}__phone`);
    const getOtpButton = container.querySelector(`#get-otp-button`);

    // Disable button initially
    getOtpButton.disabled = true;

    // Reject emails with spaces
    const isEmailValid = (email) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/\s/.test(email);

    // Only 10 digits, no spaces
    const isPhoneValid = (phone) =>
        /^\d{10}$/.test(phone) && !/\s/.test(phone);

    function validate() {
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;

        const valid = name !== '' && isEmailValid(email) && isPhoneValid(phone);
        getOtpButton.disabled = !valid;
    }

    // Limit phone to 10 digits max
    phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        validate();
    });

    emailInput.addEventListener('input', validate);
    nameInput.addEventListener('input', validate);

    getOtpButton.addEventListener('click', (e) => { 
        e.preventDefault();
        const validateOtpContainer = container.nextElementSibling;
        const name = nameInput.value;
        const email = emailInput.value;
        const phone = phoneInput.value;
        const lastFourDigit = phone.slice(-4);
        const message = validateOtpContainer.querySelector(`.${blockName}__message-content`);
        message.textContent = message.textContent.replace(/\d{4}$/, lastFourDigit);
        const resendOtp = validateOtpContainer.querySelector(`.${blockName}__resend-otp`);

        if (name && isEmailValid(email) && isPhoneValid(phone)) {
            
            const readOnlyInput = validateOtpContainer.querySelector(`.${blockName}__readonly-input`);
            const timer = validateOtpContainer.querySelector(`.${blockName}__timer`);
            readOnlyInput.value=phone;
            startCountdown(timer, 60,resendOtp)
            validateOtpContainer.classList.add('show-validate-container');
            container.classList.add('hide-button-container');

        } else {
            console.warn('Enter valid details');
        }
    });
}

function generateOTPStructure() {
    const generateOtpContainer = createElement('div', { classes: `${blockName}__generate-otp-container` });
    const formContainer = createElement('div', { classes: `${blockName}__generate-otp-form` });
    const getOtpContainer = createElement('div', { classes: `${blockName}__generate-otp-button` });

    //first name container
    const firstNameContainer = createElement('div', { classes: `${blockName}__input-container` });
    const firstNameInput = createElement('input', { classes: `${blockName}__first-name` });
    // firstNameInput.name='first-name';
    firstNameInput.type = 'text';
    firstNameInput.placeholder = 'Full Name';

    firstNameContainer.append(firstNameInput);


    //Email container
    const emailContainer = createElement('div', { classes: `${blockName}__input-container` });
    const emailInput = createElement('input', { classes: `${blockName}__email` });
    emailInput.name = 'email';
    emailInput.id = 'email';
    emailInput.type = 'email';
    emailInput.placeholder = 'Email';

    emailContainer.append(emailInput);


    //Phone container
    const phoneContainer = createElement('div', { classes: `${blockName}__input-container` });
    const phoneInput = createElement('input', { classes: `${blockName}__phone` });
    phoneInput.name = 'phone';
    phoneInput.type = 'text';
    phoneInput.placeholder = 'Phone Number';

    phoneContainer.append(phoneInput);

    //append fullname email phone into formContainer
    formContainer.append(firstNameContainer, emailContainer, phoneContainer);

    //get otp button
    const getOtpButton = createElement('button', { classes: `${blockName}__get-otp-button` });
    getOtpButton.id = 'get-otp-button';
    getOtpButton.textContent = 'Get OTP';
    getOtpContainer.append(getOtpButton);

    //append form-container and get otp coontainer into generateOtpContainer
    generateOtpContainer.append(formContainer, getOtpContainer);
    validateOTPForm(generateOtpContainer);

    return generateOtpContainer;

}


function validateOTPFormSec(validateOtpContainer){
    const editText = validateOtpContainer.querySelector(`.${blockName}__edit-text`);
    const resendOtpButton = validateOtpContainer.querySelector(`.${blockName}__resend-otp`);
    const timer = validateOtpContainer.querySelector(`.${blockName}__timer`);
    const otpInput = validateOtpContainer.querySelector(`.${blockName}__otp-input`);
    const otpButton = validateOtpContainer.querySelector(`.${blockName}__validate-button`);


    //add event listener  for edit number
    editText.addEventListener('click',()=>{
    const getValidateContainer = validateOtpContainer.previousElementSibling;
    const inputPhone = getValidateContainer.querySelector(`.${blockName}__phone`);
    if(validateOtpContainer && getValidateContainer){
        getValidateContainer.classList.remove('hide-button-container');
        validateOtpContainer.classList.remove('show-validate-container');
        inputPhone.focus();
        clearInterval(interval);
    }
    })
    resendOtpButton.addEventListener('click',()=>{
        resendOtpButton.setAttribute('disabled',true);
        startCountdown(timer, 60,resendOtpButton);
    })
    otpInput.addEventListener('input', () => {
        otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 4);
    });

    otpButton.addEventListener('click',()=>{
        const thankYouPage=validateOtpContainer.nextElementSibling;
        const parentBlock=validateOtpContainer.parentElement;
        const applyHeadingContainer = parentBlock.querySelector(`.${blockName}__heading-content`);
        if(otpInput.value && (otpInput.value.length==4)){
            applyHeadingContainer.remove();
            thankYouPage.classList.add('show-thank-you');
            validateOtpContainer.classList.remove('show-validate-container');

        } else{
            console.log("fill the proper input");
        }
    })

}

function generateValidateOTPStructure(block) {
    const validateOtpContainer = createElement('div', { classes: `${blockName}__validate-otp-container` });

    // Read-only input with editable span
    const infoContainer = createElement('div', { classes: `${blockName}__info-container` });

    const readOnlyInput = createElement('input', { classes: `${blockName}__readonly-input` });
    readOnlyInput.type = 'text';
    readOnlyInput.readOnly = true;
    readOnlyInput.value = 'Phone Number';

    const editSpan = createElement('span', { classes: `${blockName}__edit-text` });
    editSpan.textContent = 'Edit';

    infoContainer.append(readOnlyInput, editSpan);

    // Message: "Please enter the OTP sent to your number"
    const messageContainer = createElement('div', { classes: `${blockName}__message-container` });
    const messageContainerText = createElement('p',{classes:`${blockName}__message-content`})
    messageContainerText.textContent = 'Please enter the 6-digit OTP sent to your mobile number ending in ******7986';
    messageContainer.append(messageContainerText);

    // OTP input container
    const otpInputContainer = createElement('div', { classes: `${blockName}__otp-input-container` });
    const otpInput = createElement('input', { classes: `${blockName}__otp-input` });
    otpInput.type = 'text';
    otpInput.placeholder = 'Enter OTP';
    otpInput.name = 'otp';
    otpInputContainer.append(otpInput);

    // "Didn’t receive OTP?" and "Resend OTP"
    const otpOptionsContainer = createElement('div', { classes: `${blockName}__otp-options-container` });

    const noOtpDiv = createElement('div', { classes: `${blockName}__no-otp-container` });
    const noOtpLabel = createElement('p',{classes:`${blockName}__no-otp-text`});
    noOtpLabel.textContent ="Didn't receive any OTP?";

    const timer = createElement('p',{classes:`${blockName}__timer`});
    // timer.textContent='29 Seconds';
    noOtpDiv.append(noOtpLabel,timer);

    const resendOtpDiv = createElement('div', { classes: `${blockName}__resend-otp-container`});
    const resendOtpDivText = createElement('p',{classes: `${blockName}__resend-otp`})
    resendOtpDivText.textContent = 'Resend OTP';
    resendOtpDivText.setAttribute('disabled',true);
    resendOtpDiv.append(resendOtpDivText);

    otpOptionsContainer.append(noOtpDiv, resendOtpDiv);

    // Validate OTP button
    const buttonContainer = createElement('div', { classes: `${blockName}__validate-button-container` });
    const validateButton = createElement('button', { classes: `${blockName}__validate-button` });
    validateButton.id = 'validate-otp-button';
    validateButton.textContent = 'Validate OTP';

    buttonContainer.append(validateButton);

    // Final append
    validateOtpContainer.append(
        infoContainer,
        messageContainer,
        otpInputContainer,
        otpOptionsContainer,
        buttonContainer
    );
    validateOTPFormSec(validateOtpContainer,block)

    return validateOtpContainer;
}

function createApplyNowStructure(block) {
    const applyNowContainer = createElement('div', { classes: `${blockName}__container` });
    const headingContainer = createElement('div', { classes: `${blockName}__heading-container` });
    const headingContent = createElement('div', { classes: `${blockName}__heading-content` });
    const crossIcon = createElement('div', { classes: `${blockName}__cross-icon` });
    crossIcon.setAttribute('aria-label', 'Close');
    crossIcon.type = 'button';

    //create heading 
    const headingTitle = createElement('h3', { classes: `${blockName}__heading-title` });
    headingTitle.textContent = 'Godrej Capital';

    const headingLabel = createElement('h2', { classes: `${blockName}__heading-label` });
    headingLabel.textContent = 'Apply for Business Loans!';
    headingContent.append(headingTitle, headingLabel);



    //crossIcon
    crossIcon.innerHTML = '<span class="close-icon-apply">X</span>';
    crossIcon.addEventListener('click', () => {
        const dioloag = document.querySelector('dialog');
        dioloag.close();
    });

    headingContainer.append(headingContent, crossIcon);


    //creat generateOTP and validateOtp Structure

    const generateOtp = generateOTPStructure();
    const validatOtp = generateValidateOTPStructure(block);

    // all append it into applyNowContainer
    applyNowContainer.append(headingContainer);
    block.innerHTML = '';
    const thankuContainer = createElement('div',{classes:`${blockName}__thank-page-container`});
    const thankuContentContainer = createElement('div',{classes:`${blockName}__thank-page-content`});
    const headingThankYou = createElement('h2',{classes: `${blockName}__heading-thank-you`});
    headingThankYou.textContent ='Thank You!';
    const descriptionThank = createElement('p',{classes: `${blockName}__heading-thank-you`});
    descriptionThank.textContent ='We have successfully captured your details.Our representative will get in touch withyou shortly.';
    
    thankuContentContainer.append(headingThankYou,descriptionThank);
    thankuContainer.append(thankuContentContainer);

    block.append(applyNowContainer, generateOtp, validatOtp,thankuContentContainer);
}
export default function decorate(block) {
    createApplyNowStructure(block);

}
