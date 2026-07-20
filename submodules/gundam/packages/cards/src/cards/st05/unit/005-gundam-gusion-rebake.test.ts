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
  restedResources,
} from "@tcg/gundam-engine";
import { st05GundamGusionRebake005 } from "./005-gundam-gusion-rebake.ts";

function destroyEnemyUnitCommand() {
  return createMockCommand({
    name: "Destroy Enemy Unit",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 4,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 enemy Unit. Deal 4 damage to it.",
      },
    ],
  });
}

describe("Gundam Gusion Rebake (ST05-005)", () => {
  describe("【Destroyed】Choose 1 enemy Unit with 4 or less AP. Rest it.", () => {
    it("lets its controller choose the exact AP4 enemy after battle destruction", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 4, hp: 10 });
      const otherEnemy = createMockUnit({ name: "Other Enemy", ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker, otherEnemy] },
        { play: [{ card: st05GundamGusionRebake005, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, otherEnemyId] = p1.getCardsInZone("battleArea");
      const gusionId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId!, gusionId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: gusionId,
        legalTargetIds: expect.arrayContaining([attackerId, otherEnemyId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p2.resolveEffect({ targets: [attackerId!] }));

      expect(p2.getCardZone(gusionId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.isExhausted(attackerId!)).toBe(true);
      expect(p1.isExhausted(otherEnemyId!)).toBe(false);
    });

    it("also triggers when an opponent's effect destroys it", () => {
      const destroyCommand = destroyEnemyUnitCommand();
      const enemy = createMockUnit({ name: "Enemy Candidate", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [st05GundamGusionRebake005], deck: 3 },
        { hand: [destroyCommand], play: [enemy], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gusionId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.playCommand(destroyCommand, { targets: [gusionId] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p1.getCardZone(gusionId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("rejects an enemy Unit with more than 4 AP", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 5, hp: 10 });
      const eligible = createMockUnit({ name: "Eligible", ap: 4, hp: 5 });
      const tooStrong = createMockUnit({ name: "Too Strong", ap: 5, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker, eligible, tooStrong] },
        { play: [{ card: st05GundamGusionRebake005, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [attackerId, eligibleId, tooStrongId] = p1.getCardsInZone("battleArea");
      const gusionId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId!, gusionId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectFailure(p2.resolveEffect({ targets: [tooStrongId!] }), "ILLEGAL_TARGET");

      expect(p1.isExhausted(eligibleId!)).toBe(false);
      expect(p1.isExhausted(tooStrongId!)).toBe(false);
    });

    it("rejects its controller's own Unit", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 5, hp: 10 });
      const eligibleEnemy = createMockUnit({ name: "Eligible Enemy", ap: 4, hp: 5 });
      const friendly = createMockUnit({ name: "Friendly Candidate", ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [attacker, eligibleEnemy] },
        {
          play: [{ card: st05GundamGusionRebake005, exhausted: true }, friendly],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const [gusionId, friendlyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(attackerId, gusionId!));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectFailure(p2.resolveEffect({ targets: [friendlyId!] }), "ILLEGAL_TARGET");

      expect(p2.isExhausted(friendlyId!)).toBe(false);
    });

    it("cleanly skips when every enemy Unit has 5 or more AP", () => {
      const attacker = createMockUnit({ name: "Attacker", ap: 5, hp: 10 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { play: [{ card: st05GundamGusionRebake005, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const gusionId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, gusionId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.isExhausted(attackerId)).toBe(true);
      expect(p2.getCardZone(gusionId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("playing Gundam Gusion Rebake", () => {
    it("pays 3 Resources and deploys it to the battle area", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamGusionRebake005],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gusionId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(gusionId));

      expect(p1.getCardZone(gusionId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(3);
    });

    it("cannot be deployed below its printed Lv.4 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamGusionRebake005],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05GundamGusionRebake005), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st05GundamGusionRebake005)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without 3 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamGusionRebake005],
        resourceArea: [...activeResources(2), ...restedResources(2)],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st05GundamGusionRebake005), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st05GundamGusionRebake005)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamGusionRebake005],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(st05GundamGusionRebake005), "WRONG_PHASE");

      expect(p1.getCardZone(st05GundamGusionRebake005)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
