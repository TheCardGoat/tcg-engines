import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04ElanCeresEnhancedPersonNumber5087 } from "./087-elan-ceres-enhanced-person-number-5.ts";

describe("Elan Ceres (Enhanced Person Number 5) (GD04-087)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04ElanCeresEnhancedPersonNumber5087] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【During Link】【Attack】redirects battle damage this Unit would receive to another friendly Academy Unit", () => {
    const host = createMockUnit({
      name: "Elan Host",
      ap: 1,
      hp: 8,
      linkCondition: "[Elan Ceres (Enhanced Person Number 5)]",
    });
    const academyUnit = createMockUnit({ name: "Academy Ally", traits: ["academy"], hp: 8 });
    const enemy = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04ElanCeresEnhancedPersonNumber5087],
        play: [host, academyUnit],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [hostId, academyId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04ElanCeresEnhancedPersonNumber5087, hostId!));
    expectSuccess(p1.enterBattle(hostId!, enemyId));
    expectSuccess(p1.resolveEffect({ targets: [academyId!], optionalAnswers: { 0: true } }));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(getDamageCounter(engine, hostId!)).toBe(0);
    expect(getDamageCounter(engine, academyId!)).toBe(2);
  });
});
