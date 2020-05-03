//////////////////////////
// Global Variables
//////////////////////////

const global = {
    cardsInShop: [],
    cardsInPool: [],
    backgroundClasses: [
        'castle',
        'falls',
        'guincho',
        'orc-fortress',
        'realm',
        'troll-city',
    ],
}

//////////////////////////
// Classes
//////////////////////////

class Player {
    constructor () {
        this.name = 0;
        this.health = 20;
        this.currentTier = 1;
        this.cardsInPlay = [];
    }
}

class Card {
    constructor (name, power, health, img) {
        this.name = name;
        this.power = power;
        this.health = health;
        this.img = img;
    }
}

//////////////////////////
// Global Functions
//////////////////////////

const func = {
    // press start to begin
    startGame() {
        func.generateBackground();
        func.hideTitles();
        func.generatePool(); 
        func.shuffle(global.cardsInPool);
        func.makeCardElements(); // for both players
    },
    // generate a random background image
    generateBackground() {
        const randomIndex = this.randomNumberBetween(0, global.backgroundClasses.length);
        $('html').attr('class', global.backgroundClasses[randomIndex]);
    },
    // generate the starting card pool - need inputs for this
    generatePool() {

    },
    // hide the title and play button - might need to make this modular
    hideTitles() {
        $('.hero-text').toggleClass('hidden');
        $('.play-btn').toggleClass('hidden');
    },
    // generate card DOM elements - need to finish
    makeCardElements(cardArray) {    
        for (card in cardArray) {
            $('<div>').addClass('card');
            // need to wireframe/design the dom cards
        }
    },
    // shuffle cards
    shuffle(arr) {
        // Random Number Function
        const randomNumber = (arrLen) => Math.floor(Math.random() * arrLen);
        // grab the index of the last array element
        let lastIndex = arr.length - 1;
        // initialize a temporary variable to hold the numbers as we swap
        let temp = 0;
        // loop through the array backwards from the end, ignoring index 0
        for (let i = lastIndex; i > 0; i--) {
            // temporarily store the current index's value
            temp = arr[i];
            // find a random index between the current index and index 1
            randomIndex = randomNumber(i)
            // set the current index's value to the value of the random index
            arr[i] = arr[randomIndex];
            // set that random index's value to the current index's value, which we stored in temp
            arr[randomIndex] = temp;
        }
    },
    // start buy round
    buyRound(qty) {
        // shuffle the card pool
        func.shuffle(global.cardsInPool);
        // add the appropriate amount of cards to the shop
        for (let i = 0; i < qty; i++) {
            global.cardsInShop.push(global.cardsInPool.pop());
        }
        // loop that makes dom elements for the cards
        // make listeners too


        // make your creatures clickable so you can sell them if you want
        // 
    },
    // combat phase
    combat() {
    },
    // make a random number from a range
    randomNumberBetween(min, max) {
        // max is *not* inclusive - low is inclusive
        return Math.floor(Math.random() * (max - min) + min);
    },
}
//////////////////////////
// Event Handlers
//////////////////////////

const handle = {
    playbutton: $('.play-btn').on('click', func.startGame)
}

//////////////////////////
// App Logic
//////////////////////////


