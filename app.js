const btnPause = document.querySelector('.pause')
const btnReset = document.querySelector('.reset')
const arrows = document.querySelector('.arrows')
const range = document.querySelectorAll('.size')
const canvas = document.querySelector('#canvas')
const best = document.querySelector('.stats span')
const c = canvas.getContext('2d')
canvas.width = canvas.height = localStorage.getItem('width') || 500

range[1].value = range[0].value = localStorage.getItem('width') || 500

class Snake  {
  constructor(canvas, c, best, btnPause, btnReset, range, arrows) {
    this.canvas = canvas
    this.c = c
    this.score = 0
    this.best = best
    this.arrows = arrows
    best.innerHTML = localStorage.getItem('bestSnake') || 0
    this.cellSize = localStorage.getItem('cellSize') || 10
    this.cellsCount = this.canvas.width / this.cellSize
    this.gameData = []
    this.directions = []
    this.food
    this.btnPause = btnPause
    this.btnReset = btnReset
    this.range = range
    this.timeout = false
  }
  
  randomPos() {
    let rand = - 0.5 + Math.random() * this.cellsCount
    return Math.round(rand)
  }
  randFoodPos() {
    this.food = {
      'x': this.randomPos(),
      'y': this.randomPos(),
      'state': 0,
    }
    this.gameData.forEach(el => {
      if (el.x === this.food.x && el.y === this.food.y) this.randFoodPos()
    })
  }
  makeArray() {
    this.gameData = []
    for (let i=0; i < 5; i++) {
      this.gameData.push({'x': Math.round(this.cellsCount/2), 'y': Math.round(this.cellsCount/2), state: 1})
    }
  }
  renderCell(x, y, state, id) {
    state? this.c.fillStyle = 
      (id === 0 ? '#e74c3c' : 
        (id%2 === 0 ? '#f39c12' : '#e67e22')): this.c.fillStyle = '#64dd17'
    this.c.beginPath()
    this.c.rect(x*this.cellSize, y*this.cellSize, this.cellSize, this.cellSize)
    this.c.fill()
    this.c.closePath()
  }
  renderCells() {
    this.c.fillStyle = '#3d3d3e'
    this.c.beginPath()
    this.c.rect(0, 0, this.canvas.width, this.canvas.width)
    this.c.fill()
    this.c.closePath()
    this.c.fillStyle = '#242424'
    this.c.font = '90px "Roboto Mono"'
    this.c.textAlign = 'center';
    this.c.fillText(this.score, this.canvas.width/2, this.canvas.width/2+20)
    this.renderCell(this.food.x, this.food.y, 0)
    this.gameData.forEach((el, id) => {
      this.renderCell(el.x, el.y, el.state, id)
    })
  }
  init() {
    this.makeArray(this.cellsCount, this.cellsCount)
    this.randFoodPos()
  
    this.c.fillStyle = '#2e2d2e'
    this.c.beginPath()
    this.c.rect(0,0,this.c.width,this.c.height)
    this.c.closePath()
    this.c.fill()
  
    this.renderCells()
    this.setEvents()
  }
  selfEating(id) {
    this.gameData = this.gameData.slice(0, (id>5 ? id: 5 ))
  }
  snakeMoving = () => {
    let d = this.directions[0]
    let eatId;
    const oldData = [...this.gameData]
    
    if (d === 'left') { // left
      let next = oldData[0].x-1 >= 0 ? oldData[0].x-1 : this.cellsCount-1
      oldData.forEach((el, id) => {
        if (el.x === next && 
            el.y === oldData[0].y) {
        eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': next,
        'y': this.gameData[0].y,
        'state': 1
      })
      if (this.food.x === next && 
          this.food.y === this.gameData[0].y) {
        this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    if (d === 'up') { // up
      const oldData = [...this.gameData]
      let next = oldData[0].y-1 >= 0 ? oldData[0].y-1 : this.cellsCount-1
      oldData.forEach((el, id) => {
        if (el.x === oldData[0].x && 
            el.y === next) {
        eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': this.gameData[0].x,
        'y': next,
        'state': 1
      })
      if (this.food.x === this.gameData[0].x && 
          this.food.y === next) {
        this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    if (d === 'down') { // down
      const oldData = [...this.gameData]
      let next = oldData[0].y+1 < this.cellsCount ? oldData[0].y+1 : 0
      oldData.forEach((el, id) => {
        if (el.x === oldData[0].x && 
            el.y === next) {
          eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': this.gameData[0].x,
        'y': next,
        'state': 1
      })
      if (this.food.x === this.gameData[0].x && 
          this.food.y === next) {
            this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    if (d === 'right') { // right
      const oldData = [...this.gameData]
      let next = oldData[0].x+1 < this.cellsCount ? oldData[0].x+1 : 0
      oldData.forEach((el, id) => {
        if (el.x === next && 
            el.y === oldData[0].y) {
          eatId = id || ''
        }
      })
      if (eatId) this.selfEating(eatId)
      this.gameData.unshift({
        'x': next,
        'y': this.gameData[0].y,
        'state': 1
      })
      if (this.food.x === next && 
          this.food.y === this.gameData[0].y) {
        this.randFoodPos()
        return
      } else {
        this.gameData.pop()
      }
    }
    this.renderCells()
    this.directions.length >1? this.directions.shift(): ''
  }
  gameRun() {
    this.snakeMoving()
    this.score = this.gameData.length-5
    if (+this.best.innerHTML < this.score) {
      this.best.innerHTML = this.score
      localStorage.setItem('bestSnake', this.best.innerHTML)
    }
    clearInterval(this.timeout)
    this.timeout = setInterval(() =>this.gameRun(), 1000/(this.score+5))
  }
  keydownHandler = (e) =>  {
    if (e.repeat) return
    if (e.code === 'KeyW' && 
        this.directions[this.directions.length-1] !== 'down' &&
        this.directions[this.directions.length-1] !== 'up') this.directions.push('up')
    if (e.code === 'KeyA' && 
        this.directions[this.directions.length-1] !== 'right' &&
        this.directions[this.directions.length-1] !== 'left') this.directions.push('left')
    if (e.code === 'KeyD' && 
        this.directions[this.directions.length-1] !== 'left' &&
        this.directions[this.directions.length-1] !== 'right') this.directions.push('right')
    if (e.code === 'KeyS' && 
        this.directions[this.directions.length-1] !== 'up' &&
        this.directions[this.directions.length-1] !== 'down') this.directions.push('down')
  
    if (!this.timeout) {
      if ((e.code === 'KeyW') ||
          (e.code === 'KeyA') ||
          (e.code === 'KeyD') ||
          (e.code === 'KeyS')) {
        this.timeout = setInterval(() =>this.gameRun(), 1000/(this.score+5))
      }
    }
  }
  
  setEvents() {
    document.addEventListener('keydown',this.keydownHandler)
  
    this.btnPause.addEventListener('click', () => {
      clearInterval(this.timeout)
      this.timeout = false
    })
    this.btnReset.addEventListener('click', () => {
      clearInterval(this.timeout)
      this.timeout = false
      this.init()
    })
    
    this.range[0].addEventListener('change', e => {
      localStorage.setItem('width', e.target.value)
      this.canvas.width = this.canvas.height = e.target.value
      this.cellsCount = this.canvas.width / this.cellSize
      this.init()
      this.range[1].value = e.target.value
    })
    this.range[1].addEventListener('change', e => {
      let val = Math.floor(e.target.value/10)*10
      e.target.value = val
      localStorage.setItem('width', val)
      this.canvas.width = this.canvas.height = val
      this.cellsCount = this.canvas.width / this.cellSize
      this.init()
      this.range[0].value = val
    })
    this.arrows.addEventListener('touchstart', evt => {
      evt.preventDefault()
      let e = {'code': ''}
      
      let x0 = this.arrows.offsetLeft
      let y0 = this.arrows.offsetTop
    
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
      this.keydownHandler(e)
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
      this.keydownHandler(e)
    })
  }
}

let game = new Snake(canvas, c, best, btnPause, btnReset, range, arrows)

game.init()