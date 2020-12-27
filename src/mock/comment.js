import {getRandomInteger, getRandomArrayElement} from "../utils/common";
import {authors, emotions, textComments} from "../consts";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generateAuthor = () => getRandomArrayElement(authors);

const generateEmotion = () => getRandomArrayElement(emotions);

const generateText = () => getRandomArrayElement(textComments);

const generateCommentDate = () => {
  return new Date(getRandomInteger(2016, 2020), getRandomInteger(0, 11), getRandomInteger(1, 31), getRandomInteger(0, 23), getRandomInteger(0, 59));
};

export const generateComment = () => {
  return {
    id: generateId(),
    author: generateAuthor(),
    emotion: generateEmotion(),
    text: generateText(),
    date: generateCommentDate()
  };
};
