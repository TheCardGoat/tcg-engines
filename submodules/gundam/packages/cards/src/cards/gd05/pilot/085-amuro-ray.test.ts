import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCard,
  expectPlayer,
  expectPublicLog,
  resolveBattle,
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05AmuroRay085 } from "./085-amuro-ray.ts";

describe("Amuro Ray (GD05-085)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds this Pilot to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05AmuroRay085] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(attacker).into("direct");
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        directiveIndex: -1,
      });
      p2.must.acceptOptional(-1);

      expectCard(p2, gd05AmuroRay085).toBeIn("hand");
      expectPlayer(p2).toHaveShieldCount(0);
    });

    it("puts this Pilot into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05AmuroRay085] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(attacker).into("direct");
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();
      p2.must.declineOptional(-1);

      expectCard(p2, gd05AmuroRay085).toBeIn("trash");
    });
  });

  describe("During your turn, when this Unit destroys an enemy Unit with battle damage, this Unit recovers 2 HP.", () => {
    it("pairs onto a host Unit through a public assignPilot move", () => {
      const unit = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd05AmuroRay085],
        play: [unit],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.assignPilot(gd05AmuroRay085, unit);
      expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });
      expectCard(p1, unit).toHavePilot().toHaveAp(4).toHaveHp(6);
    });

    it("recovers exactly 2 HP when its paired Unit destroys an enemy Unit with battle damage", () => {
      const host = createMockUnit({ ap: 3, hp: 6 });
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AmuroRay085],
          play: [{ card: host, damage: 2 }],
          resourceArea: activeResources(5),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(gd05AmuroRay085, host);
      expectCard(p1, host).toHaveDamage(2);
      resolveBattle(engine, host, defender);

      expectCard(p2, defender).toBeIn("trash");
      expectCard(p1, host).toHaveDamage(0);
    });

    it("does not recover when a different friendly Unit destroys the enemy Unit", () => {
      const host = createMockUnit({ name: "Amuro Host", ap: 2, hp: 6 });
      const otherAttacker = createMockUnit({ name: "Other Attacker", ap: 3, hp: 4 });
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AmuroRay085],
          play: [{ card: host, damage: 2 }, otherAttacker],
          resourceArea: activeResources(5),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(gd05AmuroRay085, host);
      resolveBattle(engine, otherAttacker, defender);

      expectCard(p2, defender).toBeIn("trash");
      expectCard(p1, host).toHaveDamage(2);
    });

    it("does not recover when the paired Unit fails to destroy the defender", () => {
      const host = createMockUnit({ ap: 1, hp: 6 });
      const defender = createMockUnit({ ap: 0, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AmuroRay085],
          play: [{ card: host, damage: 2 }],
          resourceArea: activeResources(5),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(gd05AmuroRay085, host);
      resolveBattle(engine, host, defender);

      expectCard(p2, defender).toBeIn("battleArea");
      expectCard(p1, host).toHaveDamage(2);
    });

    it("does not recover when the paired Unit destroys an enemy Unit on the opponent's turn", () => {
      const host = createMockUnit({ ap: 4, hp: 6 });
      const attacker = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05AmuroRay085],
          play: [{ card: host, damage: 2 }],
          resourceArea: activeResources(5),
          deck: 3,
          shieldArea: [createMockUnit()],
        },
        {
          play: [attacker],
          deck: 3,
          shieldArea: [createMockUnit()],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(gd05AmuroRay085, host);
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [p1.unit(host).instanceId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      p2.must.attack(attacker).into(host);
      p1.must.passBlock().passBattleAction();
      p2.must.passBattleAction();

      // Host survives (AP 4+2 vs AP 1); the enemy attacker dies to counter damage,
      // but the destroyer is not "this Unit" on the Amuro controller's turn.
      expectCard(p2, attacker).toBeIn("trash");
      expectCard(p1, host).toBeIn("battleArea").toHaveDamage(3);
    });
  });
});
