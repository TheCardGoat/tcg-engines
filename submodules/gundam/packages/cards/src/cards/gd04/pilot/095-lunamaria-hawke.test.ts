import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockUnit,
  expectSuccess,
  getDamageCounter,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04LunamariaHawke095 } from "./095-lunamaria-hawke.ts";

describe("Lunamaria Hawke (GD04-095)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04LunamariaHawke095] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【When Linked】redirects battle damage from the chosen Minerva Squad Unit to this Unit", () => {
    const host = createMockUnit({
      name: "Lunamaria Host",
      ap: 1,
      hp: 8,
      linkCondition: "[Lunamaria Hawke]",
    });
    const protectedUnit = createMockUnit({
      name: "Protected Minerva Squad Unit",
      traits: ["minerva squad"],
      hp: 8,
    });
    const enemy = createMockUnit({ name: "Enemy Attacker", ap: 2, hp: 8 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd04LunamariaHawke095],
        play: [host, protectedUnit],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, protectedId] = p1.getCardsInZone("battleArea");
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04LunamariaHawke095, hostId!));
    engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
    engine.getState().ctx.status.turnPlayer = asPlayerId(PLAYER_TWO);

    expectSuccess(engine.resolveCombat({ attackerId: enemyId, target: protectedId! }));

    expect(getDamageCounter(engine, protectedId!)).toBe(0);
    expect(getDamageCounter(engine, hostId!)).toBe(2);
  });
});
