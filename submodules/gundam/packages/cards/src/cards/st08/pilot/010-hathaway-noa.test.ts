import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  buildTargetResolutionContext,
  createMockUnit,
  evaluateTargetFilter,
  getContinuousEffects,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { st08HathawayNoa010 } from "./010-hathaway-noa.ts";

describe("Hathaway Noa (ST08-010)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds this card to hand when its shield is destroyed", () => {
      const engine = GundamTestEngine.create({}, { deck: [st08HathawayNoa010] });
      const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
      if (!shieldId) throw new Error("seed failed");

      engine.fireShieldBurst(shieldId);

      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `hand:${PLAYER_TWO}`,
      );
    });
  });

  describe("【When Paired】If this is a (Mafty) Unit, choose 1 of your (Mafty) Units. During this turn, it may choose a damaged active enemy Unit as its attack target.", () => {
    it("lets a friendly Mafty Unit attack a damaged active enemy Unit this turn", () => {
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Hathaway Noa]" });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[enemyId] = 1;

      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));

      const grant = getAttackTargetGrant(engine, hostId);
      expect(grant).toBeDefined();
      expect(grantMatchesEnemy(engine, grant!, enemyId)).toBe(true);
      expectSuccess(p1.enterBattle(hostId, enemyId));
    });

    it("does not include an undamaged active enemy Unit in the granted target filter", () => {
      const host = createMockUnit({ traits: ["mafty"], linkCondition: "[Hathaway Noa]" });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));

      const grant = getAttackTargetGrant(engine, hostId);
      expect(grant).toBeDefined();
      expect(grantMatchesEnemy(engine, grant!, enemyId)).toBe(false);
    });

    it("does not grant the option when Hathaway is paired to a non-Mafty Unit", () => {
      const host = createMockUnit({
        traits: ["earth federation"],
        linkCondition: "[Hathaway Noa]",
      });
      const enemy = createMockUnit({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st08HathawayNoa010],
          play: [host],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[enemyId] = 1;

      expectSuccess(p1.assignPilot(st08HathawayNoa010, hostId));

      expect(getAttackTargetGrant(engine, hostId)).toBeUndefined();
    });
  });
});

function getAttackTargetGrant(engine: GundamTestEngine, unitId: string) {
  return getContinuousEffects(engine).find(
    (effect) => effect.targetId === unitId && effect.payload.kind === "grant-attack-target-option",
  );
}

function grantMatchesEnemy(
  engine: GundamTestEngine,
  grant: NonNullable<ReturnType<typeof getAttackTargetGrant>>,
  enemyId: string,
): boolean {
  if (grant.payload.kind !== "grant-attack-target-option") return false;
  const framework = engine.getRuntime().getFrameworkReadAPI();
  const enemy = framework.cards.get(enemyId);
  if (!enemy) return false;
  const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, framework, {
    sourceCardId: grant.targetId,
  });
  return evaluateTargetFilter(grant.payload.attackTarget, [enemy], ctx).some(
    (id) => id === enemyId,
  );
}
