import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  findStatModifier,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04SleggarLaw084 } from "./084-sleggar-law.ts";

describe("Sleggar Law (GD04-084)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04SleggarLaw084] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【Attack】gives a friendly White Base Team Unit AP+1 this turn", () => {
    const host = createMockUnit({ traits: ["white base team"], linkCondition: "[Sleggar Law]" });
    const enemy = { card: createMockUnit({ hp: 5 }), exhausted: true };
    const engine = GundamTestEngine.create(
      { hand: [gd04SleggarLaw084], play: [host], resourceArea: activeResources(3) },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04SleggarLaw084, hostId));
    expectSuccess(p1.enterBattle(hostId, enemyId));

    expect(findStatModifier(engine, hostId, "ap")?.modifier).toBe(1);
  });
});
