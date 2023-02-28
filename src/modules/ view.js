/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import knight from './knight'
import storage from './storage'
import moveSoundEffect from '../assets/audio/move.mp3'
import eatSoundEffect from '../assets/audio/eat.mp3'

const view = (() => {
  function loadContent() {
    createBoard()
    paintBoard()
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

  function paintBoard() {
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

  function setKnight() {
    const board = document.getElementById('board')

    const position = storage.getKnightCoords()
    console.log(position)
    let [x, y] = position
    x = parseInt(x, 10) * 8
    y = parseInt(y, 10)
    console.log(x, y)
    const figure = board.children[x + y].children[0]

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

    console.log(rowTarget)
    console.log(columnTarget)

    let knightCoords = storage.getKnightCoords()
    if (typeof knightCoords[0] === 'string') {
      knightCoords = knightCoords.split(',')
      knightCoords = [knightCoords.map((coord) => parseInt(coord, 10))]
    }

    console.log(knightCoords)

    const path = knight.knightTravails(knightCoords, [rowTarget, columnTarget])
    path.shift()
    console.log('path', path)
    for (let i = 0; i < path.length; i += 1) {
      await moveTimeout()
      moveSound(i, path.length - 1)
      let [x, , , y] = path[i]
      x = parseInt(x, 10) * 8
      y = parseInt(y, 10)
      console.log(x + y)
      board.children[x + y].children[0].appendChild(knightFigure)

      if (i === path.length - 1) {
        eatPawn()
        let [a, , , b] = path[i]
        storage.setKnightCoords([parseInt(a, 10), parseInt(b, 10)])
      }
    }

    toggleBoardClicks()
  }

  function moveTimeout() {
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return { loadContent }
})()

export default view
