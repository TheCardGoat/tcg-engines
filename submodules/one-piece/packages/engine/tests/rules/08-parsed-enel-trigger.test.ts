import { expect, test } from "vite-plus/test";
import { getCard } from "../../../cards/src/runtime-catalog.ts";
import { buildCardEffects } from "../../../../tools/op-card-parser/src/effect-parser/build-effects.ts";
import { OnePieceTestEngine } from "../../src/index.ts";

test("parsed Enel keeps its pending trigger after Ikoku restores Life", () => {
  const enel = getCard("OP05-098");
  const original = enel.effects;
  try {
    enel.effects = buildCardEffects(enel.effect ?? "");
    let engine = OnePieceTestEngine.create(
      { character: [{ card: getCard("EB01-018"), playedOnTurn: 0 }] },
      {
        leaderCardId: enel,
        life: ["OP03-118"],
        hand: ["EB01-005", "EB01-005"],
        deck: ["EB01-005", "EB01-018", "EB01-005"],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.declareAttack(
      engine.findCardInZone("south", "character", "EB01-018"),
      engine.leader("north"),
      "south",
    );
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    engine.resolveDecision("effectAddToLifeFromDeck", { optionId: "1" }, "north");
    expect(engine.getView("north").players.north).toMatchObject({
      lifeCount: 2,
      handCount: 0,
      deckCount: 1,
    });
    expect(engine.getView("north").prompts).toHaveLength(0);
  } finally {
    enel.effects = original;
  }
});
