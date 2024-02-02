import JZZ from "jzz";
import { chords, chordMap } from "./chords";

const playChord = async (port: any, chord: number[]) => {
  for (const note of chord) {
    await port.noteOn(0, note, 127);
  }
  await port.wait(4000);
  for (const note of chord) {
    await port.noteOff(0, note);
  }
};

const getNextChord = (currentChord: number[]) => {
  const options = chordMap.get(currentChord);
  const chord = options[Math.floor(Math.random() * options.length)];
  return chord;
};

async function main() {
  const midi = await JZZ();
  const port = await midi.openMidiOut("Logic Pro Virtual In");
  const seed = chords[Math.floor(Math.random() * chords.length)];
  let nextChord = null;
  try {
    while (true) {
      const currentChord: number[] = nextChord || seed;
      await playChord(port, currentChord);
      nextChord = getNextChord(currentChord);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await port.close();
  }
}

main();
