import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op10Enel025,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP10-025 Enel", () => {
  test("with two rested Characters, draws three then trashes exactly two chosen physical cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Enel025, eb01Doma005],
      character: [
        { card: eb01Doma005, rested: true },
        { card: eb01Doma005, rested: true },
      ],
      deck: [eb01Fourtricks025, eb01MountainGod018, op01Shanks120],
      activeDon: op10Enel025.cost,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);
    const thirdDrawId = engine.findCardInZone("south", "deck", op01Shanks120);

    engine.playCard(op10Enel025, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (trash?.kind !== "selectEntity") throw new Error("Expected Enel's two-card trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([
      keptId,
      firstDrawId,
      secondDrawId,
      thirdDrawId,
    ]);
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [keptId, secondDrawId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      thirdDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([keptId, secondDrawId]),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw or request a discard with only one rested Character", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op10Enel025, eb01Doma005],
      character: [{ card: eb01Doma005, rested: true }],
      deck: [eb01Fourtricks025, eb01MountainGod018, op01Shanks120],
      activeDon: op10Enel025.cost,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op10Enel025, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptId]);
    expect(view.players.south.deckCount).toBe(3);
    expect(view.prompts).toHaveLength(0);
  });
});
