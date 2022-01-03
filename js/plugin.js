"use strict";

let images = []
let randomCount
let trendingParent = document.querySelector(".trending")
let casting = document.querySelector(".casting")

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


// Get all cast
axios.get("https://api.themoviedb.org/3/person/popular?api_key=1dba575db6b3c4b61cea77ef1f176bb2&language=en-US&page=1")
    .then(res => {
        let data = res.data.results
        data.forEach(el => {
            axios.get(`https://api.themoviedb.org/3/person/${el.id}?api_key=1dba575db6b3c4b61cea77ef1f176bb2&language=en-US`)
                .then(res => {
                    let data = res.data
                    console.log("bio data :", data.id);
                    casting.insertAdjacentHTML('beforeend',
                        `   <li class="cast">
                                <div class="uk-panel">
                                    <div class="cast-img">
                                        <img class="slider-img" src="https://image.tmdb.org/t/p/original${el.profile_path}" alt="">
                                    </div>
                                    <div class="cast-info ms-3">
                                        <h3 class="text-white card-head">${el.name}</h3>
                                        <hr class="cast-hr" />
                                        <p class="cast-p">
                                            ${data.biography || 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus, necessitatibus'} 
                                        </p>
                                            <div class="text-end m-2">
                                                <a href='https://www.imdb.com/name/${data.imdb_id}/' target="_blank"><i class="fab fa-imdb fa-3x"></i></a>
                                            </div>
                                    </div>
                                </div>
                            </li>`)
                })
        })
    })

