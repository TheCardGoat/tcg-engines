import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectCardInTrash,
  expectFailure,
  expectSuccess,
  isCardExhausted,
} from "@tcg/gundam-engine";
import { gd03ImmortalColasour120 } from "./120-immortal-colasour.ts";

describe("Immortal Colasour (GD03-120)", () => {
  describe("【Main】During this turn, if a friendly (Superpower Bloc)/(UN) Unit destroys an enemy Unit with battle damage, choose 1 rested friendly (Superpower Bloc)/(UN) Unit. Set it as active. It can't attack during this turn.", () => {
    function setup({
      attackerTraits = ["superpower bloc"],
      readyTargetTraits = ["superpower bloc"],
      resources = 2,
    }: {
      attackerTraits?: string[];
      readyTargetTraits?: string[];
      resources?: number;
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
          resourceArea: activeResources(resources),
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
        engine,
        p1,
        p2,
        readyTargetId: readyTargetId!,
        attackerId: attackerId!,
        defenderId,
        commandId,
      };
    }

    it("creates a delayed trigger that readies a rested friendly Superpower Bloc Unit after a qualifying battle destroy", () => {
      const { engine, p1, p2, readyTargetId, attackerId, defenderId } = setup();

      expectSuccess(p1.playCommand(gd03ImmortalColasour120));
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId }));

      expect(isCardExhausted(engine, readyTargetId)).toBe(false);
      expect(p2.getCardsInZone("trash")).toContain(defenderId);
    });

    it("also triggers from a friendly UN Unit destroying an enemy Unit with battle damage", () => {
      const { engine, p1, readyTargetId, attackerId, defenderId } = setup({
        attackerTraits: ["un"],
        readyTargetTraits: ["un"],
      });

      expectSuccess(p1.playCommand(gd03ImmortalColasour120));
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId }));

      expect(isCardExhausted(engine, readyTargetId)).toBe(false);
    });

    it("does not trigger when the battle-destroying friendly Unit has neither listed trait", () => {
      const { engine, p1, readyTargetId, attackerId, defenderId } = setup({
        attackerTraits: ["aeug"],
      });

      expectSuccess(p1.playCommand(gd03ImmortalColasour120));
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId }));

      expect(isCardExhausted(engine, readyTargetId)).toBe(true);
    });

    it("does not trigger before the command has been played", () => {
      const { engine, readyTargetId, attackerId, defenderId } = setup();

      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId }));

      expect(isCardExhausted(engine, readyTargetId)).toBe(true);
    });

    it("prevents the Unit readied by the delayed trigger from attacking during this turn", () => {
      const { engine, p1, readyTargetId, attackerId, defenderId } = setup();

      expectSuccess(p1.playCommand(gd03ImmortalColasour120));
      expectSuccess(engine.resolveCombat({ attackerId, target: defenderId }));

      expectFailure(p1.enterBattle(readyTargetId, "direct"), "CANNOT_ATTACK");
    });

    it("moves the command card to trash after creating the delayed trigger", () => {
      const { engine, p1, commandId } = setup();

      expectSuccess(p1.playCommand(gd03ImmortalColasour120));

      expectCardInTrash(engine, commandId, PLAYER_ONE);
    });

    it("clears the delayed trigger at end of turn", () => {
      const { engine, p1 } = setup();

      expectSuccess(p1.playCommand(gd03ImmortalColasour120));
      expect(
        engine.getG().continuousEffects.some((effect) => effect.payload.kind === "delayed-trigger"),
      ).toBe(true);

      engine.endTurn();

      expect(
        engine.getG().continuousEffects.some((effect) => effect.payload.kind === "delayed-trigger"),
      ).toBe(false);
    });

    it("cannot be played without enough active resources", () => {
      const { engine, p1 } = setup({ resources: 2 });
      for (const resourceId of p1.getCardsInZone("resourceArea")) {
        engine.getG().exhausted[resourceId] = true;
      }

      expectFailure(p1.playCommand(gd03ImmortalColasour120), "INSUFFICIENT_RESOURCES");
    });

    it("cannot be played outside Main timing", () => {
      const { engine, p1 } = setup();
      engine.setPhase("end-phase");

      expectFailure(p1.playCommand(gd03ImmortalColasour120), "WRONG_PHASE");
    });
  });
});
