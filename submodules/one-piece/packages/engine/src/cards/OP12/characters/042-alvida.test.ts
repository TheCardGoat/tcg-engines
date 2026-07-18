import { describe, expect, test } from "vite-plus/test";
import { eb01Crocus041, eb01Doma005, eb01MountainGod018, op12Alvida042 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-042 Alvida", () => {
  test("bottom-decks an opposing base-cost-1 Character on play", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op12Alvida042], activeDon: op12Alvida042.cost },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);
    const deckBefore = engine.getView("north").players.north.deckCount;

    engine.playCard(op12Alvida042, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(targetId);
    expect(view.players.north.deckCount).toBe(deckBefore + 1);
  });

  test("gains 1 cost while controlling two other base-cost-5-or-more Characters", () => {
    const engine = OnePieceTestEngine.create({
      character: [op12Alvida042, eb01MountainGod018, eb01Crocus041],
    });
    const alvidaId = engine.findCardInZone("south", "character", op12Alvida042);

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === alvidaId)
        ?.cost,
    ).toBe(5);
  });
});
