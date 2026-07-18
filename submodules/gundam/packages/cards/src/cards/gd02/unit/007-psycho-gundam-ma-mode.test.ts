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
import { gd02PsychoGundamMaMode007 } from "./007-psycho-gundam-ma-mode.ts";
import { gd02FourMurasame085 } from "../pilot/085-four-murasame.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
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
              amount: 3,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Choose 1 ${owner} Unit. Deal 3 damage to it.`,
      },
    ],
  });
}

describe("Psycho Gundam (MA Mode) (GD02-007)", () => {
  describe("Printed Lv.5 and cost 3", () => {
    it("cannot deploy with only 4 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PsychoGundamMaMode007],
        resourceArea: activeResources(4),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02PsychoGundamMaMode007],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: (Cyber-Newtype) Trait", () => {
    it("can attack on its deploy turn after a Cyber-Newtype Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PsychoGundamMaMode007, gd02FourMurasame085],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02PsychoGundamMaMode007));
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FourMurasame085, psychoId));
      expectSuccess(p1.enterBattle(psychoId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: psychoId });
    });

    it("cannot attack on its deploy turn after a non-Cyber-Newtype Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PsychoGundamMaMode007, gd02JeridMessa086],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02PsychoGundamMaMode007));
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, psychoId));

      expectFailure(p1.enterBattle(psychoId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("<Repair 2>", () => {
    it("recovers 2 HP at the end of its controller's turn after visible effect damage", () => {
      const setup = damageCommand("friendly");
      const engine = GundamTestEngine.create(
        { hand: [setup], play: [gd02PsychoGundamMaMode007], deck: 5 },
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
      expect(p1.getDamage(unitId)).toBe(3);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(unitId)).toBe(1);
    });

    it("does not recover at the end of the opponent's turn", () => {
      const setup = damageCommand("opponent");
      const engine = GundamTestEngine.create(
        { play: [gd02PsychoGundamMaMode007], deck: 5 },
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

      expect(p1.getDamage(unitId)).toBe(3);
    });
  });
});
