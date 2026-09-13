import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, op01Shanks120, op14eb04Megalo018 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-018 Megalo", () => {
  test("optionally rests itself to K.O. only a rested opposing Character with 8000 power or less", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Megalo018],
        activeDon: op14eb04Megalo018.cost,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: op01Shanks120, rested: true },
          eb01Fourtricks025,
        ],
      },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const tooPowerfulId = engine.findCardInZone("north", "character", op01Shanks120);
    const activeId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op14eb04Megalo018, "south");
    const megaloId = engine.findCardInZone("south", "character", op14eb04Megalo018);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Megalo's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(tooPowerfulId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(activeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === megaloId)?.rested,
    ).toBe(true);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Megalo018],
        activeDon: op14eb04Megalo018.cost,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: op01Shanks120, rested: true },
          eb01Fourtricks025,
        ],
      },
    );
    engine.playCard(op14eb04Megalo018, "south");
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
