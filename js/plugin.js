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

// Random number function
const randomNumber = (number) => {
    return Math.floor(Math.random() * number)
}

setTimeout(() => {
    document.body.style.background = `url('${imageUrl}${images[randomNumber(19)]}')`;
}, 2000);

setInterval(() => {
    document.body.style.background = `url('${imageUrl}${images[randomNumber(images.length)]}')`;
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
    return `<li>
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
                        typeList.insertAdjacentHTML('beforeend', insertPosterForMoviesList(item.poster_path))
                    });
                    setTimeout(() => {
                        document.querySelectorAll(".not-load").forEach(el => {
                            el.classList.remove("not-load")
                        })
                        document.querySelector(".scaling-squares-spinner").classList.add("not-load")
                    }, 4000);
                })
        });
    })

// Insert Movies list
const insertMoviesList = (name, id,) => {
    return `                            <div class="movies-type mt-5">
            <h2 class="section-head text-white">${name}</h2>
            <div class="uk-position-relative ${name} uk-visible-toggle uk-light" tabindex="-1" uk-slider>
                <ul class="uk-slider-items type-list${id} uk-child-width-1-2 uk-child-width-1-5@m uk-grid">
                
                </ul>
            
                <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slider-item="previous"></a>
                <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slider-item="next"></a>
            
            </div>
        </div>
        <hr class="movies-hr" />`
}

// Insert poster for movies list
const insertPosterForMoviesList = (poster) => {
    return `<li>
            <div class="uk-panel">
                <img src="${imageUrl}${poster}" alt="">
            </div>
        </li>`
}
