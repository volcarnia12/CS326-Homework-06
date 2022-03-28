"use strict"; // Don't touch me. This makes JS more safe.

// Here, we import the dictionary of scrabble words.
import { dictionary } from "./dictionary.js";

/**
 * This function checks whether a given word can be constructed with the
 * available tiles. The availableTiles object should not be modified.
 *
 * @param {Object<string, number>} availableTiles A collection of available
 * tiles and their frequency.
 * @param {string} word The word a player wants to construct.
 * @returns {boolean} true if the word can be constructed with the available
 * tiles, else false.
 */
function canConstructWord(availableTiles, word) {
  // Use your solution from Homework 1 or wait for solutions to be released.
    let wordBool = true;
    const tileHolder = copyAvailableTiles(availableTiles);
    for (let x = 0; x < word.length; ++x){
      	let wordHolder = word[x];
        if (tileHolder.hasOwnProperty(wordHolder) && tileHolder[wordHolder] != 0){
            tileHolder[wordHolder] = tileHolder[wordHolder] - 1;
            continue;
        }
        else if (tileHolder.hasOwnProperty('*') && tileHolder['*'] != 0){
            tileHolder['*'] = tileHolder['*'] - 1;
        }
        else{
            wordBool = false;
            break;
        }
    }
    return wordBool;
}

/**
 * We define the base score of a word the score obtained by adding each letter's
 * score, without taking board position into account. This function will compute
 * and return the base score of a given word.
 *
 * @param {string} word The word that will be used to compute the base score.
 * @returns {number} The base score for the given word.
 */
function baseScore(word) {
    // Use your solution from Homework 1 or wait for solutions to be released.
    let count = 0;
    for (let i = 0; i < word.length; ++i){
        if (word[i] === 'e' || word[i] === 'a' || word[i] === 'i' || word[i] === 'o' || word[i] === 'n' || 
            word[i] === 'r' || word[i] === 't' || word[i] === 'l' || word[i] === 's' || word[i] === 'u'){
                count = count + 1;
        } 
        else if (word[i] === 'd' || word[i] === 'g'){
            count = count + 2;
        }
        else if (word[i] === 'b' || word[i] === 'c' || word[i] === 'm' || word[i] === 'p'){
            count = count + 3;
        }
        else if (word[i] === 'f' || word[i] === 'h' || word[i] === 'v' || word[i] === 'w' || word[i] === 'y'){
            count = count + 4;
        }
        else if (word[i] === 'k'){
            count = count + 5;
        }
        else if (word[i] === 'j' || word[i] === 'x'){
            count = count + 8;
        }
        else if (word[i] === '*'){
            continue;
        }
        else if (word[i] === 'q' || word[i] === 'z'){
            count = count + 10;
        }
    }
    return count;
}

/**
 * Finds and returns every word from the dictionary that can be constructed with
 * the given tiles.
 *
 * @param {Object<string, number>} availableTiles A collection of available
 * tiles and their frequency.
 * @returns {Array<string>} All words that can be constructed with the given
 * tiles. The array is empty if there are no words available to construct.
 */
function possibleWords(availableTiles) {
  // TODO
  const wordArray = [];
  const tileHolder = copyAvailableTiles(availableTiles);
  for (let y = 0; y < dictionary.length; ++y){
    if (canConstructWord(tileHolder, dictionary[y])){
      wordArray.push(dictionary[y]);
    }
  }
  return wordArray;
}

//console.log(canConstructWord({c: 1, a: 1, '*': 1}, "cat"));
//console.log(possibleWords({'c': 1, '*': 1, 't': 1}));

/**
 * Finds and returns the word(s) with the highest base score from the
 * dictionary, given a set of available tiles.
 *
 * @param {Object<string, number>} availableTiles A collection of available
 * tiles and their frequency.
 * @returns {Array<string>} The word (or words if there are ties) with the
 * highest base score that can be constructed with the given tiles. The array is
 * empty if there are no words available to construct.
 */

function makeWord(availableTiles){
  let tileHolder = copyAvailableTiles(availableTiles);
  const words = possibleWords(tileHolder);
  const wordArr = [];
  for (let x = 0; x < words.length; ++x){
    let str = '';
    tileHolder = copyAvailableTiles(availableTiles);
    for (let y = 0; y < words[x].length; ++y){
      let wordHolder = words[x][y];
      if (tileHolder.hasOwnProperty(wordHolder) && tileHolder[wordHolder] != 0){
          str = str + wordHolder;
          tileHolder[wordHolder] = tileHolder[wordHolder] - 1;

      }
      else if (tileHolder.hasOwnProperty('*') && tileHolder['*'] != 0){
          str = str + '*';
          tileHolder['*'] = tileHolder['*'] - 1;
      }
    }
    wordArr.push([str, words[x]]);
  }
  return wordArr;

}

function bestPossibleWords(availableTiles) {
  // TODO
  const tileHolder = copyAvailableTiles(availableTiles);
  const bestWords = [];
  let words = makeWord(tileHolder);
  let highestScore = 0;
  for (let x = 0; x < words.length; ++x){
    if (baseScore(words[x][0]) > highestScore){
      highestScore = baseScore(words[x][0]);
    }
  }
  for (let x = 0; x < words.length; ++x){
    if (baseScore(words[x][0]) === highestScore){
      bestWords.push(words[x][1]);
    }
  }
  return bestWords;
}

function isValid(word){
  let valid = false;
  //let wordCap = word.toUpperCase();
  // check if there is a word where word's letter position matches with dict word
  for (let y = 0; y < dictionary.length; ++y){
    let index = 0;
    let count = word.length;
    //if (dictionary[y][index] === word[index] || word[index] === '*'){
    while (index < word.length){
      //let cap1 = dictionary[y].toUpperCase();
      if (dictionary[y][index] === word[index] || word[index] === '*'){
        index++;
        count--
      }
      else{
        break;
      }
    }
    //console.log(index);
    if (index === (dictionary[y].length) && count === 0){
      console.log(index);
      valid = true;
      break;
    }
    //}
  }

  return valid;
}
console.log(isValid("*"));

function copyAvailableTiles(availableTiles){
  return Object.assign({}, availableTiles);
}
//console.log(bestPossibleWords({'*': 2}));
//console.log(possibleWords({c: 1, a: 1, t: 1}));
//console.log(bestPossibleWords({c: 1, a: 1, t: 1}));



// This exports our public functions.
export { canConstructWord, baseScore, possibleWords, bestPossibleWords, makeWord, isValid, copyAvailableTiles };
