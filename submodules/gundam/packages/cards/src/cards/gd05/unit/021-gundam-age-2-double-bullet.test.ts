import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05GundamAge2DoubleBullet021 } from "./021-gundam-age-2-double-bullet.ts";

function damageCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    name: `${owner} Damage Command`,
    level: 1,
    cost: 1,
    effects: [
      {
        type: "command",
        activation: { timing: ["action"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 3,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Action】Choose 1 ${owner} Unit. Deal 3 damage to it.`,
      },
    ],
  });
}

describe("Gundam AGE-2 Double Bullet (GD05-021)", () => {
  /** @behavioral-proof complete: Action timing/cost/duration and both enemy damage kinds are public. */
  describe("【Activate･Action】【Once per Turn】①：This Unit gets AP+4 during this battle.", () => {
    it("pays 1 Resource, gains AP+4 for the battle, and cannot activate twice", () => {
      const defender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamAge2DoubleBullet021],
          resourceArea: activeResources(2),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourceIds = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.enterBattle(unitId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(unitId, 0));

      expect(resourceIds.filter((id) => p1.isExhausted(id))).toHaveLength(1);
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(8);
      expectSuccess(p2.passBattleAction());
      expectFailure(p1.activateAbility(unitId, 0), "ABILITY_LIMIT_REACHED");
    });

    it("loses AP+4 when the battle ends", () => {
      const defender = createMockUnit({ ap: 0, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          play: [gd05GundamAge2DoubleBullet021],
          resourceArea: activeResources(1),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unitId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.activateAbility(unitId, 0));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
      expect(p2.getDamage(defenderId)).toBe(8);
    });

    it("cannot activate without an active Resource to pay ①", () => {
      const defender = createMockUnit({ hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [gd05GundamAge2DoubleBullet021] },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(unitId, p2.getCardsInZone("battleArea")[0]!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());

      expectFailure(p1.activateAbility(unitId, 0), "INSUFFICIENT_RESOURCES");
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
    });

    it("cannot activate during the Main Phase outside an Action Step", () => {
      const engine = GundamTestEngine.create({
        play: [gd05GundamAge2DoubleBullet021],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.activateAbility(unitId, 0), "WRONG_PHASE");

      expect(p1.isExhausted(p1.getCardsInZone("resourceArea")[0]!)).toBe(false);
      expect(p1.getVisibleCard(unitId)?.effectiveAp).toBe(4);
    });
  });

  describe("【Once per Turn】When this Unit receives enemy damage, if you have an (Earth Federation) Pilot in play, reduce it by 2.", () => {
    it("reduces the first enemy battle damage by 2 and only once that turn", () => {
      const earthFederationPilot = createMockPilot({
        traits: ["earth federation"],
        level: 1,
        cost: 1,
      });
      const firstEnemy = createMockUnit({ name: "First Enemy", ap: 3, hp: 10 });
      const secondEnemy = createMockUnit({ name: "Second Enemy", ap: 3, hp: 10 });
      const engine = GundamTestEngine.create(
        {
          hand: [earthFederationPilot],
          play: [{ card: gd05GundamAge2DoubleBullet021, exhausted: true }],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { play: [firstEnemy, secondEnemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(earthFederationPilot, unitId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(firstEnemyId!, unitId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getDamage(unitId)).toBe(1);

      expectSuccess(p2.enterBattle(secondEnemyId!, unitId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getDamage(unitId)).toBe(4);
    });

    it("reduces enemy effect damage by 2", () => {
      const earthFederationPilot = createMockPilot({
        traits: ["earth federation"],
        level: 1,
        cost: 1,
      });
      const enemyDamage = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [earthFederationPilot],
          play: [gd05GundamAge2DoubleBullet021],
          resourceArea: activeResources(1),
        },
        { hand: [enemyDamage], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(earthFederationPilot, unitId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemyDamage));
      const choice = p2.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") {
        throw new Error("Expected the enemy damage target choice");
      }
      expectSuccess(p2.resolveEffect({ targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(1);
    });

    it("works while the Earth Federation Pilot is paired with another Unit", () => {
      const earthFederationPilot = createMockPilot({
        traits: ["earth federation"],
        level: 1,
        cost: 1,
      });
      const pilotHost = createMockUnit({ name: "Pilot Host" });
      const enemyDamage = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [earthFederationPilot],
          play: [gd05GundamAge2DoubleBullet021, pilotHost],
          resourceArea: activeResources(1),
        },
        { hand: [enemyDamage], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [unitId, pilotHostId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(earthFederationPilot, pilotHostId!));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemyDamage));
      expectSuccess(p2.resolveEffect({ targets: [unitId!] }));

      expect(p1.getDamage(unitId!)).toBe(1);
    });

    it("does not reduce damage when the Earth Federation Pilot is only in hand", () => {
      const earthFederationPilot = createMockPilot({
        traits: ["earth federation"],
        level: 1,
        cost: 1,
      });
      const enemyDamage = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [earthFederationPilot],
          play: [gd05GundamAge2DoubleBullet021],
        },
        { hand: [enemyDamage], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemyDamage));
      expectSuccess(p2.resolveEffect({ targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(3);
    });

    it("does not reduce damage with a non-Earth Federation Pilot in play", () => {
      const otherPilot = createMockPilot({ traits: ["age system"], level: 1, cost: 1 });
      const enemyDamage = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [otherPilot],
          play: [gd05GundamAge2DoubleBullet021],
          resourceArea: activeResources(1),
        },
        { hand: [enemyDamage], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(otherPilot, unitId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(enemyDamage));
      expectSuccess(p2.resolveEffect({ targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(3);
    });

    it("does not reduce friendly effect damage", () => {
      const earthFederationPilot = createMockPilot({
        traits: ["earth federation"],
        level: 1,
        cost: 1,
      });
      const friendlyDamage = damageCommand("friendly");
      const engine = GundamTestEngine.create({
        hand: [earthFederationPilot, friendlyDamage],
        play: [gd05GundamAge2DoubleBullet021],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(earthFederationPilot, unitId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(friendlyDamage));
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));

      expect(p1.getDamage(unitId)).toBe(3);
    });
  });
});
