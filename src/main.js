import './styles/style.scss'

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

function addBoardCoordinates() {
  const boardArray = []
  let row = BOARD_ROW

  for (let i = 0; i < BOARD_ROW; i += 1) {
    boardArray[i] = []
    for (let j = 0; j < BOARD_COLUMN; j += 1) {
      boardArray[i][j] = `${row}${String.fromCharCode(j + 97)}` // BOARD COORDINATE
      console.log(boardArray[i][j])
    }
    row -= 1
  }
}

addBoardCoordinates()

function addKnight() {
  const board = document.getElementById('board')
  const figure = board.children[0].children[0]
  // figure.classList.add('knight')

  const image = document.createElement('img')
  image.src = 'https://www.chess.com/chess-themes/pieces/neo/150/bn.png'

  figure.appendChild(image)
}

createBoard()
paintBoard()
addKnight()
