import {helpersDate} from "../utils";
const createCommentUserTemplate = (comment) => {
  const {author, emotion, text, date} = comment;

  const commentDate = helpersDate.releaseCommentDate(date);
  return `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
  </span>
  <div>
    <p class="film-details__comment-text">${text}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${author}</span>
      <span class="film-details__comment-day">${commentDate}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`;
};

const createCommentsList = (commentsArray) => {
  return commentsArray.map(createCommentUserTemplate).join(``);
};

export {createCommentsList};