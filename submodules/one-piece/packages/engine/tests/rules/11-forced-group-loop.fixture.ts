// A child watchdog bounds synchronous regressions. No catalog loop is claimed.
import "../../../cards/src/index.ts";
import type { Action, Target } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

const mode = process.argv[2];
const card = getCard("EB01-005");
const target: Target = {
  player: mode === "empty" || mode === "cross" ? "opponent" : "self",
  zones: ["character"],
  count: {
    amount: ["numeric", "choice", "shortage", "upTo"].includes(mode ?? "") ? 2 : "all",
    ...(mode === "upTo" ? { upTo: true } : {}),
  },
};
const rest: Action = { action: "rest", target };
const active: Action = {
  action: "setActive",
  target: mode === "cross" ? { ...target, player: "self" } : target,
};
card.effects = {
  ...(mode === "protected"
    ? {
        permanentEffects: [
          {
            actions: [
              {
                action: "cannotBeRested" as const,
                target: {
                  player: "self" as const,
                  zones: ["character" as const],
                  self: true,
                  count: { amount: 1 },
                },
                duration: "permanent" as const,
                byPlayer: "self" as const,
              },
            ],
          },
        ],
      }
    : {}),
  effects: [
    { trigger: "activateMain", actions: [rest] },
    {
      trigger: "whenBecomesRested",
      eventFilter: { targetSelf: true },
      optional: mode === "optional",
      oncePerTurn: mode === "once",
      actions: [
        ...(mode === "finite"
          ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
          : []),
        active,
        rest,
      ],
    },
  ],
};
let e = OnePieceTestEngine.create(
  {
    character:
      mode === "shortage"
        ? [card]
        : mode === "choice"
          ? [card, "ST02-002", "ST02-006"]
          : [card, "ST02-002"],
    deck: ["ST02-006", "ST02-007"],
  },
  mode === "cross" ? { character: [card, "ST02-002"] } : {},
);
const source = e.findCardInZone("south", "character", card);
e.asSouth().activateMain(source);
let declared = false;
if (mode === "optional") {
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.asSouth().acceptOptional();
  const prompt = e.pendingDecision("loopIterations", "south");
  declared = true;
  e = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(e.getState())));
  e.exec({
    type: "resolvePrompt",
    seat: "south",
    promptId: prompt.id,
    iterations: Number.MAX_SAFE_INTEGER,
  });
}
const view = e.getView("south"),
  state = e.getState();
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    declared,
    rested: view.players.south.characters.filter((c) => c?.rested).length,
    hand: view.players.south.hand.length,
    deck: view.players.south.deckCount,
    pendingWork:
      state.resolutionQueue.length +
      (state.pendingAutoEffects?.length ?? 0) +
      (state.readyEffectGroup?.effects.length ?? 0),
  }),
);
