
let leftBank = [ 'l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7', 'l8' ];

let rightBank = [ 'r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8' ];

let game = null;

let leftSensor = () => (
  document.querySelector(`.l1`).classList.contains('charged') && !document.querySelector(`.l1`).classList.contains('uncharged'));

let rightSensor = () => (
  document.querySelector(`.r1`).classList.contains('charged') && !document.querySelector(`.r1`).classList.contains('uncharged'));

let timeOuts = [];

let side = bank => (bank === leftBank ? 'left' : 'right' );

let levels = {
  one: { level: 1, left: 1000, right: 300 },
  two: { level: 2, left: 800, right: 250},
  three: { level: 3, left: 200, right: 600}
}

let increments = levels.one

let count = 0;

const decharge = (bankSlot) => (document.querySelector(`.${bankSlot}`).classList.replace('charged', 'uncharged'));
 

const charge = (bank) => {
  bank.forEach(step => {
      document.querySelector(`.${step}`).classList.add('charged')
  })
}

const stop = (bank) => {
  for (let i=8; i > 0; i--) {
    let tid = 't'+bank[bank.length-i]
    timeOuts.forEach(times => {
      if (times[tid]) {
        clearTimeout(times[tid])
      }
    })
  }
}

const recharge = (bank) => {
  stop(bank)
    bank.forEach(step => {
      document.querySelector(`.${step}`).classList.remove('uncharged');
    })
  startSequence(bank)
  
}


const countDown = (bank) => {
  
  let incr = side(bank) === 'left' ? increments.left : increments.right;
  for (let i=8; i > 0; i--) {
   
    // console.log('pre', bank[bank.length-i])
    
    let tid = setTimeout(decharge, incr * i, bank[bank.length-i])
    
    timeOuts.push({ ['t'+bank[bank.length-i]]: tid })
  }
}

function showFail() {
  document.querySelector('.banner').classList.toggle('hidden')
  document.querySelector('.bodyHouse').classList.toggle('hidden')
  document.querySelector('.startButton').classList.toggle('hidden')
  document.querySelector('.restartButton').classList.toggle('hidden')
  document.querySelector('.failMessage').classList.toggle('hidden')
}

function fail() {
  startOver()
  showFail()
  console.log('juh fulled...')
}

function levelUp() {
  increments = increments === levels.one ? levels.two : levels.three
  startOver('levelSet')
  console.log('doneYEAH!')
}

const startOver = (level) => {
  clearInterval(game)
  game = null;
  count = 0;
  timeOuts = [];
  if (!level) { increments = levels.one };
  stop(leftBank)
  stop(rightBank)
  decharge(leftBank)
  decharge(rightBank)
  leftBank.forEach(step => {
      document.querySelector(`.${step}`).classList.remove('uncharged');
      document.querySelector(`.${step}`).classList.remove('charged');
    })
  rightBank.forEach(step => {
      document.querySelector(`.${step}`).classList.remove('uncharged');
      document.querySelector(`.${step}`).classList.remove('charged');
    })
}

function startSequence(bank) {
  charge(bank)
  countDown(bank)
}

const gameTrack = () => {
  console.log('tick', count)
  
   if(!leftSensor() || !rightSensor()) {
    return fail()
    }
    if (count === 10) {
      levelUp()
    }
}

const startTrack = () => (game = setInterval(gameTrack, 200))

function session() {
  count = 0;
  startSequence(leftBank)
  startSequence(rightBank)
  
  if(game === null) {
  setTimeout(startTrack, 1000)
  }
  
}

function startGame(txt) {
  console.log('clicked! => incrs =', increments)
  if(txt.includes('starter')) {
    session()
  }
}

function handleDisplays() {
  document.querySelector('.rules').classList.toggle('hidden')
  document.querySelector('.bodyHouse').classList.toggle('hidden')
  document.querySelector('.startButton').classList.toggle('hidden')
  document.querySelector('.restartButton').classList.toggle('hidden')
}

let start = document.querySelector(".startButton").addEventListener("click", e => startGame("by starter"))
let restart = document.querySelector(".restartButton").addEventListener("click", e => startOver())

let left = document.querySelector(".leftBumper").addEventListener("click", e => { count++; recharge(leftBank)} )
let right = document.querySelector(".rightBumper").addEventListener("click", e => {  count++; recharge(rightBank) })


let infoToggle = document.querySelector(".infoButton").addEventListener("click", e => handleDisplays())
let failMessageToggle = document.querySelector(".failToggle").addEventListener("click", e => showFail())

