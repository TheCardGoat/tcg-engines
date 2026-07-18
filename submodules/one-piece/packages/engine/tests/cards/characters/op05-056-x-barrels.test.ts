import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op05Maynard052,
  op05XBarrels056,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-056 X.Barrels", () => {
  test("may bottom another chosen Character as its cost before drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05XBarrels056],
      character: [op05Maynard052, eb01Fourtricks025],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: op05XBarrels056.cost,
    });
    const maynardId = engine.findCardInZone("south", "character", op05Maynard052);
    const otherId = engine.findCardInZone("south", "character", eb01Fourtricks025);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op05XBarrels056, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostReturnCharacterToDeck", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected X.Barrels' Character cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toEqual([maynardId, otherId]);
    const barrelsId = engine.findCardInZone("south", "character", op05XBarrels056);
    expect(cost.candidates.map((candidate) => candidate.ref.id)).not.toContain(barrelsId);
    engine.resolveDecision(
      "effectCostReturnCharacterToDeck",
      { selectedIds: [maynardId] },
      "south",
    );

    expect(engine.getState().players.south.deck.at(-1)).toBe(maynardId);
    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      drawnId,
    );
    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(otherId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("may decline without moving a Character or drawing", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op05XBarrels056],
      character: [op05Maynard052],
      deck: [eb01Doma005, eb01MountainGod018],
      activeDon: op05XBarrels056.cost,
    });
    const maynardId = engine.findCardInZone("south", "character", op05Maynard052);

    engine.playCard(op05XBarrels056, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(maynardId);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
