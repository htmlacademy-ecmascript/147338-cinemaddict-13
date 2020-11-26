import {helpersDate, getDurationMovie} from "../utils";

const MAX_STR_LENGTH = 140;

const replaceStrEndWithDots = (str) => {
  return (str.length > MAX_STR_LENGTH) ? str.substring(0, MAX_STR_LENGTH - 1).trim() + `...` : str;
};

const getActiveClass = (key) => {
  return key ? `film-card__controls-item--active` : ``;
};

const createCardTemplate = (card) => {
  const {title, rating, releaseDate, runtime, genres, poster, description, comments, isWatchlist, isWatched, isFavorites} = card;

  const watchlistClassName = getActiveClass(isWatchlist);
  const watchedClassName = getActiveClass(isWatched);
  const favoriteClassName = getActiveClass(isFavorites);
  const releaseDateYear = helpersDate.releaseTrimmdDate(releaseDate);
  const durationMovie = getDurationMovie(runtime);

  return `<article class="film-card">
  <h3 class="film-card__title">${title}</h3>
  <p class="film-card__rating">${rating}</p>
  <p class="film-card__info">
    <span class="film-card__year">${releaseDateYear}</span>
    <span class="film-card__duration">${durationMovie}</span>
    <span class="film-card__genre">${genres.join(`, `)}</span>
  </p>
  <img src="./images/posters/${poster}" alt="" class="film-card__poster">
  <p class="film-card__description">${replaceStrEndWithDots(description)}</p>
  <a class="film-card__comments">${comments.length} comments</a>
  <div class="film-card__controls">
    <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
    <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export {createCardTemplate};
