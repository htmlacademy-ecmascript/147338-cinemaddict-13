import AbstractView from "./abstract";

const createCommentsSectionTemplate = ({comments}) => {
  return `<section class="film-details__comments-wrap">
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>
    <ul class="film-details__comments-list">
    </ul>
    </section>`;
};

export default class CommentsSection extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;
  }

  getTemplate() {
    return createCommentsSectionTemplate(this._movie);
  }

  getCommentsWrap() {
    return this.getElement().querySelector(`.film-details__comments-wrap`);
  }

  getCommentsList() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  getCommentsCount() {
    return this.getElement().querySelector(`.film-details__comments-count`);
  }
}
