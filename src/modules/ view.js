/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import knight from './knight'
import storage from './storage'
import utils from './utils'
import audio from './audio'

const view = (() => {
  function loadContent() {
    // CREATE BOARD AND BLACK/WHITE FIELDS
    createBoard()
    markBoardFields()
    // INITIALIZE GUIDE IF FIRST LOAD / NO LOCAL STORAGE
    initGuide()
    // SET KNIGHT FIGURE AND POSITION
    storage.setKnightCoords()
    setKnight()
    // INIT FIELDS, BUTTONS AND APP HEIGHT
    initFieldClicks()
    initButtons()
    initAppHeight()
  }

  // MOBILE APP HEIGHT 100 VH FIX
  function initAppHeight() {
    const appHeight = () => {
      const doc = document.documentElement
      doc.style.setProperty('--app-height', `${window.innerHeight}px`)
    }
    window.addEventListener('resize', appHeight)
    appHeight()
  }

  // BOARD

  const BOARD_ROW = 8
  const BOARD_COLUMN = 8

  function createBoard() {
    const board = document.getElementById('board')

    for (let i = 0; i < BOARD_ROW; i += 1) {
      for (let j = 0; j < BOARD_COLUMN; j += 1) {
        const figure = document.createElement('div')
        figure.classList.add('figure')

        const field = document.createElement('div')
        field.classList.add('field')
        field.appendChild(figure)

        board.appendChild(field)
      }
    }
  }

  function markBoardFields() {
    const board = document.getElementById('board')

    let fieldColor = 'dark'
    for (let i = 0; i < BOARD_ROW; i += 1) {
      for (let j = 0; j < BOARD_COLUMN; j += 1) {
        if (fieldColor === 'light') {
          board.children[i * BOARD_ROW + j].classList.add('light')
          fieldColor = 'dark'
        } else {
          board.children[i * BOARD_COLUMN + j].classList.add('dark')
          fieldColor = 'light'
        }
      }
      // eslint-disable-next-line no-unused-expressions
      fieldColor === 'dark' ? (fieldColor = 'light') : (fieldColor = 'dark')
    }
  }

  // FIGURES

  function setKnight() {
    const board = document.getElementById('board')

    const position = storage.getKnightCoords()
    const [row, col] = position
    const currentIndex = row * 8 + col
    const figure = board.children[currentIndex].children[0]

    const image = document.createElement('img')
    image.setAttribute('id', 'knight')
    image.setAttribute('class', 'knight')
    image.src = 'https://www.chess.com/chess-themes/pieces/neo_wood/150/bn.png'

    figure.appendChild(image)
  }

  function addPawn(field) {
    audio.pawnSet()
    const figure = document.createElement('img')
    figure.src = 'https://www.chess.com/chess-themes/pieces/neo_wood/150/wp.png'
    figure.setAttribute('id', 'pawn')
    figure.setAttribute('class', 'pawn')
    field.children[0].appendChild(figure)
  }

  function eatPawn() {
    const pawn = document.getElementById('pawn')
    audio.eat()
    pawn.remove()
  }

  // FIELDS

  function initFieldClicks() {
    const board = document.getElementById('board')
    board.childNodes.forEach((field) => {
      field.addEventListener('click', startPath)
    })
  }

  function startPath(event) {
    const { target } = event

    if (abortIfKnightTarget(target)) return
    clearNumberedMoves()
    toggleClicks()
    moveKnight(this)
    addPawn(this)
  }

  function abortIfKnightTarget(field) {
    const knightFigure = document.getElementById('knight')
    if (field.contains(knightFigure)) {
      return true
    }
    return false
  }

  function toggleClicks() {
    const board = document.getElementById('board')
    const horse = document.getElementById('knight')
    const options = document.getElementById('options')

    board.classList.toggle('paused')
    horse.classList.toggle('paused')
    options.classList.toggle('paused')
  }

  // PATH

  let pathNumber = 0
  let numbered = []

  async function moveKnight(field) {
    const knightFigure = document.getElementById('knight')
    const board = document.getElementById('board')
    const fieldIndex = [...field.parentNode.children].indexOf(field)
    const rowTarget = parseInt(fieldIndex / BOARD_ROW, 10)
    const columnTarget = fieldIndex % BOARD_COLUMN

    let lastMove

    let knightCoords = storage.getKnightCoords()
    if (typeof knightCoords[0] === 'string') {
      knightCoords = utils.getIntCoordsArray(knightCoords)
    }

    const path = knight.knightTravails(knightCoords, [rowTarget, columnTarget])

    for (let i = 1; i < path.length; i += 1) {
      // DELAY BEFORE MOVE
      await utils.moveTimeout()
      audio.move(i, path.length - 1)

      // MOVE KNIGHT TO CURRENT FIELD
      const [row, col] = utils.getIntCoordsArray(path[i])
      const currentIndex = utils.coordsToIndex(row, col)
      board.children[currentIndex].children[0].appendChild(knightFigure)

      // LAST INDEX
      if (i === path.length - 1) {
        const numberEl = document.createElement('div')
        numberEl.textContent = pathNumber + 1
        numberEl.setAttribute('class', 'numbered')
        numbered.push(numberEl)
        board.children[currentIndex].children[0].appendChild(numberEl)
      }

      lastMove = utils.getIntCoordsArray(path[i - 1])
      const currentMove = [row, col]
      paintMovePath(lastMove, currentMove)
      // IF LAST FIELD, SET KNIGHT LOCATION TO LOCAL STORAGE, PLAY EAT SOUND
      if (i === path.length - 1) {
        eatPawn()
        storage.setKnightCoords([row, col])
      }
    }

    toggleClicks()
  }

  function paintMovePath(lastMove, currentMove) {
    const moves = [lastMove]
    const [lastRow, lastCol] = lastMove
    const [currentRow, currentCol] = currentMove

    // GET ALL CROSSED FIELDS IN MOVES ARRAY
    if (Math.abs(lastRow - currentRow) > Math.abs(lastCol - currentCol)) {
      const r = lastRow < currentRow ? -1 : 1
      moves.push([lastRow + (currentRow - lastRow + r), lastCol])
      moves.push([currentRow, lastCol])
      moves.push([currentRow, currentCol])
    } else {
      const c = lastCol < currentCol ? -1 : 1
      moves.push([lastRow, lastCol + (currentCol - lastCol + c)])
      moves.push([lastRow, currentCol])
      moves.push([currentRow, currentCol])
    }

    const board = document.getElementById('board')
    moves.forEach((move, index) => {
      const [row, col] = move
      const moveIndex = utils.coordsToIndex(row, col)
      if (index === 0) {
        const numberEl = document.createElement('div')
        numberEl.textContent = pathNumber
        numberEl.setAttribute('class', 'numbered')

        board.children[moveIndex].children[0].appendChild(numberEl)

        numbered.push(numberEl)
        pathNumber += 1
      }
      if (board.children[moveIndex].classList.contains('dark'))
        board.children[moveIndex].classList.add('dark-wood')
      else board.children[moveIndex].classList.add('light-wood')
    })
  }

  function clearNumberedMoves() {
    numbered.forEach((numberedNode) => {
      numberedNode.textContent = ''
      numberedNode.classList.remove('numbered')
      pathNumber = 0
    })
    numbered = []
  }

  // BUTTONS

  function initButtons() {
    const clearButton = document.getElementById('clear-board')
    const resetButton = document.getElementById('reset-knight')

    clearButton.addEventListener('click', clearBoard)
    resetButton.addEventListener('click', resetKnight)
  }

  function clearBoard() {
    const lightWood = document.querySelectorAll('.light-wood')
    const darkWood = document.querySelectorAll('.dark-wood')

    lightWood.forEach((field) => field.classList.remove('light-wood'))
    darkWood.forEach((field) => field.classList.remove('dark-wood'))
    removeNumbers()
    audio.wipeBoard()
  }

  function resetKnight() {
    const board = document.getElementById('board')
    const knightFigure = document.getElementById('knight')

    if (board.children[0].children[0].contains(knightFigure)) return
    board.children[0].children[0].appendChild(knightFigure)
    storage.setKnightCoords([0, 0])
    removeNumbers()
    audio.move()
  }

  function removeNumbers() {
    const numbers = document.querySelectorAll('.numbered')
    numbers.forEach((field) => field.remove())
  }

  // GUIDE

  function initGuide() {
    showGuideIfFirstLoad()
    const board = document.getElementById('board')
    board.addEventListener('click', hideGuide, { once: true })
  }

  function showGuideIfFirstLoad() {
    if (!storage.getKnightCoords()) {
      const board = document.getElementById('board')
      board.classList.add('guide')
    }
  }

  function hideGuide() {
    const board = document.getElementById('board')
    if (board.classList.contains('guide')) {
      board.classList.remove('guide')
      audio.start()
    }
  }

  return { loadContent }
})()

export default view

// TODO: hover spots
