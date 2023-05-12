const gameContainer = document.getElementById("game");
let firstCard = null;
let secondCard = null;
let blockedClick = false;
let attempts = 0;
const score = document.querySelector('#currentScore');
let matches = 0;
const startGame = document.querySelector('.startGame');
// const lowestScore = localStorage.getItem('lowestScore') || [];
const lowScore = document.querySelector("#lowScore");
const startGameBtn = document.querySelector('#startGameButton');
const numberOfMatches = document.querySelector('input[type=number]');


function generateRandomColor() {
  let color = "#";
  for (let i = 0; i < 6; i++) {
    let randomValue = Math.floor(Math.random() * 16);
    color += randomValue.toString(16);
  };
  return color;
}

function generateRandomColorArray(num) {
  let colors = [];
  for (let i = 0; i < num/2; i++) {
    let color = generateRandomColor();
    colors.push(color);
    colors.push(color);
  }

  shuffle(colors);

  return colors;
}

  
function changeLowestScoreFromLocalStorage(){
  lowestScore = localStorage.getItem('lowestScore') || [];
  if(lowestScore.length === 0){
    localStorage.setItem('lowestScore', '100');
  };
  lowScore.textContent = lowestScore;
};

function updateLowestScoreInLocalStorage(num){
  localStorage.setItem('lowestScore', num)
};

changeLowestScoreFromLocalStorage();
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let i = 0; i < colorArray.length; i++) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(colorArray[i]);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  if(blockedClick){
    return;
  }
  let selectedCard = event.target
  selectedCard.classList.add('flipped')
  selectedCard.style.backgroundColor = selectedCard.classList[0]
  if(!firstCard){
    firstCard = selectedCard
  } else if(!secondCard && selectedCard !== firstCard){
    secondCard = selectedCard
  }
  if(firstCard && secondCard){
    blockedClick = true;
    attempts ++
    score.innerText = `${attempts}`
    if(firstCard.classList[0] === secondCard.classList[0]){
      matches ++
      firstCard = null;
      secondCard = null;
      blockedClick = false;
    } else {
      setTimeout(function(){
        firstCard.classList.remove('flipped')
        secondCard.classList.remove('flipped')
        firstCard.style.backgroundColor = '';
        secondCard.style.backgroundColor = '';
        firstCard = null;
        secondCard = null;
        blockedClick = false;
      }, 1000)
    }
  }
  if(matches === requestedMatches/2){
    if(attempts < Number(lowScore.textContent)){
      updateLowestScoreInLocalStorage(attempts);
      changeLowestScoreFromLocalStorage();
    }
    setTimeout(function(){
      alert('You Win!')
    }, 250)
  }

}
let requestedMatches = ''
let newGame = [];
startGame.addEventListener('submit', function(e){
  e.preventDefault()
  if(gameContainer.childElementCount > 0){
    while(gameContainer.firstChild){
      gameContainer.removeChild(gameContainer.firstChild);
    }
  }
  changeLowestScoreFromLocalStorage();
  startGameBtn.textContent = 'New Game'
  attempts = 0;
  score.innerText = `${attempts}`;
  matches = 0;
  requestedMatches = numberOfMatches.value * 2;
  if(!requestedMatches){
    requestedMatches = 12;
  }
  newGame = generateRandomColorArray(requestedMatches);
  createDivsForColors(newGame);
})