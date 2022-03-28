'use strict';

export class Rack {
    constructor() {
        this.available = {};
    }

    /**
     * Returns an object of available tiles mapped to their amount.
     * @returns {Object<string, number>} An object describing the tiles available in this rack.
     */
    getAvailableTiles() {
        return this.available;
    }

    /**
     * This function will draw n tiles from the game's bag.
     * If there are not enough tiles in the bag, this should take all the remaining ones.
     * @param {number} n The number of tiles to take from the bag.
     * @param {Game} game The game whose bag to take the tiles from.
     */
    takeFromBag(n, game) {
        for (let tile of game.takeFromBag(n)) {
            if (tile in this.available) {
                ++this.available[tile];
            } else {
                this.available[tile] = 1;
            }
        }
    }

    renderRack(element, game){
        //let holder = Object.assign({}, this.available);
        const prevNodes = element.getElementsByTagName('div');
        let count = 0;
        
        let holder2 = Object.assign({}, this.available);
        for (const tile in holder2){
            while (holder2[tile] > 0){
                const node = document.createTextNode(tile.toUpperCase());
                prevNodes[count].style.fontSize = '175%';
                prevNodes[count].appendChild(node);
                holder2[tile]--;
                count++;
            }
        }
        console.log(count);
    }

    remover(element, game, word){
        console.log(this.available);
        
        for (let x = 0; x < word.length; ++x){
            let letter = word[x];
            if (this.available[letter] > 1){
                this.available[letter] = this.available[letter] - 1;
            }
            else{
                delete this.available[letter];
            }
        }
        console.log(this.available);
        this.takeFromBag(word.length, game);

        this.renderRack(element, game);
    }
};