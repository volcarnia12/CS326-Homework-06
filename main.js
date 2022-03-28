import { Game } from "./game.js";
import { canConstructWord, baseScore, possibleWords, bestPossibleWords, makeWord, isValid, copyAvailableTiles } from "./scrabbleUtils.js"
import { Rack } from "./rack.js";
import { dictionary } from "./dictionary.js";

// ES6 modules are [actually strict by default](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#Strict_mode_for_modules)
// Therefore, you can in fact comment this out or remove it.
// 'use strict';

// TODO
const board = document.getElementById("Board");
const play = document.getElementById("play");
const word = document.getElementById("word");
const xCord = document.getElementById("x");
const yCord = document.getElementById("y");
const position = document.getElementById("position");
const rack = document.getElementById("rack");
const help = document.getElementById("help");
const hint = document.getElementById("hint");
let game = new Game();
let racker = new Rack();
//document.body.onload = makeBoard(225);

function makeBoard(total){
    let count = 0;
    for(let x = 0; x < total; ++x){
        let row = document.createElement("div");
        if (x === 0 || x === 7 || x === 14 || x === 105 || x === 210 || x === 217 || x === 224 || x === 119){
            row.id = "red";
        }
        else if (x === 3 || x === 11 || x === 36 || x === 38 || x === 45 || x === 52 || x === 59 || x === 92 || 
            x === 96 || x === 98 || x === 102 || x === 108 || x === 116 || x === 122 ||
            x === 126 || x === 128 || x === 132 || x === 165 || x === 172 || x === 179 || x === 186 || x === 188 ||
            x === 213 || x === 221){ //teal
            row.id = "teal";
            // 109 117 123 127 129 133 166 173 180 187 189 214 222
        }
        else if (x === 16 || x === 28 || x === 32 || x === 42 || x === 48 || x === 56 || x === 64 || x === 70 || 
            x === 112 || x === 154 || x === 160 || x === 168 || x === 176 || x === 182 || x === 192 ||
            x === 196 || x === 208){ //pink
            row.id = "pink";
            // 113 155 161 169 177 183 193 197 209
        }
        else if (x === 20 || x === 24 || x === 76 || x === 80 || x === 84 || x === 88 || x === 136 || x === 140 || 
            x === 144 || x === 148 || x === 200 || x === 204){ // blue
            row.id = "blue";
            // 137 141 145 149 201 205
        }
        else{
            row.id = "white";
        }
        
        board.appendChild(row); // Careful -> might need to adjust board for different colors
    }

}
makeBoard(225);

function letterRack(){
    for (let x = 0; x < 7; ++x){
        let row = document.createElement("div");
        row.id = "rack-inner";
        rack.appendChild(row);
    }
    racker.takeFromBag(7, game);
    racker.renderRack(rack, game);
}

function newRack(){
    while (rack.firstChild) {
        rack.removeChild(rack.firstChild);
    }
    for (let x = 0; x < 7; ++x){
        let row = document.createElement("div");
        row.id = "rack-inner";
        rack.appendChild(row);
    }
    //racker.remover(rack, game, word.value);
    //let newRack = new Rack();
}

letterRack();

function saveState() {
    const storage = window.localStorage;
    storage.setItem('grid', JSON.stringify(game.getGrid()));
    //console.log('hi');
}
  
function restoreState() {
    const storage = window.localStorage;
    const arr = JSON.parse(storage.getItem('grid'));
    //console.log(storage.getItem('grid'));
    game.grid = arr;
    game.render(board);
}

play.addEventListener("click", function(event){
    //const storage = window.localStorage;
    if ((word.value) === '' || xCord.value === '' || yCord.value === ''){
        alert("Missing Parameters");
        return;
    };
    const cords = {
        x: parseInt(xCord.value),
        y: parseInt(yCord.value)
    };
    let direction;
    if (position.value === "horizontal"){
        direction = true;
    }
    else if (position.value === "vertical"){
        direction = false;
    }
    console.log(isValid(word.value));
    console.log(canConstructWord(racker.getAvailableTiles(), word.value));
    //console.log(racker.available);
    if (isValid(word.value.toLowerCase()) && canConstructWord(racker.getAvailableTiles(), word.value.toLowerCase()) && game.playAt(word.value, cords, direction) != -1){
        saveState();
        game.render(board);
        newRack();
        racker.remover(rack, game, word.value);
        console.log(racker.getAvailableTiles());
        //storage.setItem('board', board);
        //saveState();
    }
    else{
        alert("Word Cannot Be Played");
        return;
    }
});

//play.addEventListener("click", saveState);

if (localStorage.getItem("grid") !== null){
    restoreState();
    //console.log("hi");
}


const button = document.getElementById('clear-state');
button.addEventListener('click', clearState);

function clearState() {
    const storage = window.localStorage;
    storage.removeItem('board');
    while (board.firstChild) {
        board.removeChild(board.firstChild);
    }
    localStorage.clear();
    let newGame = new Game();
    game.grid = newGame.getGrid();
    makeBoard(225);
}

let clicks = 0;
help.addEventListener("click", function(event){
    while (hint.firstChild) {
        hint.removeChild(hint.firstChild);
    }
    let words = bestPossibleWords(racker.getAvailableTiles());
    console.log(words);
    let position = clicks % (words.length);
    const node = document.createTextNode("Hint: " + words[position]);
    hint.appendChild(node);
    clicks++;
});



  // Tests
  /*console.assert(isValid("hello") === true);
  console.assert(isValid("h*y") === true);
  console.assert(isValid("fhfks*") === false);
  console.assert(isValid("fh*ks*") === false);
  console.assert(isValid("*h*kx*") === false);
  console.assert(isValid("*****") === true);
  console.assert(isValid("**") === true);
  console.assert(isValid("d*n*") === true);
  console.assert(isValid("*f") === true);
  console.assert(isValid("f**d") === true);
  console.assert(isValid("reallybigword") === false);
  console.assert(isValid("") === false);

  console.assert(isValid("zz*") === false);
console.assert(isValid("f*zz*") === true);
console.assert(isValid("*izzy") === true);
console.assert(isValid("*") === false);
console.assert(isValid("***") === true);
console.assert(isValid("b**") === true);
console.assert(isValid("aa") === true);
console.assert(isValid("aaliis") === true);
console.assert(isValid("a*liis") === true);
console.assert(isValid("aa*ii*") === true);
console.assert(isValid("aaliiis") === false);
console.assert(isValid("aa*iiz") === false);
console.assert(isValid("sermon") === true);
console.assert(isValid("se*mon") === true);
console.assert(isValid("sermonn") === false);*/