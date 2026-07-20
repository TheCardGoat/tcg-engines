import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st03CloseCombat013 } from "./013-close-combat.ts";

describe("Close Combat (ST03-013)", () => {
  describe("【Burst】Activate this card's 【Main】.", () => {
    it("activates Main for free, deals 2 effect damage, and moves the Shield to trash", () => {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03CloseCombat013] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Close Combat's Burst choice");
      const shieldId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const target = p2.getBoardView().pendingChoice;
      if (target?.kind !== "targetSelection") {
        throw new Error("Expected Close Combat's Burst to ask for an enemy Unit");
      }
      expect(target).toMatchObject({
        sourceCardId: shieldId,
        legalTargetIds: [attackerId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p2.resolveEffect({ targets: [attackerId] }));

      expect(p1.getDamage(attackerId)).toBe(2);
      expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("moves the revealed Shield to trash without damage when its owner declines Burst", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st03CloseCombat013] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Close Combat's Burst choice");
      const shieldId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p1.getDamage(attackerId)).toBe(0);
      expect(p2.getCardZone(shieldId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 2 damage to it.", () => {
    it("deals exactly 2 damage during Main and moves the resolved Command to trash", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st03CloseCombat013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId, { targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(2);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("can be played during a legally reached battle Action step", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const enemy = createMockUnit({ ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st03CloseCombat013],
          play: [attacker],
          resourceArea: activeResources(2),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, enemyId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.playCommand(st03CloseCombat013, { targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(2);
      expect(p1.getCardZone(st03CloseCombat013)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("destroys an enemy Unit whose remaining HP is 2", () => {
      const enemy = createMockUnit({ hp: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st03CloseCombat013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st03CloseCombat013, { targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("publishes only enemy Units as exact-one legal targets", () => {
      const friendly = createMockUnit({ name: "Friendly" });
      const firstEnemy = createMockUnit({ name: "First Enemy" });
      const secondEnemy = createMockUnit({ name: "Second Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [st03CloseCombat013],
          play: [friendly],
          resourceArea: activeResources(2),
        },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyIds = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st03CloseCombat013));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected an enemy Unit choice");
      expect(choice.legalTargetIds).toEqual(enemyIds);
      expect(choice.minTargets).toBe(1);
      expect(choice.maxTargets).toBe(1);
    });

    it("rejects a friendly Unit target", () => {
      const friendly = createMockUnit({ name: "Friendly" });
      const enemy = createMockUnit({ name: "Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [st03CloseCombat013],
          play: [friendly],
          resourceArea: activeResources(2),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st03CloseCombat013, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(st03CloseCombat013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when there is no legal enemy Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st03CloseCombat013],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st03CloseCombat013), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st03CloseCombat013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.2 requirement", () => {
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [st03CloseCombat013], resourceArea: activeResources(1) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st03CloseCombat013), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st03CloseCombat013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost after a legal setup leaves one active Resource", () => {
      const setup = createMockCommand({
        level: 0,
        cost: 1,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [],
            sourceText: "【Main】Do nothing.",
          },
        ],
      });
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [setup, st03CloseCombat013], resourceArea: activeResources(2) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [setupId, commandId] = p1.getHand();

      expectSuccess(p1.playCommand(setupId!));
      expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played by the standby player during the opponent's Main Phase", () => {
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [st03CloseCombat013], resourceArea: activeResources(2) },
        { play: [enemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st03CloseCombat013), "NOT_ACTIVE_PLAYER");
      expect(p1.getCardZone(st03CloseCombat013)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
