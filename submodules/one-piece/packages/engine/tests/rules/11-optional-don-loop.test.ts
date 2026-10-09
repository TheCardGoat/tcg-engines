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
const fixture = fileURLToPath(new URL("./11-optional-don-loop.fixture.ts", import.meta.url));

test.each([
  ["mixed", { cleared: true }],
  ...["south-zero", "south-one", "south-max", "north-zero", "north-one", "north-max"].map(
    (mode) =>
      [
        mode,
        {
          status: "active",
          prompts: 0,
          donDeck: 10,
          active: 0,
          attached: 0,
          restarted: true,
          rejected: 4,
          stoppedBy: mode.startsWith("north") ? "north" : "south",
        },
      ] as const,
  ),
  ["non-turn", { status: "active", prompts: 0, rejected: 4, stoppedBy: "south" }],
  ["finite", { status: "finished", finishReason: "emptyDeck", prompts: 0 }],
  ["choice", { status: "active", prompts: 1, rejected: 0 }],
  ["up-to", { status: "active", prompts: 1, rejected: 0 }],
  ...["ledger", "restriction", "replacement"].map(
    (mode) => [mode, { status: "active", prompts: 0, rejected: 0 }] as const,
  ),
] as const)(
  "optional DON %s",
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
