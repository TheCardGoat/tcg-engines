// Synthetic native effects only; no current catalog loop is claimed.
import "../../../cards/src/index.ts";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../src/testing/test-engine.ts";

const mode = process.argv[2];
const card = getCard("EB01-005");
card.effects = {
  effects: [
    {
      trigger: "onPlay",
      optional: mode === "optional",
      actions: [
        ...(mode === "random" ? [{ action: "shuffleDeck" as const, player: "self" as const }] : []),
        ...(["finite", "random"].includes(mode ?? "")
          ? [{ action: "draw" as const, player: "self" as const, amount: 1 }]
          : []),
        {
          action: "returnToHand",
          target: { player: "self", self: true, zones: ["character"], count: { amount: 1 } },
        },
        {
          action: "play",
          source: { player: "self", zone: "hand" },
          self: true,
          count: { amount: 1 },
        },
      ],
    },
  ],
};
const engine = OnePieceTestEngine.create({
  hand: [card],
  activeDon: 3,
  deck: ["ST01-003", "ST01-004"],
});
engine.playCard(card, "south");
if (mode === "optional") {
  engine.asSouth().acceptOptional();
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
    deck: view.players.south.deckCount,
    characters: view.players.south.characters.filter(Boolean).length,
  }),
);
