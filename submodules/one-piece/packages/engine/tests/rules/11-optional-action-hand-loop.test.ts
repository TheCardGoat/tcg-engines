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
const fixture = fileURLToPath(
  new URL("./11-optional-action-hand-loop.fixture.ts", import.meta.url),
);

test.each([
  [
    "north",
    {
      status: "active",
      finishReason: null,
      prompts: 0,
      sameCharacter: true,
      stoppedLog: true,
      changedStateCanRestart: true,
    },
  ],
  [
    "nestedOuter",
    { status: "active", finishReason: null, prompts: 0, sameCharacter: true, deck: 3 },
  ],
  [
    "nestedInner",
    { status: "active", finishReason: null, prompts: 0, sameCharacter: true, deck: 3 },
  ],
  [
    "zero",
    {
      status: "active",
      finishReason: null,
      prompts: 0,
      sameCharacter: true,
      stoppedLog: true,
      changedStateCanRestart: true,
    },
  ],
  [
    "one",
    {
      status: "active",
      finishReason: null,
      prompts: 0,
      sameCharacter: true,
      stoppedLog: true,
      changedStateCanRestart: true,
    },
  ],
  [
    "large",
    {
      status: "active",
      finishReason: null,
      prompts: 0,
      sameCharacter: true,
      stoppedLog: true,
      changedStateCanRestart: true,
    },
  ],
  ["random", { status: "active", finishReason: null, prompts: 0, sameCharacter: true, deck: 1 }],
  ["finite", { status: "active", finishReason: null, prompts: 0, sameCharacter: true, deck: 1 }],
] as const)(
  "11-1 optional action hand movement %s",
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
