//////////////////////////
// Global Variables
//////////////////////////

const global = {

}

//////////////////////////
// Functions
//////////////////////////

const func = {
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
    }
}
//////////////////////////
// Event Handlers
//////////////////////////

const handle = {

}

//////////////////////////
// App Logic
//////////////////////////

