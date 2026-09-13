import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01Fukurokuju110, op01HitokiriKamazo108 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-108 Hitokiri Kamazo", () => {
  test("on battle K.O. returns one DON!! and K.O.s only a cost-5-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01HitokiriKamazo108, rested: true }],
        activeDon: 1,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Fukurokuju110, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kamazoId = engine.findCardInZone("south", "character", op01HitokiriKamazo108);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("north", "character", op01Fukurokuju110);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.declareAttack(eligibleId, kamazoId, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Kamazo's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.donDeckCount).toBe(donDeckBefore + 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(kamazoId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === excludedId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01HitokiriKamazo108, rested: true }],
        activeDon: 1,
      },
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: op01Fukurokuju110, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kamazoId = engine.findCardInZone("south", "character", op01HitokiriKamazo108);
    const eligibleId = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(eligibleId, kamazoId, "north");
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
