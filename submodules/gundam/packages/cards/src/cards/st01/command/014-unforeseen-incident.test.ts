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
import { st01UnforeseenIncident014 } from "./014-unforeseen-incident.ts";

describe("Unforeseen Incident (ST01-014)", () => {
  describe("【Burst】Activate this card's 【Main】.", () => {
    it("offers the Shield owner the Burst and applies AP-3 to the chosen enemy Unit", () => {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 5, hp: 4 });
      const otherEnemy = createMockUnit({ name: "Other Enemy", ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st01UnforeseenIncident014] },
        { play: [attacker, otherEnemy] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, otherEnemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(attackerId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expect(burst).toMatchObject({ controllerId: PLAYER_ONE, directiveIndex: -1 });
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const target = p1.getBoardView().pendingChoice;
      if (target?.kind !== "targetSelection") {
        throw new Error("Expected the Burst to ask which enemy Unit gets AP-3");
      }
      expect(target.legalTargetIds).toEqual(expect.arrayContaining([attackerId, otherEnemyId]));
      expectSuccess(p1.resolveEffect({ targets: [otherEnemyId!] }));

      expect(p2.getVisibleCard(attackerId!)?.effectiveAp).toBe(5);
      expect(p2.getVisibleCard(otherEnemyId!)?.effectiveAp).toBe(1);
      expect(p1.getCardZone(st01UnforeseenIncident014)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("moves the revealed Shield to trash without changing AP when its owner declines", () => {
      const attacker = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st01UnforeseenIncident014] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getVisibleCard(attackerId)?.effectiveAp).toBe(5);
      expect(p1.getCardZone(st01UnforeseenIncident014)).toBe(`trash:${PLAYER_ONE}`);
    });
  });

  describe("【Main】/【Action】Choose 1 enemy Unit. It gets AP-3 during this turn.", () => {
    it("applies AP-3 to exactly the chosen enemy Unit during Main and moves to trash", () => {
      const firstEnemy = createMockUnit({ ap: 5, hp: 4 });
      const secondEnemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st01UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [firstEnemy, secondEnemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [firstEnemyId, secondEnemyId] = p2.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(commandId));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected an enemy Unit choice");
      expect(choice).toMatchObject({ minTargets: 1, maxTargets: 1 });
      expect(choice.legalTargetIds).toEqual(expect.arrayContaining([firstEnemyId, secondEnemyId]));
      expectSuccess(p1.resolveEffect({ targets: [secondEnemyId!] }));

      expect(p2.getVisibleCard(firstEnemyId!)?.effectiveAp).toBe(5);
      expect(p2.getVisibleCard(secondEnemyId!)?.effectiveAp).toBe(1);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("can be played in a legally reached Action step", () => {
      const enemy = createMockUnit({ ap: 4, hp: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st01UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(st01UnforeseenIncident014, { targets: [enemyId] }));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(1);
    });

    it("cannot be played during the Block Step before the Action Step begins", () => {
      const attacker = createMockUnit({ ap: 4, hp: 4 });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          hand: [st01UnforeseenIncident014],
          play: [{ card: enemy, exhausted: true }],
          resourceArea: activeResources(3),
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, enemyId));
      expectFailure(
        p2.playCommand(st01UnforeseenIncident014, { targets: [attackerId] }),
        "WRONG_PHASE",
      );
      expect(p2.getCardZone(st01UnforeseenIncident014)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("rejects a friendly Unit target", () => {
      const friendly = createMockUnit({ ap: 5, hp: 4 });
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st01UnforeseenIncident014],
          play: [friendly],
          resourceArea: activeResources(3),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st01UnforeseenIncident014, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(st01UnforeseenIncident014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played when there is no enemy Unit to choose", () => {
      const engine = GundamTestEngine.create({
        hand: [st01UnforeseenIncident014],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st01UnforeseenIncident014), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st01UnforeseenIncident014)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.3 requirement", () => {
      const enemy = createMockUnit();
      const engine = GundamTestEngine.create(
        { hand: [st01UnforeseenIncident014], resourceArea: activeResources(2) },
        { play: [enemy] },
      );

      expectFailure(
        engine.asPlayer(PLAYER_ONE).playCommand(st01UnforeseenIncident014),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot pay its printed cost after legal setup leaves no active Resource", () => {
      const setup = createMockCommand({
        level: 0,
        cost: 3,
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
        { hand: [setup, st01UnforeseenIncident014], resourceArea: activeResources(3) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [setupId, commandId] = p1.getHand();

      expectSuccess(p1.playCommand(setupId!));
      expectFailure(p1.playCommand(commandId!), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(commandId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("expires the AP modifier when the turn ends", () => {
      const enemy = createMockUnit({ ap: 5, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [st01UnforeseenIncident014], resourceArea: activeResources(3), deck: 5 },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st01UnforeseenIncident014, { targets: [enemyId] }));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
    });
  });
});
