let blockName = 'lead-generation-form';

function createElement(tag, className, innerHTML = "") {
    const element = document.createElement(tag);
    element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function addValidationLogic(nameInput, numberInput, checkBox, optButton, block) {
    const isValidName = (name) => /^[A-Za-z\s]+$/.test(name.trim());
    const isValidNumber = (num) => /^\d{10}$/.test(num.trim());

    function validateForm() {
        const nameValid = isValidName(nameInput.value);
        const numberValid = isValidNumber(numberInput.value);
        const checkboxChecked = checkBox.checked;

        optButton.disabled = !(nameValid && numberValid && checkboxChecked);
    }

    nameInput.addEventListener("input", () => {
        nameInput.value = nameInput.value.replace(/[^A-Za-z\s]/g, "");
        validateForm();
    });

    numberInput.addEventListener("input", () => {
        numberInput.value = numberInput.value.replace(/[^0-9]/g, "").slice(0, 10);
        validateForm();
    });

    checkBox.addEventListener("change", validateForm);

    optButton.disabled = true;

    optButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Move to step 2
        const nextStep = block.querySelector(`.${blockName}__form2_container`);
        const firstStep = block.querySelector(`.${blockName}__form1_container`);
        const otpNumberInput = nextStep.querySelector(`#number_input_otp`);

        // Set number as placeholder in step 2
        otpNumberInput.placeholder = `+ ${numberInput.value}`;
        nextStep.style.display = 'flex';
        firstStep.style.display = 'none';

        // Add edit button functionality here
        const editBtn = nextStep.querySelector(`.${blockName}__edit_number`);
        editBtn.addEventListener("click", () => {
            firstStep.style.display = 'flex';
            nextStep.style.display = 'none';
            setTimeout(() => {
                numberInput.focus();
            }, 100);
        });
    });
}

function stepFirstFormInput(stepFirstFormContainer, block) {
    const nameInput = createElement('input', `${blockName}__name_input`)
    nameInput.type = 'text';
    nameInput.id = 'name_input';
    nameInput.placeholder = 'Aditya Arjugade';

    const numberInput = createElement('input', `${blockName}__number_input`)
    numberInput.type = 'text';
    numberInput.id = 'number_input';
    numberInput.placeholder = '+91 77180 87986';

    const inputContiner = createElement('div', `${blockName}__inputs`);
    inputContiner.append(nameInput, numberInput);


    const checkBoxContaier = createElement('div', `${blockName}__checkBox_container`);
    const checkBox = createElement('input', `${blockName}__checkbox`);
    checkBox.type = 'checkbox';
    checkBox.id = 'checkBox_input';
    const checkBoxDescriptionDiv = block.children[1];
    const description = checkBoxDescriptionDiv.querySelector('p');
    description.classList.add(`${blockName}__checkBox_description`)
    checkBoxDescriptionDiv.remove();
    checkBoxContaier.append(checkBox, description);


    const otpButtonContainer = createElement('div', `${blockName}__btn_otp_container`);
    const optButton = createElement('button', `${blockName}__otp_button`);
    optButton.textContent = 'GET OTP';
    otpButtonContainer.append(optButton);

    stepFirstFormContainer.append(inputContiner, checkBoxContaier, otpButtonContainer);
    addValidationLogic(nameInput, numberInput, checkBox, optButton, block);
}

function showThnakYouPage(block){
    const thankCaption = createElement('div',`${blockName}__thankyou_container`);
    const thnakContent = createElement('p',`${blockName}__thankyou_label`);
    thnakContent.textContent='ThankYou to show the interest..!';
    thankCaption.append(thnakContent);

    const closeThank = createElement('div',`${blockName}__thank_close_container`);
    const thankIcon = createElement('span',`${blockName}__thankyou_close_icon`);
    thankIcon.textContent ='X';
    closeThank.append(thankIcon);
    block.append(thankCaption,closeThank);

    thankIcon.addEventListener('click',()=>{
        const updatedData = {
          value: true,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem('leadFill', JSON.stringify(updatedData));
        sessionStorage.removeItem("showLeadBlock");
        block.classList.add('hideLead');
        block.classList.remove('showLeadBlock');
    })
}

function addValidationLogicSec(otpInput, checkBox, submitButton, block) {
    function validateStep2Form() {
        const isOtpValid = /^\d{4}$/.test(otpInput.value.trim());
        const isChecked = checkBox.checked;
        submitButton.disabled = !(isOtpValid && isChecked);
    }
    otpInput.addEventListener('input', (e) => {
        otpInput.value = otpInput.value.replace(/[^0-9]/g, '').slice(0, 4);
        validateStep2Form();
    });
    checkBox.addEventListener('change', validateStep2Form);
    submitButton.disabled = true;
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        block.innerHTML='';
        showThnakYouPage(block)
    });

}

function stepSecFormInput(stepSecFormContiner, block) {
    const numInput = createElement('input', `${blockName}__number_input_otp`)
    numInput.type = 'text';
    numInput.id = 'number_input_otp';
    numInput.placeholder = '+91 77180 87986';
    numInput.setAttribute('readonly', true);
    const otpInput = createElement('input', `${blockName}__input_otp_verify`)
    otpInput.type = 'text';
    otpInput.id = 'nput_otp_verify';
    otpInput.placeholder = 'Enter the 4 digit OTP';

    const readOnlynumber = createElement('div', `${blockName}__readonly_number_container`);
    const editNumber = createElement('p', `${blockName}__edit_number`);
    editNumber.textContent = 'Edit';
    readOnlynumber.append(numInput, editNumber);

    const inputContiner = createElement('div', `${blockName}__inputs`);
    inputContiner.append(readOnlynumber, otpInput);


    const checkBoxContaier = createElement('div', `${blockName}__checkBox_container`);
    const checkBox = createElement('input', `${blockName}__checkbox`);
    checkBox.type = 'checkbox';
    checkBox.id = 'checkBox_input_otp';
    const checkBoxDescriptionDiv = block.querySelector(`.${blockName}__checkBox_description`);
    const description = checkBoxDescriptionDiv.cloneNode(true);
    description.classList.add(`${blockName}__checkBox_description`)
    checkBoxContaier.append(checkBox, description);


    const otpButtonContainer = createElement('div', `${blockName}__btn_submit_container`);
    const submitButton = createElement('button', `${blockName}__submit_button`);
    submitButton.textContent = 'Submit Application';
    otpButtonContainer.append(submitButton);

    stepSecFormContiner.append(inputContiner, checkBoxContaier, otpButtonContainer);
    addValidationLogicSec(otpInput, checkBox, submitButton, block)
}

function trackScrollDepth(block) {
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        if (scrollPercentage > 50) {
            const isCheckOut = sessionStorage.getItem("leadChekout");
            const isFilled= localStorage.getItem('leadFill');
            if (!isCheckOut && !isFilled) {
                sessionStorage.setItem("showLeadBlock", true);
                if (!block.classList.contains('showLeadBlock')) {
                    block.classList.add("showLeadBlock");
                }
            }
        }

    });
}

function createFormContainerStructure(block, wrapperDiv) {
    const formContianer = createElement('div', `${blockName}__content_contianer`);
    // wrapperDiv.append(formContianer);

    const stepFirstFormContainer = createElement('div', `${blockName}__form1_container`);
    const stepSecFormContiner = createElement('div', `${blockName}__form2_container`);

    //initally stepSecFormContiner will be display none
    stepSecFormContiner.style.display = 'none';
    const closeIconDiv = createElement('div', `${blockName}__close_icon_container`);
    const closeIcon = createElement('span', `${blockName}__close_icon`);
    closeIcon.textContent = 'X';
    closeIconDiv.append(closeIcon);
    wrapperDiv.append(formContianer);
    block.append(closeIconDiv)

    formContianer.append(stepFirstFormContainer, stepSecFormContiner);

    stepFirstFormInput(stepFirstFormContainer, block);
    stepSecFormInput(stepSecFormContiner, block);
    closeIcon.addEventListener('click', () => {
        block.style.display = 'none';
        sessionStorage.removeItem("showLeadBlock");
        sessionStorage.setItem("leadChekout", true);
        if (block.classList.contains("showLeadBlock")) {
            block.classList.remove("showLeadBlock");
        }
    })
    trackScrollDepth(block);
    const getItem = sessionStorage.getItem("showLeadBlock");
    if (getItem) {
        block.classList.add("showLeadBlock");
    }
}

function checkLeadSurveyCondition(block){
 const storedData = localStorage.getItem('leadFill');
      if (storedData) {
    const currentDate = new Date();
    const { value, timestamp } = JSON.parse(storedData);
    const storedDate = timestamp ? new Date(timestamp) : null;

    // Check if timestamp exists and is older than 1 Minute
    if (!storedDate || (currentDate - storedDate) / (1000 * 60) > 1) {
      localStorage.removeItem('leadFill');
    //   block.classList.add('showLeadBlock');
      block.classList.remove('hideLead');
    }
}
}

export default function decorate(block) {
    const wrapperDiv = block.querySelector(':scope>div');
    wrapperDiv.classList.add(`${blockName}__container`)
    const headingContainer = wrapperDiv.querySelector(':scope>div');
    headingContainer.classList.add(`${blockName}__heading_container`);
    createFormContainerStructure(block, wrapperDiv);
    checkLeadSurveyCondition(block)
}