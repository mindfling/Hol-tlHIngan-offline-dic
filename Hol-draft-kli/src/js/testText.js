"use strict";

import getData from "./getData.js";

// import dic from "./words-en.js"; // получаем список слов

export const text = (strElem = "") => {

  const resElem = document.querySelector(strElem);
  console.log("elem: ", resElem);

  if (resElem) {

    // await
    getData()
      .then(data => {

        data.map(item => {
          console.log(item);
          resElem.insertAdjacentHTML('beforeend', `<p className="word">${item.word} =&gt; ${item.name}</p>`);
        });
      })
  }
};


/*
export const text = (strElem = "") => {
  console.log("test", dic);

  const elem = document.querySelector(strElem);
  console.log("elem: ", elem);

  if (elem) {
    elem.textContent = JSON.stringify(dic);
  }
};
*/
