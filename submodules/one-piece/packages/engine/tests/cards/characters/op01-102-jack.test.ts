import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Jack102 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-102 Jack", () => {
  test("returns DON!! when attacking, then the opponent chooses the physical card they trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Jack102, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { hand: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jackId = engine.findCardInZone("south", "character", op01Jack102);
    const discardedId = engine.findCardInZone("north", "hand", eb01Fourtricks025);
    const keptId = engine.findCardInZone("north", "hand", eb01Doma005);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(jackId, engine.leader("north"), "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "north").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Jack's opposing discard.");
    expect(discard.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([discardedId, keptId]),
    );
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [discardedId] }, "north");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");

    const view = engine.getView("north");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardedId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01Jack102, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { hand: [eb01Doma005, eb01Fourtricks025] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jackId = engine.findCardInZone("south", "character", op01Jack102);
    engine.declareAttack(jackId, engine.leader("north"), "south");
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
