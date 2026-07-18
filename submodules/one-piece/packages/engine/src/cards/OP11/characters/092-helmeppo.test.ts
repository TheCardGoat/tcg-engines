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
});
