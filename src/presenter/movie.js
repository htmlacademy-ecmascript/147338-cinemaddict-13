import CardView from "../view/card";
import PopupView from "../view/popup";
import {render, RenderPosition, remove, replace} from "../utils/render";
import {isEscapeEvent} from "../utils/helper";
import CommentsPresenter from "./comments";
import {UserAction, UpdateType} from "../consts";


export default class Movie {
  constructor(movieContainer, changeData, filmsModel, commentsModel, api) {
    this._movieContainer = movieContainer;
    this._changeData = changeData;
    this._filmsModel = filmsModel;
    this._api = api;
    this._commentsModel = commentsModel;

    this._movieComponent = null;
    this._popupComponent = null;
    this._commentsContainer = null;
    this._commentsPresenter = null;

    this._handleElementClick = this._handleElementClick.bind(this);
    this._handleClosePopup = this._handleClosePopup.bind(this);
    this._handleClosePopupBtnClick = this._handleClosePopupBtnClick.bind(this);
    this._escapePressHandler = this._escapePressHandler.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);

    this._destroyCommentPresenter = this._destroyCommentPresenter.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init(movie) {
    this._movie = movie;
    const prevMovieComponent = this._movieComponent;
    const prevPopupComponent = this._popupComponent;

    this._movieComponent = new CardView(movie);
    this._popupComponent = new PopupView(movie);

    this._setMovieControlsClickHandlers();
    this._setPopupControlsClickHandlers();
    this._movieComponent.setElementClickHandler(this._handleElementClick);


    if (prevMovieComponent === null || prevPopupComponent === null) {
      render(this._movieContainer, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._movieContainer.getElement().contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }

    if (document.body.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
      replace(this._commentsContainer, this._popupComponent.getCommentSectionContainer());
      this._popupComponent.setPopupCloseBtnHandler(this._handleClosePopupBtnClick);
    }

    remove(prevMovieComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._movieComponent);
    remove(this._popupComponent);
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateMovie(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
    }
  }

  _handleModelEvent(updateType, updatedMovie) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._commentsPresenter !== null) {
          this._commentsPresenter.init(updatedMovie);
        }
        break;
    }
  }

  _renderCommentSection(movie) {
    this._commentsPresenter = new CommentsPresenter(this._commentsContainer, this._handleViewAction, this._filmsModel, this._commentsModel, this._api);
    this._commentsPresenter.init(movie);
  }

  _destroyCommentPresenter() {
    if (this._commentsPresenter !== null) {
      this._commentsPresenter.destroy();
      this._commentsPresenter = null;
      this._commentsContainer = null;
    }
  }

  _handleElementClick() {
    this._renderPopup();
  }

  _handleClosePopup() {
    this._destroyCommentPresenter();
    if (this._popupComponent) {
      remove(this._popupComponent);
    }
    document.body.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._escapePressHandler);
  }

  _escapePressHandler(evt) {
    isEscapeEvent(evt, this._handleClosePopup);
  }

  _handleClosePopupBtnClick() {
    this._handleClosePopup();
  }

  _renderPopup() {
    const popupElement = document.body.querySelector(`.film-details`);
    if (document.body.contains(popupElement)) {
      document.body.removeChild(popupElement);
    }
    render(document.body, this._popupComponent, RenderPosition.BEFOREEND);

    this._commentsContainer = this._popupComponent.getCommentSectionContainer();
    document.body.classList.add(`hide-overflow`);
    this._setPopupControlsClickHandlers();
    this._setMovieControlsClickHandlers();
    this._popupComponent.setPopupCloseBtnHandler(this._handleClosePopupBtnClick);
    document.addEventListener(`keydown`, this._escapePressHandler);

    this._api.getComments(this._movie)
      .then((comments) => {
        this._commentsModel.setComments(UpdateType.INIT, comments);
        this._renderCommentSection(this._movie);
      })
      .catch(() => {
        this._commentsModel.setComments(UpdateType.INIT, []);
      });
  }

  _setMovieControlsClickHandlers() {
    this._movieComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._movieComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._movieComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setPopupControlsClickHandlers() {
    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _handleWatchlistClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isWatchlist: !this._movie.isWatchlist
            }
        )

    );
  }

  _handleWatchedClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched,
              watchingDate: new Date(),
            }
        )
    );
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.PATCH,
        Object.assign(
            {},
            this._movie,
            {
              isFavorites: !this._movie.isFavorites
            }
        )
    );

  }
}
