import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";
import type { Action } from "@tcg/op-types";
import { isDeterministicStateAction } from "../../src/engine/loop-transition.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true };
  return nextResolve(specifier, context);
}`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;
const fixture = fileURLToPath(new URL("./11-forced-group-loop.fixture.ts", import.meta.url));

test.each([
  ["all", { status: "finished", finishReason: "draw", prompts: 0, pendingWork: 0 }],
  ["cross", { status: "finished", finishReason: "draw", prompts: 0, pendingWork: 0 }],
  ["numeric", { status: "finished", finishReason: "draw", prompts: 0, pendingWork: 0 }],
  [
    "optional",
    { status: "active", finishReason: null, prompts: 0, declared: true, rested: 2, pendingWork: 0 },
  ],
  ["choice", { status: "active", finishReason: null, prompts: 1 }],
  ["shortage", { status: "active", finishReason: null, prompts: 1 }],
  ["upTo", { status: "active", finishReason: null, prompts: 1 }],
  ["empty", { status: "active", finishReason: null, prompts: 0, rested: 0, pendingWork: 0 }],
  ["once", { status: "active", finishReason: null, prompts: 0, rested: 2, pendingWork: 0 }],
  ["protected", { status: "active", finishReason: null, prompts: 0, rested: 1, pendingWork: 0 }],
  [
    "finite",
    { status: "finished", finishReason: "emptyDeck", prompts: 0, deck: 0, hand: 2, pendingWork: 0 },
  ],
] as const)(
  "11-1 forced group %s",
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

test("grouped certification does not widen moving or qualified target profiles", () => {
  const e = OnePieceTestEngine.create({ character: ["EB01-005", "ST02-002"] });
  const source = e.findCardInZone("south", "character", "EB01-005");
  const item = {
    kind: "effectBlock",
    id: "proof",
    controller: "south",
    sourceInstanceId: source,
    trigger: "activateMain",
    blockIndex: 0,
  } as const;
  const action: Extract<Action, { action: "rest" }> = {
    action: "rest",
    target: { player: "self", zones: ["character"], count: { amount: "all" } },
  };
  const state = e.getState();
  expect(isDeterministicStateAction(state, item, action)).toBe(false);
  expect(isDeterministicStateAction(state, item, action, "forcedGroup")).toBe(true);
  const choices: Action[] = [
    { ...action, target: { ...action.target, count: { amount: "all", upTo: true } } },
    { ...action, target: { ...action.target, chosenBy: "opponent" } },
    { ...action, target: { ...action.target, player: "any" } },
    { ...action, target: { ...action.target, zones: ["character", "leader"] } },
    { ...action, target: { ...action.target, filters: [{ filter: "state", value: "active" }] } },
    { ...action, condition: { condition: "turn", value: "your" } },
  ];
  for (const choice of choices)
    expect(isDeterministicStateAction(state, item, choice, "forcedGroup")).toBe(false);
  const replacement = OnePieceTestEngine.create({ character: ["EB01-005", "OP05-030"] });
  const replacementItem = {
    ...item,
    sourceInstanceId: replacement.findCardInZone("south", "character", "EB01-005"),
  };
  expect(
    isDeterministicStateAction(replacement.getState(), replacementItem, action, "forcedGroup"),
  ).toBe(false);
});
