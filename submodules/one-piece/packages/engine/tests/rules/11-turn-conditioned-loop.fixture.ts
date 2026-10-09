// Child-process fixture: a regression must fail by watchdog, never hang Vitest.
import "../../../cards/src/index.ts";
import type { Action, EffectBlock } from "@tcg/op-types";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

const mode = process.argv[2];
const resting = mode === "rest" || mode === "restOpponent";
const card = getCard("EB01-005");
const selfKo: Action = {
  action: "ko",
  target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
};
const conditions: EffectBlock["conditions"] = [
  { condition: "turn", value: mode === "false" || mode === "restOpponent" ? "opponent" : "your" },
];
card.effects = resting
  ? {
      effects: [
        {
          trigger: "activateMain",
          actions: [
            {
              action: "rest",
              target:
                mode === "restOpponent"
                  ? { player: "opponent", zones: ["character"], count: { amount: 1 } }
                  : selfKo.target,
            },
          ],
        },
        {
          trigger: "whenBecomesRested",
          eventFilter: { targetSelf: true },
          conditions,
          actions: [
            { action: "setActive", target: selfKo.target },
            { action: "rest", target: selfKo.target },
          ],
        },
      ],
    }
  : {
      effects: [
        {
          trigger: "onPlay",
          conditions,
          actions: [
            ...(mode === "finite"
              ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
              : []),
            selfKo,
          ],
        },
        {
          trigger: "onKo",
          optional: mode === "optional",
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "trash" },
              count: { amount: 1 },
              ...(mode === "choice" ? {} : { self: true }),
            },
          ],
        },
      ],
    };
let engine = OnePieceTestEngine.create(
  {
    ...(resting ? { character: [card] } : { hand: [card] }),
    activeDon: 3,
    deck: ["EB01-025", "EB01-018"],
    ...(mode === "choice" ? { trash: ["EB01-025"] } : {}),
  },
  mode === "restOpponent" ? { character: [card] } : {},
);
if (resting)
  engine.activateEffect(engine.findCardInZone("south", "character", card), "activateMain", "south");
else engine.playCard(card);
if (mode === "optional") {
  engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
  engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
  engine.exec({
    type: "resolvePrompt",
    seat: "south",
    promptId: engine.pendingDecision("loopIterations", "south").id,
    iterations: 0,
  });
}
const view = engine.getView("south");
process.stdout.write(
  JSON.stringify({
    status: view.status,
    finishReason: view.finishReason,
    prompts: view.prompts.length,
    deckCount: view.players.south.deckCount,
    characters: view.players.south.characters.filter(Boolean).length,
    pendingWork:
      engine.getState().resolutionQueue.length +
      (engine.getState().pendingAutoEffects?.length ?? 0),
  }),
);
