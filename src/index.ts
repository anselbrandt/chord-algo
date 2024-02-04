import JZZ from "jzz";
import { chords, chordMap } from "./chords";

const playChord = async (port: any, chord: number[]) => {
  for (const note of chord) {
    await port.noteOn(0, note, 90);
  }
  await port.wait(2000);
  for (const note of chord) {
    await port.noteOff(0, note);
  }
};

const getNextChord = (currentChord: number[]): number[] => {
  const options = chordMap.get(currentChord);
  const chord = options[Math.floor(Math.random() * options.length)];
  if (chord !== currentChord) return chord;
  return getNextChord(currentChord);
};

async function main() {
  const midi = await JZZ();

  // const ports = await midi.info().outputs;
  // const fluidPort = ports.filter((port: any) =>
  //   port.id.includes("FluidSynth")
  // )[0];
  // const logicPort = ports.filter((port: any) =>
  //   port.id.includes("Logic Pro")
  // )[0];

  const port = await midi.openMidiOut();
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
