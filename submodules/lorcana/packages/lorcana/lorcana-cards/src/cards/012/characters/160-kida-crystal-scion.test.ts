import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { kidaCrystalScion } from "./160-kida-crystal-scion";

const discardFodderA = createMockCharacter({
  id: "kida-cs-discard-a",
  name: "Discard Fodder A",
  cost: 1,
});

const discardFodderB = createMockCharacter({
  id: "kida-cs-discard-b",
  name: "Discard Fodder B",
  cost: 1,
});

const opponentDiscardFodder = createMockCharacter({
  id: "kida-cs-opponent-discard",
  name: "Opponent Discard Fodder",
  cost: 1,
});

const deckTop = createMockCharacter({
  id: "kida-cs-deck-top",
  name: "Deck Top",
  cost: 1,
});

const deckSecond = createMockCharacter({
  id: "kida-cs-deck-second",
  name: "Deck Second",
  cost: 1,
});

describe("Kida - Crystal Scion", () => {
  it("has Shift 6", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [kidaCrystalScion],
      deck: 5,
    });

    expect(testEngine.hasKeyword(kidaCrystalScion, "Shift")).toBe(true);
  });

  describe("FLOOD OF POWER - When you play this character, each player may put up to 5 cards from their discard into their inkwell facedown and exerted.", () => {
    it("lets the controller put cards from their discard into their inkwell when Kida is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: kidaCrystalScion.cost,
        hand: [kidaCrystalScion],
        discard: [discardFodderA, discardFodderB],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(kidaCrystalScion)).toBeSuccessfulCommand();
      const controllerBag = playerOne.getBagEffects().find((effect) => effect.abilityIndex === 1);
      expect(controllerBag).toBeDefined();

      // Resolve the controller's optional; accept and choose both discard cards
      expect(
        playerOne.resolveBag(controllerBag!.id, {
          resolveOptional: true,
          targets: [discardFodderA, discardFodderB],
        }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(discardFodderA)).toBe("inkwell");
      expect(playerOne.getCardZone(discardFodderB)).toBe("inkwell");
    });

    it("is optional for the controller - declining leaves discard untouched", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: kidaCrystalScion.cost,
        hand: [kidaCrystalScion],
        discard: [discardFodderA, discardFodderB],
        deck: 5,
      });

      const playerOne = testEngine.asPlayerOne();

      expect(playerOne.playCard(kidaCrystalScion)).toBeSuccessfulCommand();
      const controllerBag = playerOne.getBagEffects().find((effect) => effect.abilityIndex === 1);
      expect(controllerBag).toBeDefined();
      expect(
        playerOne.resolveBag(controllerBag!.id, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(discardFodderA)).toBe("discard");
      expect(playerOne.getCardZone(discardFodderB)).toBe("discard");
    });

    it("also lets the opponent put cards from their discard into their inkwell", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: kidaCrystalScion.cost,
          hand: [kidaCrystalScion],
          discard: [discardFodderA],
          deck: 5,
        },
        {
          discard: [opponentDiscardFodder],
          deck: 5,
        },
      );

      const playerOne = testEngine.asPlayerOne();
      const playerTwo = testEngine.asPlayerTwo();

      expect(playerOne.playCard(kidaCrystalScion)).toBeSuccessfulCommand();
      const controllerBag = playerOne.getBagEffects().find((effect) => effect.abilityIndex === 1);
      expect(controllerBag).toBeDefined();
      expect(
        playerOne.resolveBag(controllerBag!.id, {
          resolveOptional: true,
          targets: [discardFodderA],
        }),
      ).toBeSuccessfulCommand();
      expect(playerTwo.getPendingEffects()).toHaveLength(1);
      expect(
        playerTwo.resolveNextPending({ targets: [opponentDiscardFodder] }),
      ).toBeSuccessfulCommand();

      expect(playerOne.getCardZone(discardFodderA)).toBe("inkwell");
      expect(playerTwo.getCardZone(opponentDiscardFodder)).toBe("inkwell");
    });
  });

  describe("THE PATH REVEALED 7 - {I} — Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of your deck.", () => {
    it("scry 2 when activated: put one in hand, other on bottom of deck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: 10,
        play: [{ card: kidaCrystalScion, isDrying: false }],
        deck: [deckTop, deckSecond],
      });

      const playerOne = testEngine.asPlayerOne();

      // Activated ability: THE PATH REVEALED 7 {I}
      expect(
        playerOne.activateAbility(kidaCrystalScion, "THE PATH REVEALED"),
      ).toBeSuccessfulCommand();

      const pending = testEngine.asServer().getState().G.pendingEffects[0];
      expect(pending?.kind).toBe("scry-selection");
      const revealedCardIds = pending?.resolutionInput.eventSnapshot?.revealedCardIds as
        | string[]
        | undefined;
      expect(revealedCardIds).toHaveLength(2);
      const [first, second] = revealedCardIds!;

      expect(
        playerOne.resolvePendingEffect(kidaCrystalScion, {
          destinations: [
            { zone: "hand", cards: [first] },
            { zone: "deck-bottom", cards: [second] },
          ],
        }),
      ).toBeSuccessfulCommand();
    });
  });
});
