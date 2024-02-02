const shapes = [
  [0, 4, 7],
  [0, 3, 8],
  [0, 5, 9],
  [0, 3, 7],
  [0, 4, 9],
  [0, 5, 8],
  [0, 4, 7, 11],
  [0, 3, 7, 8],
  [0, 4, 5, 9],
  [0, 1, 5, 8],
  [0, 3, 7, 10],
  [0, 4, 7, 9],
  [0, 3, 5, 8],
  [0, 2, 5, 9],
];

// 88-key piano -> 21 - 108
const chords = Array(88)
  .fill(0)
  .map((_, index) => index + 21)
  .map((start) =>
    shapes.map((shape) => shape.map((interval) => start + interval))
  )
  .flat()
  .filter((chord) => !chord.some((note) => note > 108));