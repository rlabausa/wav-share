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
    span.textContent = file.name;
}

window.onload = function () {
    const fileInput = document.querySelector('#file');
    
    fileInput.addEventListener('change', handleFileSelection);
    fileInput.addEventListener('click', clearFileSelection);

}