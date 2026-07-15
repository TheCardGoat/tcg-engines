import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03CarrisNautilus093 } from "./093-carris-nautilus.ts";

describe("Carris Nautilus (GD03-093)", () => {
  it("【Burst】 adds this revealed Shield to its owner's hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03CarrisNautilus093] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03CarrisNautilus093)).toBe(`hand:${PLAYER_TWO}`);
  });

  it("while no enemy Base is in play, the paired Unit gets AP+1", () => {
    const host = createMockUnit({ ap: 2, hp: 4, linkCondition: "[Carris Nautilus]" });
    const engine = GundamTestEngine.create({
      hand: [host, gd03CarrisNautilus093],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03CarrisNautilus093, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 5, effectiveHp: 5 });
  });

  it("does not grant AP+1 while an enemy Base is in play", () => {
    const host = createMockUnit({ ap: 2, hp: 4, linkCondition: "[Carris Nautilus]" });
    const enemyBase = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create(
      { hand: [host, gd03CarrisNautilus093], resourceArea: activeResources(4) },
      { baseSection: [enemyBase] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(host));
    expectSuccess(p1.assignPilot(gd03CarrisNautilus093, host));
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 5 });
  });
});
