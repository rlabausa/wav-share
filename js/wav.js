
function getAudioFiles() {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'client-correl-id': 'generate'
        }
    };

    fetch('http://localhost:5212/api/audiofiles', options)
        .then((response) => response.json())
        .then((data) => {

            const tBody = document.querySelector('#audioFilesDetails tbody');

            data.audioFilesDetails.forEach(record => {
                const tr = tBody.insertRow();

                Object.entries(record)
                    .forEach(([key, value]) => {
                        if (key !== 'audioFileId') {
                            const td = tr.insertCell();
                            td.innerText = value;

                            tr.append(td);
                        }
                    });
                tBody.append(tr);
            });
        });
}

window.addEventListener('DOMContentLoaded', getAudioFiles);