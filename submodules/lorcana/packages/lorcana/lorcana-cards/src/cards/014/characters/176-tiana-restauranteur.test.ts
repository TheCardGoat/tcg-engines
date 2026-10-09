import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { tianaRestauranteur } from "./176-tiana-restauranteur";

const firstDraw = createMockCharacter({
  id: "tiana-first-draw",
  name: "First Draw",
  cost: 1,
});

const secondDraw = createMockCharacter({
  id: "tiana-second-draw",
  name: "Second Draw",
  cost: 1,
});

describe("Tiana - Restauranteur", () => {
  it("resolves each played copy independently", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaRestauranteur, tianaRestauranteur, secondDraw],
      inkwell: 4,
      deck: [firstDraw],
    });
    const copies = game
      .getCardInstanceIdsInZone("hand", "player_one")
      .filter((id) => game.getCardDefinitionId(id) === tianaRestauranteur.id);
    expect(game.asPlayerOne().playCard(copies[0]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[0]!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("deck");
    expect(game.asPlayerOne().playCard(copies[1]!)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(copies[1]!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolveNextPending({ targets: [secondDraw] }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("discard");
    expect(game.asPlayerOne().getZonesCardCount().play).toBe(2);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("pays two ink and remains drying until the next own turn, then quests without drawing", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tianaRestauranteur], inkwell: 2, deck: 3 },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(game.asServer().getAvailableInk("player_one")).toBe(0);
    expect(game.asPlayerOne().quest(tianaRestauranteur)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    const deckBefore = game.asPlayerOne().getZonesCardCount().deck;
    expect(game.asPlayerOne().quest(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(game.getLore("player_one")).toBe(1);
    expect(game.asPlayerOne().isExerted(tianaRestauranteur)).toBe(true);
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(deckBefore);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });

  it("rejects insufficient ink without entry effects and inks without Handpicked", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaRestauranteur],
      inkwell: 1,
      deck: [firstDraw],
    });
    expect(game.asPlayerOne().playCard(tianaRestauranteur)).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(tianaRestauranteur)).toBe("hand");
    expect(game.asServer().getAvailableInk("player_one")).toBe(1);
    expect(game.asPlayerOne().getBagCount()).toBe(0);
    expect(
      game.asPlayerOne().putIntoInkwell("player_one", tianaRestauranteur),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(tianaRestauranteur)).toBe("inkwell");
    expect(game.asServer().getAvailableInk("player_one")).toBe(2);
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("deck");
    expect(game.asPlayerOne().getBagCount()).toBe(0);
  });
  it("player two draws and chooses from their own hand", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [secondDraw], deck: 3 },
      { hand: [tianaRestauranteur], inkwell: 2, deck: [firstDraw, secondDraw] },
    );
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    // The turn draw takes secondDraw, leaving firstDraw for Handpicked.
    expect(game.asPlayerTwo().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: true,
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      game.asPlayerTwo().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(firstDraw)).toBe("hand");
    expect(
      game.asPlayerTwo().resolveNextPending({
        targets: [game.findCardInstanceId(firstDraw, "hand", "player_two")],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerTwo().getCardZone(firstDraw)).toBe("discard");
    expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(secondDraw)).toBe("hand");
  });

  it("accepting an empty-deck draw still requires discarding an existing card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tianaRestauranteur, secondDraw], inkwell: 2, deck: [] },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getZonesCardCount().hand).toBe(1);
    expect(
      game.asPlayerOne().resolveNextPending({
        targets: [game.findCardInstanceId(secondDraw, "hand")],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("discard");
    expect(game.asPlayerOne().hasGameEnded()).toBe(false);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
  });

  it("declining with an empty deck does not attempt a draw or create a discard choice", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tianaRestauranteur, secondDraw], inkwell: 2, deck: [] },
      { deck: 3 },
    );
    expect(game.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("hand");
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(game.asPlayerOne().hasGameEnded()).toBe(false);
    expect(game.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(game.asServer().getWinner()).toBe(PLAYER_TWO);
  });
  it.each(["none", "two", "opponent", "play"] as const)(
    "rejects %s discard targets without consuming the required choice",
    (invalid: "none" | "two" | "opponent" | "play") => {
      const opponentCard = createMockCharacter({
        id: "tiana-opponent-hand",
        name: "Opponent Hand",
        cost: 1,
      });
      const game = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [tianaRestauranteur, secondDraw], inkwell: 2, deck: [firstDraw] },
        { hand: [opponentCard], deck: 2 },
      );
      expect(game.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
      expect(
        game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
          resolveOptional: true,
        }),
      ).toBeSuccessfulCommand();
      const drawn = game.findCardInstanceId(firstDraw, "hand");
      const existing = game.findCardInstanceId(secondDraw, "hand");
      const targets =
        invalid === "none"
          ? []
          : invalid === "two"
            ? [drawn, existing]
            : invalid === "opponent"
              ? [game.findCardInstanceId(opponentCard, "hand", "player_two")]
              : [game.findCardInstanceId(tianaRestauranteur, "play")];
      expect(game.asPlayerOne().resolveNextPending({ targets })).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("hand");
      expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("hand");
      expect(game.asPlayerTwo().getCardZone(opponentCard)).toBe("hand");
      expect(game.asPlayerOne().getCardZone(tianaRestauranteur)).toBe("play");
      expect(game.asPlayerOne().passTurn()).not.toBeSuccessfulCommand();
      expect(game.asPlayerOne().resolveNextPending({ targets: [drawn] })).toBeSuccessfulCommand();
      expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("discard");
      expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
    },
  );
  it("draws a card, then discards a chosen card when accepted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaRestauranteur],
      inkwell: tianaRestauranteur.cost,
      deck: [firstDraw, secondDraw],
    });

    expect(testEngine.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    // Drew the top card of the deck; choose it for the discard.
    // Fixture decks place the last supplied card on top.
    const drawnCard = secondDraw;
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    const drawnCardId = testEngine.findCardInstanceId(drawnCard, "hand");
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [drawnCardId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(firstDraw)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(1);
  });

  it("declining draws nothing and discards nothing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaRestauranteur],
      inkwell: tianaRestauranteur.cost,
      deck: [firstDraw, secondDraw],
    });

    expect(testEngine.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(firstDraw)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(secondDraw)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().discard).toBe(0);
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(tianaRestauranteur)).toBe("play");
  });

  it("can discard an existing hand card while keeping the drawn top card", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tianaRestauranteur, secondDraw],
      inkwell: 2,
      deck: [firstDraw],
    });
    expect(game.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("hand");
    expect(
      game.asPlayerOne().resolveNextPending({
        targets: [game.findCardInstanceId(secondDraw, "hand")],
      }),
    ).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("hand");
    expect(game.asPlayerOne().getCardZone(secondDraw)).toBe("discard");
    expect(game.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(game.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("does not let the opponent choose the controller's discard", () => {
    const game = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tianaRestauranteur], inkwell: 2, deck: [firstDraw] },
      { hand: [secondDraw], deck: 2 },
    );
    expect(game.asPlayerOne().playCard(tianaRestauranteur)).toBeSuccessfulCommand();
    expect(
      game.asPlayerOne().resolvePendingByCard(tianaRestauranteur, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    const drawnId = game.findCardInstanceId(firstDraw, "hand");
    expect(
      game.asPlayerTwo().resolveNextPending({ targets: [drawnId] }),
    ).not.toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("hand");
    expect(game.asPlayerTwo().getCardZone(secondDraw)).toBe("hand");
    expect(game.asPlayerOne().resolveNextPending({ targets: [drawnId] })).toBeSuccessfulCommand();
    expect(game.asPlayerOne().getCardZone(firstDraw)).toBe("discard");
  });
});
