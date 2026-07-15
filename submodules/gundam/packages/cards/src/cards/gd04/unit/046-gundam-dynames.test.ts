import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GundamDynames046 } from "./046-gundam-dynames.ts";

describe("Gundam Dynames (GD04-046)", () => {
  it("【Deploy】 rests this Unit and deals 2 damage to a chosen enemy Unit (Lv.3 or lower)", () => {
    const lowLv = createMockUnit({ ap: 1, hp: 5, level: 2 });
    const highLv = createMockUnit({ ap: 1, hp: 5, level: 5 });

    const engine = GundamTestEngine.create(
      {
        hand: [gd04GundamDynames046],
        resourceArea: activeResources(5),
      },
      { play: [lowLv, highLv] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const dynamesId = p1.getHand()[0]!;
    const [lowLvId, highLvId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(dynamesId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      controllerId: PLAYER_ONE,
      sourceCardId: dynamesId,
      directiveIndex: 0,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      controllerId: PLAYER_ONE,
      sourceCardId: dynamesId,
      minTargets: 1,
      maxTargets: 1,
      legalTargetIds: [lowLvId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowLvId!] }));

    expect(p1.isExhausted(dynamesId)).toBe(true);
    expect(p2.getDamage(lowLvId!)).toBe(2);
    // Lv.5 unit isn't a candidate (filter Lv ≤ 3) so it takes no damage.
    expect(p2.getDamage(highLvId!)).toBe(0);
  });

  it("【Deploy】does not present an unusable optional prompt when no legal target exists", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04GundamDynames046],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd04GundamDynames046));

    const dynamesId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.isExhausted(dynamesId)).toBe(false);
    expect(p1.getCardsInZone("hand")).toHaveLength(0);
  });
});
