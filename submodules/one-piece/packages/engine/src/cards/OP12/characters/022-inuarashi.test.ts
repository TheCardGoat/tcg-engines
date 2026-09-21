import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op01Shanks120 } from "@tcg/op-cards";
import { op12Inuarashi022 } from "../../../../../cards/src/cards/characters/op12-022-inuarashi.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-022 Inuarashi", () => {
  test("rests itself and freezes only an eligible rested Character for the next Refresh", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Inuarashi022] },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: op01Shanks120, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("south", "character", op12Inuarashi022);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("north", "character", op01Shanks120);

    engine.activateEffect(inuarashiId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Inuarashi's freeze target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    engine.endTurn("north");
    engine.endTurn("south");
    expect(
      engine
        .getView("north")
        .players.north.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(false);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op12Inuarashi022] },
      {
        character: [
          { card: eb01Doma005, rested: true, playedOnTurn: 0 },
          { card: op01Shanks120, rested: true, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const inuarashiId = engine.findCardInZone("south", "character", op12Inuarashi022);
    engine.activateEffect(inuarashiId, "activateMain", "south");
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
