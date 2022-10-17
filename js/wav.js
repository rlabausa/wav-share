const URL = 'http://localhost:5212/api/audiofiles';
const OPTIONS = {
    headers: {
        'Content-Type': 'application/json',
        'client-correl-id': 'generate'
    }
};
const PAGE_LIMIT = 10;
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

            populateTableData(data.audioFilesDetails);

        });
}

function populateTableData(data) {
    const existingRows = document.querySelectorAll('#audioFilesDetails tbody tr');

    for (let row of existingRows){
        row.remove();
    }

    const tBody = document.querySelector('#audioFilesDetails tbody');

    data.forEach(record => {
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