// @ts-nocheck
"use strict";

let images = []
let originUrl = "https://api.themoviedb.org/3/"
let imageUrl = 'https://image.tmdb.org/t/p/original'
let apiKey = "?api_key=1dba575db6b3c4b61cea77ef1f176bb2"
let randomCount
let trendingParent = document.querySelector(".trending")
let casting = document.querySelector(".casting")
let moviesList = document.querySelector(".movies-list")
let typeList
let bodyOverlay = document.querySelector(".body-container")

// Random number function
const randomNumber = (number) => {
    return Math.floor(Math.random() * number)
}

setTimeout(() => {
    bodyOverlay.style.background = `url('${imageUrl}${images[randomNumber(19)]}')`;

}, 2000);

setInterval(() => {
    bodyOverlay.style.background = `url('${imageUrl}${images[randomNumber(images.length)]}')`;
}, 10000);

// @ts-ignore
axios.get(`${originUrl}trending/all/day${apiKey}`)
    .then(res => {
        let data = res.data.results
        data.forEach(el => {
            images.push(el.backdrop_path)
            trendingParent.insertAdjacentHTML('beforeend',
                addTrendingImages(el.backdrop_path)
            )
        });
    })

// Add trending images
const addTrendingImages = (poster) => {
    return `<li class="trending-li">
                <div class="uk-panel">
                    <img class="slider-img" src="${imageUrl}${poster}" alt="">
                </div>
            </li>`
}




// Get all cast
// @ts-ignore
axios.get(`${originUrl}person/popular${apiKey}&language=en-US&page=1`)
    .then(res => {
        let data = res.data.results
        data.forEach(el => {
            // @ts-ignore
            axios.get(`${originUrl}person/${el.id}${apiKey}&language=en-US`)
                .then(res => {
                    let data = res.data
                    casting.insertAdjacentHTML('beforeend',
                        insertCastingCard(el.profile_path, el.name, data.biography, data.imdb_id))
                })
        })
    })

// Insert casting card
const insertCastingCard = (poster, name, biography, imdb) => {
    return `   <li class="cast">
                    <div class="uk-panel">
                        <div class="cast-img">
                            <img class="slider-img" src="${imageUrl}${poster}" alt="">
                        </div>
                        <div class="cast-info ms-3">
                            <h3 class="text-white card-head">${name}</h3>
                            <hr class="cast-hr" />
                            <p class="cast-p">
                                ${biography || 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus, necessitatibus'} 
                            </p>
                                <div class="text-end m-2">
                                    <a href='https://www.imdb.com/name/${imdb}/' target="_blank"><i class="fab fa-imdb fa-3x"></i></a>
                                </div>
                        </div>
                    </div>
                </li>`
}

// Get all movies catagories
// @ts-ignore
axios.get(`${originUrl}genre/movie/list${apiKey}&language=en-US`)
    .then(res => {
        let data = res.data.genres

        data.forEach(el => {
            let name = el.name
            // @ts-ignore
            axios.get(`${originUrl}genre/${el.id}/movies${apiKey}&language=en-US&include_adult=false&sort_by=created_at.asc`)
                .then(res => {
                    let data = res.data.results
                    moviesList.insertAdjacentHTML('beforeend',
                        insertMoviesList(el.name, el.id)
                    )
                    typeList = document.querySelector(`.type-list${el.id}`)
                    data.forEach(item => {
                        // console.log("item : ", item.id);
                        typeList.insertAdjacentHTML('beforeend', insertPosterForMoviesList(item.poster_path, item.id))
                    });
                    // setTimeout(() => {
                    //     document.querySelectorAll(".not-load").forEach(el => {
                    //         el.classList.remove("not-load")
                    //     })
                    //     document.querySelector(".scaling-squares-spinner").classList.add("not-load")
                    // }, 4000);
                })
        });
    })

// Insert Movies list
const insertMoviesList = (name, id,) => {
    return `                            <div class="movies-type mt-5">
            <h2 class="section-head text-white">${name}</h2>
            <div class="uk-position-relative ${name} uk-visible-toggle uk-light" tabindex="-1" uk-slider>
                <ul class="uk-slider-items movie-container my-5 type-list${id} uk-child-width-1-2 uk-child-width-1-5@m uk-grid">
                
                </ul>
            
                <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
                <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
            
            </div>
        </div>
        <hr class="movies-hr" />`
}

// Insert poster for movies list
const insertPosterForMoviesList = (poster, id) => {
    return `<li class="movie-card text-center">
                <a class="single-movie" href="single.html">
                    <div class="uk-panel">
                        <img id="${id}" src="${imageUrl}${poster}" alt="">
                    </div>
                </a>
            </li>`
}


setTimeout(() => {
    let movieId = document.querySelectorAll(".single-movie")
    movieId.forEach(item => {
        item.addEventListener("click", e => {
            localStorage.setItem("movieID", e.target.id)
        })
    })
}, 1000);

const player = new Plyr('#player', {
    controls: [],
    muted: true,
    loop: { active: true }
});

player.on('ready', (event) => {
    // event.path[0].click()
    // console.log("play play : ", event);
});

// Get info for movie

let movieIdFromStorage = localStorage.getItem('movieID')
let rating

axios.get(`https://api.themoviedb.org/3/movie/${movieIdFromStorage}${apiKey}&language=en-US`)
    .then(res => {
        let movieData = res.data
        rating = +(movieData.vote_average / 2).toFixed(1)

        console.log("movieData : ", movieData);

        axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}/credits${apiKey}&language=en-US`)
            .then(res => {

                let castData = res.data.cast


                document.querySelector(".single-info-top").insertAdjacentHTML('beforeend', `
                    <h2 class="single-head">${movieData.original_title}</h2>
                    <div class="d-flex">
                    <div
                        id="rateYo"
                        class="d-flex flex-column justify-content-center"
                    ></div>
                    <span class="movie-date text-white fs-4">${movieData.release_date}</span>
                    </div>
                    <p class="text-white fs-3 mt-4">
                    Statting: <span class="cast">${castData[0].name}</span> /
                    <span class="cast">${castData[1].name}</span>
                    </p>
                    <p class="mt-4 text-white fs-3 w-50 fw-bolder">
                    Introduction:
                    <span class="introduction fw-normal"
                        >${movieData.overview}</span
                    >
                    </p>
            `)

                $(function () {
                    $("#rateYo").rateYo({
                        rating: rating,
                        starWidth: "20px",
                        halfStar: true,
                        readOnly: true
                    });
                });
            })

        document.querySelector(".imdb-link").setAttribute("href", `https://www.imdb.com/title/${movieData.imdb_id}`)

        axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}/videos${apiKey}&language=en-US`)
            .then(res => {
                let trailer = res.data.results[0]
                console.log("video res :", trailer);

                document.querySelector(".plyr__video-embed").insertAdjacentHTML("beforeend", `
                        <iframe
                            class="background-trailer"
                            src="https://www.youtube.com/embed/${trailer.key}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1"
                            allowfullscreen>
                        </iframe>
                    `)




                document.querySelector(".trailer-id").setAttribute("src", `https://www.youtube-nocookie.com/embed/${trailer.key}`)
                // document.querySelector(".background-trailer").setAttribute("src", `https://www.youtube.com/embed/${movieIdFromStorage}?origin=https://plyr.io&amp;iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`)
            })



        // Related Movies
        axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}/similar${apiKey}&language=en-US&page=1`)
            // axios.get(`https://api.themoviedb.org/3/movie/${movieData.id}/recommendations${apiKey}&language=en-US&page=1`)
            .then(res => {
                let relatedMovies = res.data.results


                relatedMovies.forEach(item => {
                    if (item.poster_path) {
                        document.querySelector(".related-list").insertAdjacentHTML('beforeend', `
                        <li>
                            <a class="single-movie" href="single.html">
                                <div class="uk-panel h-100">
                                    <img id="${item.id}" class="h-100" src="${imageUrl}${item.poster_path}" alt="" />
                                </div>
                                <h3 class="uk-card-title mt-3 text-center fs-2">
                                ${item.original_title}
                                </h3>
                            </a>
                      </li>
                        `)
                    } else {
                        document.querySelector(".related-list").insertAdjacentHTML('beforeend', `
                        <li>
                            <a class="single-movie" href="single.html">
                                <div class="uk-panel h-100">
                                    <img id="${item.id}" class="h-100" src="img/default.png" alt="default" />
                                </div>
                                <h3 class="uk-card-title mt-3 text-center fs-2">
                                ${item.original_title}
                                </h3>
                            </a>
                      </li>
                        `)
                    }
                })
                console.log("related res : ", relatedMovies);
            })
    })




















