const btnPlay = document.querySelector('.play')
const btnPause = document.querySelector('.pause')
const btnReset = document.querySelector('.reset')
const arrows = document.querySelector('.arrows')
const range = document.querySelectorAll('.size')
const cellRange = document.querySelectorAll('.cellSize')
const canvas = document.querySelector('#canvas')
const c = canvas.getContext('2d')
canvas.width = canvas.height = localStorage.getItem('width') || 500

range[1].value = range[0].value = localStorage.getItem('width') || 500
cellRange[1].value = cellRange[0].value = localStorage.getItem('cellSize') || 10

c.fillStyle = '#eeeeee'
c.strokeStyle = '#000'
c.lineWidth = '1'

let cellSize = localStorage.getItem('cellSize') || 10
let cellsCount = canvas.width / cellSize
let gameData = []
let direction = ''
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
  gameData = gameData.slice(0, id)
}

const snakeMoving = () => {
  let d = direction
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
}

const gameRun = () => {
  snakeMoving()
}

let timeout = false
const keydownHandler = (e) => {
  if (e.repeat) return
  if (e.code === 'KeyW' && 
      direction !== 'down' &&
      direction !== 'up') direction = 'up'
  if (e.code === 'KeyA' && 
      direction !== 'right' &&
      direction !== 'left') direction = 'left'
  if (e.code === 'KeyD' && 
      direction !== 'left' &&
      direction !== 'right') direction = 'right'
  if (e.code === 'KeyS' && 
      direction !== 'up' &&
      direction !== 'down') direction = 'down'

  if (!timeout) {
    if ((e.code === 'KeyW') ||
        (e.code === 'KeyA') ||
        (e.code === 'KeyD') ||
        (e.code === 'KeyS')) {
      timeout = setInterval(() =>gameRun(), 50)
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
  localStorage.setItem('width', e.target.value)
  canvas.width = canvas.height = e.target.value
  cellsCount = canvas.width / cellSize
  init()
  range[0].value = e.target.value
})

cellRange[0].addEventListener('change', e => {
  localStorage.setItem('cellSize', e.target.value)
  cellSize = e.target.value
  cellsCount = canvas.width / cellSize
  init()
  cellRange[1].value = e.target.value
})
cellRange[1].addEventListener('change', e => {
  localStorage.setItem('cellSize', e.target.value)
  cellSize = e.target.value
  cellsCount = canvas.width / cellSize
  init()
  cellRange[0].value = e.target.value
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