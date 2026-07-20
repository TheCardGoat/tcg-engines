import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op12SilversRayleigh001,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op13ScopperGaban067 } from "../../../../../cards/src/cards/OP13/characters/067-scopper-gaban.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP13-067 Scopper Gaban", () => {
  test("with an included Roger Pirates Leader draws two, trashes one selected card, then may add rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op12SilversRayleigh001,
      hand: [op13ScopperGaban067, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018, eb01Doma005],
      activeDon: op13ScopperGaban067.cost,
    });
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op13ScopperGaban067, "south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (trash?.kind !== "selectEntity") throw new Error("Expected Gaban's hand-trash choice.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    expect(trash.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([firstDrawnId, secondDrawnId]),
    );
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawnId] },
      "south",
    );
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(secondDrawnId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(firstDrawnId);
    expect(view.players.south.restedDon).toBe(op13ScopperGaban067.cost + 1);
    expect(view.prompts).toHaveLength(0);
  });

  test("with a nonmatching Leader skips the full On Play sequence", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op13ScopperGaban067, eb01Doma005],
      deck: [eb01Fourtricks025, eb01MountainGod018],
      activeDon: op13ScopperGaban067.cost,
    });

    engine.playCard(op13ScopperGaban067, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ handCount: 1, deckCount: 2 });
    expect(view.players.south.restedDon).toBe(op13ScopperGaban067.cost);
    expect(view.prompts).toHaveLength(0);
  });
});
