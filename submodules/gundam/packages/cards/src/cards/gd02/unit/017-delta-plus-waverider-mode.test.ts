import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02DeltaPlusWaveriderMode017 } from "./017-delta-plus-waverider-mode.ts";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function damageCommand(owner: "friendly" | "opponent") {
  return createMockCommand({
    name: "Repair Setup",
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
              amount: 2,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Choose 1 ${owner} Unit. Deal 2 damage to it.`,
      },
    ],
  });
}

describe("Delta Plus (Waverider Mode) (GD02-017)", () => {
  describe("Printed Lv.3 and cost 2", () => {
    it("cannot deploy with only 2 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02DeltaPlusWaveriderMode017],
        resourceArea: activeResources(2),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 1 active Resource", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02DeltaPlusWaveriderMode017],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Riddhe Marcenas]", () => {
    it("can attack on its deploy turn after Riddhe Marcenas is paired", () => {
      const riddhe = createMockPilot({ name: "Riddhe Marcenas", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [gd02DeltaPlusWaveriderMode017, riddhe],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02DeltaPlusWaveriderMode017));
      const deltaPlusId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(riddhe, deltaPlusId));
      expectSuccess(p1.enterBattle(deltaPlusId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: deltaPlusId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const otherPilot = createMockPilot({ name: "Banagher Links", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [gd02DeltaPlusWaveriderMode017, otherPilot],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02DeltaPlusWaveriderMode017));
      const deltaPlusId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(otherPilot, deltaPlusId));

      expectFailure(p1.enterBattle(deltaPlusId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("<Repair 2>", () => {
    it("recovers 2 HP at the end of its controller's turn after visible effect damage", () => {
      const setup = damageCommand("friendly");
      const engine = GundamTestEngine.create(
        { hand: [setup], play: [gd02DeltaPlusWaveriderMode017], deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup));
      const damageChoice = p1.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(unitId);
      expectSuccess(p1.resolveEffect({ targets: [unitId] }));
      expect(p1.getDamage(unitId)).toBe(2);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(unitId)).toBe(0);
    });

    it("does not recover at the end of the opponent's turn", () => {
      const setup = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        { play: [gd02DeltaPlusWaveriderMode017], deck: 5 },
        { hand: [setup], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(setup));
      const damageChoice = p2.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(unitId);
      expectSuccess(p2.resolveEffect({ targets: [unitId] }));
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      expect(p1.getDamage(unitId)).toBe(2);
    });
  });
});
