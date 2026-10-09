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
const fixture = fileURLToPath(new URL("./11-two-player-don-loop.fixture.ts", import.meta.url));

test.each(
  (["south", "north"] as const).flatMap((turn) =>
    ["turn-zero", "other-zero", "turn-large", "other-large", "tie"].map(
      (mode) => [turn, mode] as const,
    ),
  ),
)(
  "two-player DON %s %s (tie preserves existing engine policy)",
  (turn, mode) => {
    const output = run(turn, mode),
      stopsTurn = !mode.startsWith("other");
    expect(output).toMatchObject({
      status: "active",
      prompts: 0,
      turnAttached: stopsTurn ? 0 : 1,
      otherAttached: stopsTurn ? 1 : 0,
      turnDeck: stopsTurn ? 10 : 9,
      otherDeck: stopsTurn ? 9 : 10,
      restarted: true,
      rejected: 8,
      stoppedBy: stopsTurn ? turn : turn === "south" ? "north" : "south",
    });
  },
  12000,
);

test.each([
  ["mixed", { cleared: true }],
  ["extra", { excluded: true, status: "active" }],
  ["admission", { defaultAdmission: false, singleAdmission: false, twoAdmission: true }],
  ["finite", { status: "finished", finishReason: "emptyDeck", prompts: 0 }],
  ...["choice", "up-to"].map(
    (mode) => [mode, { status: "active", prompts: 1, rejected: 0 }] as const,
  ),
  ...["ledger", "restriction", "replacement"].map(
    (mode) => [mode, { status: "active", prompts: 0, rejected: 0 }] as const,
  ),
] as const)(
  "two-player DON exclusion %s",
  (mode, expected) => {
    expect(run("south", mode)).toMatchObject(expected);
  },
  12000,
);

function run(turn: string, mode: string) {
  const output = execFileSync(
    process.execPath,
    [
      "--experimental-strip-types",
      "--disable-warning=ExperimentalWarning",
      "--import",
      `data:text/javascript,${encodeURIComponent(register)}`,
      fixture,
      turn,
      mode,
    ],
    { timeout: 8000, encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  return JSON.parse(output);
}
