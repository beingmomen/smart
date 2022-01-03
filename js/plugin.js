"use strict";

let images = []
let randomCount
let trendingParent = document.querySelector(".trending")

setTimeout(() => {
    document.body.style.background = `url('https://image.tmdb.org/t/p/original${images[10]}')`;
}, 2000);

setInterval(() => {
    randomCount = Math.floor(Math.random() * images.length)
    document.body.style.background = `url('https://image.tmdb.org/t/p/original${images[randomCount]}')`;
}, 10000);

// @ts-ignore
axios.get("https://api.themoviedb.org/3/trending/all/day?api_key=1dba575db6b3c4b61cea77ef1f176bb2")
    .then(res => {
        let data = res.data.results
        data.forEach(el => {
            images.push(el.backdrop_path)
            trendingParent.insertAdjacentHTML('beforeend',
                `<li>
                    <div class="uk-panel">
                        <img class="slider-img" src="https://image.tmdb.org/t/p/original${el.backdrop_path}" alt="">
                    </div>
                </li>`)
        });
    })
