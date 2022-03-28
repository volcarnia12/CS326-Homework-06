//import { shuffle } from "./shuffle.js";
//import { baseScore } from "../326-homework-02-scrabble-utilities-volcarnia12/scrabbleUtils.js";
import { canConstructWord, baseScore, possibleWords, bestPossibleWords, makeWord, isValid } from "./scrabbleUtils.js"

// ES6 modules are [actually strict by default](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#Strict_mode_for_modules)
// Therefore, you can in fact comment this out or remove it.
// 'use strict';

function shuffle(array) {
    let m = array.length;
  
    // While there remain elements to shuffle...
    while (m) {
      // Pick a remaining element...
      const i = Math.floor(Math.random() * m--);
  
      // And swap it with the current element.
      const t = array[m];
      array[m] = array[i];
      array[i] = t;
    }
    return array;
}

export class Game {
  // Include your solution code from HW3 in this class.
  // You can use the solution when released

  constructor() {
    // Initialize the bag.
    const frequencies = {
        '*': 2, 'a': 9, 'b': 2, 'c': 2, 'd': 4, 'e': 12, 'f': 2, 'g': 3, 'h': 2, 'i': 9, 'j': 1, 'k': 1, 'l': 4, 'm': 2,
        'n': 6, 'o': 8, 'p': 2, 'q': 1, 'r': 6, 's': 4, 't': 6, 'u': 4, 'v': 2, 'w': 2, 'x': 1, 'y': 2, 'z': 1
    };

    this.bag = [];
    for (let letter in frequencies) {
        for (let i = 0; i < frequencies[letter]; ++i) {
            this.bag.push(letter);
        }
    }

    this.bag = shuffle(this.bag);

    // Initialize the grid.
    this.grid = [];
    for (let i = 1; i <= 15; ++i) {
        this.grid[i] = [];
        for (let j = 1; j <= 15; ++j) {
            this.grid[i][j] = null;
        }
    }
}

/**
 * This function removes the first n tiles from the bag and returns them.
 * If n is greater than the number of remaining tiles, this removes and returns all the tiles from the bag.
 * If the bag is empty, this returns an empty array.
 * @param {number} n The number of tiles to take from the bag.
 * @returns {Array<string>} The first n tiles removed from the bag.
 */
takeFromBag(n) {
    if (n >= this.bag.length) {
        const drawn = this.bag;
        this.bag = [];
        return drawn;
    }
    
    const drawn = [];
    for (let i = 0; i < n; ++i) {
        drawn.push(this.bag.pop());
    }
    return drawn;
}
/**
 * This function returns the current state of the board.
 * The positions where there are no tiles can be anything (undefined, null, ...).
 * @returns {Array<Array<string>>} A 2-dimensional array representing the current grid.
 */
getGrid() {
    return this.grid;
}

/**
 * This function will be called when a player takes a turn and attempts to place a word on the board.
 * It will check whether the word can be placed at the given position. If not, it'll return -1.
 * It will then compute the score that the word will receive and return it, taking into account special positions.
 * @param {string} word The word to be placed.
 * @param {Object<x|y, number>} position The position, an object with properties x and y. Example: { x: 2, y: 3 }.
 * @param {boolean} direction Set to true if horizontal, false if vertical. 
 * @returns {number} The score the word will obtain (including special tiles), or -1 if the word cannot be placed.
 */
playAt(word, position, direction) {
    word = word.toUpperCase();
    // The double letter score positions
    const LSx2 = [
      {x: 7, y: 7}, {x: 9, y: 7}, {x: 7, y: 9}, {x: 9, y: 9},
      {x: 8, y: 4}, {x: 7, y: 3}, {x: 9, y: 3}, {x: 4, y: 1}, {x: 12, y: 1},
      {x: 8, y: 12}, {x: 7, y: 13}, {x: 9, y: 13}, {x: 4, y: 15}, {x: 12, y: 15},
      {x: 4, y: 8}, {x: 3, y: 7}, {x: 3, y: 9}, {x: 1, y: 4}, {x: 1, y: 12},
      {x: 12, y: 8}, {x: 13, y: 7}, {x: 13, y: 9}, {x: 15, y: 4}, {x: 15, y: 12}
  ];

  // The triple letter score positions
  const LSx3 = [
      {x: 6, y: 2}, {x: 10, y: 2},
      {x: 2, y: 6}, {x: 6, y: 6}, {x: 10, y: 6}, {x: 14, y: 6},
      {x: 2, y: 10}, {x: 6, y: 10}, {x: 10, y: 10}, {x: 14, y: 10},
      {x: 6, y: 14}, {x: 10, y: 14},
  ];

  // The double word score positions
  const WSx2 = [
      {x: 8, y: 8},
      {x: 2, y: 2}, {x: 3, y: 3}, {x: 4, y: 4}, {x: 5, y: 5},
      {x: 11, y: 11}, {x: 12, y: 12}, {x: 13, y: 13}, {x: 14, y: 14},
      {x: 2, y: 14}, {x: 3, y: 13}, {x: 4, y: 12}, {x: 5, y: 11},
      {x: 11, y: 5}, {x: 12, y: 4}, {x: 13, y: 3}, {x: 14, y: 2},
  ];

  // The triple word score positions
  const WSx3 = [
      {x: 1, y: 1}, {x: 8, y: 1}, {x: 15, y: 1},
      {x: 1, y: 8}, {x: 15, y: 8},
      {x: 1, y: 15}, {x: 8, y: 15}, {x: 15, y: 15}
  ];

  // Some preprocessing: Since JS cannot easily compare objects, we will transform the premium tile coordinates
  // to numbers. For a pair of coordinates x, y, we set c = x * 100 + 1. We pick 100 because x and y are less than
  // or equal to 15 (2-digit). This preprocessing allows us to use the builtin `Array.includes` later on.
  // Example: (x, y) = (3, 14) --> processed = 3 * 100 + 14 = 314.
  // An alternative to this is to create another helper function, that would take a coordinate and an array and
  // return whether the coordinate is in the array.
  const LSx2p = LSx2.map(coordinate => coordinate.x * 100 + coordinate.y);
  const LSx3p = LSx3.map(coordinate => coordinate.x * 100 + coordinate.y);
  const WSx2p = WSx2.map(coordinate => coordinate.x * 100 + coordinate.y);
  const WSx3p = WSx3.map(coordinate => coordinate.x * 100 + coordinate.y);

  // We first check if the word can be placed
  for (let i = 0; i < word.length; ++i) {
      const tile = direction ? (this.grid[position.x + i] || [])[position.y] : this.grid[position.x][position.y + i];
      //const tile = !direction ? this.grid[position.x + i][position.y] : (this.grid[position.x] || [])[position.y + i];
      if (tile !== null && tile !== word[i]) {
          return -1;
      }
  }

  // We now place the word and compute its score at the same time.
  let score = 0;
  let multiplier = 1; // The word score multiplier
  
  for (let i = 0; i < word.length; ++i) {
      const coordinate = {
          x: direction ? (position.x + i) : position.x,
          y: direction ? position.y : (position.y + i),
      };

      this.grid[coordinate.x][coordinate.y] = word.charAt(i);
      
      // Following the preprocessing steps outlined above. This allows to use `Array.includes`.
      const processed = coordinate.x * 100 + coordinate.y;

      if (LSx2p.includes(processed)) {
          score += baseScore(word.charAt(i)) * 2;
      } else if (LSx3p.includes(processed)) {
          score += baseScore(word.charAt(i)) * 3;
      } else {
          if (WSx2p.includes(processed)) {
              multiplier *= 2;
          } else if (WSx3p.includes(processed)) {
              multiplier *= 3;
          }

          score += baseScore(word.charAt(i));
      }
  }

  return score * multiplier;
}

  /**
   * This method will take an HTMLElement, which will either be empty or
   * contain the current grid, and render the board in that element. For
   * example, if we have a `<div id="board"></div>`, this should be called
   * `game.render(document.getElementById('board'))`.
   * @param {HTMLElement} element an HTMLElement to render the board into.
   */
  render(element) {
    // TODO: You need to add your solution code here.
    //this.grid = element;
    // loop through div elements appended to Board here
    // keep an eye on y-values --> might not translate 2D array of grid over to Board
    const prevNodes = element.getElementsByTagName('div');
    let count = 0;
    const storage = window.localStorage;
    //console.log(this.grid);
    //console.log(this.grid[1][1]);
    for (let x = 1; x <= 15; ++x){
        for(let y = 1; y <= 15; ++y){
            const grid = this.getGrid();
            if (grid[y][x] === null || prevNodes[count].hasChildNodes()){
                count++;
                continue;
            }
            const node = document.createTextNode(grid[y][x]);
            prevNodes[count].style.fontSize = '175%';
            prevNodes[count].appendChild(node);
            //storage.setItem(count.toString(), JSON.stringify(node.textContent));
            //let b = JSON.parse(storage.getItem(count.toString()));
            //console.log(b);
            count++;
        }
    }
  }
}
