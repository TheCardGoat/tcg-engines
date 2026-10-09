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
const fixture = fileURLToPath(new URL("./11-optional-multi-moving.fixture.ts", import.meta.url));

test.each([
  ["nested", { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true }],
  ["nestedZero", { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true }],
  ["nestedMax", { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true }],
  ["southLower", { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true }],
  ["northLower", { stoppedBy: "north", restartedAfterChange: true, representativeComplete: true }],
  ["tie", { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true }],
  ["max", { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true }],
  [
    "northTurnSouthLower",
    { stoppedBy: "south", restartedAfterChange: true, representativeComplete: true },
  ],
  [
    "northTurnNorthLower",
    { stoppedBy: "north", restartedAfterChange: true, representativeComplete: true },
  ],
  // Equal counts use the existing turn-player stopping policy, not a claimed rule priority.
  [
    "northTurnTie",
    { stoppedBy: "north", restartedAfterChange: true, representativeComplete: true },
  ],
  ["nestedOuterNo", { deck: 3 }],
  ["nestedInnerNo", { deck: 3 }],
  ["nestedFinite", { deck: 1 }],
  ["nestedRandom", { deck: 1 }],
] as const)(
  "11-1 remaining moving declaration %s",
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
    expect(JSON.parse(output)).toMatchObject({
      status: "active",
      finishReason: null,
      prompts: 0,
      ...expected,
    });
  },
  12000,
);
