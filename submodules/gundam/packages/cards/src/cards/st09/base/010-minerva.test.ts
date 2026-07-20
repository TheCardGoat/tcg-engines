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
import { st09Minerva010 } from "./010-minerva.ts";

describe("Minerva (ST09-010)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("deploys the revealed Base for free, adds the remaining Shield to hand, and skips the own-turn rider", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const otherShield = createMockUnit({ name: "Other Shield" });
      const engine = GundamTestEngine.create(
        {
          shieldArea: [st09Minerva010, otherShield],
          deck: [createMockUnit({ name: "First" }), createMockUnit({ name: "Second" })],
        },
        { play: [attacker], deck: 5 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p1.getBoardView().players[PLAYER_ONE]!.shieldCount;
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Minerva's Burst choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p1.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(shieldsBefore - 2);
      expect(p1.getHand()).toHaveLength(1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getResourceCount()).toBe(0);
    });

    it("moves the revealed Base card to trash when its owner declines Burst", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st09Minerva010] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      const burst = p1.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Minerva's Burst choice");
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p1.getCardZone(burst.sourceCardId)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.", () => {
    it("gives only its controller the two revealed identities, rejects invalid routing, and visibly keeps the chosen card on top while trashing the other", () => {
      const first = createMockUnit({ name: "First Revealed" });
      const second = createMockUnit({ name: "Second Revealed" });
      const filler = createMockUnit({ name: "Unrevealed Filler" });
      const engine = GundamTestEngine.create(
        {
          hand: [st09Minerva010],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: [first, second, filler],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getHand()[0]!;
      const shieldsBefore = p1.getBoardView().players[PLAYER_ONE]!.shieldCount;
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p1.deployBase(baseId));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected Minerva's deck-look choice");
      expect(choice).toMatchObject({
        sourceCardId: baseId,
        controllerId: PLAYER_ONE,
        returnMode: "chooseTop",
        remainingDestination: "trash",
      });
      expect(choice.revealedCardIds).toHaveLength(2);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
      const [chosenTopId, trashedId] = choice.revealedCardIds;

      expectFailure(
        p2.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTopId!], toTrash: [trashedId!] },
          },
        }),
        "NOT_ACTIVE_PLAYER",
      );
      expectFailure(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTopId!], toTrash: [chosenTopId!] },
          },
        }),
        "INVALID_DECK_LOOK_CARD_IDS",
      );
      expect(p1.getBoardView().pendingChoice?.kind).toBe("deckLook");
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTopId!], toTrash: [trashedId!] },
          },
        }),
      );

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(shieldsBefore - 1);
      expect(p1.getCardZone(trashedId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore - 1);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());

      expect(p1.getHand()).toContain(chosenTopId);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("still performs the own-turn deck look when there is no Shield to add to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [st09Minerva010],
        resourceArea: activeResources(2),
        deck: [createMockUnit({ name: "First" }), createMockUnit({ name: "Second" })],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st09Minerva010));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") {
        throw new Error("Expected the 'Then' deck look without a Shield");
      }
      const [chosenTopId, trashedId] = choice.revealedCardIds;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTopId!], toTrash: [trashedId!] },
          },
        }),
      );

      expect(p1.getHand()).toHaveLength(handBefore - 1);
      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(0);
      expect(p1.getCardZone(trashedId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });

    it("keeps the sole revealed card on top and has no remaining card to trash", () => {
      const onlyCard = createMockUnit({ name: "Only Card" });
      const engine = GundamTestEngine.create({
        hand: [st09Minerva010],
        resourceArea: activeResources(2),
        deck: [onlyCard],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;

      expectSuccess(p1.deployBase(st09Minerva010));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected the one-card deck look");
      expect(choice.revealedCardIds).toHaveLength(1);
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [choice.revealedCardIds[0]!], toTrash: [] },
          },
        }),
      );

      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore);
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });

    it("adds a Shield and finishes without a prompt when the deck is empty", () => {
      const engine = GundamTestEngine.create({
        hand: [st09Minerva010],
        resourceArea: activeResources(2),
        shieldArea: [createMockUnit({ name: "Shield" })],
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
        hand: [st09Minerva010],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st09Minerva010), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(st09Minerva010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const engine = GundamTestEngine.create({
        hand: [st09Minerva010],
        resourceArea: restedResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.deployBase(st09Minerva010), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(st09Minerva010)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("is destroyed after receiving battle damage equal to its printed 5 HP", () => {
      const attacker = createMockUnit({ ap: 5, hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st09Minerva010], resourceArea: activeResources(2), deck: [] },
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
