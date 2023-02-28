/* eslint-disable no-unused-expressions */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import knight from './knight'
import storage from './storage'
import moveSoundEffect from '../assets/audio/move.mp3'
import eatSoundEffect from '../assets/audio/eat.mp3'
import utils from './utils'

const view = (() => {
  function loadContent() {
    createBoard()
    setKnight()
    initFieldClicks()
    storage.setKnightCoords()
  }

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

  function setKnight() {
    const board = document.getElementById('board')

    const position = storage.getKnightCoords()
    const [row, col] = position
    const currentIndex = row * 8 + col
    const figure = board.children[currentIndex].children[0]

    const image = document.createElement('img')
    image.setAttribute('id', 'knight')
    image.src = 'https://www.chess.com/chess-themes/pieces/neo_wood/150/bn.png'

    figure.appendChild(image)
  }

  function addPawn(field) {
    const figure = document.createElement('img')
    figure.src = 'https://www.chess.com/chess-themes/pieces/neo_wood/150/wp.png'
    figure.setAttribute('id', 'pawn')
    figure.setAttribute('class', 'figure')
    field.children[0].appendChild(figure)
  }

  function eatPawn() {
    const pawn = document.getElementById('pawn')
    pawn.remove()
    eatSound()
  }

  function eatSound() {
    const audio = new Audio(eatSoundEffect)
    audio.play()
  }

  function moveSound(move, lastMove) {
    // DON'T PLAY ON LAST MOVE
    if (move < lastMove) {
      const audio = new Audio(moveSoundEffect)
      audio.play()
    }
  }

  function initFieldClicks() {
    const board = document.getElementById('board')
    board.childNodes.forEach((field) => {
      field.addEventListener('click', startPath)
    })
  }

  function startPath() {
    if (abortIfKnightTarget(this)) return
    toggleBoardClicks()
    moveKnight(this)
    addPawn(this)
  }

  function abortIfKnightTarget(field) {
    if (field.firstChild.hasChildNodes()) {
      return true
    }
    return false
  }

  function toggleBoardClicks() {
    const board = document.getElementById('board')
    const horse = document.getElementById('knight')

    board.classList.toggle('paused')
    horse.classList.toggle('paused')
  }

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
      // WAIT A SECOND FOR EVERY MOVE
      await utils.moveTimeout()
      moveSound(i, path.length - 1)

      // MOVE KNIGHT TO CURRENT FIELD
      const [row, col] = utils.getIntCoordsArray(path[i])
      const currentIndex = utils.coordsToIndex(row, col)
      board.children[currentIndex].firstElementChild.appendChild(knightFigure)

      lastMove = utils.getIntCoordsArray(path[i - 1])
      const currentMove = [row, col]
      paintMovePath(lastMove, currentMove)
      // IF LAST FIELD, SET KNIGHT LOCATION TO LOCAL STORAGE, PLAY EAT SOUND
      if (i === path.length - 1) {
        eatPawn()
        storage.setKnightCoords([row, col])
      }
    }

    toggleBoardClicks()
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
    moves.forEach((move) => {
      const [row, col] = move
      const moveIndex = utils.coordsToIndex(row, col)
      board.children[moveIndex].classList.add('black')
    })

    console.log(moves)
  }

  return { loadContent }
})()

export default view
