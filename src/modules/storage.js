const storage = (() => {
  function setKnightCoords(coordsArray) {
    const coords = coordsArray || getKnightCoords() || [0, 0]
    localStorage.setItem('knight', JSON.stringify(coords))
  }

  function getKnightCoords() {
    return JSON.parse(localStorage.getItem('knight'))
  }

  return { setKnightCoords, getKnightCoords }
})()

export default storage
