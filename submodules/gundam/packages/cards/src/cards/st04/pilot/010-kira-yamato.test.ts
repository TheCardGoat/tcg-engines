import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st04KiraYamato010 } from "./010-kira-yamato.ts";

describe("Kira Yamato (ST04-010)", () => {
  it("【Burst】 Add this card to your hand — moves shield into hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [st04KiraYamato010] },
    );
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

  it("【Attack】 applies AP-2 to the sole enemy unit when the paired unit attacks", () => {
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 4,
      cost: 1,
      linkCondition: "[Kira Yamato]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const enemy = createMockUnit({ ap: 5, hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [unit, st04KiraYamato010], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const pilotId = p1.getHand()[0]!;
    expectSuccess(p1.assignPilot(pilotId, unitId));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unitId, enemyId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      sourceCardId: pilotId,
      legalTargetIds: [enemyId],
    });
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
  });
});
