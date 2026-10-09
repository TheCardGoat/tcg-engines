import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vite-plus/test";

// Source-only subprocesses bound a possible synchronous engine loop independently
// of Vitest. No package build or prebuilt engine is used by these public commands.
const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true };
  return nextResolve(specifier, context);
}`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;
const fixture = fileURLToPath(new URL("./11-turn-conditioned-loop.fixture.ts", import.meta.url));

describe("11-1-1: compulsory loops with stable turn conditions", () => {
  test.each([
    ["moving", { status: "finished", finishReason: "draw", prompts: 0, pendingWork: 0 }],
    ["rest", { status: "finished", finishReason: "draw", prompts: 0, pendingWork: 0 }],
    ["restOpponent", { status: "finished", finishReason: "draw", prompts: 0, pendingWork: 0 }],
    ["false", { status: "active", finishReason: null, prompts: 0, characters: 1 }],
    [
      "finite",
      { status: "finished", finishReason: "emptyDeck", prompts: 0, deckCount: 0, pendingWork: 0 },
    ],
    ["optional", { status: "active", finishReason: null, prompts: 0, characters: 0 }],
    ["choice", { status: "active", finishReason: null, prompts: 1 }],
  ] as const)(
    "%s remains bounded without false draws",
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
        { timeout: 10_000, encoding: "utf8", maxBuffer: 1024 * 1024 },
      );
      expect(JSON.parse(output)).toMatchObject(expected);
    },
    15_000,
  );
});
