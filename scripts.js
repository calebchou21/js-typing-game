const textElement = document.querySelector("#paragraph");
const restartBtn = document.querySelector("#restart");
const mistakesEl = document.querySelector(".mistakes span");
const inputEl = document.querySelector(".input-field");
const timer = document.querySelector(".time span");
const WPMEl = document.querySelector(".wpm span");
const CPMEl = document.querySelector(".cpm span");

let charEls = [];
let mistakes = 0;
let charArray = [];
let curIndex = 0;

let startTime;
let stopwatchInterval;
let firstKey = true;

//Setup 
function resetGame(){
  setParagraph(generateString());
  resetWatch();
  resetMetrics();
  restartBtn.blur();
  inputEl.value = "";
  firstKey = true;
  mistakes = 0;
  mistakesEl.innerHTML = 0;
}
function setParagraph(text) {
  charArray = text.split('');
  text = Array.from(text).map(ch => `<span>${ch}</span>`).toString().replace(/,/g, '');
  textElement.innerHTML = text;
  curIndex = 0; 
  charEls = document.querySelectorAll('span');
  charEls[0].classList.add("active");
}

//Metrics
function startStopwatch(){
  startTime = new Date().getTime();
  stopwatchInterval = setInterval(updateStopwatch, 10);
}
function startMetrics(){
  metricsInterval = setInterval(updateMetrics, 1000);
}
function updateStopwatch(){
    const curTime = new Date().getTime();
    const elapsedTime = curTime - startTime;

    const minutes = Math.floor(elapsedTime / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((elapsedTime % 1000) / 10);

    const formattedTime = formatTime(minutes) + ':' + formatTime(seconds) + ':' + formatTime(milliseconds);
    timer.innerHTML = formattedTime;
}
function formatTime(time) {
    return time < 10 ? '0' + time : time;
}
function resetMetrics(){
  clearInterval(metricsInterval);
  WPMEl.innerHTML = '0';
  CPMEl.innerHTML = '0';
}
function resetWatch(){
    clearInterval(stopwatchInterval);
    timer.innerHTML = '00:00:000';
}
function updateMetrics(){
  const curTime = new Date().getTime();
  const elapsedTime = curTime - startTime;
  const mins = elapsedTime/60000;
  const words = inputEl.value.split(" ").length-1;
  const chars = inputEl.value.split('').length;
  const wpm = words/mins;
  const cpm = chars/mins;

  CPMEl.innerHTML = cpm.toFixed(2)
  WPMEl.innerHTML = wpm.toFixed(2)
}

//Typing logic
function handleInput(event) {

    const excludedKeys = ['Backspace', 'Tab', 'Enter', 'Command', 'Meta', 'Shift', 'Control', 'Alt', 'CapsLock', 'Escape'];
    let curKey = event.key;
    let curString = charArray.slice(0, curIndex + 1).join('');

    charEls[curIndex].classList.remove("active");

    if (firstKey) {
        startStopwatch();
        startMetrics();
        firstKey = false;
    } 

    if(!excludedKeys.includes(curKey)){
      inputEl.value += curKey;
      checkWin();
      if (inputEl.value === curString) {
        charEls[curIndex].classList.add("correct");
        curIndex++;
      }
      else if (inputEl.value !== curString) {
        mistakes++;
        charEls[curIndex].classList.add("incorrect");
        mistakesEl.innerHTML = mistakes;
        curIndex++;
      }
    }else{
      if (event.key === "Backspace" && curIndex > 0) {
      curIndex--;
      inputEl.value = inputEl.value.substring(0, inputEl.value.length - 1);
      charEls[curIndex].classList.remove("incorrect");
      charEls[curIndex].classList.remove("correct");
    }   
  }
  charEls[curIndex].classList.add("active");
}

function checkWin(){
  if(JSON.stringify(inputEl.value.split('')) == JSON.stringify(charArray)){
    clearInterval(stopwatchInterval);
    clearInterval(metricsInterval);
  }
}
  
restartBtn.addEventListener("click", () => {
  resetGame()
})

document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener("keydown", handleInput);
  let text = generateString();
  setParagraph(text);
});

