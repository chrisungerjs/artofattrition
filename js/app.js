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
        'flying-fortress',
        'ancient-tree',
    ],
    enemyPool: [],
    enemyCards: [],
    currentEnemyTier: 1,

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

        // set active player to player1 for the time being
        global.activePlayer = player1;
        
        // ui functions
        func.generateBackground();
        func.toggleTitles();
        func.toggleShop();
        func.toggleCards();
        func.updateCoins();
        func.updateTier();

        // start buy round
        func.startBuyRound(global.activePlayer.currentTier);

        // make enemy cards
        func.generateEnemies();
        
    },
    
    // generate the card pool
    generatePool(tier) { 

        // variables
        const totalCommons = 10;
        const totalUncommonAs = 4;
        const totalUncommonBs = 4;
        const totalRares = 2;
        
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

        // make uncommon As - +1/+0
        for (let i = 0; i < totalUncommonAs; i++) {

            const rarity = 'uncommon-a';

            // uncommons have either +1 power OR +1 health
            // 
            const power = tier + 1;
            const health = tier;

            func.generateCard(tier, rarity, power, health);

        }

        // make uncommon Bs - +0/+1
        for (let i = 0; i < totalUncommonBs; i++) {

            const rarity = 'uncommon-b';

            const power = tier;
            const health = tier + 1;

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
    makeshopCards(cardArray) {    

        // initialize counter for index IDs
        let indexId = 0;

        for (card in cardArray) {

            const rarity = cardArray[card].rarity;
            const tier = cardArray[card].tier;
            const power = cardArray[card].power;
            const health = cardArray[card].health; 

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
           
            // make dom elements
            const cardElement = func.makeCard(indexId, tier, power, health, rarity, tierStars);

            // add event listener 
            cardElement.on('click', (event) => func.buyCard(event));
            
            // append to the buy row
            $('.buy').append(cardElement);

            // increment counter
            indexId++;
        }
    },

    // make a card element
    makeCard(id, tier, power, health, rarity = 'common', tierStars = '') {
        
        return $('<div>').addClass('card-container').attr('id', id).html(`

        <div class="card-image tier-${tier}-${rarity}">
        <div class="card-stat-container ${rarity}">
            <div class="card-stat-row">
                <div class="card-tier">
                ${tierStars}
                </div>
                <div class="power-health">
                    <div class="card-power">${power}</div>
                    <div class="slash">/</div>
                    <div class="card-health" id="health-${id}">${health}</div>
                </div>
            </div>
        </div>
        </div>

    `)},

    reset() {

        player1 = {};
        player1 = new Player('Player 1');
        const player = global.activePlayer;

        // reset global variables
        global.cardsInShop = [];
        global.cardsInPool = [];
        player.cardsInPlay = [];

        // empty the dom cards
        $('.card-container').remove();


        // ui toggles - purposefully not resetting background image
        func.toggleTitles();
        func.toggleShop();
        func.toggleCards();
        func.updateTier();
        func.updateCoins();

    },

    //////////////////////////
    // Shop Functions
    //////////////////////////
    
    // start buy round
    startBuyRound(tier) {

        $('.player-2.card-row').toggleClass('hidden');

        // empty the current pool 
        global.cardsInPool = [];
        $('.buy .card-container').remove();

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
        func.makeshopCards(global.cardsInShop);

    },

    // buy a card from the shop
    buyCard(event) {

        // check if the player has too many cards - limit 6
        if (global.activePlayer.cardsInPlay.length >= 6) {
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

        // reset ids 
        func.resetIds();

    },

    // reset Id's
    resetIds() {

        // get element lists
        const $cardList = $('.card-container.in-player-row');
        const $healthList = $('.in-player-row .card-health')

        // loop through and reset ids
        for (let i = 0; i < $cardList.length; i++) {

            $cardList[i].id = i;
            $healthList[i].id = 'health-' + i;

        }
    },

    // refresh the shop
    refreshShop(event) {

        // check coins function - canIPay

        // decrement player coins and update ui
        global.activePlayer.coins -= 1;
        func.updateCoins();

        // empty the shop array and ui
        global.cardsInShop = [];
        $('.buy .card-container').remove();

        // call buy round with current tier
        func.startBuyRound(global.activePlayer.currentTier);

    },

    // upgrade tier
    upgradeTier() {

        // check if player has enough money to upgrade
        //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<uncomment
        // if (global.activePlayer.coins < global.activePlayer.tierUpgradeCost) {
        //     return (alert('not enough coins'));
        // }

        // decrement players coins
        global.activePlayer.coins -= global.activePlayer.tierUpgradeCost;
        func.updateCoins();

        // increment tier and upgrade cost
        global.activePlayer.currentTier++;
        global.activePlayer.tierUpgradeCost++;

        // update dom
       func.updateTier();

    },

    //////////////////////////
    // Combat Functions
    //////////////////////////

    // start combat phase // need to finish
    startCombat() {

        $('.player-2').toggleClass('hidden');
        // toggle shop ui off
        func.toggleShop();

        // toggle buy-row
        $('.buy').toggleClass('hidden');
        
        // empty buy row
        $('.buy').empty();
        
        // make dom elements for enemy cards
        const currentEnemy = global.enemyPool.shift();
        global.enemyCards.push(currentEnemy);
        // console.log(currentEnemy)

        const id = 'enemy';
        const tier = 'enemy-' + global.currentEnemyTier;
        const power = currentEnemy.power;
        const health = currentEnemy.health;
        const rarity = '';

        const enemyElement = func.makeCard(id, tier, power, health, rarity);
        $('.player-2').append(enemyElement);

        // increment enemy tier
        global.currentEnemyTier++;

        // trigger attack function
        setTimeout(() => {
            func.attackCard();
        }, 1000);

    },

    attackCard() {

        
        // go to combat resolution if so
        
        // reset player array Id's
        func.resetIds();
        
        // get enemy and player cards
        const enemyCards = global.enemyCards;
        const cardsInPlay = global.activePlayer.cardsInPlay;
        
        console.log(enemyCards);
        console.log(cardsInPlay);


        // check if either player has 0 creatures before continuing
        if (enemyCards.length <= 0 || cardsInPlay.length <= 0) {

            global.cardsInShop = [];
            $('.buy').toggleClass('hidden');
            func.toggleShop();
            func.startBuyRound(global.activePlayer.currentTier);
            return;

        }

        // generate a random card from player array
        const randomPlayerId = func.randomNumberBetween(0, cardsInPlay.length);
        const playerCardObj = cardsInPlay[randomPlayerId];
        const $playerCard = $(`#${randomPlayerId}`);
        const $playerCardHealth = $(`#health-${randomPlayerId}`);

        // generate a random card from enemy array
        const randomEnemyId = func.randomNumberBetween(0, enemyCards.length);
        const enemyCardObj = enemyCards[randomEnemyId];
        const $enemyCard = $(`#enemy:nth-of-type(${randomEnemyId + 1})`);
        const $enemyCardHealth = $(`#health-enemy:nth-of-type(${randomEnemyId + 1})`)

        console.log($enemyCard)

        // apply damage
        playerCardObj.health -= enemyCardObj.power;
        enemyCardObj.health -= playerCardObj.power;

        console.log(enemyCardObj.health, playerCardObj.health);

        // update health on the dom
        $playerCardHealth.text(playerCardObj.health).addClass('damaged')
        $enemyCardHealth.text(enemyCardObj.health).addClass('damaged')
        
        // check if card dead and remove if so
        setTimeout(() => {
            if (playerCardObj.health <= 0) {

                $playerCard.remove();
                cardsInPlay.splice(randomPlayerId, 1);

            }
            if (enemyCardObj.health <= 0) {

                $enemyCard.remove();
                enemyCards.splice(randomEnemyId, 1);

            }

            // call attack again
            setTimeout(() => {

                func.attackCard();
            }, 1000);
        }, 1000);

    },

    generateEnemies() {

        for (i = 0; i < 10; i++) {

            global.enemyPool.push(new Card(i, 'common', i + 1, i + 2));
        }
    },

    // check win state<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    checkWin() {

    },

    // check loss state<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    checkLoss() {
    },

    //////////////////////////
    // Utilities
    //////////////////////////
    
    // generate a background image
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

    //////////////////////////
    // UI Functions
    //////////////////////////
    
    // toggle start ui
    toggleTitles() {

        $('.hero-text').toggleClass('hidden');
        $('.play-btn').toggleClass('hidden');
        $('.social-links').toggleClass('hidden');

    },

    // toggle shop ui
    toggleShop() {

        $('.coins').toggleClass('hidden');
        $('.current-tier').toggleClass('hidden');
        $('.refresh-tier').toggleClass('hidden');
        $('.go-to-combat').toggleClass('hidden');
        $('.reset-btn').toggleClass('hidden');
    },

    // toggle card rows
    toggleCards() {

        $('.card-row').toggleClass('hidden');

    },

    // update tier labels
    updateTier() {

        $('.tier-title').text(`Tier ${global.activePlayer.currentTier}`);
        $('.tier-cost').text(global.activePlayer.tierUpgradeCost);

    },

    // update coins
    updateCoins() {

        $('.coin-total').text(global.activePlayer.coins);
    },

}
//////////////////////////
// Event Handlers
//////////////////////////

    const handle = {

        playButton: $('.play-btn').on('click', func.startGame),
        tierUpgrade: $('.current-tier').on('click', func.upgradeTier),
        refreshButton: $('.refresh-tier').on('click', func.refreshShop),
        combatButton: $('.go-to-combat').on('click', func.startCombat),
        resetButton: $('.reset-btn').on('click', func.reset),
    }

//////////////////////////
// App Logic
//////////////////////////

let player1 = new Player('Player 1');