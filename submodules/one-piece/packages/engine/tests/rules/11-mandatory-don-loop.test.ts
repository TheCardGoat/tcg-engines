import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";

// Source-only subprocesses bound a possible synchronous engine loop independently
// of Vitest. No package build or prebuilt engine is used by these public commands.
const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true };
  return nextResolve(specifier, context);
}`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;
const fixture = fileURLToPath(new URL("./11-mandatory-don-loop.fixture.ts", import.meta.url));

test.each([
  ["south", { status: "finished", finishReason: "draw", prompts: 0, don: 10 }],
  ["north", { status: "finished", finishReason: "draw", prompts: 0, don: 10 }],
  ["simple", { status: "finished", finishReason: "draw", prompts: 0, don: 10 }],
  ["zero", { status: "active", finishReason: null, prompts: 0, don: 10 }],
  ["once", { status: "active", finishReason: null, prompts: 0, don: 10 }],
  ["optional", { status: "active", finishReason: null, prompts: 1, don: 10 }],
  ["choice", { status: "active", finishReason: null, prompts: 1, don: 10 }],
  ["finite", { status: "finished", finishReason: "emptyDeck", prompts: 0, deck: 0, don: 10 }],
  ["ledger", { admitted: false }],
  ["restriction", { admitted: false }],
] as const)(
  "11-1 mandatory DON %s",
  (mode, expected) => {
    const output = execFileSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--disable-warning=ExperimentalWarning",
        "--import",
        `data:text/javascript,${encodeURIComponent(register)}`,
        fixture,
        mode,
      ],
      { timeout: 8000, encoding: "utf8", maxBuffer: 1024 * 1024 },
    );
    expect(JSON.parse(output)).toMatchObject(expected);
  },
  12000,
);
