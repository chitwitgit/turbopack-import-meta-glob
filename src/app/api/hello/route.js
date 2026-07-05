const localModules = import.meta.glob("./modules/*.js");
const parentModules = import.meta.glob("../../../lib/modules/*.js");

async function loadValues(modules) {
  const values = [];

  for (const loader of Object.values(modules)) {
    const mod = await loader();
    values.push(mod.value);
  }

  return values.sort();
}

export async function GET() {
  return Response.json({
    localValues: await loadValues(localModules),
    parentValues: await loadValues(parentModules),
  });
}
