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
    constructor (name) {

        this.name = name;
        this.health = 20;
        this.currentTier = 1;
        this.cardsInPlay = [];

    }
}

class Card {
    constructor (tier, rarity, power, health) {

        this.tier = tier;
        this.rarity = rarity;
        this.power = power;
        this.health = health;

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

        // determine who goes first and store - global

        func.startBuyRound(1); // for the first player

        func.makeCardElements(); // should probably be inside startBuyRound
        // I need to call startBuyRound with the current player's tier
        // maybe an "active player" toggle to tell the buy cards function where to put the cards from the store
        // attack listeners to card elements and callback this function





    },

    // generate a random background image
    generateBackground() {

        const randomIndex = this.randomNumberBetween(0, global.backgroundClasses.length);
        $('html').attr('class', global.backgroundClasses[randomIndex]);

    },

    // generate the starting card pool
    generatePool(tier) { // I need to pass tier so I can leave it open to other players classes

        // variables
        const totalCommons = 10;
        const totalUncommons = 5;
        const totalRares = 1;
        
        // make commons
        for (let i = 0; i < totalCommons; i++) {

            const rarity = 'common';

            // common power and health are equal to tier
            const power = tier;
            const health = tier;

            // make cards and push to pool
            // pass (tier, rarity, power, health)
            func.generateCard(tier, rarity, power, health) 

        }

        // make uncommons
        for (let i = 0; i < totalUncommons; i++) {

            const rarity = 'uncommon';

            // uncommons have either +1 power OR +1 health
            // 
            const power = tier + func.randomNumberBetween(0,2);
            const health = tier + (power > tier ? 0 : 1);

            func.generateCard(tier, rarity, power, health);

        }

        // make rares
        for (let i = 0; i < totalRares; i++) {

            const rarity = 'rare';

            // rares have +1 power AND +1 health
            const power = tier + 1;
            const health = tier + 1;

            func.generateCard(tier, rarity, power, health);

        }

    },

    // generate card object
    generateCard(tier, rarity, power, health) {
        global.cardsInPool.push(new Card(tier, rarity, power, health));
    },

    // hide the title, play button, and social links
    hideTitles() {

        $('.hero-text').toggleClass('hidden');
        $('.play-btn').toggleClass('hidden');
        $('.social-links').toggleClass('hidden');

    },

    // generate card DOM elements - need to finish designing cards
    makeCardElements(cardArray) {    

        for (card in cardArray) {

            const tierStars = '';

            for (let i = 0; i < card.tier; i++){

                tierStars += '<i class="fas fa-star">';

            }

            const cardElement = $('<div>').addClass('card').html(`
            
                <div class="card-container">
                    <div class="card-image-bg">
                        <img src="img/tier 1/Conscript.png" class="card-image-png ${card.rarity}" title="" alt="">
                    </div>
                    <div class="card-stat-container">
                        <div class="card-tier">
                            ${tierStars}
                        </div>
                        <div class="power-health">
                            <div class="card-power">${card.power}</div>
                            <div class="slash">/</div>
                            <div class="card-health">${card.health}</div>
                        </div>
                    </div>
                </div>
            
            `);

            // add listener
            cardElement.on('click', () => console.log(`you bought a card`))
            
            // append to the buy row
            $('.buy').append(cardElement);

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

    // start buy round // need to finish
    startBuyRound(tier) {

        $('.buy').toggleClass('hidden');

        // empty the current pool
        global.cardsInPool = [];

        // generate the new card pool - pass the player's current tier
        func.generatePool(tier);

        // shuffle the card pool
        func.shuffle(global.cardsInPool);

        // set the quantity of cards to appear in the shop
        const shopQty = tier + 2;

        // add the appropriate amount of cards to the shop
        for (let i = 0; i < shopQty; i++) {

            global.cardsInShop.push(global.cardsInPool.pop());

        }
        
        // make elements for each of the cards in the shop
        func.makeCardElements(global.cardsInShop);


        // make listeners too
        
        // 

        // make your creatures clickable so you can sell them if you want
        // later


        for (cards in global.cardsInPool) {

        }



    },

    // combat phase // need to finish
    startCombat() {
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

        playbutton: $('.play-btn').on('click', func.startGame),

    }

//////////////////////////
// App Logic
//////////////////////////


const player1 = new Player('Player 1');
const player2 = new Player('Player 2');