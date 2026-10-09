// Synchronous regression is bounded by the parent process watchdog.
import "../../../cards/src/index.ts";
import type { Action, Condition } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";
const finite = process.argv[2] === "finite";
const card = getCard("EB01-005");
const actions: Action[] = [
  ...(finite ? [{ action: "draw" as const, player: "self" as const, amount: 1 }] : []),
  {
    action: "setActive",
    target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
  },
  {
    action: "rest",
    target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
  },
];
const conditions: Condition[] = finite
  ? [{ condition: "handCount", player: "self", comparison: "lt", value: 2 }]
  : [
      { condition: "leaderTrait", trait: "Straw Hat Crew" },
      { condition: "lifeCount", player: "self", comparison: "eq", value: 2 },
      { condition: "donFieldCount", player: "opponent", comparison: "eq", value: 2 },
    ];
card.effects = {
  effects: [
    { trigger: "activateMain", actions: [actions.at(-1)!] },
    { trigger: "whenBecomesRested", eventFilter: { targetSelf: true }, conditions, actions },
  ],
};
const e = OnePieceTestEngine.create(
  {
    leaderCardId: "ST01-001",
    character: [card],
    life: 2,
    deck: ["EB01-025", "EB01-018", "EB01-025"],
  },
  { activeDon: 2 },
);
e.asSouth().activateMain(e.findCardInZone("south", "character", card));
const view = e.getView("south");
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    hand: view.players.south.handCount,
    deck: view.players.south.deckCount,
  }),
);
