import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02Cabaji052,
  op02Mohji060,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-052 Cabaji", () => {
  test("with Mohji, draws 2 cards and trashes 1 chosen card from hand", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Cabaji052, eb01Doma005],
      character: [{ card: op02Mohji060, playedOnTurn: 0 }],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op02Cabaji052.cost,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);
    const firstDrawId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op02Cabaji052, "south");

    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Cabaji's hand trash choice.");
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual([
      keptId,
      firstDrawId,
      secondDrawId,
    ]);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [keptId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([
      firstDrawId,
      secondDrawId,
    ]);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(keptId);
    expect(view.prompts).toHaveLength(0);
  });

  test("without Mohji, does not draw or request a discard", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02Cabaji052, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op02Cabaji052.cost,
    });
    const keptId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02Cabaji052, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptId]);
    expect(view.players.south.deckCount).toBe(2);
    expect(view.prompts).toHaveLength(0);
  });
});
