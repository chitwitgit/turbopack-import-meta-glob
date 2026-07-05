# Turbopack `import.meta.glob` parent traversal repro

Minimal reproduction for a Next.js 16.3 + Turbopack bug: a parent-relative
`import.meta.glob()` in both a Server Component page and an App Route is
transformed, but it matches **zero files** even though a local glob in the
same module resolves correctly.

Targets `next@16.3.0-canary.78`.

## Setup

```bash
npm install
```

## Reproduce

```bash
npm run build
npm run start
# in another terminal:
curl http://localhost:3000/
curl http://localhost:3000/api/hello
```

Or in dev:

```bash
npm run dev
curl http://localhost:3000/api/hello
```

## Expected

`import.meta.glob` is officially supported by Turbopack in Next.js 16.3, and
its semantics are Vite-compatible.

The Server Component page should resolve:

- `./page-modules/*.js` -> `["page-local-module"]`
- `../lib/modules/*.js` -> `["example-module"]`

The App Route should resolve:

- `./modules/*.js` -> `["local-module"]`
- `../../../lib/modules/*.js` -> `["example-module"]`

The route should return:

```json
{
  "localValues": ["local-module"],
  "parentValues": ["example-module"]
}
```

## Actual

Build and dev succeed, and the local control glob works in both places, but
the parent-relative glob returns an empty map:

```json
{
  "localValues": ["local-module"],
  "parentValues": []
}
```

The page likewise renders:

- `page-local-values`: `["page-local-module"]`
- `page-parent-values`: `[]`

So this is specifically the parent-directory traversal case in server-side
modules.

## Minimal shape

1. A Server Component page (`src/app/page.js`) and an App Route
   (`src/app/api/hello/route.js`) each use a local glob and a parent-relative
   glob.
2. The local glob works.
3. The parent-relative glob (`../lib/modules/*.js` in the page,
   `../../../lib/modules/*.js` in the route) should work, but returns no
   matches.

## Notes for upstream

- Next.js **16.3 canary** (`16.3.0-canary.78` at time of writing).
- `import.meta.glob` is [officially supported in 16.3](https://nextjs.org/blog/next-16-3-turbopack) (Turbopack only).
- Vite-compatible semantics allow importer-relative parent traversal.
