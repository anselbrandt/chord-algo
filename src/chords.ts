const shapes = [
  // Major
  [0, 4, 7],
  [0, 3, 8],
  [0, 5, 9],
  // Minor
  // [0, 3, 7],
  // [0, 4, 9],
  // [0, 5, 8],
  // Major 7th
  [0, 4, 7, 11],
  [0, 3, 7, 8],
  [0, 4, 5, 9],
  [0, 1, 5, 8],
  // Minor 7th
  // [0, 3, 7, 10],
  // [0, 4, 7, 9],
  // [0, 3, 5, 8],
  // [0, 2, 5, 9],
];

// 88-key piano -> 21 - 108
// 61-key range -> 36 - 96
// 37-key range -> 48 - 84
export const chords = Array(37)
  .fill(0)
  .map((_, index) => index + 48)
  .map((start) =>
    shapes.map((shape) => shape.map((interval) => start + interval))
  )
  .flat()
  .filter((chord) => !chord.some((note) => note > 84));

const chordMap = new Map();

for (const i in chords) {
  const chord = chords[i];

  const matches = [];
  for (const j in chords) {
    let noteMatches = 0;
    const chordBeingCompared = chords[j];
    const requiredMatches =
      chord.length === chordBeingCompared.length
        ? chord.length - 1
        : Math.max(chord.length - 1, chordBeingCompared.length - 1);
    for (const note of chordBeingCompared) {
      if (chord.includes(note)) noteMatches++;
    }
    if (noteMatches === requiredMatches) matches.push(chordBeingCompared);
  }
  chordMap.set(chord, matches);
}

export { chordMap };
