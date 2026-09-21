import { describe, expect, test } from "vite-plus/test";
import { op15Brook022 } from "../../../../../cards/src/cards/leaders/op15-022-brook.ts";
import { op15Brook032 } from "../../../../../cards/src/cards/characters/op15-032-brook.ts";
import { op15TonyTonyChopper085 } from "../../../../../cards/src/cards/characters/op15-085-tony-tony-chopper.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP15-085 Tony Tony.Chopper", () => {
  test("[On Play] trashes 3 deck cards", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op15TonyTonyChopper085], activeDon: 4, deck: 6 },
      {},
    );
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op15TonyTonyChopper085);

    expect(engine.getView("south").players.south.deckCount).toBe(deckBefore - 3);
  });

  test("[Activate: Main] self-trashes to return a Straw Hat Character from trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op15Brook022,
        character: [op15TonyTonyChopper085],
        trash: [op15Brook032],
        activeDon: 3,
      },
      {},
    );
    const chopperId = engine.findCardInZone("south", "character", op15TonyTonyChopper085);
    const brookId = engine.findCardInZone("south", "trash", op15Brook032);

    engine.activateEffect(chopperId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected the return target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([brookId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [brookId] }, "south");

    const south = engine.getView("south").players.south;
    expect(south.hand.map((card) => card.instanceId)).toContain(brookId);
    expect(south.trash.map((card) => card.instanceId)).toContain(chopperId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("[Activate: Main] may be declined", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ cardId: "OP15-085", rested: false }], activeDon: 5 },
      { character: ["OP13-013"], activeDon: 5 },
    );
    const donBefore =
      engine.getView("south").players.south.activeDon +
      engine.getView("south").players.south.restedDon;

    engine.activateEffect(
      engine.findCardInZone("south", "character", "OP15-085"),
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
