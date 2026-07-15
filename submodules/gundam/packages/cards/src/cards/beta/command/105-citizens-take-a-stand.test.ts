import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  asPlayerId,
  expectSuccess,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  type ContinuousEffectEntry,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { betaCitizensTakeAStand105 } from "./105-citizens-take-a-stand.ts";
describe("Citizens, Take a Stand! (GD01-105, beta reprint)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({ deck: [betaCitizensTakeAStand105] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");
    engine
      .getRuntime()
      .registerCardInstance(shieldId, betaCitizensTakeAStand105.cardNumber, asPlayerId(PLAYER_ONE));

    const p1 = engine.asPlayer(PLAYER_ONE);
    const handBefore = p1.getHand().length;

    engine.fireShieldBurst(shieldId);

    expect(p1.getHand()).toContain(shieldId);
    expect(p1.getHand().length).toBe(handBefore + 1);
  });

  describe("【Main】All your Units get AP+2 during this turn.", () => {
    it("applies AP+2 to every friendly unit in play", () => {
      const u1 = createMockUnit({ ap: 2, hp: 5 });
      const u2 = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [betaCitizensTakeAStand105],
        resourceArea: activeResources(4),
        play: [u1, u2],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [u1Id, u2Id] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaCitizensTakeAStand105));

      const effects = engine.getG().continuousEffects;
      const u1Effects = effects.filter((e: ContinuousEffectEntry) => e.targetId === u1Id);
      const u2Effects = effects.filter((e: ContinuousEffectEntry) => e.targetId === u2Id);
      expect(u1Effects.length).toBe(1);
      expect(u1Effects[0]!.payload).toEqual({
        kind: "stat-modifier",
        stat: "ap",
        modifier: 2,
      });
      expect(u2Effects.length).toBe(1);
      expect(u2Effects[0]!.payload).toEqual({
        kind: "stat-modifier",
        stat: "ap",
        modifier: 2,
      });
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
