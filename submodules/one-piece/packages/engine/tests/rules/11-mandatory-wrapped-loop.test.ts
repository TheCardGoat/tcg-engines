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
const fixture = fileURLToPath(new URL("./11-mandatory-wrapped-loop.fixture.ts", import.meta.url));

test.each([
  ["rest-grouped-finite", { status: "finished", finishReason: "emptyDeck", deck: 0 }],
  ["rest-grouped-choice", { status: "active", finishReason: null }],
  ["rest-grouped", { status: "finished", finishReason: "draw" }],
  ["rest-sequence", { status: "finished", finishReason: "draw" }],
  ["rest-false", { status: "finished", finishReason: "draw" }],
  ["sequence", { status: "finished", finishReason: "draw" }],
  ["true", { status: "finished", finishReason: "draw" }],
  ["false", { status: "finished", finishReason: "draw" }],
  ["nested", { status: "finished", finishReason: "draw" }],
  ["gated", { status: "active", finishReason: null }],
  ["finite", { status: "finished", finishReason: "emptyDeck", deck: 0 }],
  ["random", { status: "finished", finishReason: "emptyDeck", deck: 0 }],
  ["optional", { status: "active", finishReason: null }],
] as const)(
  "11-1 wrapped %s",
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
    expect(JSON.parse(output)).toMatchObject({ ...expected, prompts: 0 });
  },
  12000,
);
