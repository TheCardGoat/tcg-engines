import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  expectSuccess,
  createMockUnit,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaAmuroRay010 } from "./010-amuro-ray.ts";
describe("Amuro Ray (ST01-010)", () => {
  it("【Burst】 moves this card from shield area to hand when the shield is destroyed", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [betaAmuroRay010] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Burst fired: the shield card is now in p2's hand, not in trash.
    expect(p2.getHand()).toContain(shieldId!);
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
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    // Enemy should NOT be rested yet.
    expect(engine.getG().exhausted[enemyId]).toBeFalsy();

    expectSuccess(p1.assignPilot(betaAmuroRay010, linkUnit));

    // Amuro's 【When Paired】 rest trigger fired → enemy is now exhausted.
    expect(engine.getG().exhausted[enemyId]).toBe(true);
  });
});
