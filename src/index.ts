import JZZ from "jzz";
import { chords, chordMap } from "./chords";

const MAX_DURATION = 8000;
const LEAD_DELAY = 4000;
const BASS_DELAY = 2000;

let prevBass: number | null = null;

const playChord = async (port: any, chord: number[]) => {
  for (const note of chord) {
    await port.noteOn(1, note, 60);
  }
  await port.wait(MAX_DURATION);
  for (const note of chord) {
    await port.noteOff(1, note);
  }
};

const playLead = async (port: any, chord: number[]) => {
  const lead = chord[Math.floor(Math.random() * chord.length)];
  await port.wait(LEAD_DELAY);
  await port.noteOn(1, lead, 60);
  await port.wait(MAX_DURATION - LEAD_DELAY);
  await port.noteOff(1, lead);
};

const playBass = async (port: any, chord: number[]) => {
  let bass = chord[0] - 12;
  if (bass === prevBass) bass = bass - 12;
  prevBass = bass;
  await port.wait(BASS_DELAY);
  await port.noteOn(1, bass, 60);
  await port.wait(MAX_DURATION - BASS_DELAY);
  await port.noteOff(1, bass);
};

const playAll = async (ports: any, chord: number[]) => {
  const [port1, port2, port3] = ports;
  const playedChord = playChord(port1, chord);
  const playedLead = playLead(port2, chord);
  const playedBass = playBass(port3, chord);
  await Promise.all([await playedChord, await playedLead, await playedBass]);
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

  const IACport1 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 1")
  )[0];

  const IACport2 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 2")
  )[0];

  const IACport3 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 3")
  )[0];

  const port1 = await midi.openMidiOut(IACport1);
  const port2 = await midi.openMidiOut(IACport2);
  const port3 = await midi.openMidiOut(IACport3);

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
        await playAll([port1, port2, port3], currentChord);
        addToPrevChords(currentChord);
      }
      nextChord = getNextChord(currentChord);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await port1.allNotesOff(1);
    await port2.allNotesOff(1);
    await port3.allNotesOff(1);
    await port1.close();
    await port2.close();
    await port3.close();
  }
}

main();
