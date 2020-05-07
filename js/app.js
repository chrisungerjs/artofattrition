//////////////////////////
// Global Variables and Classes
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
    ],
    enemyPool: [],
    enemyCards: [],
    currentEnemyTier: 1,
    modalText: '',
    transitionText: '',

}

class Player {
    constructor (name) {

        this.name = name;
        this.health = 30;
        this.cardsInPlay = [];

        this.currentTier = 1;
        this.tierUpgradeCost = 4;
        
        this.coins = 0;
        this.newCoinsPerRound = 3;

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
        func.toggleShopOn();
        func.toggleCards();
        func.updateCoins();
        func.updateTier();
        $('.player-health-container').toggleClass('hidden');

        // start buy round
        func.awardCoins()
        func.startBuyRound(global.activePlayer.currentTier);

        // make enemy cards
        func.generateEnemies();
        
    },
    
    // generate the card pool
    generatePool(tier) { 

        // variables
        const totalCommons = 8;
        const totalUncommonAs = 3;
        const totalUncommonBs = 3;
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
        for (let i = 0; i < cardArray.length; i++) {

            const rarity = cardArray[i].rarity;
            const tier = cardArray[i].tier;
            const power = cardArray[i].power;
            const health = cardArray[i].health; 

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
                
                tierStars += '&#8734;';
            }
           
            // make dom elements
            const cardElement = func.makeCard(i, tier, power, health, rarity, tierStars);

            // add event listener 
            cardElement.on('click', (event) => func.buyCard(event));
            
            // append to the buy row
            $('.buy').append((cardElement).addClass('slide-in-right'));
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
        `)
    },

    reset() {

        // returning to fix bugs so I can save user data locally - just reloading page for now
        location.reload();

        // known bugs:

            // health ui and combat buttons don't always toggle
            // health and win checks aren't resetting

        // graveyard:

        // player1 = {};
        // player1 = new Player('Player 1');
        // const player = global.activePlayer;

        // // reset global variables
        // global.cardsInShop = [];
        // global.cardsInPool = [];
        // player.cardsInPlay = [];
        // global.enemyPool = [];
        
        // // empty the dom cards
        // $('.card-container').remove();


        // // ui toggles - purposefully not resetting background image
        // func.toggleTitles();
        // func.toggleShopOn();
        // func.toggleCards();
        // func.updateTier();
        // func.updateCoins();
        // $('.player-health').addClass('hidden');
        // $('.go-to-combat').addClass('hidden');
        // $('.player-2.card-row').addClass('hidden');

    },

    //////////////////////////
    // Shop Functions
    //////////////////////////
    
    // start buy round
    startBuyRound(tier) {

        global.transitionText = 'shop';
        func.updateTransition();

        $('.player-2.card-row').addClass('hidden');

        // empty the current pool - disabled for testing
        // global.cardsInPool = [];

        // remove old dom cards
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

            global.modalText = 'You have too many minions. Sell one to free up space';

            return func.updateModal();
        }
   
        // check if player can buy more items - can always refresh tier
        if (global.activePlayer.coins < 3) {
            
            global.modalText = "you don't have enough coins!";
            return func.updateModal();
        }

        // decrement player money
        global.activePlayer.coins -= 3;
        func.updateCoins();

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

        // go to combat if player can't buy any more minions
        if (global.activePlayer.coins < 3) {

            setTimeout(() => {

                func.startCombat();
            
            }, 1000);
        }

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

    resetEnemyIds() {

        // get element lists
        const $enemyCardList = $('.player-2 > .card-container');
        const $enemyHealthList = $('.player-2 .card-health');

        // loop through and reset ids
        for (let i = 0; i < $enemyCardList.length; i++) {
            
            $enemyCardList[i].id = 'enemy-' + i;
            $enemyHealthList[i].id = 'health-enemy-' + i;

        }

    },

    // refresh the shop
    refreshShop(event) {

        // decrement player coins and update ui - currently disabled
        // global.activePlayer.coins -= 1;
        // func.updateCoins();

        // empty the shop array and ui
        global.cardsInShop = [];
        $('.buy .card-container').remove();

        // call buy round with current tier
        func.startBuyRound(global.activePlayer.currentTier);

    },

    // set coins for round
    awardCoins() {

        global.activePlayer.coins += global.activePlayer.newCoinsPerRound;
        func.updateCoins()
        global.activePlayer.newCoinsPerRound += 1;

    },

    // upgrade tier
    upgradeTier() {


        // check if player has enough money to upgrade
        if (global.activePlayer.coins < global.activePlayer.tierUpgradeCost) {

            global.modalText = "you don't have enough coins!"
            return func.updateModal();
        };

        // check if player is already at tier 8
        if (global.activePlayer.currentTier >= 8) {

            global.modalText = 'You are already at the highest tier!';
            return func.updateModal();
        }

        // decrement players coins
        global.activePlayer.coins -= global.activePlayer.tierUpgradeCost;
        func.updateCoins();

        // increment tier and upgrade cost
        global.activePlayer.currentTier++;
        global.activePlayer.tierUpgradeCost = global.activePlayer.currentTier + 3;

        
        // update dom
        func.updateTier();
        
        // refresh the shop
        func.refreshShop();
        
        // check if player can still buy minions
        if (global.activePlayer.coins < 3) {

            setTimeout(() => {

                func.startCombat();

            }, 1000);
        }
    },

    //////////////////////////
    // Combat Functions
    //////////////////////////

    // start combat phase // need to finish
    startCombat() {

        global.transitionText = 'combat';
        func.updateTransition();

        // toggle shop ui off
        func.toggleShopCombat();

        // toggle buy-row
        $('.buy').toggleClass('hidden');
        
        // empty buy row
        $('.buy').empty();

        $('.player-2.card-row').removeClass('hidden').empty();
        
        // push a new enemy to the enemy card row
        const currentEnemy = global.enemyPool.shift();
        global.enemyCards.push(currentEnemy);

        // make dom elements for the enemy cards
        for (let i = 0; i < global.enemyCards.length; i++) {

            const enemy = global.enemyCards[i];

            const id = 'enemy-' + i;
            const tier = 'enemy-' + (enemy.tier + 1);
            const power = enemy.power;
            const health = enemy.health;
            const rarity = 'common';
            const tierStars = '&#9760';
        
            const enemyElement = func.makeCard(id, tier, power, health, rarity, tierStars);
            $('.player-2').append(enemyElement);
        
        }

        // increment enemy tier
        global.currentEnemyTier++;

        // trigger attack function
        setTimeout(() => {

            func.attackCard();
        }, 2000);

    },

    attackCard() {

        if (global.enemyPool.length <= 0 && global.enemyCards.length <= 0) {
            return setTimeout(() => {
                
                func.youWin();
            
            }, 1000)
        }
        
        // reset card array Id's
        func.resetIds();
        func.resetEnemyIds();
        
        // get enemy and player cards
        const enemyCards = global.enemyCards;
        const cardsInPlay = global.activePlayer.cardsInPlay;
        
        // check if either player has 0 creatures before continuing
        if (cardsInPlay.length <= 0) {
            
            return func.attackPlayer();
        } 
        if (enemyCards.length <= 0) {
            
            return func.endCombatRound();
        }        

        // generate a random card from player array
        const randomPlayerId = func.randomNumberBetween(0, cardsInPlay.length);
        const playerCardObj = cardsInPlay[randomPlayerId];
        const $playerCard = $(`#${randomPlayerId}`);
        const $playerCardHealth = $(`#health-${randomPlayerId}`);

        // generate a random card from enemy array
        const randomEnemyId = func.randomNumberBetween(0, enemyCards.length);
        const enemyCardObj = enemyCards[randomEnemyId];
        const $enemyCard = $(`#enemy-${randomEnemyId}`);
        const $enemyCardHealth = $(`#health-enemy-${randomEnemyId}.card-health`);

        // apply animations to both cards in combat
        $playerCard.removeClass('bounce-bottom');
        setTimeout(() => {
            $playerCard.addClass('bounce-bottom');
        }, 5);
        $enemyCard.removeClass('bounce-top');
        setTimeout(() => {
            $enemyCard.addClass('bounce-top');
        }, 5);
        

        // apply damage
        playerCardObj.health -= enemyCardObj.power;
        enemyCardObj.health -= playerCardObj.power;


        // update health on the dom
        $playerCardHealth.text(playerCardObj.health).addClass('damaged')
        $enemyCardHealth.text(enemyCardObj.health).addClass('damaged')

        // check if card dead and remove if so
        setTimeout(() => {

            if (enemyCardObj.health <= 0) {

                $enemyCard.addClass('shake-horizontal');
                
                $enemyCard.remove();
                global.activePlayer.coins += 2;
                func.updateCoins();
                enemyCards.splice(randomEnemyId, 1);

            }

            if (playerCardObj.health <= 0) {

                $playerCard.remove();
                cardsInPlay.splice(randomPlayerId, 1);

            }

            // call attack again
            setTimeout(() => {

                func.attackCard();
            }, 1000);

        }, 1000);

    },

    attackPlayer() {

        // get enemy cards
        const enemyCards = global.enemyCards;
        
        for (let i = 0; i < enemyCards.length; i++) {

            global.activePlayer.health -= enemyCards[i].power;
            $(`.enemy-${i}`).removeClass('bounce-top');
            $(`.enemy-${i}`).addClass('bounce-top');
            func.updateHealth();
        }

        if (global.activePlayer.health > 0) {

            setTimeout(() => {

                func.endCombatRound();

            }, 1000)
        
        } else {

            setTimeout(() => {
                
                func.youLose();
            
            }, 1000);
        }
    },

    endCombatRound() {
        global.cardsInShop = [];
        $('.buy').toggleClass('hidden');
        func.toggleShopCombat();
        func.awardCoins()
        global.activePlayer.tierUpgradeCost--;

        // make sure update cost doesn't go below zero
        if (global.activePlayer.tierUpgradeCost <= 0) {
            global.activePlayer.tierUpgradeCost = 0;
        }

        func.updateTier();
        func.startBuyRound(global.activePlayer.currentTier);
        return;
    },

    generateEnemies() {

        for (i = 0; i < 10; i++) {

            const chance = func.randomNumberBetween(0, 2);

            global.enemyPool.push(new Card(i, 'common', i + 1, i + 1 + chance));
        }
    },

    youWin() {

        $('body').empty();

        $('body').append('<div>').addClass('win-background').html(`
        
            <div class="win">
                <div class="win-textbox">
                    <div class="win-text">YOU WIN</div>
                </div>
            </div>
        
        `).on('click', func.reset);
    },

    youLose() {

        $('body').empty();

        $('body').append('<div>').addClass('lose-background').html(`
        
            <div class="lose">
                <div class="lose-textbox">
                    <div class="lose-text">YOU LOSE</div>
                </div>
            </div>
        
        `).on('click', func.reset);
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

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    //////////////////////////
    // Tutorial
    //////////////////////////
    
    startTutorial() {

        
    },

    //////////////////////////
    // UI Functions
    //////////////////////////

    // update and show the transition message
    updateTransition() {

        $('.transition').text(global.transitionText).fadeIn('slow');
        setTimeout(() => {
            $('.transition').fadeOut();
        }, 1000);
    },
    
    // toggle start ui
    toggleTitles() {

        $('.hero-text').toggleClass('hidden');
        $('.play-btn').toggleClass('hidden');
        $('.social-links').toggleClass('hidden');

    },

    // toggle shop ui
    toggleShopOn() {

        $('.coins').toggleClass('hidden');
        $('.current-tier').toggleClass('hidden');
        $('.refresh-tier').toggleClass('hidden');
        $('.go-to-combat').toggleClass('hidden');
        $('.reset-btn').toggleClass('hidden');
    },

    toggleShopCombat() {

        $('.current-tier').toggleClass('hidden');
        $('.go-to-combat').toggleClass('hidden');


    },

    // toggle card rows
    toggleCards() {

        $('.card-row').toggleClass('hidden');

    },

    // update tier labels
    updateTier() {

        // if tier is already 8, remove the upgrade cost from the dom
        if (global.activePlayer.currentTier >= 8) {

            $('.upgrade-tier').remove();
        }

        $('.tier-title').text(`Tier ${global.activePlayer.currentTier}`);
        $('.tier-cost').text(global.activePlayer.tierUpgradeCost);

    },

    // update coins
    updateCoins() {

        $('.coin-total').text(global.activePlayer.coins);
    },

    // update health
    updateHealth() {

        $('.player-health').text(global.activePlayer.health);
    },

    // update modal text
    updateModal() {

        $('.modal-text').text(global.modalText);
        $('.modal').toggleClass('hidden');
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
        toggleModal: $('.modal').on('click', () => $('.modal').toggleClass('hidden'))
}

// Player 1
let player1 = new Player('Player 1');