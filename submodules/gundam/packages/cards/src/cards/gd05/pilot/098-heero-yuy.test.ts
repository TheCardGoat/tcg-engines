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
} from "@tcg/gundam-engine";
import { gd05HeeroYuy098 } from "./098-heero-yuy.ts";

describe("Heero Yuy (GD05-098)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds this Pilot to hand when its controller accepts the revealed Shield prompt", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05HeeroYuy098] },
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

      expectCard(p2, gd05HeeroYuy098).toBeIn("hand");
      expectPlayer(p2).toHaveShieldCount(0);
    });

    it("puts this Pilot into trash when its controller declines Burst", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [gd05HeeroYuy098] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(attacker).into("direct");
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();
      p2.must.declineOptional(-1);

      expectCard(p2, gd05HeeroYuy098).toBeIn("trash");
    });
  });

  describe("When this Unit destroys an enemy shield area card with damage, choose 1 enemy Unit. It gets AP-2 during this turn.", () => {
    it("pairs onto a host Unit through a public assignPilot move", () => {
      const unit = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [gd05HeeroYuy098],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.assignPilot(gd05HeeroYuy098, unit);
      expectPublicLog(engine, "gundam.move.assignPilot", { playerId: PLAYER_ONE });
      expectCard(p1, unit).toHavePilot().toHaveAp(4).toHaveHp(5);
    });

    it("reduces a chosen enemy Unit's AP by 2 when its paired Unit destroys an enemy Shield", () => {
      const host = createMockUnit({ ap: 2, hp: 4 });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const otherEnemy = createMockUnit({ ap: 5, hp: 4 });
      const shield = createMockUnit({ name: "Enemy Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05HeeroYuy098],
          play: [host],
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [enemy, otherEnemy], shieldArea: [shield], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.assignPilot(gd05HeeroYuy098, host);
      p1.must.attack(host).into("direct");
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: expect.arrayContaining([
          p2.unit(enemy).instanceId,
          p2.unit(otherEnemy).instanceId,
        ]),
        minTargets: 1,
        maxTargets: 1,
      });
      p1.must.resolveTargets(enemy);

      expectCard(p2, enemy).toHaveAp(2);
      expectCard(p2, otherEnemy).toHaveAp(5);
      expectPlayer(p2).toHaveShieldCount(0);
    });

    it("does not offer an AP reduction when the paired Unit attacks an enemy Unit instead of a Shield", () => {
      const host = createMockUnit({ ap: 2, hp: 4 });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd05HeeroYuy098],
          play: [host],
          resourceArea: activeResources(4),
          deck: 3,
        },
        {
          play: [{ card: enemy, exhausted: true }],
          shieldArea: [createMockUnit({ name: "Untouched Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

      p1.must.assignPilot(gd05HeeroYuy098, host);
      p1.must.attack(host).into(enemy);
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectPlayer(p2).toHaveShieldCount(shieldsBefore);
      expectCard(p2, enemy).toBeIn("battleArea").toHaveAp(4);
    });

    it("does not trigger when an unpaired host Unit destroys a Shield", () => {
      const host = createMockUnit({ ap: 2, hp: 4 });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          play: [host],
          resourceArea: activeResources(4),
          deck: 3,
        },
        {
          play: [enemy],
          shieldArea: [createMockUnit({ name: "Enemy Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(host).into("direct");
      p2.must.passBlock().passBattleAction();
      p1.must.passBattleAction();

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expectCard(p2, enemy).toHaveAp(4);
    });
  });
});
