import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st02ZechsMerquise011 } from "./011-zechs-merquise.ts";

describe("Zechs Merquise (ST02-011)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds the revealed Pilot card to its owner's hand", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st02ZechsMerquise011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Zechs Merquise's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(0);
      expect(p2.getHand()).toContain(burst.sourceCardId);
      expect(p2.getCardZone(burst.sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("moves the revealed Pilot card to trash when its owner declines Burst", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st02ZechsMerquise011] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Zechs Merquise's Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getHand()).toHaveLength(0);
    });
  });

  describe("【During Link】During your turn, when this Unit destroys an enemy Unit with battle damage, draw 1.", () => {
    it("draws when the linked host destroys an enemy Unit with battle damage during its controller's turn", () => {
      const linkedHost = createMockUnit({
        name: "Zechs Host",
        ap: 3,
        hp: 5,
        level: 5,
        linkCondition: "[Zechs Merquise]",
      });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02ZechsMerquise011],
          play: [linkedHost],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p1.assignPilot(st02ZechsMerquise011, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
      expect(p1.getHand()).toHaveLength(1);
    });

    it("does not draw when another friendly Unit destroys the enemy Unit", () => {
      const linkedHost = createMockUnit({
        name: "Zechs Host",
        ap: 3,
        hp: 5,
        linkCondition: "[Zechs Merquise]",
      });
      const attacker = createMockUnit({ ap: 3, hp: 5 });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02ZechsMerquise011],
          play: [linkedHost, attacker],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, attackerId] = p1.getCardsInZone("battleArea");
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p1.assignPilot(st02ZechsMerquise011, hostId!));
      expectSuccess(p1.enterBattle(attackerId!, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p2.getCardZone(defenderId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
      expect(p1.getHand()).toHaveLength(0);
    });

    it("does not draw while Zechs is paired but does not satisfy the host's Link Condition", () => {
      const unlinkedHost = createMockUnit({
        name: "Unlinked Host",
        ap: 3,
        hp: 5,
        linkCondition: "[Other Pilot]",
      });
      const defender = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02ZechsMerquise011],
          play: [unlinkedHost],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p1.assignPilot(st02ZechsMerquise011, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
      expect(p1.getHand()).toHaveLength(0);
    });

    it("does not draw when the linked host destroys an attacker during the opponent's turn", () => {
      const linkedHost = createMockUnit({
        name: "Zechs Host",
        ap: 3,
        hp: 5,
        linkCondition: "[Zechs Merquise]",
      });
      const attacker = createMockUnit({ ap: 1, hp: 1 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02ZechsMerquise011],
          play: [linkedHost],
          resourceArea: activeResources(5),
          deck: 5,
        },
        { play: [attacker], shieldArea: [createMockUnit({ name: "Shield" })], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p1.assignPilot(st02ZechsMerquise011, hostId));
      expectSuccess(p1.enterBattle(hostId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(attackerId, hostId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p2.getCardZone(attackerId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
      expect(p1.getHand()).toHaveLength(0);
    });
  });

  describe("Printed Lv.5, cost 1, AP+2, and HP+1", () => {
    it("pairs as a Pilot and applies its printed AP and HP bonuses", () => {
      const host = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [st02ZechsMerquise011],
        play: [host],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getPilotId(hostId)).toBe(pilotId);
      expect(p1.getCardZone(pilotId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 4, effectiveHp: 4 });
    });

    it("cannot be paired below its printed Lv.5 requirement", () => {
      const host = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [st02ZechsMerquise011],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.assignPilot(st02ZechsMerquise011, p1.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      expect(p1.getCardZone(st02ZechsMerquise011)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const host = createMockUnit();
      const engine = GundamTestEngine.create({
        hand: [st02ZechsMerquise011],
        play: [host],
        resourceArea: restedResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(
        p1.assignPilot(st02ZechsMerquise011, p1.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardZone(st02ZechsMerquise011)).toBe(`hand:${PLAYER_ONE}`);
    });
  });
});
