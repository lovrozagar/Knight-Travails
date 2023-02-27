const knight = (() => {
  const squareRegistry = new Map()

  function chessSquare(x, y) {
    const xPosition = x
    const yPosition = y
    let predecessor

    const KNIGHT_MOVES = [
      [1, 2],
      [1, -2],
      [2, 1],
      [2, -1],
      [-1, 2],
      [-1, -2],
      [-2, 1],
      [-2, -1],
    ]

    function getPredecessor() {
      return predecessor
    }
    function setPredecessor(newPredecessor) {
      predecessor ||= newPredecessor
    }

    function getCoordinate() {
      return `${x}, ${y}`
    }

    function createKnightMoves() {
      return KNIGHT_MOVES.map(newSquareFrom).filter(Boolean)
    }

    function newSquareFrom([xMove, yMove]) {
      const [xNew, yNew] = [xPosition + xMove, yPosition + yMove]
      if (xNew >= 0 && xNew < 8 && yNew >= 0 && y < 8) {
        return chessSquare(xNew, yNew)
      }
      return undefined
    }

    if (squareRegistry.has(getCoordinate())) {
      return squareRegistry.get(getCoordinate())
    }

    const newSquare = {
      getCoordinate,
      getPredecessor,
      setPredecessor,
      createKnightMoves,
    }

    squareRegistry.set(getCoordinate(), newSquare)
    return newSquare
  }

  function knightTravails(start, finish) {
    squareRegistry.clear()

    const origin = chessSquare(...start)
    const target = chessSquare(...finish)

    const queue = [target]
    while (!queue.includes(origin)) {
      const currentSquare = queue.shift()

      const enqueueList = currentSquare.createKnightMoves()
      enqueueList.forEach((square) => square.setPredecessor(currentSquare))
      queue.push(...enqueueList)
    }
    const path = [origin]
    while (!path.includes(target)) {
      const nextSquare = path.at(-1).getPredecessor()
      path.push(nextSquare)
    }
    console.log(`The shortest path was ${path.length - 1} moves!`)
    console.log('The moves were: ')
    path.forEach((square) => console.log(square.getCoordinate()))

    return path
  }

  return { knightTravails }
})()

export default knight
