import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04DeuxMurasame091 } from "../pilot/091-deux-murasame.ts";
import { gd04PsychoGundamGq042 } from "./042-psycho-gundam-gq.ts";

describe("Psycho Gundam (GQ) (GD04-042)", () => {
  describe("【During Link】【Once per Turn】When damage from one of your Units paired with a (Cyber-Newtype) Pilot destroys an enemy shield area card, choose 1 enemy Unit with 5 or less AP. Deal 2 damage to it.", () => {
    it("deals 2 damage after a Cyber-Newtype paired friendly Unit destroys an enemy Shield in battle", () => {
      const enemy = createMockUnit({ ap: 5, hp: 6 });
      const highApEnemy = createMockUnit({ name: "High-AP Enemy", ap: 6, hp: 6 });
      const shield = createMockUnit({ name: "Enemy Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DeuxMurasame091],
          play: [gd04PsychoGundamGq042],
          resourceArea: activeResources(7),
        },
        { play: [enemy, highApEnemy], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      const [enemyId, highApEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd04DeuxMurasame091, psychoId));
      expectSuccess(p1.enterBattle(psychoId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: psychoId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getDamage(enemyId!)).toBe(2);
      expect(p2.getDamage(highApEnemyId!)).toBe(0);
    });

    it("offers the same damage choice when Breach from the paired Unit destroys a Shield", () => {
      const deuxMurasame = createMockPilot({
        name: "Deux Murasame",
        traits: ["cyber-newtype"],
        level: 4,
        cost: 1,
      });
      const cyberNewtypePilot = createMockPilot({ traits: ["cyber-newtype"], cost: 1 });
      const breachAttacker = createMockUnit({
        name: "Cyber-Newtype Breach Unit",
        ap: 4,
        hp: 5,
        keywordEffects: [{ keyword: "Breach", value: 1 }],
      });
      const defender = createMockUnit({ name: "Breach Defender", ap: 1, hp: 3 });
      const enemy = createMockUnit({ name: "Damage Target", ap: 5, hp: 6 });
      const shield = createMockUnit({ name: "Enemy Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [deuxMurasame, cyberNewtypePilot],
          play: [gd04PsychoGundamGq042, breachAttacker],
          resourceArea: activeResources(7),
        },
        {
          play: [{ card: defender, exhausted: true }, enemy],
          shieldArea: [shield],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [psychoId, breachAttackerId] = p1.getCardsInZone("battleArea");
      const [defenderId, enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(deuxMurasame, psychoId!));
      expectSuccess(p1.assignPilot(cyberNewtypePilot, breachAttackerId!));
      expectSuccess(p1.enterBattle(breachAttackerId!, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: psychoId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId!] }));

      expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getDamage(enemyId!)).toBe(2);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("does not trigger from Breach when the damage-dealing Unit lacks a Cyber-Newtype Pilot", () => {
      const deuxMurasame = createMockPilot({
        name: "Deux Murasame",
        traits: ["cyber-newtype"],
        level: 4,
        cost: 1,
      });
      const nonCyberNewtypePilot = createMockPilot({
        name: "Non-Cyber-Newtype Pilot",
        traits: ["earth federation"],
        cost: 1,
      });
      const breachAttacker = createMockUnit({
        name: "Non-Cyber-Newtype Breach Unit",
        ap: 4,
        hp: 5,
        keywordEffects: [{ keyword: "Breach", value: 1 }],
      });
      const defender = createMockUnit({ name: "Breach Defender", ap: 1, hp: 3 });
      const enemy = createMockUnit({ name: "Damage Target", ap: 5, hp: 6 });
      const shield = createMockUnit({ name: "Enemy Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [deuxMurasame, nonCyberNewtypePilot],
          play: [gd04PsychoGundamGq042, breachAttacker],
          resourceArea: activeResources(7),
        },
        {
          play: [{ card: defender, exhausted: true }, enemy],
          shieldArea: [shield],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [psychoId, breachAttackerId] = p1.getCardsInZone("battleArea");
      const [defenderId, enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(deuxMurasame, psychoId!));
      expectSuccess(p1.assignPilot(nonCyberNewtypePilot, breachAttackerId!));
      expectSuccess(p1.enterBattle(breachAttackerId!, defenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId!)).toBe(0);
    });

    it("deals its triggered damage only once per turn", () => {
      const cyberNewtypePilot = createMockPilot({ traits: ["cyber-newtype"], cost: 1 });
      const secondAttacker = createMockUnit({
        name: "Second Cyber-Newtype Unit",
        ap: 3,
        hp: 4,
      });
      const enemy = createMockUnit({ ap: 5, hp: 8 });
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04DeuxMurasame091, cyberNewtypePilot],
          play: [gd04PsychoGundamGq042, secondAttacker],
          resourceArea: activeResources(7),
        },
        { play: [enemy], shieldArea: [firstShield, secondShield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [psychoId, secondAttackerId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd04DeuxMurasame091, psychoId!));
      expectSuccess(p1.assignPilot(cyberNewtypePilot, secondAttackerId!));

      expectSuccess(p1.enterBattle(psychoId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: psychoId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expectSuccess(p1.enterBattle(secondAttackerId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(2);
    });
  });
});
