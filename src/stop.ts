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

  const IACport3 = ports.filter((port: any) =>
    port.id.includes("IAC Driver Bus 3")
  )[0];

  const port1 = await midi.openMidiOut(IACport1);
  const port2 = await midi.openMidiOut(IACport2);
  const port3 = await midi.openMidiOut(IACport3);

  try {
    await port1.allNotesOff(1);
    await port2.allNotesOff(1);
    await port3.allNotesOff(1);
  } catch (error) {
    console.log(error);
  } finally {
    await port1.close();
    await port2.close();
    await port3.close();
  }
}

main();
