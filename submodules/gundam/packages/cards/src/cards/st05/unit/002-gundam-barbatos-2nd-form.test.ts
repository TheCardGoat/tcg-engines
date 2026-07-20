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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st05GundamBarbatos2ndForm002 } from "./002-gundam-barbatos-2nd-form.ts";

function damageCommand() {
  return createMockCommand({
    name: "Damage Setup",
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
              amount: 1,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Unit. Deal 1 damage to it.",
      },
    ],
  });
}

function recoverCommand() {
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
              action: "recoverHP",
              amount: 1,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 friendly Unit. Recover 1 HP from it.",
      },
    ],
  });
}

describe("Gundam Barbatos 2nd Form (ST05-002)", () => {
  describe("Printed Lv.4 and cost 2", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos2ndForm002],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(cardId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot deploy with fewer than 2 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, st05GundamBarbatos2ndForm002],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const barbatosId = p1.getHand()[0]!;
      expectFailure(p1.deployUnit(barbatosId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(barbatosId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("deploys from hand to the battle area for 2 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos2ndForm002],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getHand()).not.toContain(cardId);
      expect(p1.getVisibleCard(cardId)?.effectiveAp).toBe(2);
    });
  });

  describe("While this Unit is damaged, it gets AP+2.", () => {
    it("keeps its printed AP while undamaged", () => {
      const engine = GundamTestEngine.create({ play: [st05GundamBarbatos2ndForm002] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expect(p1.getDamage(barbatosId)).toBe(0);
      expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(2);
      expectSuccess(p1.passPhase());
    });

    it("gets AP+2 after receiving visible effect damage", () => {
      const setup = damageCommand();
      const engine = GundamTestEngine.create({
        hand: [setup],
        play: [st05GundamBarbatos2ndForm002],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup, { targets: [barbatosId] }));

      expect(p1.getDamage(barbatosId)).toBe(1);
      expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(4);
    });

    it("does not get AP+2 when only another friendly Unit is damaged", () => {
      const setup = damageCommand();
      const ally = createMockUnit({ name: "Damaged Ally", hp: 4 });
      const engine = GundamTestEngine.create({
        hand: [setup],
        play: [st05GundamBarbatos2ndForm002, ally],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [barbatosId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(setup, { targets: [allyId!] }));

      expect(p1.getDamage(allyId!)).toBe(1);
      expect(p1.getDamage(barbatosId!)).toBe(0);
      expect(p1.getVisibleCard(barbatosId!)?.effectiveAp).toBe(2);
    });

    it("does not modify an enemy Unit when Barbatos is damaged", () => {
      const setup = damageCommand();
      const enemy = createMockUnit({ ap: 3, hp: 4 });
      const engine = GundamTestEngine.create(
        { hand: [setup], play: [st05GundamBarbatos2ndForm002] },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup, { targets: [barbatosId] }));

      expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(4);
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    });

    it("loses AP+2 after all of its damage is recovered", () => {
      const damage = damageCommand();
      const recovery = recoverCommand();
      const engine = GundamTestEngine.create({
        hand: [damage, recovery],
        play: [st05GundamBarbatos2ndForm002],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(damage, { targets: [barbatosId] }));
      expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(4);
      expectSuccess(p1.playCommand(recovery, { targets: [barbatosId] }));

      expect(p1.getDamage(barbatosId)).toBe(0);
      expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(2);
    });

    it("keeps AP+2 on the opponent's turn while it remains damaged", () => {
      const setup = damageCommand();
      const engine = GundamTestEngine.create(
        {
          hand: [setup],
          play: [st05GundamBarbatos2ndForm002],
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup, { targets: [barbatosId] }));
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(barbatosId)).toBe(1);
      expect(p1.getVisibleCard(barbatosId)?.effectiveAp).toBe(4);
    });
  });
});
