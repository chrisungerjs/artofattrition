# Art of Attrition

- A front-end draft and auto-battler card game by Christian Unger.

  

- Check out my other projects on [GitHub](https://github.com/ChrisUngerJS) and follow me on [Twitter](https://twitter.com/ChrisUngerJS) and [LinkedIn](https://www.linkedin.com/in/christian-unger-044629152/)

  

- Play the game [HERE](https://chrisungerjs.github.io/art_of_attrition/)

  

## Technologies Used

- Art of Attrition was built entirely on the front-end with HTML, CSS, and JavaScript. Events and DOM manipulation are written in jQuery. I took a functional approach to constructing the core game logic, trying to leave my functions as open-ended as I could so that I can expand on game functionality in the future.

  

- The function used to shuffle my card arrays is an implementation of the [Fisher-Yates Shuffle](https://bost.ocks.org/mike/shuffle/) algorithm, a simple and elegant way to ensure randomization.

  

## Attributions

- All artwork included in Art of Attrition is completely open source and provided by the fantastic [wtactics](https://github.com/wtactics/art) under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/) (copy of license also included in repository). Also check out other awesome wtactics projects like [ArcMage](https://arcmage.org/).

  

- Animations are all from [Animista](https://animista.net/). I was really impressed by how these were to implement, except that I found out they don't all play nice with absolute positioned items, so there are definitely trade-offs to the pre-made approach.

  

- For the time being (see bugs), the majority of Art of Attrition's UI icons (play button, social links, shop buttons) are provided free by [Font Awesome](https://fontawesome.com/). Check them out for tons of free icons for your projects. They also offer paid accounts for even more options.

  

## Next Steps  

-  **Stylesheet Cleanup** - my CSS is a **mess** and cleaning that up for readability is a top priority

-  **Tutuorial** - I have a modal coded and I'm ready to set up an in-game tutorial

-  **Balancing and Testing** - The game itself is actually pretty balanced - to a point (that point is roughly tier 4). I will be experimenting with additional functionality for both hero and emeny card logic, as well as different game modes and card types like spells and creatures with static abilities that affect your board.

  

## Known Bugs

  

- The in-game **reset function** is not yet working properly to reset player health, win condition checks, and several UI feature toggles. It has been commented out and substituted for a full page refresh until I resolve those issues. The page refresh is not ideal but it is functional for now.

  

- Needs to **request full-screen** on mobile to prevent UI bugs when the mobile browser address bar does not auto-hide.

-  **Font-Awesome icons need to be replaced**. Core game UI is reliant on the FA server, which has proven to be inconsistent.

  

- The **final enemy does not attack the player correctly**, nor does it attack creatures on subsequent combat steps if it survives combat the first time.

  

- If you spot a bug that isn't listed above, please [submit an issue ticket](https://github.com/ChrisUngerJS/art_of_attrition/issues). It is much appreciated.