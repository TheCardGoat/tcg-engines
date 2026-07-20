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
} from "@tcg/gundam-engine";
import {
  passTurnThroughPublicMoves,
  resolveUnitBattle,
  restUnitsByAttackingDirectly,
} from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st04MiguelSGinn009 } from "./009-miguel-s-ginn.ts";

describe("Miguel's Ginn (ST04-009)", () => {
  describe("Printed Lv.2 and cost 2", () => {
    it("deploys from hand to the battle area and rests exactly 2 Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04MiguelSGinn009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const ginnId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(ginnId));

      expect(p1.getCardZone(ginnId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("stays in hand below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04MiguelSGinn009],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const ginnId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(ginnId), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(ginnId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("stays in hand when another legal play rests 1 of its 2 Resources", () => {
      const spender = createMockUnit({ name: "Resource Spender", level: 1, cost: 1 });
      const engine = GundamTestEngine.create({
        hand: [spender, st04MiguelSGinn009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [spenderId, ginnId] = p1.getHand();

      expectSuccess(p1.deployUnit(spenderId!));
      expectFailure(p1.deployUnit(ginnId!), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(ginnId!)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be deployed during a legally reached Action step", () => {
      const engine = GundamTestEngine.create({
        hand: [st04MiguelSGinn009],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ginnId = p1.getHand()[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.deployUnit(ginnId), "WRONG_PHASE");

      expect(p1.getCardZone(ginnId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【During Pair】【Destroyed】If you have another Link Unit in play, draw 1.", () => {
    // The draw chooses no target, so target filters, decline, and no-legal-target paths do not apply.
    it("draws exactly 1 for its controller when destroyed while paired beside another Link Unit", () => {
      const ginnPilot = createMockPilot({ name: "Miguel Aiman", level: 1, cost: 1 });
      const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const linkHost = createMockUnit({
        name: "Link Host",
        ap: 0,
        hp: 5,
        linkCondition: "[Link Pilot]",
      });
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [ginnPilot, linkPilot],
          play: [st04MiguelSGinn009, linkHost],
          resourceArea: activeResources(2),
          deck: 3,
        },
        {
          play: [attacker],
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [ginnId, linkHostId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(ginnPilot, ginnId!));
      const pairedPilotId = p1.getPilotId(ginnId!);
      expectSuccess(p1.assignPilot(linkPilot, linkHostId!));
      expect(p1.getPilotId(linkHostId!)).toBeDefined();
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [ginnId!]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      const opponentHandBeforeDestruction = p2.getBoardView().players[PLAYER_TWO]?.handCount;
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, ginnId!);

      expect(p1.getCardZone(ginnId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(pairedPilotId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(1);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
      expect(p2.getBoardView().players[PLAYER_TWO]?.handCount).toBe(opponentHandBeforeDestruction);
    });

    it("does not draw when there is no other Unit in play", () => {
      const ginnPilot = createMockPilot({ name: "Miguel Aiman", level: 1, cost: 1 });
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [ginnPilot],
          play: [st04MiguelSGinn009],
          resourceArea: activeResources(1),
          deck: 3,
        },
        {
          play: [attacker],
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ginnId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(ginnPilot, ginnId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [ginnId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, ginnId);

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("does not draw when the other friendly Unit is not a Link Unit", () => {
      const ginnPilot = createMockPilot({ name: "Miguel Aiman", level: 1, cost: 1 });
      const ordinaryUnit = createMockUnit({ name: "Ordinary Unit", ap: 0, hp: 5 });
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [ginnPilot],
          play: [st04MiguelSGinn009, ordinaryUnit],
          resourceArea: activeResources(1),
          deck: 3,
        },
        {
          play: [attacker],
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ginnId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(ginnPilot, ginnId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [ginnId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, ginnId);

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("does not draw when Miguel's Ginn was not paired before it was destroyed", () => {
      const linkPilot = createMockPilot({ name: "Link Pilot", level: 1, cost: 1 });
      const linkHost = createMockUnit({
        name: "Link Host",
        ap: 0,
        hp: 5,
        linkCondition: "[Link Pilot]",
      });
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [linkPilot],
          play: [st04MiguelSGinn009, linkHost],
          resourceArea: activeResources(1),
          deck: 3,
        },
        {
          play: [attacker],
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [ginnId, linkHostId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(linkPilot, linkHostId!));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [ginnId!]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      resolveUnitBattle(engine, PLAYER_TWO, attackerId, ginnId!);

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });

    it("does not count an opposing Link Unit", () => {
      const ginnPilot = createMockPilot({ name: "Miguel Aiman", level: 1, cost: 1 });
      const enemyLinkPilot = createMockPilot({ name: "Enemy Link Pilot", level: 1, cost: 1 });
      const enemyLinkHost = createMockUnit({
        name: "Enemy Link Host",
        ap: 0,
        hp: 5,
        linkCondition: "[Enemy Link Pilot]",
      });
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [ginnPilot],
          play: [st04MiguelSGinn009],
          resourceArea: activeResources(1),
          deck: 3,
        },
        {
          hand: [enemyLinkPilot],
          play: [attacker, enemyLinkHost],
          resourceArea: activeResources(1),
          shieldArea: [createMockUnit({ name: "Opening Shield" })],
          deck: 3,
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const ginnId = p1.getCardsInZone("battleArea")[0]!;
      const [attackerId, enemyLinkHostId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(ginnPilot, ginnId));
      restUnitsByAttackingDirectly(engine, PLAYER_ONE, [ginnId]);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      expectSuccess(p2.assignPilot(enemyLinkPilot, enemyLinkHostId!));
      expect(p2.getPilotId(enemyLinkHostId!)).toBeDefined();
      resolveUnitBattle(engine, PLAYER_TWO, attackerId!, ginnId);

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(3);
    });
  });
});
