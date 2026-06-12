import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Peacemillion125 } from "./125-peacemillion.ts";

describe("Peacemillion (GD03-125)", () => {
  it("【Burst】Deploy this card — flips into baseSection on shield destruction", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03Peacemillion125] });
    const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Peacemillion125);

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `baseSection:${PLAYER_TWO}`,
    );
  });

  it("【Deploy】 adds 1 shield to hand when deployed", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd03Peacemillion125], resourceArea: activeResources(6), deck: 6 },
      {},
    );
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployBase(gd03Peacemillion125));

    expect(p1.getHand()).toContain(shieldIds[0]);
    expect(p1.getCardsInZone("baseSection").length).toBe(1);
  });

  describe("【Once per Turn】During your turn, when a friendly (Operation Meteor)/(G Team) Unit that is Lv.6 or higher destroys an enemy Unit with battle damage, that friendly Unit may recover 2 HP.", () => {
    it("may recover 2 HP on the friendly Lv.6+ Operation Meteor Unit that destroyed an enemy Unit with battle damage", () => {
      const attacker = createMockUnit({
        cardNumber: "TEST-OPERATION-METEOR-L6",
        traits: ["operation meteor"],
        level: 6,
        ap: 4,
        hp: 6,
      });
      const enemy = createMockUnit({ ap: 0, hp: 2 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd03Peacemillion125], play: [attacker] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      engine.getG().damage[attackerId] = 3;

      expectSuccess(engine.resolveCombat({ attackerId, target: enemyId }));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getDamage(attackerId)).toBe(1);
      expect(p2.getCardsInZone("trash")).toContain(enemyId);
    });

    it("may decline the recovery after the qualifying battle destroy", () => {
      const attacker = createMockUnit({
        cardNumber: "TEST-G-TEAM-DECLINE",
        traits: ["g team"],
        level: 6,
        ap: 4,
        hp: 6,
      });
      const enemy = createMockUnit({ ap: 0, hp: 2 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd03Peacemillion125], play: [attacker] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      engine.getG().damage[attackerId] = 3;

      expectSuccess(engine.resolveCombat({ attackerId, target: enemyId }));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getDamage(attackerId)).toBe(3);
    });

    it("does not trigger for a matching-trait Unit below Lv.6", () => {
      const attacker = createMockUnit({
        cardNumber: "TEST-G-TEAM-L5",
        traits: ["g team"],
        level: 5,
        ap: 4,
        hp: 6,
      });
      const enemy = createMockUnit({ ap: 0, hp: 2 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd03Peacemillion125], play: [attacker] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      engine.getG().damage[attackerId] = 3;

      expectSuccess(engine.resolveCombat({ attackerId, target: enemyId }));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.getDamage(attackerId)).toBe(3);
    });

    it("does not trigger for a Lv.6 Unit without Operation Meteor or G Team", () => {
      const attacker = createMockUnit({
        cardNumber: "TEST-WRONG-TRAIT-L6",
        traits: ["earth federation"],
        level: 6,
        ap: 4,
        hp: 6,
      });
      const enemy = createMockUnit({ ap: 0, hp: 2 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd03Peacemillion125], play: [attacker] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      engine.getG().damage[attackerId] = 3;

      expectSuccess(engine.resolveCombat({ attackerId, target: enemyId }));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.getDamage(attackerId)).toBe(3);
    });

    it("does not trigger when the enemy Unit survives the battle damage", () => {
      const attacker = createMockUnit({
        cardNumber: "TEST-G-TEAM-SURVIVE",
        traits: ["g team"],
        level: 6,
        ap: 2,
        hp: 6,
      });
      const enemy = createMockUnit({ ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        { baseSection: [gd03Peacemillion125], play: [attacker] },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
      engine.getG().damage[attackerId] = 3;

      expectSuccess(engine.resolveCombat({ attackerId, target: enemyId }));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.getDamage(attackerId)).toBe(3);
    });
  });
});
