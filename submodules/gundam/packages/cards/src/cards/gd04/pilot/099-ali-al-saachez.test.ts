import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  asPlayerId,
  createMockPilot,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04AliAlSaachez099 } from "./099-ali-al-saachez.ts";

describe("Ali al-Saachez (GD04-099)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04AliAlSaachez099] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【During Link】【Attack】You may choose 1 enemy Pilot. Return it to its owner's hand.", () => {
    it("returns a chosen enemy Pilot to hand when Ali's linked Unit attacks", () => {
      const aliUnit = createMockUnit({
        name: "Ali Host",
        ap: 3,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Ali al-Saachez]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const enemyUnit = createMockUnit({
        name: "Enemy Host",
        ap: 1,
        hp: 4,
        level: 3,
        cost: 1,
      });
      const enemyPilot = createMockPilot({ name: "Enemy Pilot", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [aliUnit, gd04AliAlSaachez099],
          resourceArea: activeResources(6),
        },
        {
          hand: [enemyPilot],
          play: [{ card: enemyUnit, exhausted: true }],
          resourceArea: activeResources(6),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.deployUnit(aliUnit));
      expectSuccess(p1.assignPilot(gd04AliAlSaachez099, aliUnit));
      const enemyUnitId = p2.getCardsInZone("battleArea")[0]!;
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
      expectSuccess(p2.assignPilot(enemyPilot, enemyUnitId));
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_ONE);

      const enemyPilotId = engine
        .getRuntime()
        .getInstanceIdByDefinition(asPlayerId(PLAYER_TWO), enemyPilot.cardNumber);
      if (!enemyPilotId) throw new Error("setup failed: enemy pilot not registered");

      expectSuccess(p1.enterBattle(aliUnit, enemyUnitId));
      expectSuccess(p1.resolveEffect({ targets: [enemyPilotId], optionalAnswers: { 0: true } }));

      expect(p2.getHand()).toContain(enemyPilotId);
      expect(engine.getG().pilotAssignments[enemyUnitId]).toBeUndefined();
    });

    it("does not fire when Ali is paired but not linked", () => {
      const nonLinkUnit = createMockUnit({
        name: "Wrong Host",
        ap: 3,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Different Pilot]",
      } as unknown as Parameters<typeof createMockUnit>[0]);
      const enemyUnit = createMockUnit({
        name: "Enemy Host",
        ap: 1,
        hp: 4,
        level: 3,
        cost: 1,
      });
      const enemyPilot = createMockPilot({ name: "Enemy Pilot", level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [nonLinkUnit, gd04AliAlSaachez099],
          resourceArea: activeResources(6),
        },
        {
          hand: [enemyPilot],
          play: [{ card: enemyUnit, exhausted: true }],
          resourceArea: activeResources(6),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.deployUnit(nonLinkUnit));
      expectSuccess(p1.assignPilot(gd04AliAlSaachez099, nonLinkUnit));
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyUnitId = p2.getCardsInZone("battleArea")[0]!;
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_TWO);
      expectSuccess(p2.assignPilot(enemyPilot, enemyUnitId));
      engine.getState().ctx.status.activePlayer = asPlayerId(PLAYER_ONE);

      engine.getG().exhausted[attackerId] = false;
      engine.getG().turnMetadata.deployedThisTurn = [];

      expectSuccess(p1.enterBattle(nonLinkUnit, enemyUnitId));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p2.getHand()).toHaveLength(0);
      expect(engine.getG().pilotAssignments[enemyUnitId]).toBeDefined();
    });
  });
});
