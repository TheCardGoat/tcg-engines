import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  createMockUnit,
} from "@tcg/gundam-engine";
import { betaAmuroRay010 } from "./010-amuro-ray.ts";
describe("Amuro Ray (ST01-010)", () => {
  it("【Burst】 moves this card from shield area to hand when the shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [betaAmuroRay010] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const shieldId = p2.getCardsInZone("shieldArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(shieldId)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.", () => {
    const linkUnit = createMockUnit({
      ap: 3,
      hp: 5,
      level: 1,
      cost: 1,
      linkCondition: "[Amuro Ray]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const enemy = createMockUnit({ ap: 2, hp: 4 });

    const engine = GundamTestEngine.create(
      {
        hand: [linkUnit, betaAmuroRay010],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(linkUnit));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getHand()[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expect(p2.isExhausted(enemyId)).toBe(false);

    expectSuccess(p1.assignPilot(pilotId, unitId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: pilotId,
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
  });
});
