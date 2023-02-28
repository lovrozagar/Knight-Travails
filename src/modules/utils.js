const utils = (() => {
  function getIntCoordsArray(string) {
    const [x, , , y] = string
    return [parseInt(x, 10), parseInt(y, 10)]
  }

  function coordsToIndex(row, col) {
    return row * 8 + col
  }

  function moveTimeout() {
    return new Promise((resolve) => setTimeout(resolve, 800))
  }

  return { moveTimeout, getIntCoordsArray, coordsToIndex }
})()

export default utils
