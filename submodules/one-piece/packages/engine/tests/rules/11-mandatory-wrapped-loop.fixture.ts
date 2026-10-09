// Synthetic native grammar, not an asserted real-card infinite loop.
import "../../../cards/src/index.ts";
import type { Action } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
const mode = process.argv[2];
const card = getCard("EB01-005");
const movement: Action[] = [
  {
    action: "returnToHand",
    target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
  },
  { action: "play", source: { player: "self", zone: "hand" }, self: true, count: { amount: 1 } },
];
const body: Action[] = [
  ...(mode === "random" ? [{ action: "shuffleDeck" as const, player: "self" as const }] : []),
  ...(["finite", "random"].includes(mode ?? "")
    ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
    : []),
  ...movement,
];
let action: Action;
if (mode === "true" || mode === "false") {
  action = {
    action: "conditional",
    predicate: { condition: "turn", value: mode === "true" ? "your" : "opponent" },
    whenTrue: mode === "true" ? body : [],
    whenFalse: mode === "false" ? body : [],
  };
} else if (mode === "nested") {
  action = {
    action: "sequence",
    actions: [
      {
        action: "conditional",
        predicate: { condition: "turn", value: "your" },
        whenTrue: [{ action: "sequence", actions: body }],
      },
    ],
  };
} else if (mode === "optional") {
  action = { action: "sequence", actions: [{ action: "optional", actions: body }] };
} else {
  action = {
    action: "sequence",
    actions: body,
    ...(mode === "gated"
      ? { condition: { condition: "turn" as const, value: "opponent" as const } }
      : {}),
  };
}
const restCycle =
  mode === "rest-sequence" || mode === "rest-false" || mode?.startsWith("rest-grouped") === true;
const rest: Action = {
  action: "rest",
  target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
};
if (restCycle) {
  const restore: Action = {
    action: "setActive",
    target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
  };
  action = mode?.startsWith("rest-grouped")
    ? {
        action: "sequence",
        actions: [
          ...(mode === "rest-grouped-finite"
            ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
            : []),
          {
            action: "simultaneousStateChange",
            groups: [
              {
                state: "active",
                target: {
                  player: "self",
                  self: true,
                  zones: ["character"],
                  count: { amount: 1, ...(mode === "rest-grouped-choice" ? { upTo: true } : {}) },
                },
              },
            ],
          },
          {
            action: "simultaneousStateChange",
            groups: [
              {
                state: "rested",
                target: {
                  player: "self",
                  self: true,
                  zones: ["character"],
                  count: { amount: 1 },
                },
              },
            ],
          },
        ],
      }
    : mode === "rest-false"
      ? {
          action: "conditional",
          predicate: { condition: "turn", value: "opponent" },
          whenTrue: [],
          whenFalse: [restore, rest],
        }
      : { action: "sequence", actions: [restore, rest] };
}
card.effects = {
  effects: restCycle
    ? [
        { trigger: "activateMain", actions: [rest] },
        { trigger: "whenBecomesRested", eventFilter: { targetSelf: true }, actions: [action] },
      ]
    : [{ trigger: "onPlay", actions: [action] }],
};
const engine = OnePieceTestEngine.create({
  ...(restCycle ? { character: [card] } : { hand: [card] }),
  activeDon: 3,
  deck: ["ST01-003", "ST01-004"],
});
if (restCycle) engine.asSouth().activateMain(engine.findCardInZone("south", "character", card));
else engine.asSouth().play(card);
if (mode === "optional")
  engine.resolveDecision("effectActionOptional", { optionId: "no" }, "south");
if (mode === "rest-grouped-choice")
  engine.resolveDecision("effectSimultaneousStateSelection", { selectedIds: [] }, "south");
const view = engine.getView("south");
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    deck: view.players.south.deckCount,
  }),
);
