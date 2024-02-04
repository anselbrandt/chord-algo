import JZZ from "jzz";

async function main() {
  const midi = await JZZ();

  const ports = await midi.info().outputs;

  const IACport1 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 1")
  )[0];

  const IACport2 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 2")
  )[0];

  const port1 = await midi.openMidiOut(IACport1);
  const port2 = await midi.openMidiOut(IACport2);

  try {
    await port1.allNotesOff(1);
    await port2.allNotesOff(1);
  } catch (error) {
    console.log(error);
  } finally {
    await port1.close();
    await port2.close();
  }
}

main();
