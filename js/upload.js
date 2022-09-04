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

function uploadFile() {
    if (formIsValid()) {
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