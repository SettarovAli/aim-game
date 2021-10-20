let $start = document.querySelector('#start');
let $game = document.querySelector('#game');
let $result = document.querySelector('#result');
let $lifesInput = document.querySelector('#lifes-input');
let $goalInput = document.querySelector('#goal-input');
let $speedInput = document.querySelector('#speed-input');
let $roundNumber = document.querySelector('.round-number');
let $roundDisplay = document.querySelector('#round-display');
let $resultInfo = document.querySelector('#result-info');
let $hits = document.querySelector('#hits');
let $misses = document.querySelector('#misses');
let $accuracy = document.querySelector('#accuracy');
let $lifes = document.querySelector('#lifes');
let $score = document.querySelector('#score');
let $round = document.querySelector('#round');
let $timeTotal = document.querySelector('#time-total');
let $timeRound = document.querySelector('#time-round');
let $resultRounds = document.querySelector('#result-rounds');
let $resultScore = document.querySelector('#result-score');
let $resultTime = document.querySelector('#result-time');
let $resultLifes = document.querySelector('#result-lifes');
let $resultHits = document.querySelector('#result-hits');
let $resultMisses = document.querySelector('#result-misses');
let $resultAccuracy = document.querySelector('#result-accuracy');
let boxParent1, boxParent2, boxParent3, boxParent4, boxParent5, boxParentBonus;
let boxSizeInterval1,
  boxSizeInterval2,
  boxSizeInterval3,
  boxSizeInterval4,
  boxSizeInterval5,
  boxSizeIntervalBonus;
let isBoxGrow,
  isBoxGrow2,
  isBoxGrow3,
  isBoxGrow4,
  isBoxGrow5,
  isBoxGrowBonus,
  boxBonusArea;
let hit = new Audio('music/hit.mp3');
let miss = new Audio('music/miss.mp3');
let minusLife = new Audio('music/minus-life.mp3');
let endGameMusic = new Audio('music/end-game.mp3');
hit.volume = 0.01;
miss.volume = 0.01;
minusLife.volume = 0.01;
endGameMusic.volume = 0.01;
let accuracy = 0;
let hits = 0;
let misses = 0;
let lifes = 5;
let isGameStarted = false;
let score = 0;
let boxWidthHeight;
let intervalValue;
let round = 1;
let gameSize = $game.getBoundingClientRect();
let maxTop;
let maxLeft;
setGoalSize();

let boxes = [
  {
    parent: boxParent1,
    classParent: 'boxParent1',
    dataAttr: 'data-box1',
    dataset: 'box1',
    interval: boxSizeInterval1,
    grow: isBoxGrow,
    index: 0,
  },
  {
    parent: boxParent2,
    classParent: 'boxParent2',
    dataAttr: 'data-box2',
    dataset: 'box2',
    interval: boxSizeInterval2,
    grow: isBoxGrow2,
    index: 1,
  },
  {
    parent: boxParent3,
    classParent: 'boxParent3',
    dataAttr: 'data-box3',
    dataset: 'box3',
    interval: boxSizeInterval3,
    grow: isBoxGrow3,
    index: 2,
  },
  {
    parent: boxParent4,
    classParent: 'boxParent4',
    dataAttr: 'data-box4',
    dataset: 'box4',
    interval: boxSizeInterval4,
    grow: isBoxGrow4,
    index: 3,
  },
  {
    parent: boxParent5,
    classParent: 'boxParent5',
    dataAttr: 'data-box5',
    dataset: 'box5',
    interval: boxSizeInterval5,
    grow: isBoxGrow5,
    index: 4,
  },
  {
    parent: boxParentBonus,
    classParent: 'boxParentBonus',
    dataAttr: 'data-boxbonus',
    dataset: 'boxbonus',
    interval: boxSizeIntervalBonus,
    grow: isBoxGrowBonus,
    index: 5,
    bonus: true,
  },
];

$start.addEventListener('click', startGame);
$lifesInput.addEventListener('input', setGameLifes);
$goalInput.addEventListener('input', setGoalSize);
$game.addEventListener('click', handleBoxClickMisses);
$game.addEventListener('click', function () {
  boxClick(event, boxes[0]);
  boxClick(event, boxes[1]);
  boxClick(event, boxes[2]);
  boxClick(event, boxes[3]);
  boxClick(event, boxes[4]);
  boxClick(event, boxes[5]);
});

function startGame() {
  score = 0;
  hits = 0;
  misses = 0;
  accuracy = 0;
  round = 1;
  boxWidthHeight = +$goalInput.value;
  intervalValue = +$speedInput.value;
  lifes = +$lifesInput.value;
  isGameStarted = true;
  $timeTotal.textContent = 180;
  $timeRound.textContent = 15;
  $round.textContent = round;
  $score.textContent = score.toString();
  $misses.textContent = misses.toString();
  $hits.textContent = hits.toString();
  $accuracy.textContent = `${accuracy.toString()}%`;
  $resultInfo.style.display = 'none';
  $game.style.backgroundImage = 'url(images/back.png)';
  $game.style.backgroundImage = 'background-repeat: repeat';

  let timeInterval = setInterval(function () {
    if (isGameStarted) {
      let time = parseFloat($timeTotal.textContent);
      if (time <= 0) {
        endGame();
        $timeRound.textContent = 0;
        clearInterval(timeInterval);
      } else {
        $timeTotal.textContent = time - 1;
      }
    } else {
      clearInterval(timeInterval);
    }
  }, 1000);

  $game.innerHTML = '';

  $lifesInput.setAttribute('disabled', 'true');
  $goalInput.setAttribute('disabled', 'true');
  $speedInput.setAttribute('disabled', 'true');
  renderLifes();
  hide($start);
  isBoxesGrow();
  setRoundInterval();
  render(boxes[0]);
  render(boxes[1]);
  render(boxes[2]);
}

function boxClick(event, box) {
  if (!isGameStarted) {
    return;
  } else if (event.target.dataset[box.dataset]) {
    hits++;
    hit.play();
    $hits.textContent = hits.toString();
    calcAccuracy();
    clearInterval(boxes[box.index].interval);
    boxes[box.index].grow = true;
    if (box.bonus) {
      score += 5000;
      boxBonusArea.remove();
    } else {
      score += 1000;
      render(boxes[box.index]);
    }
    $score.textContent = score.toString();
  }
}

function handleBoxClickMisses(event) {
  if (!isGameStarted) {
    return;
  } else if (event.target.dataset.misses) {
    misses++;
    score -= 5000;
    miss.play();
    $misses.textContent = `${misses.toString()}`;
    $score.textContent = score.toString();
    calcAccuracy();
  }
}

function setGameLifes() {
  lifes = +$lifesInput.value;
  $lifes.textContent = `${lifes}💚`;
}

function setGoalSize() {
  boxWidthHeight = +$goalInput.value;
  maxTop = gameSize.height - boxWidthHeight;
  maxLeft = gameSize.width - boxWidthHeight;
}

function isBoxesGrow() {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].grow = true;
  }
}

function setRoundInterval() {
  timeRoundInterval = setInterval(function () {
    if (isGameStarted) {
      let time = parseFloat($timeRound.textContent);
      if (time <= 1) {
        clearInterval(timeRoundInterval);
        if (!(round == 12)) {
          newRound();
        }
        if (round == 4) {
          render(boxes[3]);
        } else if (round == 10) {
          render(boxes[4]);
        }
      } else {
        $timeRound.textContent = time - 1;
      }
    } else {
      clearInterval(timeRoundInterval);
    }
  }, 1000);
}

function newRound() {
  round += 1;
  $round.textContent = round;
  intervalValue -= 1;
  $timeRound.textContent = 15;
  render(boxes[5]);
  showRoundNumber();
  setRoundInterval();
}

function endGame() {
  isGameStarted = false;
  show($start);
  $game.style.backgroundImage = 'none';
  $game.innerHTML = '';
  $lifes.textContent = `0💚`;
  endGameMusic.play();
  $resultInfo.style.display = 'block';
  $start.style.top = '350px';
  $lifesInput.removeAttribute('disabled');
  $goalInput.removeAttribute('disabled');
  $speedInput.removeAttribute('disabled');

  $resultRounds.textContent = round.toString();
  $resultScore.textContent = score.toString();
  $resultTime.textContent = $timeTotal.textContent;
  $resultLifes.textContent = $lifes.textContent;
  $resultHits.textContent = hits.toString();
  $resultMisses.textContent = misses.toString();
  $resultAccuracy.textContent = accuracy.toString();
}

function render(box) {
  if (box.parent) {
    box.parent.remove();
  }

  box.parent = document.createElement('div');
  box.parent.classList.add(box.classParent);
  box.parent.classList.add('boxParent');
  box.parent.style.top = getRandom(0, maxTop) + 'px';
  box.parent.style.left = getRandom(0, maxLeft) + 'px';
  box.parent.style.height = box.parent.style.width = boxWidthHeight + 'px';
  box.parent.setAttribute('data-misses', true);
  $game.insertAdjacentElement('afterbegin', box.parent);

  let boxChildSize = 10;
  let boxChild = document.createElement('div');
  boxChild.classList.add('boxChild');
  boxChild.setAttribute(box.dataAttr, true);

  if (box.bonus) {
    boxChild.style.backgroundImage = `url(images/navi.jpg)`;
    boxChild.style.backgroundSize = 'cover';
  }

  box.parent.insertAdjacentElement('afterbegin', boxChild);

  box.interval = setInterval(function () {
    if (boxChildSize <= 0) {
      clearInterval(box.interval);
      lifes--;
      console.log('Box ' + box.index + ': ' + lifes + '💚');
      minusLife.play();
      if (box.bonus) {
        boxBonusArea.remove();
      }
      box.grow = true;
      if (lifes <= 0) {
        endGame();
      } else if (isGameStarted) {
        renderLifes();
        if (!box.bonus) {
          render(boxes[box.index]);
        }
      }
    } else if (isGameStarted) {
      if (box.grow == true) {
        boxChildSize += 1;
        boxChild.style.height = boxChild.style.width = boxChildSize + 'px';
        if (boxChildSize >= boxWidthHeight) {
          box.grow = false;
        }
      } else {
        boxChildSize -= 1;
        boxChild.style.height = boxChild.style.width = boxChildSize + 'px';
      }
    } else {
      clearInterval(box.interval);
    }
  }, intervalValue);

  if (box.bonus) {
    boxBonusArea = box.parent;
  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function calcAccuracy() {
  accuracy = ((hits / (hits + misses)) * 100).toFixed(2);
  $accuracy.textContent = `${accuracy.toString()}%`;
}

function showRoundNumber() {
  $roundDisplay.textContent = round;
  $roundNumber.style.display = 'inline-block';
  let fontSize = 2.2;
  $roundNumber.style.fontSize = '0rem';

  roundDisplayInterval = setInterval(function () {
    if (isGameStarted) {
      if (fontSize >= 3) {
        $roundNumber.style.display = 'none';
        clearInterval(roundDisplayInterval);
      } else {
        fontSize += 0.01;
        $roundNumber.style.fontSize = fontSize + 'rem';
      }
    } else {
      clearInterval(roundDisplayInterval);
      $roundNumber.style.display = 'none';
    }
  }, 10);
}

function renderLifes() {
  $lifes.textContent = `${lifes.toString()}💚`;
}

function show($el) {
  $el.classList.remove('hide');
}

function hide($el) {
  $el.classList.add('hide');
}
