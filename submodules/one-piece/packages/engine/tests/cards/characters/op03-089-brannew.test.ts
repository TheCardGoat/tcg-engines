import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op03Brannew089, op03Vergo079 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP03-089 Brannew", () => {
  test("finds an included Navy card other than every Brannew, then trashes the looked remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Brannew089],
      deck: [op03Vergo079, op03Brannew089, eb01Doma005, eb01Doma005],
      activeDon: op03Brannew089.cost,
    });
    const navyId = engine.findCardInZone("south", "deck", op03Vergo079);
    const otherBrannewId = engine.findCardInZone("south", "deck", op03Brannew089);
    const nonNavyId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op03Brannew089, "south");

    const search = engine.pendingDecision("effectSearchSelection", "south").steps[0];
    expect(search?.kind).toBe("selectEntity");
    if (search?.kind !== "selectEntity") throw new Error("Expected Brannew's search selection.");
    expect(search.candidates.find((candidate) => candidate.ref.id === navyId)?.legal).toBe(true);
    expect(search.candidates.find((candidate) => candidate.ref.id === otherBrannewId)?.legal).toBe(
      false,
    );
    expect(search.candidates.find((candidate) => candidate.ref.id === nonNavyId)?.legal).toBe(
      false,
    );
    engine.resolveDecision("effectSearchSelection", { selectedIds: [navyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(navyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([otherBrannewId, nonNavyId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("may select no Navy card and trashes all three looked cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op03Brannew089],
      deck: [op03Vergo079, op03Brannew089, eb01Doma005, eb01Doma005],
      activeDon: op03Brannew089.cost,
    });
    const navyId = engine.findCardInZone("south", "deck", op03Vergo079);
    const otherBrannewId = engine.findCardInZone("south", "deck", op03Brannew089);
    const nonNavyId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op03Brannew089, "south");
    engine.resolveDecision("effectSearchSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(navyId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([navyId, otherBrannewId, nonNavyId]),
    );
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
