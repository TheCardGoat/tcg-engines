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
import { st03CharSZaku006 } from "./006-char-s-zaku.ts";

describe("Char's Zaku Ⅱ (ST03-006)", () => {
  describe("Lv.3 / cost 2 Unit", () => {
    it("deploys with its printed AP and HP after paying two active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03CharSZaku006],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployUnit(st03CharSZaku006));

      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getCardZone(zakuId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(zakuId)).toMatchObject({ effectiveAp: 3, effectiveHp: 2 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("cannot deploy below its printed Lv.3", () => {
      const engine = GundamTestEngine.create({
        hand: [st03CharSZaku006],
        resourceArea: activeResources(2),
      });

      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployUnit(st03CharSZaku006),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });

    it("cannot deploy without two active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st03CharSZaku006],
        resourceArea: activeResources(3).map((entry, index) => ({
          ...entry,
          exhausted: index >= 1,
        })),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployUnit(st03CharSZaku006), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st03CharSZaku006)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Destroyed】Look at the top 3 cards of your deck. You may reveal 1 (Zeon)/(Neo Zeon) Unit card among them and add it to your hand. Return the remaining cards randomly to the bottom of your deck.", () => {
    it.each([
      ["Zeon", ["zeon"]],
      ["Neo Zeon", ["neo zeon"]],
    ])("reveals and adds a %s Unit from the top three cards", (_label, traits) => {
      const attacker = createMockUnit({ name: "Destroying Attacker", ap: 4, hp: 5 });
      const eligible = createMockUnit({ name: `${_label} Unit`, traits });
      const nonMatch1 = createMockUnit({ traits: ["earth federation"] });
      const nonMatch2 = createMockUnit({ traits: [] });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st03CharSZaku006, exhausted: true }],
          deck: [nonMatch1, eligible, nonMatch2],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({
        kind: "deckLook",
        sourceCardId: zakuId,
        legalTutorCardIds: expect.any(Array),
      });
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(3);
      expect(choice.legalTutorCardIds).toHaveLength(1);
      const eligibleId = choice.legalTutorCardIds[0]!;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { tutorCardId: eligibleId },
          },
        }),
      );

      expect(p1.getCardZone(zakuId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(eligibleId)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    });

    it("offers no add-to-hand option for a Unit without either required trait", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const ineligible = createMockUnit({ traits: ["earth federation"] });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st03CharSZaku006, exhausted: true }],
          deck: [ineligible],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.legalTutorCardIds).toEqual([]);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {},
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
      expect(p1.getCardZone(zakuId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("does not treat a Zeon Pilot as a legal Unit choice", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const zeonPilot = createMockPilot({ traits: ["zeon"], level: 1, cost: 1 });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st03CharSZaku006, exhausted: true }],
          deck: [zeonPilot],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.legalTutorCardIds).toEqual([]);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {},
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(1);
    });

    it("may decline an eligible Unit and returns all revealed cards to the deck", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const eligible = createMockUnit({ traits: ["zeon"] });
      const other = createMockUnit({ traits: ["academy"] });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st03CharSZaku006, exhausted: true }],
          deck: [eligible, other],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.legalTutorCardIds).toHaveLength(1);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {},
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(2);
    });

    it("looks at only three cards and cannot choose an eligible fourth card", () => {
      const attacker = createMockUnit({ ap: 4, hp: 5 });
      const eligibleBeyondThree = createMockUnit({ traits: ["neo zeon"] });
      const engine = GundamTestEngine.create(
        {
          play: [{ card: st03CharSZaku006, exhausted: true }],
          deck: [eligibleBeyondThree, createMockUnit(), createMockUnit(), createMockUnit()],
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zakuId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      expect(choice.revealedCardIds).toHaveLength(3);
      expect(choice.legalTutorCardIds).toEqual([]);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: {},
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]?.deckCount).toBe(4);
      expect(p1.getBoardView().players[PLAYER_ONE]?.handCount).toBe(0);
    });
  });
});
