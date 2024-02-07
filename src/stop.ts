import JZZ from "jzz";
import { PORT_NAMES } from "./constants";

async function main() {
  const midi = await JZZ();

  const outPorts = await midi.info().outputs;

  const [portDesc1, portDesc2, portDesc3] = PORT_NAMES.map(
    (portName) => outPorts.filter((port: any) => port.id.includes(portName))[0]
  );

  const port1 = await midi.openMidiOut(portDesc1);
  const port2 = await midi.openMidiOut(portDesc2);
  const port3 = await midi.openMidiOut(portDesc3);

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
