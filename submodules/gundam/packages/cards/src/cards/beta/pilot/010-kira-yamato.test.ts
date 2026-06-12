import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  createMockUnit,
  activeResources,
  type ContinuousEffectEntry,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaKiraYamato010 } from "./010-kira-yamato.ts";
describe("Kira Yamato (ST04-010)", () => {
  it("【Burst】 adds this card to hand when its shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [betaKiraYamato010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p2.getHand()).toContain(shieldId!);
  });

  // Pilot-resident 【Attack】 trigger now fires via the observer-trigger
  // scan in attack-step (the paired pilot sits in battleArea alongside
  // the unit). The AP-2 auto-targets the lone enemy unit because
  // triggered effects with a `count` filter auto-pick candidates in the
  // executor (rule 10-3-3 deterministic fallback for triggered effects).
  it("【Attack】 applies AP-2 to the sole enemy unit when the paired unit attacks", () => {
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      level: 4,
      cost: 1,
      // Dummy linkCondition so the unit can attack the deploy turn with
      // Kira paired (rule 3-2-6-3).
      linkCondition: "[Kira Yamato]",
    } as unknown as Parameters<typeof createMockUnit>[0]);
    // Enemy: AP 5, HP 3 → after Kira's AP-2, its effective AP is 3; unit
    // (AP 2, HP 5) survives a counter-attack of 3 damage.
    const enemy = createMockUnit({ ap: 5, hp: 3 });
    const engine = GundamTestEngine.create(
      { hand: [unit, betaKiraYamato010], resourceArea: activeResources(6) },
      { play: [{ card: enemy, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    expectSuccess(p1.deployUnit(unit));
    expectSuccess(p1.assignPilot(betaKiraYamato010, unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(unit, enemyId));
    // thisBattle AP-2 applied via the pilot's own 【Attack】 trigger.
    expect(
      engine
        .getG()
        .continuousEffects.some((e: ContinuousEffectEntry) => e.duration === "this-battle"),
    ).toBe(true);
  });
});
