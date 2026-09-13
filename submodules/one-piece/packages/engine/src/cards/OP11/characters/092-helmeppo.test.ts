import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op11Helmeppo092, op11Hibari010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-092 Helmeppo", () => {
  test("bottom-decks the Character it played at the end of this turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Helmeppo092, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005],
      trash: [op11Hibari010],
      activeDon: op11Helmeppo092.cost,
    });
    const playedId = engine.findCardInZone("south", "trash", op11Hibari010);

    engine.playCard(op11Helmeppo092, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Helmeppo's SWORD choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(playedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playedId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(playedId);
    engine.endTurn("south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).not.toContain(playedId);
    expect(view.players.south.deckCount).toBe(2);
    expect(engine.findCardInZone("south", "deck", op11Hibari010)).toBe(playedId);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Helmeppo092, eb01Doma005],
      deck: [eb01Fourtricks025, eb01Doma005],
      trash: [op11Hibari010],
      activeDon: op11Helmeppo092.cost,
    });
    engine.playCard(op11Helmeppo092, "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
