import JZZ from "jzz";
import { chords, chordMap } from "./chords";

const playChord = async (port: any, chord: number[]) => {
  for (const note of chord) {
    await port.noteOn(0, note, 90);
  }
  await port.wait(6000);
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
  const ports = await midi.info().outputs;
  const fluidPort = ports.filter((port: any) =>
    port.id.includes("Fluidsynth")
  )[0];
  //   [
  //     {
  //       id: "Logic Pro Virtual In",
  //       name: "Logic Pro Virtual In",
  //       manufacturer: "Unknown",
  //       version: "0.0",
  //       engine: "node",
  //     },
  //   ]
  //   const port = await midi.openMidiOut("Logic Pro Virtual In");
  const port = await midi.openMidiOut(fluidPort);
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
