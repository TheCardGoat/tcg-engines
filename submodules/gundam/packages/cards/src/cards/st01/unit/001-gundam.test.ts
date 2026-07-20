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
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st01Gundam001 } from "./001-gundam.ts";

function damageCommand(owner: "friendly" | "opponent", amount: number) {
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
              amount,
              target: { owner, cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: `【Main】Choose 1 ${owner} Unit. Deal ${amount} damage to it.`,
      },
    ],
  });
}

function zeroBonusPilot() {
  return createMockPilot({
    name: "Amuro Ray",
    level: 1,
    cost: 1,
    apBonus: 0,
    hpBonus: 0,
  });
}

describe("Gundam (ST01-001)", () => {
  describe("Printed Lv.4 and cost 3", () => {
    it("cannot deploy with only 3 total Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Gundam001],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getHand()).toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
    });

    it("cannot deploy with fewer than 3 active Resources", () => {
      const spender = createMockUnit({ level: 1, cost: 2 });
      const engine = GundamTestEngine.create({
        hand: [spender, st01Gundam001],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(spender));
      const cardId = p1.getHand()[0]!;
      expectFailure(p1.deployUnit(cardId), "INSUFFICIENT_RESOURCES");
      expect(p1.getHand()).toContain(cardId);
    });

    it("deploys from hand to the battle area for 3 active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st01Gundam001],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployUnit(cardId));

      expect(p1.getHand()).not.toContain(cardId);
      expect(p1.getCardsInZone("battleArea")).toContain(cardId);
      expect(p1.getCardZone(cardId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });

  describe("<Repair 2> (At the end of your turn, this Unit recovers the specified number of HP.)", () => {
    it("recovers 2 HP at the end of its controller's turn after visible effect damage", () => {
      const setup = damageCommand("friendly", 3);
      const engine = GundamTestEngine.create(
        { hand: [setup], play: [st01Gundam001], deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [gundamId],
      });
      expectSuccess(p1.resolveEffect({ targets: [gundamId] }));
      expect(p1.getDamage(gundamId)).toBe(3);

      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(gundamId)).toBe(1);
    });

    it("does not recover more damage than the Unit has received", () => {
      const setup = damageCommand("friendly", 1);
      const engine = GundamTestEngine.create(
        { hand: [setup], play: [st01Gundam001], deck: 5 },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.playCommand(setup));
      expectSuccess(p1.resolveEffect({ targets: [gundamId] }));
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getDamage(gundamId)).toBe(0);
    });

    it("does not recover at the end of the opponent's turn", () => {
      const setup = damageCommand("opponent", 3);
      const engine = GundamTestEngine.create(
        { play: [st01Gundam001], deck: 5 },
        { hand: [setup], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.playCommand(setup));
      expectSuccess(p2.resolveEffect({ targets: [gundamId] }));
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      expect(p1.getDamage(gundamId)).toBe(3);
    });
  });

  describe("【During Pair】During your turn, all your Units get AP+1.", () => {
    it("gives this Unit and every other friendly Unit AP+1 while paired", () => {
      const ally = createMockUnit({ ap: 2, hp: 4 });
      const pilot = zeroBonusPilot();
      const engine = GundamTestEngine.create({
        hand: [pilot],
        play: [st01Gundam001, ally],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamId, allyId] = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, gundamId!));

      expect(p1.getPilotId(gundamId!)).toBe(pilotId);
      expect(p1.getVisibleCard(gundamId!)?.effectiveAp).toBe(4);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(3);
    });

    it("does not give enemy Units AP+1", () => {
      const pilot = zeroBonusPilot();
      const enemy = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01Gundam001],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const gundamId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, gundamId));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
    });

    it("does not give friendly Units AP+1 while Gundam is unpaired", () => {
      const ally = createMockUnit({ ap: 2, hp: 4 });
      const engine = GundamTestEngine.create({ play: [st01Gundam001, ally] });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.passPhase());

      expect(p1.getVisibleCard(gundamId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
    });

    it("stops giving AP+1 when the opponent's turn begins", () => {
      const ally = createMockUnit({ ap: 2, hp: 4 });
      const pilot = zeroBonusPilot();
      const engine = GundamTestEngine.create(
        {
          hand: [pilot],
          play: [st01Gundam001, ally],
          resourceArea: activeResources(4),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [gundamId, allyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(pilot, gundamId!));
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(3);
      passTurnThroughPublicMoves(engine, PLAYER_ONE);

      expect(p1.getVisibleCard(gundamId!)?.effectiveAp).toBe(3);
      expect(p1.getVisibleCard(allyId!)?.effectiveAp).toBe(2);
    });
  });
});
