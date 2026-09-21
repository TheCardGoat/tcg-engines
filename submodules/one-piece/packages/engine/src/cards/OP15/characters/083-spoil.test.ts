import { describe, expect, test } from "vite-plus/test";
import { op15Spoil083 } from "../../../../../cards/src/cards/characters/op15-083-spoil.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-083 Spoil", () => {
  test("[On Play] trashes 3 deck cards", () => {
    const engine = OnePieceTestEngine.create({ hand: [op15Spoil083], activeDon: 3, deck: 6 }, {});
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15Spoil083);

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 3);
  });

  test("[Activate: Main] with 15+ trash cards, self-trashes to give a rested DON!!", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op15Spoil083],
        trash: 15,
        activeDon: 3,
        restedDon: 1,
      },
      {},
    );
    const spoilId = engine.findCardInZone("south", "character", op15Spoil083);

    engine.activateEffect(spoilId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    if (count?.kind !== "chooseOption") throw new Error("Expected the DON!! count.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const south = engine.getView("south").players.south;
    expect(south.restedDon).toBe(0);
    expect(south.trash.map((card) => card.instanceId)).toContain(spoilId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-083", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-083"),
      "activateMain",
      "south",
    );
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(
      engine.getView("south").players.south.activeDon +
        engine.getView("south").players.south.restedDon,
    ).toBe(donBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
