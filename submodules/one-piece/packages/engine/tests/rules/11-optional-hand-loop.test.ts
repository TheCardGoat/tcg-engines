import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { Action, Target } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/index.ts";
import { expect, test } from "vite-plus/test";

// Source-only subprocesses bound a possible synchronous engine loop independently
// of Vitest. No package build or prebuilt engine is used by these public commands.
const typesUrl = new URL("../../../types/src/index.ts", import.meta.url).href;
const loader = `export async function resolve(specifier, context, nextResolve) {
  if (specifier === '@tcg/op-types') return { url: ${JSON.stringify(typesUrl)}, shortCircuit: true };
  return nextResolve(specifier, context);
}`;
const register = `import { register } from 'node:module'; register(${JSON.stringify(`data:text/javascript,${encodeURIComponent(loader)}`)}, ${JSON.stringify(import.meta.url)});`;
const fixture = fileURLToPath(new URL("./11-optional-hand-loop.fixture.ts", import.meta.url));

test.each([
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
  "11-1 optional hand movement %s",
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

test("saved rest-loop evidence preserves ordered activation requirement grants", () => {
  const loop = getCard("EB01-005"),
    giver = getCard("ST01-007"),
    recipient = getCard("ST01-013");
  const originals = [loop.effects, giver.effects, recipient.effects];
  const self: Target = {
    player: "self",
    self: true,
    zones: ["character"],
    count: { amount: 1 },
  } as const;
  const cycle: Action[] = [
    { action: "setActive", target: self },
    { action: "rest", target: self },
  ];
  try {
    loop.effects = {
      effects: [
        { trigger: "activateMain", actions: cycle },
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          optional: true,
          actions: cycle,
        },
      ],
    };
    recipient.effects = {
      effects: [
        { trigger: "activateMain", actions: [{ action: "draw", player: "self", amount: 1 }] },
      ],
    };
    giver.effects = {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "addActivationCosts",
              target: {
                player: "self",
                zones: ["character"],
                filters: [{ filter: "name", value: recipient.name }],
                count: { amount: 1 },
              },
              costs: [{ cost: "restDon", amount: 1 }],
              duration: "thisTurn",
            },
            {
              action: "addActivationCosts",
              target: {
                player: "self",
                zones: ["character"],
                filters: [{ filter: "name", value: recipient.name }],
                count: { amount: 1 },
              },
              costs: [{ cost: "returnDon", amount: 1 }],
              duration: "thisTurn",
            },
          ],
        },
      ],
    };
    let e = OnePieceTestEngine.create({
      character: [loop, giver, recipient],
      activeDon: 1,
      deck: ["ST01-003", "ST01-004"],
    });
    e.asSouth().activateMain(giver);
    e.asSouth().activateMain(loop);
    e.asSouth().acceptOptional();
    e.exec({
      type: "resolvePrompt",
      seat: "south",
      promptId: e.pendingDecision("loopIterations", "south").id,
      iterations: 0,
    });
    const saved = JSON.parse(JSON.stringify(e.getState()));
    const ordered = OnePieceTestEngine.fromState(saved);
    ordered.asSouth().activateMain(recipient);
    expect(ordered.getView("south").players.south.hand).toHaveLength(1);
    // Replay control: preserve all IDs/payloads and change only dictionary insertion order.
    saved.modifiers = Object.fromEntries(Object.entries(saved.modifiers).reverse());
    e = OnePieceTestEngine.fromState(saved);
    const denied = e.expectFailure({
      type: "activateEffect",
      seat: "south",
      sourceInstanceId: e.findCardInZone("south", "character", recipient),
      trigger: "activateMain",
    });
    e = OnePieceTestEngine.fromState(denied.state);
    expect(e.getView("south").players.south.activeDon).toBe(1);
    e.asSouth().activateMain(loop);
    expect(e.pendingDecision("effectOptional", "south")).toBeDefined();
    e.asSouth().declineOptional();
    expect(e.getView("south").prompts).toHaveLength(0);
  } finally {
    [loop.effects, giver.effects, recipient.effects] = originals;
  }
});
