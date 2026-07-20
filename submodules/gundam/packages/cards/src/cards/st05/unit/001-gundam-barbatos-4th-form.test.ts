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
import { st05GundamBarbatos4thForm001 } from "./001-gundam-barbatos-4th-form.ts";

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

describe("Gundam Barbatos 4th Form (ST05-001)", () => {
  describe("Printed Lv.6 and cost 4", () => {
    it("cannot deploy with only 5 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(cardId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot deploy with fewer than 4 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 3 });
      const engine = GundamTestEngine.create({
        hand: [spender, st05GundamBarbatos4thForm001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const barbatosId = p1.getHand()[0]!;
      expectFailure(p1.deployUnit(barbatosId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(barbatosId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("deploys from hand to the battle area for 4 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getHand()).not.toContain(cardId);
    });
  });

  describe("【Deploy】Choose 1 of your other Units. Deal 1 damage to it. It gets AP+1 during this turn.", () => {
    it("deals 1 damage and gives AP+1 to the same chosen other friendly Unit", () => {
      const ally = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        play: [ally],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const allyId = p1.getCardsInZone("battleArea")[0]!;
      const barbatosId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(barbatosId, { targets: [allyId] }));

      expect(p1.getDamage(allyId)).toBe(1);
      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(3);
      expect(p1.getCardZone(barbatosId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("publishes all other friendly Units as one exact choice and continues on that identity", () => {
      const first = createMockUnit({ name: "First Ally", ap: 2, hp: 5 });
      const second = createMockUnit({ name: "Second Ally", ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        play: [first, second],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");
      const barbatosId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(barbatosId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: barbatosId,
        legalTargetIds: [firstId, secondId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.getDamage(firstId!)).toBe(0);
      expect(p1.getVisibleCard(firstId!)?.effectiveAp).toBe(2);
      expect(p1.getDamage(secondId!)).toBe(1);
      expect(p1.getVisibleCard(secondId!)?.effectiveAp).toBe(4);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects Barbatos itself as the Deploy target", () => {
      const ally = createMockUnit({ name: "Legal Ally" });
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        play: [ally],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(barbatosId, { targets: [barbatosId] }), "INVALID_TARGET");

      expect(p1.getCardZone(barbatosId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getDamage(ally)).toBe(0);
    });

    it("rejects an enemy Unit as the Deploy target", () => {
      const ally = createMockUnit({ name: "Legal Ally" });
      const enemy = createMockUnit({ name: "Enemy" });
      const engine = GundamTestEngine.create(
        {
          hand: [st05GundamBarbatos4thForm001],
          play: [ally],
          resourceArea: activeResources(6),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const barbatosId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(p1.deployUnit(barbatosId, { targets: [enemyId] }), "INVALID_TARGET");

      expect(p1.getCardZone(barbatosId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("still deploys when there is no other friendly Unit", () => {
      const engine = GundamTestEngine.create({
        hand: [st05GundamBarbatos4thForm001],
        resourceArea: activeResources(6),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(barbatosId));

      expect(p1.getCardZone(barbatosId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getDamage(barbatosId)).toBe(0);
    });

    it("removes the chosen Unit's AP increase when the turn ends", () => {
      const ally = createMockUnit({ ap: 2, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st05GundamBarbatos4thForm001],
          play: [ally],
          resourceArea: activeResources(6),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const allyId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(st05GundamBarbatos4thForm001, { targets: [allyId] }));
      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(3);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(allyId)).toBe(1);
      expect(p1.getVisibleCard(allyId)?.effectiveAp).toBe(2);
    });
  });

  describe("While this is damaged, it gains <Suppression>.", () => {
    it("does not have Suppression while undamaged", () => {
      const engine = GundamTestEngine.create({ play: [st05GundamBarbatos4thForm001] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expect(p1.getDamage(barbatosId)).toBe(0);
      expect(p1.getVisibleCard(barbatosId)?.keywords).not.toContain("Suppression");
      expectSuccess(p1.passPhase());
    });

    it("gains Suppression after receiving visible effect damage", () => {
      const setup = damageCommand();
      const engine = GundamTestEngine.create({
        hand: [setup],
        play: [st05GundamBarbatos4thForm001],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup, { targets: [barbatosId] }));

      expect(p1.getDamage(barbatosId)).toBe(1);
      expect(p1.getVisibleCard(barbatosId)?.keywords).toContain("Suppression");
    });

    it("loses Suppression after all damage is recovered", () => {
      const damage = damageCommand();
      const recovery = recoverCommand();
      const engine = GundamTestEngine.create({
        hand: [damage, recovery],
        play: [st05GundamBarbatos4thForm001],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(damage, { targets: [barbatosId] }));
      expect(p1.getVisibleCard(barbatosId)?.keywords).toContain("Suppression");
      expectSuccess(p1.playCommand(recovery, { targets: [barbatosId] }));

      expect(p1.getDamage(barbatosId)).toBe(0);
      expect(p1.getVisibleCard(barbatosId)?.keywords).not.toContain("Suppression");
    });

    it("destroys the first 2 Shields simultaneously when damaged Barbatos attacks", () => {
      const setup = damageCommand();
      const engine = GundamTestEngine.create(
        {
          hand: [setup],
          play: [st05GundamBarbatos4thForm001],
        },
        {
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup, { targets: [barbatosId] }));
      expect(p1.getVisibleCard(barbatosId)?.keywords).toContain("Suppression");
      expectSuccess(p1.enterBattle(barbatosId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
    });

    it("destroys only the first Shield when undamaged Barbatos attacks", () => {
      const engine = GundamTestEngine.create(
        { play: [st05GundamBarbatos4thForm001] },
        {
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const barbatosId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(barbatosId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(1);
    });
  });
});
