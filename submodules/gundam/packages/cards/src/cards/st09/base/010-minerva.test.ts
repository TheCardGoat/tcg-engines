import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st09Minerva010 } from "./010-minerva.ts";

describe("Minerva (ST09-010)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips Minerva from shieldArea into baseSection", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st09Minerva010] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      const shieldId = p2.getCardsInZone("shieldArea")[0]!;

      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p2.getBoardView().pendingChoice).toMatchObject({
        kind: "optional",
        sourceCardId: shieldId,
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p2.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_TWO}`);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand. Then, if it is your turn, look at the top 2 cards of your deck and return 1 to the top. Place the remaining card into your trash.", () => {
    it("moves the first shield to hand and deploys Minerva to baseSection", () => {
      const first = createMockUnit({ name: "First Revealed" });
      const second = createMockUnit({ name: "Second Revealed" });
      const engine = GundamTestEngine.create(
        {
          hand: [st09Minerva010],
          resourceArea: activeResources(2),
          shieldArea: [
            createMockUnit({ name: "First Shield" }),
            createMockUnit({ name: "Second Shield" }),
          ],
          deck: [first, second],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const shieldIds = p1.getCardsInZone("shieldArea");
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st09Minerva010));
      const choice = p1.getBoardView().pendingChoice;
      expect(choice).toMatchObject({ kind: "deckLook", sourceCardId: expect.any(String) });
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const [chosenTop, trashed] = choice.revealedCardIds;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTop!], toTrash: [trashed!] },
          },
        }),
      );

      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getHand().length).toBe(handBefore);
      expect(p1.getCardsInZone("shieldArea")).toEqual([shieldIds[1]]);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });

    it("on its controller's turn, returns one revealed card to top and trashes the other", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st09Minerva010],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: [
            createMockUnit({ name: "Bottom" }),
            createMockUnit({ name: "Second Revealed" }),
            createMockUnit({ name: "Top Revealed" }),
          ],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const deckBefore = p1.getCardsInZone("deck").length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p1.deployBase(st09Minerva010));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const [chosenTop, trashed] = choice.revealedCardIds;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTop!], toTrash: [trashed!] },
          },
        }),
      );

      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
      expect(p1.getCardsInZone("trash")).toHaveLength(trashBefore + 1);
      expect(p1.getCardsInZone("trash")).toContain(trashed);
      expect(p1.getCardsInZone("trash")).not.toContain(chosenTop);
    });

    it("does not resolve the deck-look rider when deployed during the opponent's turn", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { shieldArea: [st09Minerva010], deck: 3 },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldId = p1.getCardsInZone("shieldArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;
      const trashBefore = p1.getCardsInZone("trash").length;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore);
      expect(p1.getCardsInZone("trash")).toHaveLength(trashBefore);
      expect(p1.getCardZone(shieldId)).toBe(`baseSection:${PLAYER_ONE}`);
    });

    it("still deploys cleanly when there are no shields to add", () => {
      const engine = GundamTestEngine.create(
        { hand: [st09Minerva010], resourceArea: activeResources(2), deck: 2 },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st09Minerva010));
      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "deckLook") throw new Error("Expected a deck-look choice");
      const [chosenTop, trashed] = choice.revealedCardIds;
      expectSuccess(
        p1.resolveEffect({
          deckLookAnswers: {
            [choice.directiveIndex]: { toTop: [chosenTop!], toTrash: [trashed!] },
          },
        }),
      );

      expect(p1.getHand()).toHaveLength(handBefore - 1);
      expect(p1.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });

    it("handles an empty deck after the shield is added to hand", () => {
      const engine = GundamTestEngine.create(
        {
          hand: [st09Minerva010],
          resourceArea: activeResources(2),
          shieldArea: [createMockUnit({ name: "Shield" })],
          deck: [],
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const shieldId = p1.getCardsInZone("shieldArea")[0]!;

      expectSuccess(p1.deployBase(st09Minerva010));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getHand()).toContain(shieldId);
      expect(p1.getCardsInZone("deck")).toHaveLength(0);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });
  });
});
