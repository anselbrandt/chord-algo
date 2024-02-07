import JZZ from "jzz";

async function main() {
  try {
    const midi = await JZZ();
    const outPorts = await midi.info().outputs;
    console.log(outPorts);
  } catch (error) {
    console.log(error);
  }
}

main();
