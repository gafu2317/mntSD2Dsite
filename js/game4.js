"use strict";
const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let secretNum = [];
let level;
let count = 0;

const modal = document.getElementById("modal");
modal.addEventListener("click", start);
const numDisplay = document.getElementById("numDisplay");
const nums = document.querySelectorAll(".num");
const choiceNum = document.querySelectorAll(".choiceNum");
choiceNum.forEach((value) => {
  value.addEventListener("click", selectNumber);
});
const btn = document.getElementById("btn");
btn.addEventListener("click", show);
const clearBtn = document.getElementById("clearBtn");
clearBtn.addEventListener("click", clear);
const table = document.querySelector("table");
const end = document.getElementById("end");

// スタート画面で桁数が選択された時の処理
function start(e) {
  if (e.target.className === "select") {
    level = Number(e.target.textContent);
    secretNum = makeNumber(array);
    modal.classList.add("hide");
  }
}

// 問題作成
function makeNumber(array) {
  // Fisher–Yates shuffleアルゴリズムでシャッフル
  let a = array.length;
  while (a) {
    let j = Math.floor(Math.random() * a);
    let t = array[--a];
    array[a] = array[j];
    array[j] = t;
  }
  return array.slice(0, level);
}

// 答え合わせ
function is_same(answer, secretNum) {
  let hitBlow = {
    hit: 0,
    blow: 0,
  };
  secretNum.forEach((value, index) => {
    if (secretNum.indexOf(answer[index]) !== -1) {
      if (answer[index] === value) {
        hitBlow.hit++;
      } else {
        hitBlow.blow++;
      }
    }
  });
  return hitBlow;
}

// 数字が押された時の処理
function selectNumber(e) {
  if (numDisplay.textContent.length === level - 1) {
    choiceNum.forEach((value) => {
      value.classList.add("disable");
      btn.style.pointerEvents = "auto";
      return;
    });
  }
  if (numDisplay.textContent.length < level) {
    numDisplay.textContent = numDisplay.textContent.concat(
      e.target.textContent
    );
    e.target.classList.add("disable");
  }
}

// 履歴表示
function show() {
  let answer = numDisplay.textContent.split("").map(Number);
  if (answer.length === level) {
    count++;
    let result = is_same(answer, secretNum);
    choiceNum.forEach((value) => {
      value.classList.remove("disable");
    });
    btn.style.pointerEvents = "none";

    table.rows[count].cells[0].textContent = `${numDisplay.textContent}`;
    table.rows[count].cells[1].textContent = `${result.hit}`;
    table.rows[count].cells[2].textContent = `${result.blow}`;
    numDisplay.textContent = `Hit:${result.hit} Blow:${result.blow}`;
    numDisplay.textContent = "";
    endGame(result.hit);
  }
}

// クリアボタンが押された時の処理
function clear() {
  numDisplay.textContent = "";
  choiceNum.forEach((value) => {
    value.classList.remove("disable");
  });
}

// ゲーム終了判定
function endGame(hit) {
  if (hit === level) {
    end.children[0].textContent = "Clear!!";
    showEnd();
  } else if (count === 10) {
    end.children[0].textContent = "Game Over..";
    showEnd();
  }
}

// ゲーム終了画面表示
function showEnd() {
  end.classList.remove("hide");
  end.animate({ opacity: [0, 0.7] }, { duration: 1500 });
  end.children[1].textContent = secretNum.join("");
  end.children[2].textContent = "Click Reset";
}