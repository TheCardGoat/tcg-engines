import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, eb03UtaManga061, op13Uta023 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-061 Uta (Manga)", () => {
  test("sets one own DON!! active, rests a cost-4-or-less opposing Character, and is once per turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [eb03UtaManga061],
        restedDon: 1,
      },
      {
        character: [eb01Doma005, eb01MountainGod018],
        activeDon: 1,
      },
    );
    const utaId = engine.findCardInZone("south", "character", eb03UtaManga061);
    const lowCostId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.activateEffect(utaId, "activateMain", "south");
    engine.resolveDecision("effectSetActiveDon", { optionId: "1" }, "south");

    const target = engine.pendingDecision("effectMixedRestSelection", "south").steps[0];
    expect(target?.kind).toBe("payCost");
    if (target?.kind !== "payCost") throw new Error("Expected Uta's opposing rest target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain("active-don:north:0");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(lowCostId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectMixedRestSelection", { selectedIds: [lowCostId] }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(
      engine
        .getView("south")
        .players.north.characters.find((card) => card?.instanceId === lowCostId)?.rested,
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: utaId,
        trigger: "activateMain",
      }).reason,
    ).toBe("This effect has already been used this turn.");
  });

  test("at end of its controller's turn, rests one DON!! to set a FILM Character active", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        { card: eb03UtaManga061, rested: true },
        { card: op13Uta023, rested: true },
      ],
      activeDon: 1,
    });
    const filmId = engine.findCardInZone("south", "character", op13Uta023);

    engine.endTurn("south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [filmId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.restedDon).toBe(1);
    expect(view.players.south.characters.find((card) => card?.instanceId === filmId)?.rested).toBe(
      false,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create({
      character: [
        { card: eb03UtaManga061, rested: true },
        { card: op13Uta023, rested: true },
      ],
      activeDon: 1,
    });
    engine.endTurn("south");
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
