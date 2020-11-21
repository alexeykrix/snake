const btnPlay = document.querySelector('.play')
const btnPause = document.querySelector('.pause')
const btnReset = document.querySelector('.reset')
const arrows = document.querySelector('.arrows')
const range = document.querySelectorAll('.size')
const canvas = document.querySelector('#canvas')
const best = document.querySelector('.stats span')
const c = canvas.getContext('2d')
canvas.width = canvas.height = localStorage.getItem('width') || 500

range[1].value = range[0].value = localStorage.getItem('width') || 500

c.fillStyle = '#eeeeee'
c.strokeStyle = '#000'
c.lineWidth = '1'
let score = 0
best.innerHTML = localStorage.getItem('best') || 0

let cellSize = localStorage.getItem('cellSize') || 10
let cellsCount = canvas.width / cellSize
let gameData = []
let directions = []
let food;

const randomPos = () => {
  let rand = - 0.5 + Math.random() * cellsCount;
  return Math.round(rand);
}
const randFoodPos = () => {
  food = {
    'x': randomPos(),
    'y': randomPos(),
    'state': 0,
  }
  gameData.forEach(el => {
    if (el.x === food.x && el.y === food.y) randFoodPos()
  })
}

const makeArray = () => {
  gameData = []
  for (let i=0; i < 5; i++) {
    gameData.push({'x': Math.round(cellsCount/2), 'y': Math.round(cellsCount/2), state: 1})
  }
}

const renderCell = (x, y, state, id) => {
  state? c.fillStyle = 
    (id === 0 ? '#e74c3c' : 
      (id%2 === 0 ? '#f39c12' : '#e67e22')): c.fillStyle = '#64dd17'
  c.beginPath()
  c.rect(x*cellSize, y*cellSize, cellSize, cellSize)
  c.fill()
  c.closePath()
}

const renderCells = () => {
  c.fillStyle = '#3d3d3e'
  c.beginPath()
  c.rect(0, 0, canvas.width, canvas.width)
  c.fill()
  c.closePath()
  c.fillStyle = '#242424'
  c.font = '90px "Roboto Mono"'
  c.textAlign = 'center';
  c.fillText(score, canvas.width/2, canvas.width/2+20)
  renderCell(food.x, food.y, 0)
  gameData.forEach((el, id) => {
    renderCell(el.x, el.y, el.state, id)
  })
}

const init = () => {
  makeArray(cellsCount, cellsCount)
  randFoodPos()

  c.fillStyle = '#2e2d2e'
  c.beginPath()
  c.rect(0,0,c.width,c.height)
  c.closePath()
  c.fill()

  renderCells()
}

init()

const selfEating = (id) => {
  gameData = gameData.slice(0, (id>5 ? id: 5 ))
}

const snakeMoving = () => {
  let d = directions[0]
  let eatId;
  const oldData = [...gameData]
  
  if (d === 'left') { // left
    let next = oldData[0].x-1 >= 0 ? oldData[0].x-1 : cellsCount-1
    oldData.forEach((el, id) => {
      if (el.x === next && 
          el.y === oldData[0].y) {
      eatId = id || ''
      }
    })
    if (eatId) selfEating(eatId)
    gameData.unshift({
      'x': next,
      'y': gameData[0].y,
      'state': 1
    })
    if (food.x === next && 
        food.y === gameData[0].y) {
      randFoodPos()
      return
    } else {
      gameData.pop()
    }
  }
  if (d === 'up') { // up
    const oldData = [...gameData]
    let next = oldData[0].y-1 >= 0 ? oldData[0].y-1 : cellsCount-1
    oldData.forEach((el, id) => {
      if (el.x === oldData[0].x && 
          el.y === next) {
      eatId = id || ''
      }
    })
    if (eatId) selfEating(eatId)
    gameData.unshift({
      'x': gameData[0].x,
      'y': next,
      'state': 1
    })
    if (food.x === gameData[0].x && 
        food.y === next) {
      randFoodPos()
      return
    } else {
      gameData.pop()
    }
  }
  if (d === 'down') { // down
    const oldData = [...gameData]
    let next = oldData[0].y+1 < cellsCount ? oldData[0].y+1 : 0
    oldData.forEach((el, id) => {
      if (el.x === oldData[0].x && 
          el.y === next) {
        eatId = id || ''
      }
    })
    if (eatId) selfEating(eatId)
    gameData.unshift({
      'x': gameData[0].x,
      'y': next,
      'state': 1
    })
    if (food.x === gameData[0].x && 
        food.y === next) {
      randFoodPos()
      return
    } else {
      gameData.pop()
    }
  }
  if (d === 'right') { // right
    const oldData = [...gameData]
    let next = oldData[0].x+1 < cellsCount ? oldData[0].x+1 : 0
    oldData.forEach((el, id) => {
      if (el.x === next && 
          el.y === oldData[0].y) {
        eatId = id || ''
      }
    })
    if (eatId) selfEating(eatId)
    gameData.unshift({
      'x': next,
      'y': gameData[0].y,
      'state': 1
    })
    if (food.x === next && 
        food.y === gameData[0].y) {
      
          randFoodPos()
      return
    } else {
      gameData.pop()
    }
  }
  renderCells()
  directions.length >1? directions.shift(): ''
}

const gameRun = () => {
  snakeMoving()
  score = gameData.length-5
  if (+best.innerHTML < score) {
    best.innerHTML = score
    localStorage.setItem('best', best.innerHTML)
  }
  clearInterval(timeout)
  timeout = setInterval(() =>gameRun(), 1000/(score+5))
}

let timeout = false
const keydownHandler = (e) => {
  if (e.repeat) return
  if (e.code === 'KeyW' && 
      directions[directions.length-1] !== 'down' &&
      directions[directions.length-1] !== 'up') directions.push('up')
  if (e.code === 'KeyA' && 
      directions[directions.length-1] !== 'right' &&
      directions[directions.length-1] !== 'left') directions.push('left')
  if (e.code === 'KeyD' && 
      directions[directions.length-1] !== 'left' &&
      directions[directions.length-1] !== 'right') directions.push('right')
  if (e.code === 'KeyS' && 
      directions[directions.length-1] !== 'up' &&
      directions[directions.length-1] !== 'down') directions.push('down')

  if (!timeout) {
    if ((e.code === 'KeyW') ||
        (e.code === 'KeyA') ||
        (e.code === 'KeyD') ||
        (e.code === 'KeyS')) {
      timeout = setInterval(() =>gameRun(), 1000/(score+5))
    }
  }
}


document.addEventListener('keydown', keydownHandler)

btnPause.addEventListener('click', () => {
  clearInterval(timeout)
  timeout = false
})
btnReset.addEventListener('click', () => {
  clearInterval(timeout)
  timeout = false
  init()
})

range[0].addEventListener('change', e => {
  localStorage.setItem('width', e.target.value)
  canvas.width = canvas.height = e.target.value
  cellsCount = canvas.width / cellSize
  init()
  range[1].value = e.target.value
})
range[1].addEventListener('change', e => {
  let val = Math.floor(e.target.value/10)*10
  e.target.value = val
  localStorage.setItem('width', val)
  canvas.width = canvas.height = val
  cellsCount = canvas.width / cellSize
  init()
  range[0].value = val
})

arrows.addEventListener('touchstart', evt => {
  evt.preventDefault()
  let e = {'code': ''}
  
  let x0 = arrows.offsetLeft
  let y0 = arrows.offsetTop

  if (x0<evt.touches[0].clientX+25 &&
      x0+49>evt.touches[0].clientX+25 &&
      y0<evt.touches[0].clientY &&
      y0+49>evt.touches[0].clientY) {
    e.code = 'KeyW'
  }
  if (x0<evt.touches[0].clientX+25 &&
      x0+49>evt.touches[0].clientX+25 &&
      y0+99<evt.touches[0].clientY &&
      y0+149>evt.touches[0].clientY) {
    e.code = 'KeyS'
  }
  if (x0<evt.touches[0].clientX+74 &&
      x0+49>evt.touches[0].clientX+74 &&
      y0+49<evt.touches[0].clientY &&
      y0+99>evt.touches[0].clientY) {
    e.code = 'KeyA'
  }
  if (x0<evt.touches[0].clientX-25 &&
      x0+49>evt.touches[0].clientX-25 &&
      y0+49<evt.touches[0].clientY &&
      y0+99>evt.touches[0].clientY) {
    e.code = 'KeyD'
  }
  keydownHandler(e)
})

window.addEventListener('touchmove', evt => {
  let e = {'code': ''}
  let x0 = arrows.offsetLeft
  let y0 = arrows.offsetTop

  if (x0<evt.touches[0].clientX+25 &&
      x0+49>evt.touches[0].clientX+25 &&
      y0<evt.touches[0].clientY &&
      y0+49>evt.touches[0].clientY) {
    e.code = 'KeyW'
  }
  if (x0<evt.touches[0].clientX+25 &&
      x0+49>evt.touches[0].clientX+25 &&
      y0+99<evt.touches[0].clientY &&
      y0+149>evt.touches[0].clientY) {
    e.code = 'KeyS'
  }
  if (x0<evt.touches[0].clientX+74 &&
      x0+49>evt.touches[0].clientX+74 &&
      y0+49<evt.touches[0].clientY &&
      y0+99>evt.touches[0].clientY) {
    e.code = 'KeyA'
  }
  if (x0<evt.touches[0].clientX-25 &&
      x0+49>evt.touches[0].clientX-25 &&
      y0+49<evt.touches[0].clientY &&
      y0+99>evt.touches[0].clientY) {
    e.code = 'KeyD'
  }
  keydownHandler(e)
})