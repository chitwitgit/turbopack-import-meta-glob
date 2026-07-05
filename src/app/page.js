const localModules = import.meta.glob("./page-modules/*.js");
const parentModules = import.meta.glob("../lib/modules/*.js");

async function loadValues(modules) {
  const values = [];

  for (const loader of Object.values(modules)) {
    const mod = await loader();
    values.push(mod.value);
  }

  return values.sort();
}

export default async function HomePage() {
  const localValues = await loadValues(localModules);
  const parentValues = await loadValues(parentModules);

  return (
    <main>
      <h1>Turbopack import.meta.glob parent traversal repro</h1>
      <p>
        This Server Component and <code>/api/hello</code> both resolve a local
        glob but fail to resolve a parent-relative glob.
      </p>
      <div id="page-local-values">{JSON.stringify(localValues)}</div>
      <div id="page-parent-values">{JSON.stringify(parentValues)}</div>
    </main>
  );
}
