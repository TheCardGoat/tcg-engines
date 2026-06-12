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
import { gd04RosamiaBadam082 } from "./082-rosamia-badam.ts";

describe("Rosamia Badam (GD04-082)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04RosamiaBadam082] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  it("【When Linked】deals 1 damage to a rested Unit", () => {
    const host = createMockUnit({ linkCondition: "[Rosamia Badam]" });
    const target = { card: createMockUnit({ hp: 4 }), exhausted: true };
    const engine = GundamTestEngine.create(
      { hand: [gd04RosamiaBadam082], play: [host], resourceArea: activeResources(4) },
      { play: [target] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd04RosamiaBadam082, hostId));

    expect(getDamageCounter(engine, targetId)).toBe(1);
  });
});
