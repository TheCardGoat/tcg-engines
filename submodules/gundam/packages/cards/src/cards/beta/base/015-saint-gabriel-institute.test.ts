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
import { betaSaintGabrielInstitute015 } from "./015-saint-gabriel-institute.ts";

describe("Saint Gabriel Institute (ST02-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Base for free and activates its Deploy ability", () => {
      const attacker = createMockUnit({ ap: 1, hp: 3 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        {
          shieldArea: [betaSaintGabrielInstitute015, otherShield],
          deck: [createMockUnit({ name: "First" }), createMockUnit({ name: "Second" })],
        },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p2.getBoardView().players[PLAYER_TWO]!.shieldCount;

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") {
        throw new Error("Expected Saint Gabriel Institute's Burst choice");
      }
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
      const deckLook = p2.getBoardView().pendingChoice;
      if (deckLook?.kind !== "deckLook") {
        throw new Error("Expected the deployed Base to look at the top two cards");
      }

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expectSuccess(
        p2.resolveEffect({
          deckLookAnswers: {
            [deckLook.directiveIndex]: {
              toTop: [deckLook.revealedCardIds[0]!],
              toBottom: [deckLook.revealedCardIds[1]!],
            },
          },
        }),
      );

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]!.shieldCount).toBe(shieldsBefore - 2);
      expect(p2.getHand()).toHaveLength(1);
    });

    it("moves the revealed Base card to trash when its owner declines Burst", () => {
      const attacker = createMockUnit({ ap: 1, hp: 3 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [betaSaintGabrielInstitute015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") {
        throw new Error("Expected Saint Gabriel Institute's Burst choice");
      }
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, look at the top 2 cards of your deck and return 1 to the top and 1 to the bottom.", () => {
    it("adds exactly one Shield to hand and lets its controller choose the top and bottom cards", () => {
      const firstShield = createMockUnit({ name: "First Shield" });
      const secondShield = createMockUnit({ name: "Second Shield" });
      const first = createMockUnit({ name: "First Revealed" });
      const second = createMockUnit({ name: "Second Revealed" });
      const fillerOne = createMockUnit({ name: "Unrevealed Filler One" });
      const fillerTwo = createMockUnit({ name: "Unrevealed Filler Two" });
      const baseDestroyer = createMockUnit({ name: "Base Destroyer", ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaSaintGabrielInstitute015, betaSaintGabrielInstitute015],
          resourceArea: activeResources(4),
          shieldArea: [firstShield, secondShield],
          deck: [first, second, fillerOne, fillerTwo],
        },
        { play: [baseDestroyer], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [baseId, secondBaseId] = p1.getHand();
      const shieldsBefore = p1.getBoardView().players[PLAYER_ONE]!.shieldCount;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId!));
      const firstLook = p1.getBoardView().pendingChoice;
      if (firstLook?.kind !== "deckLook") throw new Error("Expected the first deck-look choice");
      const [chosenTopId, chosenBottomId] = firstLook.revealedCardIds;
      if (!chosenTopId || !chosenBottomId) throw new Error("Expected two revealed cards");

      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [firstLook.directiveIndex]: {
              toTop: [chosenTopId],
              toBottom: [chosenBottomId],
            },
          },
        }),
      );
      expect(p1.getCardZone(baseId!)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(shieldsBefore - 1);
      expect(p1.getHand()).toHaveLength(handBefore);

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getCardZone(baseId!)).toBe(`trash:${PLAYER_ONE}`);
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());

      expect(p1.getHand()).toContain(chosenTopId);
      expectSuccess(p1.deployBase(secondBaseId!));
      const secondLook = p1.getBoardView().pendingChoice;
      if (secondLook?.kind !== "deckLook") throw new Error("Expected the second deck-look choice");
      expect(secondLook.revealedCardIds).not.toContain(chosenBottomId);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [secondLook.directiveIndex]: {
              toTop: [secondLook.revealedCardIds[0]!],
              toBottom: [secondLook.revealedCardIds[1]!],
            },
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(shieldsBefore - 2);
      expect(p1.getCardZone(secondBaseId!)).toBe(`baseSection:${PLAYER_ONE}`);
    });

    it("still looks at the top two cards when there is no Shield to add to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [betaSaintGabrielInstitute015],
        resourceArea: activeResources(2),
        deck: [createMockUnit({ name: "First" }), createMockUnit({ name: "Second" })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(commandId));
      const deckLook = p1.getBoardView().pendingChoice;
      if (deckLook?.kind !== "deckLook") {
        throw new Error("Expected the 'Then' deck look even without a Shield");
      }
      expect(deckLook.revealedCardIds).toHaveLength(2);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [deckLook.directiveIndex]: {
              toTop: [deckLook.revealedCardIds[0]!],
              toBottom: [deckLook.revealedCardIds[1]!],
            },
          },
        }),
      );

      expect(p1.getCardZone(commandId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
    });

    it("still deploys and adds a Shield to hand when the deck is empty", () => {
      const engine = GundamTestEngine.create({
        hand: [betaSaintGabrielInstitute015],
        shieldArea: [createMockUnit({ name: "Shield" })],
        resourceArea: activeResources(2),
        deck: [],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(0);
      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("cannot be deployed below its printed Lv.2 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [betaSaintGabrielInstitute015],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(betaSaintGabrielInstitute015), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(betaSaintGabrielInstitute015)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without two active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [betaSaintGabrielInstitute015],
        resourceArea: restedResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(betaSaintGabrielInstitute015), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(betaSaintGabrielInstitute015)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("is destroyed after receiving battle damage equal to its printed 5 HP", () => {
      const attacker = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [betaSaintGabrielInstitute015],
          resourceArea: activeResources(2),
          deck: [],
        },
        { play: [attacker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(baseId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardZone(baseId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });
});
