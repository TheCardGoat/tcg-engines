import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op09Usopp024 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-024 Usopp", () => {
  test("with 2 rested Characters draws 2, then trashes 2 chosen hand cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Usopp024, eb01Fourtricks025],
      deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      character: [
        { card: eb01Doma005, rested: true },
        { card: eb01Fourtricks025, rested: true },
      ],
      activeDon: op09Usopp024.cost,
    });
    const handBefore = engine.getView("south").players.south.hand.map((card) => card.instanceId);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op09Usopp024, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Usopp's hand-trash choice.");
    expect(trash).toMatchObject({ min: 2, max: 2 });
    const drawnIds = trash.candidates
      .map((candidate) => candidate.ref.id)
      .filter((instanceId) => !handBefore.includes(instanceId));
    expect(drawnIds).toHaveLength(2);
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: drawnIds }, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 2);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining(drawnIds),
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("does not draw with fewer than 2 rested Characters", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op09Usopp024],
      deck: [eb01Doma005, eb01Fourtricks025, eb01Doma005, eb01Fourtricks025],
      character: [{ card: eb01Doma005, rested: true }],
      activeDon: op09Usopp024.cost,
    });
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op09Usopp024, "south");

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.prompts).toHaveLength(0);
  });
});
