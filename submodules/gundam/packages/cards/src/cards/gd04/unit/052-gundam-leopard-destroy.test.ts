import { describe, it, expect } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd04GundamLeopardDestroy052 } from "./052-gundam-leopard-destroy.ts";

describe("Gundam Leopard Destroy (GD04-052)", () => {
  it("【During Pair】【Attack】deals 2 damage to an enemy Unit and itself", () => {
    const pilot = createMockPilot({ traits: ["vulture"] });
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      {
        play: [gd04GundamLeopardDestroy052],
        hand: [pilot],
        resourceArea: activeResources(6),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, leopardId));
    expectSuccess(p1.enterBattle(leopardId, "direct"));

    expect(getDamageCounter(engine, leopardId)).toBe(2);
    expect(getDamageCounter(engine, enemyId)).toBe(2);
  });

  it("does not fire the attack damage effect while unpaired", () => {
    const enemy = createMockUnit({ hp: 6 });
    const engine = GundamTestEngine.create(
      { play: [gd04GundamLeopardDestroy052] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const leopardId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(leopardId, "direct"));

    expect(getDamageCounter(engine, leopardId)).toBe(0);
    expect(getDamageCounter(engine, enemyId)).toBe(0);
  });
});
