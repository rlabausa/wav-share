function clearFileSelection(event) {
    // Reset input value
    event.target.value = null;

    // Reset span containing file name selection
    const span = document.querySelector('span.input-file-selection');
    span.textContent = 'No file chosen';
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
            const base64String = resultString.replace(/^.*\/.*,/, '');

            const hiddenField = document.querySelector('#fileBase64Encoding');
            hiddenField.value = base64String;
        }

        reader.onerror = function () {
            span.textContent = 'Error occurred while reading file.';
        }

        // Perform the read to trigger the FileReader's `load` event
        reader.readAsDataURL(file);
    } else if (file) {
        span.textContent = 'Invalid file selection.  Only .wav files are accepted.';
    } else {
        span.textContent = 'No file chosen';
    }
}

window.onload = function () {
    const fileInput = document.querySelector('#file');

    fileInput.addEventListener('change', handleFileSelection);
    fileInput.addEventListener('click', clearFileSelection);

}