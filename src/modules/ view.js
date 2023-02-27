import knight from './knight'

const view = (() => {
  function loadContent() {
    createBoard()
    paintBoard()
    addKnight()
    initFieldClicks()
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

  function addKnight() {
    const board = document.getElementById('board')
    const figure = board.children[0].children[0]

    const image = document.createElement('img')
    image.setAttribute('id', 'knight')
    image.src = 'https://www.chess.com/chess-themes/pieces/neo/150/bn.png'

    figure.appendChild(image)
  }

  function initFieldClicks() {
    const board = document.getElementById('board')
    board.childNodes.forEach((field) => {
      field.addEventListener('click', moveKnight)
    })
  }

  async function moveKnight() {
    const knightFigure = document.getElementById('knight')
    const board = document.getElementById('board')
    const fieldIndex = [...this.parentNode.children].indexOf(this)
    const rowTarget = parseInt(fieldIndex / BOARD_ROW, 10)
    const columnTarget = fieldIndex % BOARD_COLUMN
    console.log(rowTarget)
    console.log(columnTarget)
    const path = knight.knightTravails([0, 0], [rowTarget, columnTarget])
    path.shift()
    console.log('path', path)
    for (let i = 0; i < path.length; i += 1) {
      let [x, , , y] = path[i]
      x = parseInt(x, 10) * 8
      y = parseInt(y, 10)
      console.log(x + y)
      board.children[x + y].children[0].appendChild(knightFigure)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  return { loadContent }
})()

export default view
