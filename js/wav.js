const URL = 'http://localhost:5212/api/audiofiles';
const OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
        'client-correl-id': 'generate'
    }
};
const PAGE_LIMIT = 10;
const CLICKED_ROW_CSS = 'row-clicked';

let pageCursor = 0;
let totalPages = 0;

function setPageEvent() {
    const anchors = document.querySelectorAll('ul.pagination .pageNumber');

    for (let a of anchors) {
        if (a.onclick != 'function') {
            a.addEventListener('click', (event) => {
                event.preventDefault();

                const id = event.target.parentNode.id;
                const cursor = event.target.parentNode.value;

                getPage(id, cursor);
            });
        }
    }
}

function removePages() {
    const pages = document.querySelectorAll('.pageNumber');

    for (let page of pages) {
        page.remove();
    }
}

function getPage(id, cursor) {
    const prevCursor = pageCursor;

    if (id === 'prevBtn') {
        pageCursor = Math.max(pageCursor - 1, 0);
    } else if (id === 'nextBtn') {
        pageCursor = Math.min(pageCursor + 1, totalPages - 1);
    } else {
        pageCursor = cursor;
    }

    const params = {
        pageLimit: PAGE_LIMIT,
        pageCursor: pageCursor
    };

    const resource = URL + '?' + new URLSearchParams(params);

    fetch(
        resource,
        OPTIONS
    )
        .then((response) => response.json())
        .then((data) => {
            populateTableData(data.audioFilesDetails);
            const prev = document.querySelector(`ul.pagination li[value='${prevCursor}'] > a`);
            prev.removeAttribute('aria-current');

            const curr = document.querySelector(`ul.pagination li[value='${pageCursor}'] > a`);
            curr.setAttribute('aria-current', 'page');

        });
}

function getAudioFiles() {
    const params = new URLSearchParams(
        {
            pageCursor: pageCursor,
            pageLimit: PAGE_LIMIT
        }
    );

    const resource = URL + '?' + params;


    fetch(
        resource,
        OPTIONS
    )
        .then((response) => response.json())
        .then((data) => {

            const nextPageBtn = document.querySelector('#nextBtn');
            totalPages = Math.ceil(data.totalRecords / PAGE_LIMIT);

            for (let i = 0; i < totalPages; i++) {
                const li = document.createElement('li');
                li.className = 'pageNumber';
                li.value = i;
                const displayIndex = i + 1;
                li.innerHTML = '<a href=""><span class="hide-element">page </span>' + displayIndex + '</a>';
                nextPageBtn.before(li);
            }

            setPageEvent();

            // set current page on initial load
            const curr = document.querySelector(`ul.pagination li[value='${pageCursor}'] > a`);
            curr.setAttribute('aria-current', 'page');

            populateTableData(data.audioFilesDetails);

        });
}

function populateTableData(data) {
    const existingRows = document.querySelectorAll('#audioFilesDetails tbody tr');

    for (let row of existingRows) {
        row.remove();
    }

    const tBody = document.querySelector('#audioFilesDetails tbody');

    data.forEach(record => {
        const tr = tBody.insertRow();

        Object.entries(record)
            .forEach(([key, val]) => {
                const td = tr.insertCell();

                if (key === 'audioFileId') {
                    td.hidden = true;
                }

                td.innerText = val;
                tr.append(td);

            });
        tr.addEventListener('click', onRowClick);
        tr.addEventListener('dblclick', onRowDoubleClick);
        tBody.append(tr);
    });
}

function onRowDoubleClick(event) {
    const td = event.target.parentNode.children[0];
    const id = td.innerText;

    const audioPlayer = document.querySelector('audio');
    const audioSrc = document.querySelector('#audioSrc');

    const resource = `${URL}/${id}`;

    highlightRow(event);

    fetch(
        resource, OPTIONS
    )
        .then((response) => response.json())
        .then((data) => {

            const dataUrl = 'data:audio/wav;base64,' + data.encodedAudio;
            audioSrc.src = dataUrl;

            audioPlayer.load();
            audioPlayer.play();
        });

}

function onRowClick(event) {
    highlightRow(event);

}

function highlightRow(event) {
    if (event.detail == 1) {
        let unselected = false;

        const clickedRow = event.target.parentNode;
        const currentlyHighlightedRows = document.getElementsByClassName(CLICKED_ROW_CSS);


        for (let row of currentlyHighlightedRows) {
            row.classList.remove(CLICKED_ROW_CSS);

            if (row == clickedRow) {
                unselected = true;
            }

        }

        if (!unselected && clickedRow.classList && !clickedRow.classList.contains(CLICKED_ROW_CSS)) {
            clickedRow.classList.add(CLICKED_ROW_CSS);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const anchors = document.querySelectorAll('ul.pagination li a');

    for (let a of anchors) {
        a.addEventListener('click', (event) => {
            event.preventDefault();
            const id = event.target.parentNode.parentNode.id;
            const value = event.target.parentNode.parentNode.value;

            getPage(id, value);
        });
    }
})
window.addEventListener('DOMContentLoaded', getAudioFiles);