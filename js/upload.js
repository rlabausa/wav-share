function clearFileSelection(event) {
    // Reset input value
    event.target.value = null;

    // Reset span containing file name selection
    const span = document.querySelector('span.input-file-selection');
    span.textContent = 'No file chosen';
}

function enableUpload() {
    const uploadBtn = document.querySelector('#uploadBtn');

    uploadBtn.disabled = !formIsValid();
}

function formIsValid() {
    const encodedWavFile = document.querySelector('#fileBase64Encoding');
    const fileNameInput = document.querySelector('#fileName');
    const uploaderNameInput = document.querySelector('#uploaderName');

    if (encodedWavFile.value && fileNameInput.value && uploaderNameInput.value) {
        return true;
    } else {
        return false;
    }
}

function handleFileSelection(event) {
    const file = event.target.files[0];
    const span = document.querySelector('span.input-file-selection');
    if (file && file.type === 'audio/wav') {
        span.textContent = file.name;

        const reader = new FileReader();

        reader.onload = function () {
            const resultString = reader.result;

            // Remove Data-URL declaration (data:audio/wav;base64,) 
            // This allows blob to be directly decoded as Base64
            const DATA_URL_DECLARATION_PATTERN = /^.*\/.*,/
            const base64String = resultString.replace(DATA_URL_DECLARATION_PATTERN, '');

            const encodedWavFile = document.querySelector('#fileBase64Encoding');
            encodedWavFile.value = base64String;

            enableUpload();
        }

        reader.onerror = function () {
            const msg = 'Error occurred while reading file.';
            span.textContent = msg;
            alert(msg);

            enableUpload();
        }

        // Perform the read to trigger the FileReader's `load` event
        reader.readAsDataURL(file);
    } else if (file) {
        const msg = 'Invalid file selection.  Only .wav files are accepted.';
        span.textContent = msg;
        alert(msg);
    } else {
        span.textContent = 'No file chosen';
    }
}

function postData(form) {
    const xhr = new XMLHttpRequest();

    // Bind the FormData object and the form element
    const formData = new FormData(form);
    const payload = JSON.stringify(Object.fromEntries(formData));   

    // Define what happens on successful data submission
    xhr.addEventListener('load', (event) => {
        alert(event.target.responseText);
    });

    // Define what happens in case of error
    xhr.addEventListener('error', (event) => {
        alert(`Error: There was a problem submitting the form. ${event.target.responseText}`);
    })

    // Set up request
    xhr.open('POST', 'http://localhost:5212/api/audiofiles');

    // Add required headers for API
    xhr.setRequestHeader('client-correl-id', 'generate');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Add payload to request body
    xhr.send(payload);
}

function uploadFile() {
    if (formIsValid()) {
        const form = document.getElementById('uploadForm');

        postData(form);

        console.log('UPLOADED');
    } else {
        console.log('NOT UPLOADED');
        alert('All required fields must be filled out before form can be submitted!');
    }
}

window.onload = function () {
    const fileInput = document.querySelector('#file');
    const fileNameInput = document.querySelector('#fileName');
    const uploaderNameInput = document.querySelector('#uploaderName');
    const uploadBtn = document.querySelector('#uploadBtn');

    fileInput.addEventListener('change', handleFileSelection);
    fileInput.addEventListener('click', clearFileSelection);
    fileNameInput.addEventListener('change', enableUpload);
    uploaderNameInput.addEventListener('change', enableUpload);
    uploadBtn.addEventListener('click', uploadFile);
    uploadBtn.disabled = true;
}