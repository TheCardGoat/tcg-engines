import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op02Vista011 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04MissGoldenweekMarianne085 } from "../../../../../cards/src/cards/OP14EB04/characters/085-miss-goldenweek-marianne.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-085 Miss.Goldenweek(Marianne)", () => {
  test("on K.O. draws two then trashes the controller's two selected physical hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op14eb04MissGoldenweekMarianne085],
        hand: [eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { hand: [op02Vista011], activeDon: op02Vista011.cost },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const goldenweekId = engine.findCardInZone(
      "south",
      "character",
      op14eb04MissGoldenweekMarianne085,
    );
    const initialHandId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op02Vista011, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [goldenweekId] }, "north");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected the two-card trash choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([initialHandId, firstDrawId, secondDrawId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [initialHandId, firstDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([goldenweekId, initialHandId, firstDrawId]),
    );
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([secondDrawId]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
