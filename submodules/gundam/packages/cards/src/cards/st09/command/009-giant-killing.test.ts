import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st09GiantKilling009 } from "./009-giant-killing.ts";

describe("Giant Killing (ST09-009)", () => {
  describe("【Main】/【Action】Choose 1 active enemy Unit with 4 or less AP. Destroy it.", () => {
    it("publishes every eligible enemy Unit, destroys the chosen physical Unit and its paired Pilot, and trashes the Command", () => {
      const firstEnemy = createMockUnit({ name: "First Enemy", ap: 4, hp: 5 });
      const chosenEnemy = createMockUnit({ name: "Chosen Enemy", ap: 2, hp: 5 });
      const pairedPilot = createMockPilot({
        name: "Paired Pilot",
        level: 1,
        cost: 1,
        apBonus: 1,
      });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4), deck: 5 },
        {
          hand: [pairedPilot],
          play: [firstEnemy, chosenEnemy],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const [firstEnemyId, chosenEnemyId] = p2.getCardsInZone("battleArea");
      const pilotId = p2.getHand()[0]!;

      expectSuccess(p2.assignPilot(pilotId, chosenEnemyId!));
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(commandId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: commandId,
        controllerId: PLAYER_ONE,
        legalTargetIds: expect.arrayContaining([firstEnemyId, chosenEnemyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [chosenEnemyId!] }));

      expect(p2.getCardZone(firstEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p2.getCardZone(chosenEnemyId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardZone(pilotId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("destroys an active enemy Unit with exactly 4 effective AP", () => {
      const enemy = createMockUnit({ ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(st09GiantKilling009, { targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("can destroy an eligible enemy Unit during a battle Action Step", () => {
      const attacker = createMockUnit({ ap: 1, hp: 5 });
      const battleDefender = createMockUnit({ ap: 1, hp: 5 });
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st09GiantKilling009],
          play: [attacker],
          resourceArea: activeResources(4),
        },
        { play: [{ card: battleDefender, exhausted: true }, enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [battleDefenderId, enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, battleDefenderId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.playCommand(st09GiantKilling009, { targets: [enemyId!] }));

      expect(p2.getCardZone(enemyId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardsInZone("trash")).toHaveLength(1);
    });

    it("rejects an enemy Unit whose Pilot raises its effective AP above 4", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const pilot = createMockPilot({ name: "AP Pilot", level: 1, cost: 1, apBonus: 2 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4), deck: 5 },
        {
          hand: [pilot],
          play: [enemy],
          resourceArea: activeResources(1),
          deck: 5,
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.assignPilot(pilot, enemyId));
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());

      expectFailure(p1.playCommand(commandId, { targets: [enemyId] }), "INVALID_TARGET");
      expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("rejects an enemy Unit with printed AP above 4", () => {
      const enemy = createMockUnit({ ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(st09GiantKilling009, { targets: [enemyId] }), "INVALID_TARGET");
      expect(p1.getCardZone(st09GiantKilling009)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects a rested enemy Unit even when its AP is low enough", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectFailure(p1.playCommand(st09GiantKilling009, { targets: [enemyId] }), "INVALID_TARGET");
      expect(p1.getCardZone(st09GiantKilling009)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("rejects a friendly active Unit", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st09GiantKilling009],
        resourceArea: activeResources(4),
        play: [friendly],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const friendlyId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.playCommand(st09GiantKilling009, { targets: [friendlyId] }),
        "INVALID_TARGET",
      );
      expect(p1.getCardZone(friendlyId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("cannot be played when there is no legal target", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(4) },
        { play: [createMockUnit({ ap: 6 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st09GiantKilling009), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(st09GiantKilling009)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: activeResources(3) },
        { play: [createMockUnit({ ap: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st09GiantKilling009), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st09GiantKilling009)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without three active Resources", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09GiantKilling009], resourceArea: restedResources(4) },
        { play: [createMockUnit({ ap: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st09GiantKilling009), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st09GiantKilling009)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
