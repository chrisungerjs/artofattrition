//////////////////////////
// Global Variables
//////////////////////////

const global = {

    activePlayer: '',
    cardsInShop: [],
    cardsInPool: [],
    backgroundClasses: [
        'castle',
        'falls',
        'guincho',
        'orc-fortress',
        'realm',
        // 'troll-city',
    ],

}

//////////////////////////
// Classes
//////////////////////////

class Player {
    constructor (name) {

        this.name = name;
        this.health = 20;
        this.cardsInPlay = [];
        this.coins = 3;
        this.currentTier = 1;
        this.tierUpgradeCost = 4;

    }
}

class Card {
    constructor (tier, rarity, power, health) {

        this.tier = tier;
        this.rarity = rarity;
        this.power = power;
        this.health = health;
        this.toRemove = false;

    }
}

//////////////////////////
// Global Functions
//////////////////////////

const func = {

    //////////////////////////
    // Start Game Functions
    //////////////////////////
    
    // press start to begin
    startGame() {
        
        // ui functions
        func.generateBackground();
        func.hideTitles();

        // set active player to player1 for the time being
        global.activePlayer = player1;

        // ui functions
        $('.buy').toggleClass('hidden');
        $('.current-tier').toggleClass('hidden');
        $('.refresh-tier').toggleClass('hidden');
        $('.coins').toggleClass('hidden');

        // start buy round
        func.startBuyRound(global.activePlayer.currentTier);
        
    },
    
    // generate the card pool
    generatePool(tier) { 

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

    // generate card objects
    generateCard(tier, rarity, power, health) {

        global.cardsInPool.push(new Card(tier, rarity, power, health));
    
    },

    // generate card DOM elements
    makeCardElements(cardArray) {    

        // initialize counter for index IDs
        let indexId = 0;

        for (card in cardArray) {

            const rarity = cardArray[card].rarity;
            const tier = cardArray[card].tier;

            // add a utf star for each tier
            let tierStars = '';

            if (global.activePlayer.currentTier <= 3) { 
                for (let i = 0; i < tier; i++){

                    tierStars += '&#11088;';
                }
            } 
            else if (global.activePlayer.currentTier <= 6) {
                for (let i = 0; i < tier - 3; i++) {
                    
                    tierStars += '&#128081;';
                }
            } else {
                
                tierStars += tier;
            }
           
            // add card elements to the dom
            const cardElement = $('<div>').addClass('card-container').attr('id', indexId).html(`

                <div class="card-image tier-${tier}-${rarity}">
                <div class="card-stat-container ${rarity}">
                    <div class="card-stat-row">
                        <div class="card-tier">
                        ${tierStars}
                        </div>
                        <div class="power-health">
                            <div class="card-power">${cardArray[card].power}</div>
                            <div class="slash">/</div>
                            <div class="card-health">${cardArray[card].health}</div>
                        </div>
                    </div>
                </div>
                </div>

            `);

            // add event listener <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Can I just put this in my global handler and if so how?
            cardElement.on('click', (event) => func.buyCard(event));
            
            // append to the buy row
            $('.buy').append(cardElement);

            // increment counter
            indexId++;
        }
    },

    //////////////////////////
    // Shop Functions
    //////////////////////////
    
    // start buy round
    startBuyRound(tier) {

        // empty the current pool 
        global.cardsInPool = [];

        // generate the new card pool - pass the activeplayer's current tier
        func.generatePool(tier);

        // shuffle the card pool
        func.shuffle(global.cardsInPool);

        // set the quantity of cards to appear in the shop - limit 5
        const shopQty = tier + 2 <= 5 ? tier + 2 : 5;

        // add the appropriate amount of cards to the shop
        for (let i = 0; i < shopQty; i++) {

            global.cardsInShop.push(global.cardsInPool.pop());
        }
        
        // make elements for each of the cards in the shop
        func.makeCardElements(global.cardsInShop);

    },

    // buy a card from the shop
    buyCard(event) {

        // check if the player has too many cards - limit 7
        if (global.activePlayer.cardsInPlay.length >= 7) {
            return alert('You have too many minions. Sell one');
        }

        // decrement player money
        global.activePlayer.coins -= 3;
        func.updateCoins();

        // check if player can buy more items
        if (global.activePlayer.coins < 3 || global.activePlayer.coins < tierUpgradeCost) {

            // modal alert
            // COMBAT 
        }

        // identify the id to find the corresponding object index
        const boughtCardId = event.currentTarget.id;
        const boughtCard = global.cardsInShop[boughtCardId];

        // push the bought card to the player row
        global.activePlayer.cardsInPlay.push(boughtCard);

        // move the card element from the buy row into the player row 
        const cardElement = $(event.currentTarget).remove();
        cardElement.attr('id', global.activePlayer.cardsInPlay.length - 1)
        cardElement.on('click', func.sellCard);
        cardElement.addClass('in-player-row').appendTo($('.player-1'));

    },

    // sell a card to the shop
    sellCard(event) {

        // increment player coins
        global.activePlayer.coins += 1;
        func.updateCoins();

        // identify the current id to get the object index
        const soldCardId = event.currentTarget.id;
        const soldCard = global.activePlayer.cardsInPlay[soldCardId];
        
        // remove the element from the dom
        $(event.currentTarget).remove();
        
        // remove the card from the player array
        soldCard.toRemove = true;
        global.activePlayer.cardsInPlay = global.activePlayer.cardsInPlay.filter((value) => value.toRemove === false);
        // console.log(global.activePlayer.cardsInPlay);

        // reset ids 
        const $elementList = $('.card-container.in-player-row');
        let i = 0;
        $elementList.each((value) => {

            $elementList[value].id = value;
        })

    },

    // refresh the shop
    refreshShop(event) {

        global.cardsInShop = [];
        $('.buy .card-container').remove();
        func.startBuyRound(global.activePlayer.currentTier);

    },

    // upgrade tier
    upgradeTier() {

        // check if player has enough money to upgrade
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<uncomment
        // if (global.activePlayer.coins < global.activePlayer.tierUpgradeCost) {
        //     return (console.log('not enough coins'));
        // }

        // decrement players coins
        global.activePlayer.coins -= global.activePlayer.tierUpgradeCost;
        func.updateCoins();

        // increment tier and upgrade cost
        global.activePlayer.currentTier++;
        global.activePlayer.tierUpgradeCost++;

        // update dom
       $('.tier-title').text(`Tier ${global.activePlayer.currentTier}`);
       $('.tier-cost').text(global.activePlayer.tierUpgradeCost);

    },

    updateCoins() {
        $('.coin-total').text(global.activePlayer.coins);
    },

    //////////////////////////
    // Combat Functions
    //////////////////////////

    // start combat phase // need to finish
    startCombat() {

    },

    //////////////////////////
    // Utilities
    //////////////////////////
    
    // generate a random background image
    generateBackground() {
    
        const randomIndex = this.randomNumberBetween(0, global.backgroundClasses.length);
        $('html').attr('class', global.backgroundClasses[randomIndex]);
        
    },

    // make a random number from a range
    randomNumberBetween(min, max) {
    
        // max is *not* inclusive - low is inclusive
        return Math.floor(Math.random() * (max - min) + min);
    
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

    // hide the title, play button, and social links
    hideTitles() {

        $('.hero-text').toggleClass('hidden');
        $('.play-btn').toggleClass('hidden');
        $('.social-links').toggleClass('hidden');

    },

}
//////////////////////////
// Event Handlers
//////////////////////////

    const handle = {

        playButton: $('.play-btn').on('click', func.startGame),
        tierUpgrade: $('.current-tier').on('click', func.upgradeTier),
        refreshButton: $('.refresh-tier').on('click', func.refreshShop),
    }

//////////////////////////
// App Logic
//////////////////////////

const player1 = new Player('Player 1');