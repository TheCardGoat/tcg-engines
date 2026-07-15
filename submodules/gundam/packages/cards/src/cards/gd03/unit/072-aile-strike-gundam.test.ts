import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03AileStrikeGundam072 } from "./072-aile-strike-gundam.ts";

describe("Aile Strike Gundam (GD03-072)", () => {
  it("<Blocker> lets Aile Strike intercept a direct attack", () => {
    const attacker = createMockUnit({ ap: 2, hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd03AileStrikeGundam072], deck: 5 },
      { play: [attacker], deck: 5 },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.declareBlock(unitId));

    expect(p1.getBoardView().pendingCombat?.blockerId).toBe(unitId);
  });

  it("【Deploy】 with another Triple Ship Alliance Unit in play draws 1, then discards 1", () => {
    const ally = createMockUnit({ traits: ["triple ship alliance"] });
    const handFiller = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd03AileStrikeGundam072, handFiller],
      play: [ally],
      resourceArea: activeResources(4),
      deck: 2,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const fillerId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd03AileStrikeGundam072));
    const discardableIds = p1.getHand();
    expect(discardableIds).toHaveLength(2);
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining(discardableIds),
      minTargets: 1,
      maxTargets: 1,
    });
    expectSuccess(p1.resolveEffect({ targets: [fillerId] }));

    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
    expect(p1.getCardsInZone("trash")).toContain(fillerId);
    expect(p1.getCardsInZone("hand")).toHaveLength(1);
  });

  it("does not draw or discard without another Triple Ship Alliance Unit in play", () => {
    const handFiller = createMockUnit();
    const engine = GundamTestEngine.create({
      hand: [gd03AileStrikeGundam072, handFiller],
      resourceArea: activeResources(4),
      deck: 1,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const fillerId = p1.getHand()[1]!;

    expectSuccess(p1.deployUnit(gd03AileStrikeGundam072));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(1);
    expect(engine.getCardCount({ zone: "trash", playerId: PLAYER_ONE })).toBe(0);
    expect(p1.getCardsInZone("hand")).toEqual([fillerId]);
  });
});
