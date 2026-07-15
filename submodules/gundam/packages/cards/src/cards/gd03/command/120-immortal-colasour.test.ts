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
import { gd03ImmortalColasour120 } from "./120-immortal-colasour.ts";

describe("Immortal Colasour (GD03-120)", () => {
  describe("【Main】During this turn, if a friendly (Superpower Bloc)/(UN) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (Superpower Bloc)/(UN) Unit. Set it as active. It can't attack during this turn.", () => {
    function setup({
      attackerTraits = ["superpower bloc"],
      readyTargetTraits = ["superpower bloc"],
      resources = 2,
      resourcesAvailable = true,
    }: {
      attackerTraits?: string[];
      readyTargetTraits?: string[];
      resources?: number;
      resourcesAvailable?: boolean;
    } = {}) {
      const readyTarget = createMockUnit({
        name: "Ready Target",
        traits: readyTargetTraits,
        ap: 2,
        hp: 4,
      });
      const attacker = createMockUnit({
        name: "Battle Destroyer",
        traits: attackerTraits,
        ap: 4,
        hp: 4,
      });
      const defender = createMockUnit({ name: "Fragile Enemy", ap: 0, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ImmortalColasour120],
          resourceArea: activeResources(resources).map((entry) => ({
            ...entry,
            exhausted: !resourcesAvailable,
          })),
          play: [{ card: readyTarget, exhausted: true }, attacker],
        },
        { play: [{ card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [readyTargetId, attackerId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;
      return {
        p1,
        p2,
        readyTargetId: readyTargetId!,
        attackerId: attackerId!,
        defenderId,
        commandId,
      };
    }

    function resolveBattle(ctx: ReturnType<typeof setup>) {
      expectSuccess(ctx.p1.enterBattle(ctx.attackerId, ctx.defenderId));
      expectSuccess(ctx.p2.passBlock());
      expectSuccess(ctx.p2.passBattleAction());
      expectSuccess(ctx.p1.passBattleAction());
    }

    it("creates a delayed trigger that readies a rested friendly Superpower Bloc Unit after a qualifying battle destroy", () => {
      const ctx = setup();

      expectSuccess(ctx.p1.playCommand(ctx.commandId));
      resolveBattle(ctx);
      const choice = ctx.p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).toContain(ctx.readyTargetId);
      expectSuccess(ctx.p1.resolveEffect({ targets: [ctx.readyTargetId] }));

      expect(ctx.p1.isExhausted(ctx.readyTargetId)).toBe(false);
      expect(ctx.p2.getCardZone(ctx.defenderId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("also triggers from a friendly UN Unit destroying an enemy Unit with battle damage", () => {
      const ctx = setup({
        attackerTraits: ["un"],
        readyTargetTraits: ["un"],
      });

      expectSuccess(ctx.p1.playCommand(ctx.commandId));
      resolveBattle(ctx);
      const choice = ctx.p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected a target choice");
      expect(choice.legalTargetIds).toContain(ctx.readyTargetId);
      expectSuccess(ctx.p1.resolveEffect({ targets: [ctx.readyTargetId] }));

      expect(ctx.p1.isExhausted(ctx.readyTargetId)).toBe(false);
    });

    it("does not trigger when the battle-destroying friendly Unit has neither listed trait", () => {
      const ctx = setup({
        attackerTraits: ["aeug"],
      });

      expectSuccess(ctx.p1.playCommand(ctx.commandId));
      resolveBattle(ctx);

      expect(ctx.p1.getBoardView().pendingChoice).toBeUndefined();
      expect(ctx.p1.isExhausted(ctx.readyTargetId)).toBe(true);
    });

    it("does not trigger before the command has been played", () => {
      const ctx = setup();

      resolveBattle(ctx);

      expect(ctx.p1.getBoardView().pendingChoice).toBeUndefined();
      expect(ctx.p1.isExhausted(ctx.readyTargetId)).toBe(true);
    });

    it("prevents the Unit readied by the delayed trigger from attacking during this turn", () => {
      const ctx = setup();

      expectSuccess(ctx.p1.playCommand(ctx.commandId));
      resolveBattle(ctx);
      expectSuccess(ctx.p1.resolveEffect({ targets: [ctx.readyTargetId] }));

      expectFailure(ctx.p1.enterBattle(ctx.readyTargetId, "direct"), "CANNOT_ATTACK");
    });

    it("moves the command card to trash after creating the delayed trigger", () => {
      const { p1, commandId } = setup();

      expectSuccess(p1.playCommand(commandId));

      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not ready a qualifying Unit after the turn ends", () => {
      const readyTarget = createMockUnit({ traits: ["superpower bloc"], ap: 2, hp: 4 });
      const attacker = createMockUnit({ traits: ["superpower bloc"], ap: 4, hp: 4 });
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const restFriendly = createRestCommand("friendly");
      const restEnemy = createRestCommand("opponent");
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ImmortalColasour120, restFriendly, restEnemy],
          resourceArea: activeResources(5),
          play: [readyTarget, attacker],
          deck: 5,
        },
        { play: [{ card: defender, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [readyTargetId, attackerId] = p1.getCardsInZone("battleArea");
      const commandId = p1.getHand()[0]!;
      const restFriendlyId = p1.getHand()[1]!;
      const restEnemyId = p1.getHand()[2]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.playCommand(restFriendlyId, { targets: [readyTargetId!] }));
      expectSuccess(p1.playCommand(restEnemyId, { targets: [defenderId] }));
      expectSuccess(p1.enterBattle(attackerId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.isExhausted(readyTargetId!)).toBe(true);
    });

    it("cannot be played without enough active resources", () => {
      const { p1, commandId } = setup({ resourcesAvailable: false });

      expectFailure(p1.playCommand(commandId), "INSUFFICIENT_RESOURCES");
    });

    it("cannot be played outside Main timing", () => {
      const ctx = setup();
      expectSuccess(ctx.p1.enterBattle(ctx.attackerId, ctx.defenderId));
      expectSuccess(ctx.p2.passBlock());
      expectSuccess(ctx.p2.passBattleAction());

      expectFailure(ctx.p1.playCommand(ctx.commandId), "WRONG_TIMING");
    });

    it("can be played as Patrick Colasour and visibly grants AP+1", () => {
      const host = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd03ImmortalColasour120],
        play: [host],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
    });
  });
});

function createRestCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    name: `Rest ${owner} Unit`,
    effect: `【Main】Choose 1 ${owner} Unit. Rest it.`,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "rest",
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Choose 1 ${owner} Unit. Rest it.`,
      },
    ],
  });
}
