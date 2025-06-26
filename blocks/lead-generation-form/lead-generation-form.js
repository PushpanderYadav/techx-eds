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
        nextStep.style.display = 'block';
        firstStep.style.display = 'none';

        // Add edit button functionality here
        const editBtn = nextStep.querySelector(`.${blockName}__edit_number`);
        editBtn.addEventListener("click", () => {
            firstStep.style.display = 'block';
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

function addValidationLogicSec(otpInput, checkBox, submitButton, block) {
    function validateStep2Form() {
        const isOtpValid = /^\d{4}$/.test(otpInput.value.trim());
        const isChecked = checkBox.checked;
        submitButton.disabled = !(isOtpValid && isChecked);
    }
    otpInput.addEventListener('input', () => {
        otpInput.value = otpInput.value.replace(/[^0-9]/g, '').slice(0, 4);
        validateStep2Form();
    });
    checkBox.addEventListener('change', validateStep2Form);
    submitButton.disabled = true;
    submitButton.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Application Submitted!");
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


    const otpButtonContainer = createElement('div', `${blockName}__btn_otp_container`);
    const submitButton = createElement('button', `${blockName}__otp_button`);
    submitButton.textContent = 'Submit Application';
    otpButtonContainer.append(submitButton);

    stepSecFormContiner.append(inputContiner, checkBoxContaier, otpButtonContainer);
    addValidationLogicSec(otpInput, checkBox, submitButton, block)
}

function createFormContainerStructure(block, wrapperDiv) {
    const formContianer = createElement('div', `${blockName}__content_contianer`);
    wrapperDiv.append(formContianer);

    const stepFirstFormContainer = createElement('div', `${blockName}__form1_container`);
    const stepSecFormContiner = createElement('div', `${blockName}__form2_container`);

    //initally stepSecFormContiner will be display none
    stepSecFormContiner.style.display = 'none';
    const closeIconDiv = createElement('div', `${blockName}__close_icon_container`);
    const closeIcon =   createElement('span',`${blockName}__close_icon`);
    closeIcon.textContent ='X';
    closeIconDiv.append(closeIcon);


    formContianer.append(stepFirstFormContainer, stepSecFormContiner, closeIconDiv);

    stepFirstFormInput(stepFirstFormContainer, block);
    stepSecFormInput(stepSecFormContiner, block);
}

export default function decorate(block) {
    const wrapperDiv = block.querySelector(':scope>div');
    wrapperDiv.classList.add(`${blockName}__container`)

    const headingContainer = wrapperDiv.querySelector(':scope>div');
    headingContainer.classList.add(`${blockName}__heading_container`);
    createFormContainerStructure(block, wrapperDiv);
}