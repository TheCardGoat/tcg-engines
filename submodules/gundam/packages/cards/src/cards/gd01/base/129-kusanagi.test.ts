import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
  asPlayerId,
} from "@tcg/gundam-engine";
import { gd01Kusanagi129 } from "./129-kusanagi.ts";

describe("Kusanagi (GD01-129)", () => {
  it("【Burst】Deploy this card — flips Kusanagi into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd01Kusanagi129] });
    const state = engine.getState();
    const priv = state.ctx.zones.private;
    const pub = state.ctx.zones.public.zoneSummaries;
    const deckKey = `deck:${PLAYER_TWO}`;
    const shieldKey = `shieldArea:${PLAYER_TWO}`;
    const shieldId = (priv.zoneCards[deckKey] ?? []).shift();
    if (!shieldId) throw new Error("seed setup: no shield created");
    (priv.zoneCards[shieldKey] ??= []).push(shieldId);
    const e = priv.cardIndex[shieldId]!;
    e.zoneKey = shieldKey;
    e.index = priv.zoneCards[shieldKey]!.length - 1;
    pub[deckKey] = { count: priv.zoneCards[deckKey]!.length, revision: 1 };
    pub[shieldKey] = { count: priv.zoneCards[shieldKey]!.length, revision: 1 };

    engine
      .getRuntime()
      .registerCardInstance(shieldId, gd01Kusanagi129.cardNumber, asPlayerId(PLAYER_TWO));

    engine.fireShieldBurst(shieldId);
    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`baseSection:${PLAYER_TWO}`);
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.", () => {
    it("returns a chosen low-HP enemy to hand (not the base itself) on deploy", () => {
      const lowHpEnemy = createMockUnit({ ap: 2, hp: 3 });
      const highHpEnemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Kusanagi129],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [lowHpEnemy, highHpEnemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      for (let i = 0; i < 3; i++) {
        engine.giveCard(asPlayerId(PLAYER_ONE), createMockResource().cardNumber, {
          zone: "shieldArea",
          playerId: PLAYER_ONE,
        });
      }

      const shieldsBefore = p1.getCardsInZone("shieldArea").length;
      const enemyIds = p2.getCardsInZone("battleArea");
      const lowHpEnemyId = enemyIds[0]!;
      const highHpEnemyId = enemyIds[1]!;
      const p2HandBefore = p2.getCardsInZone("hand").length;

      expectSuccess(p1.deployBase(gd01Kusanagi129, { targets: [lowHpEnemyId] }));

      // Pre-committed targets auto-drain; no halt required.
      expect(engine.getPendingChoice()).toBeUndefined();

      // Base itself stayed in the base section — not bounced by its own effect.
      expect(p1.getCardsInZone("baseSection").length).toBe(1);
      expect(p1.getCardsInZone("shieldArea").length).toBe(shieldsBefore - 1);

      // The low-HP enemy was returned to its owner's hand.
      expect(p2.getCardsInZone("battleArea")).not.toContain(lowHpEnemyId);
      expect(p2.getCardsInZone("battleArea")).toContain(highHpEnemyId);
      expect(p2.getCardsInZone("hand").length).toBe(p2HandBefore + 1);
    });

    it("rejects targeting an enemy unit with HP above 3", () => {
      const highHpEnemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd01Kusanagi129],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [highHpEnemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      const highHpEnemyId = p2.getCardsInZone("battleArea")[0]!;
      const result = p1.deployBase(gd01Kusanagi129, { targets: [highHpEnemyId] });
      expect(result.success).toBe(false);
    });
  });
});
