const url = 'https://swapi.dev/api/people/',
    container = document.querySelector('div.container'),
    number = 10;
let currentPage = 1;

const getPeople = async () => {
    try {
        const response1 = await fetch(`${url}?page=1&limit=10`)
        if (!response1.ok) {
            throw new Error(`HTTP error! status: ${response1.status}`);
        }
        const data1 = await response1.json();
        const response2 = await fetch(`${url}?page=2&limit=10`)
        if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response2.status}`);
        }
        const data2 = await response2.json();
        const response3 = await fetch(`${url}?page=3&limit=10`)
        if (!response3.ok) {
            throw new Error(`HTTP error! status: ${response3.status}`);
        }
        const data3 = await response3.json();
        const people = [...data1.results, ...data2.results, ...data3.results];
        showPeople(people, currentPage, number);
        btnEvents(people, currentPage, number);
    } catch (err) {
        console.error(err);
    }
}
getPeople();

function createElem() {
    const html1 = `
        <div class="cards-wrap">
        <div class="people-wrap">
            <ul class="people-list">
            <div class="loader-wrap">
            <span class="loader"></span>
            </div>
            </ul>
            <div class="btn-wrap">
                <button disabled id="prevBtn">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <button id="nextBtn">
                    <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    </div>
    `;
    container.insertAdjacentHTML("afterbegin", html1);
}
createElem();
function showPeople(arr, page, number) {
    const ul = document.querySelector('.people-list')
    ul.innerHTML = '';
    const start = page * number - number;
    const end = page * number;
    const li = arr.slice(start, end).map(({ name }) => {
        return `
        <li>${name}</li>
        `
    })
    ul.insertAdjacentHTML("beforeend", li.join(''));
}

function btnEvents(arr, page, number) {
    const prevBtn = document.getElementById('prevBtn'),
        nextBtn = document.getElementById('nextBtn');
    function nextClick() {
        page++;
        prevBtn.disabled = false;
        if (page === arr.length / number) {
            this.disabled = true;
        }
        showPeople(arr, page, number);
    }
    function prevClick() {
        page--;
        nextBtn.disabled = false;
        if (page === 1) {
            this.disabled = true;
        }
        showPeople(arr, page, number);
    }
    prevBtn.addEventListener('click', prevClick);
    nextBtn.addEventListener('click', nextClick);

    const ul = document.querySelector('.people-list');
    ul.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') {
            return
        }
        const index = arr.findIndex((obj) => obj.name === event.target.textContent);
        showPerson(arr, index);
    })

}

// Створення картки
const divCard = document.createElement('div');
function showPerson(arr, index) {
    divCard.className = 'person-card';
    document.querySelector('.people-wrap').after(divCard);
    divCard.innerHTML = '';

    const icon = `
    <div class='icon'>
    <i class="fa fa-light fa-circle-xmark"></i>
    </div>
    `
    divCard.insertAdjacentHTML("afterbegin", icon);

    document.querySelector('.icon').addEventListener('click', () => {
        divCard.remove();
    })
    const personCard = arr
        .slice(index, index + 1)
        .map(({ name, birth_year, gender, films, homeworld, species }) => {
            const filmsUl = films.map((film) => {
                return `<li class='films'>${film}</li>`
            })
            return `
            	<ul class='person-list'>
                    <li>
                    <h2>${name}</h2>
                    </li>
                    <li>
                        Рік народження: ${birth_year}
                    </li>
                    <li>
                        Стать: ${gender}
                    </li>
                    <li>
                        Список фільмів:
                        <ul>${filmsUl.join('')}</ul>
                    </li>
                    <li>
                        Рідна планета: ${homeworld}
                    </li>
                    <li>
                        Підвид (species): ${species}
                    </li>
                </ul>
            `
        })
    divCard.insertAdjacentHTML('beforeend', personCard);
}

