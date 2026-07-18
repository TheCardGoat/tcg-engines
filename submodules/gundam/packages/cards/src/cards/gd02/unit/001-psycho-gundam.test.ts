import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02PsychoGundam001 } from "./001-psycho-gundam.ts";
import { gd02FourMurasame085 } from "../pilot/085-four-murasame.ts";
import { gd02JeridMessa086 } from "../pilot/086-jerid-messa.ts";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";

function selfDamageCommand() {
  return createMockCommand({
    name: "Recovery Setup",
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
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Unit. Deal 3 damage to it.",
      },
    ],
  });
}

describe("Psycho Gundam (GD02-001)", () => {
  describe("Printed Lv.6 and cost 4", () => {
    it("cannot deploy with only 5 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PsychoGundam001],
        resourceArea: activeResources(5),
      });

      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy after a legal play leaves only 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, gd02PsychoGundam001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");

      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    });
  });

  describe("Link Condition: [Four Murasame]", () => {
    it("can attack on its deploy turn after Four Murasame is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PsychoGundam001, gd02FourMurasame085],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02PsychoGundam001));
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02FourMurasame085, psychoId));
      expectSuccess(p1.enterBattle(psychoId, "direct"));

      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: psychoId });
    });

    it("cannot attack on its deploy turn after a different Pilot is paired", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02PsychoGundam001, gd02JeridMessa086],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(gd02PsychoGundam001));
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(gd02JeridMessa086, psychoId));

      expectFailure(p1.enterBattle(psychoId, "direct"), "CANNOT_ATTACK");
      expect(p1.getBoardView().pendingCombat).toBeUndefined();
    });
  });

  describe("<Breach 3>", () => {
    it("deals 3 damage to the enemy Base after destroying a Unit with battle damage", () => {
      const defender = createMockUnit({ ap: 0, hp: 1 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        {
          play: [gd02PsychoGundam001],
          baseSection: [createMockBase({ hp: 20 })],
          deck: 5,
        },
        { play: [defender], baseSection: [base], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const baseId = p2.getCardsInZone("baseSection")[0]!;

      restUnitsByAttackingDirectly(engine, PLAYER_TWO, [defenderId]);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);
      resolveUnitBattle(engine, PLAYER_ONE, psychoId, defenderId);

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getDamage(baseId)).toBe(3);
      expect(p1.getVisibleCard(psychoId)?.keywordEffects).toContainEqual({
        keyword: "Breach",
        value: 3,
      });
    });
  });

  describe("【During Pair･(Cyber-Newtype) Pilot】When one of your (Titans) Units destroys an enemy shield area card with damage, this Unit recovers 2 HP.", () => {
    it("recovers 2 HP after the paired Psycho Gundam destroys an enemy Shield", () => {
      const setup = selfDamageCommand();
      const engine = GundamTestEngine.create(
        {
          hand: [setup, gd02FourMurasame085],
          play: [gd02PsychoGundam001],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup));
      const damageChoice = p1.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(psychoId);
      expectSuccess(p1.resolveEffect({ targets: [psychoId] }));
      expect(p1.getDamage(psychoId)).toBe(3);
      expectSuccess(p1.assignPilot(gd02FourMurasame085, psychoId));
      expectSuccess(p1.enterBattle(psychoId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
      expect(p1.getDamage(psychoId)).toBe(1);
    });

    it("recovers when another friendly Titans Unit destroys an enemy Shield with damage", () => {
      const setup = selfDamageCommand();
      const titansAlly = createMockUnit({ traits: ["titans"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [setup, gd02FourMurasame085],
          play: [gd02PsychoGundam001, titansAlly],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [psychoId, titansAllyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(setup));
      const damageChoice = p1.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(psychoId);
      expectSuccess(p1.resolveEffect({ targets: [psychoId!] }));
      expect(p1.getDamage(psychoId!)).toBe(3);
      expectSuccess(p1.assignPilot(gd02FourMurasame085, psychoId!));
      expectSuccess(p1.enterBattle(titansAllyId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
      expect(p1.getDamage(psychoId!)).toBe(1);
    });

    it("does not recover while paired with a Pilot that is not a Cyber-Newtype", () => {
      const setup = selfDamageCommand();
      const engine = GundamTestEngine.create(
        {
          hand: [setup, gd02JeridMessa086],
          play: [gd02PsychoGundam001],
          resourceArea: activeResources(6),
        },
        { shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const psychoId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup));
      const damageChoice = p1.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(psychoId);
      expectSuccess(p1.resolveEffect({ targets: [psychoId] }));
      expectSuccess(p1.assignPilot(gd02JeridMessa086, psychoId));
      expectSuccess(p1.enterBattle(psychoId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(psychoId)).toBe(3);
    });

    it("does not recover when a friendly Unit outside the Titans trait destroys the Shield", () => {
      const setup = selfDamageCommand();
      const outsider = createMockUnit({ traits: ["aeug"], ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [setup, gd02FourMurasame085],
          play: [gd02PsychoGundam001, outsider],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { shieldArea: [createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [psychoId, outsiderId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(setup));
      const damageChoice = p1.getBoardView().pendingChoice;
      if (damageChoice?.kind !== "targetSelection") {
        throw new Error("Expected a visible damage target choice");
      }
      expect(damageChoice.legalTargetIds).toContain(psychoId);
      expectSuccess(p1.resolveEffect({ targets: [psychoId!] }));
      expectSuccess(p1.assignPilot(gd02FourMurasame085, psychoId!));
      expectSuccess(p1.enterBattle(outsiderId!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(psychoId!)).toBe(3);
    });
  });
});
