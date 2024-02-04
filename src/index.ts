import JZZ from "jzz";
import { chords, chordMap } from "./chords";

const playChord = async (ports: any, chord: number[]) => {
  const [port1, port2] = ports;
  for (const note of chord) {
    await port1.noteOn(1, note, 60);
  }
  const lead = chord[Math.floor(Math.random() * chord.length)];
  await port2.wait(1000);
  await port2.noteOn(1, lead, 120);
  await port2.wait(1000);
  await port2.noteOff(1, lead);

  await port1.wait(4000);
  for (const note of chord) {
    await port1.noteOff(1, note);
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

  const ports = await midi.info().outputs;
  const logicPort = ports.filter((port: any) =>
    port.id.includes("Logic Pro")
  )[0];

  const IACport1 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 1")
  )[0];

  const IACport2 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 2")
  )[0];

  const port1 = await midi.openMidiOut(IACport1);
  const port2 = await midi.openMidiOut(IACport2);

  const seed = chords[Math.floor(Math.random() * chords.length)];
  let nextChord = null;
  let prevChords: number[][] = [];
  const addToPrevChords = (chord: number[]) => {
    if (prevChords.length === 4) {
      let first, rest;
      [first, ...rest] = prevChords;
      prevChords = [...rest, chord];
    } else {
      prevChords.push(chord);
    }
  };
  try {
    while (true) {
      const currentChord: number[] = nextChord || seed;
      if (!prevChords.includes(currentChord)) {
        await playChord([port1, port2], currentChord);
        addToPrevChords(currentChord);
      }
      nextChord = getNextChord(currentChord);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await port1.allNotesOff(1);
    await port2.allNotesOff(1);
    await port1.close();
    await port2.close();
  }
}

main();
