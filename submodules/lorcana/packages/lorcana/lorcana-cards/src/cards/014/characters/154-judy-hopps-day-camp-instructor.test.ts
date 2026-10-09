import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockItem,
  createMockAction,
} from "@tcg/lorcana-engine/testing";
import { ward } from "../../../helpers/abilities";
import { dragonFire } from "../../001/actions/130-dragon-fire";
import { judyHoppsDayCampInstructor } from "./154-judy-hopps-day-camp-instructor";

const campMate = createMockCharacter({
  id: "judy-daycamp-mate",
  name: "Camp Mate",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const deckTopCard = createMockCharacter({ id: "judy-daycamp-top", name: "Top Card", cost: 1 });

describe("Judy Hopps - Day Camp Instructor", () => {
  it("Player Two does not count the opponent's preceding character play", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [campMate], inkwell: 2, deck: [deckTopCard] },
      { hand: [judyHoppsDayCampInstructor], inkwell: 2, deck: [deckTopCard, deckTopCard] },
    );
    expect(g.asPlayerOne().playCard(campMate)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toHaveLength(2);
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toHaveLength(1);
  });

  it("the first Judy qualifies later copies even after leaving play, with independent accept and decline", () => {
    const nonInkable = createMockCharacter({
      id: "judy-noninkable-top",
      name: "Non Inkable",
      cost: 1,
      inkable: false,
    });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [
        judyHoppsDayCampInstructor,
        judyHoppsDayCampInstructor,
        judyHoppsDayCampInstructor,
        dragonFire,
      ],
      inkwell: 11,
      deck: [deckTopCard, nonInkable],
    });
    const [first, second, third] = g.getCardInstanceIdsInZone("hand", PLAYER_ONE);
    expect(g.asPlayerOne().playCard(first!)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagEffects()).toHaveLength(0);
    expect(g.asPlayerOne().playCard(dragonFire, { targets: [first!] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(second!)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(second!, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(nonInkable)).toBe("inkwell");
    expect(g.isCardFaceDown(nonInkable, "inkwell", PLAYER_ONE)).toBe(true);
    expect(g.asPlayerOne().isExerted(nonInkable)).toBe(true);
    expect(g.asPlayerOne().playCard(third!)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(third!, { resolveOptional: false }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([deckTopCard.id]);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(12);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it.each([2, -2])(
    "Player Two Support uses current strength after a %s modifier and allows own Ward",
    (modifier: number) => {
      const change = createMockAction({
        id: `judy-strength-${modifier}`,
        name: "Change Strength",
        cost: 0,
        abilities: [
          {
            type: "action",
            effect: {
              type: "modify-stat",
              stat: "strength",
              modifier,
              target: "CHOSEN_CHARACTER",
              duration: "this-turn",
            },
          },
        ],
      });
      const ownWard = createMockCharacter({
        id: "judy-own-ward",
        name: "Own Ward",
        cost: 1,
        strength: 1,
        abilities: [ward],
      });
      const opposingWard = createMockCharacter({
        id: "judy-opposing-ward",
        name: "Opposing Ward",
        cost: 1,
        abilities: [ward],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [opposingWard], deck: 3 },
        {
          play: [{ card: judyHoppsDayCampInstructor, isDrying: false }, ownWard],
          hand: [change],
          deck: 3,
        },
      );
      expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(
        g.asPlayerTwo().playCard(change, { targets: [judyHoppsDayCampInstructor] }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardStrength(judyHoppsDayCampInstructor)).toBe(2 + modifier);
      expect(g.asPlayerTwo().quest(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
      expect(
        g.asPlayerTwo().resolvePendingByCard(judyHoppsDayCampInstructor, {
          resolveOptional: true,
          targets: [opposingWard],
        }),
      ).not.toBeSuccessfulCommand();
      expect(
        g.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
          resolveOptional: true,
          targets: [ownWard],
        }),
      ).not.toBeSuccessfulCommand();
      expect(
        g.asPlayerTwo().resolvePendingByCard(judyHoppsDayCampInstructor, {
          resolveOptional: true,
          targets: [ownWard],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(1 + Math.max(0, 2 + modifier));
      expect(g.asPlayerTwo().getPendingEffects()).toHaveLength(0);
      expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardStrength(ownWard)).toBe(1);
    },
  );

  it("failed payment and ordinary inking leave Judy in hand without triggering", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [judyHoppsDayCampInstructor],
      inkwell: 1,
      deck: [deckTopCard],
    });
    expect(g.asPlayerOne().playCard(judyHoppsDayCampInstructor)).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().putIntoInkwell(PLAYER_ONE, judyHoppsDayCampInstructor),
    ).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(judyHoppsDayCampInstructor)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("does not count a character played on the previous turn", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [campMate, judyHoppsDayCampInstructor], inkwell: 4, deck: 4 },
      { deck: 4 },
    );
    expect(g.asPlayerOne().playCard(campMate)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
  });

  it("an empty deck adds no ink and leaves no prompt", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [campMate, judyHoppsDayCampInstructor],
      inkwell: 4,
      deck: [],
    });
    expect(g.asPlayerOne().playCard(campMate)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(4);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("player two inks only their own top card after playing another character", () => {
    const draw = createMockItem({ id: "judy-daycamp-draw", name: "Turn Draw", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { deck: [deckTopCard, deckTopCard] },
      { hand: [campMate, judyHoppsDayCampInstructor], inkwell: 4, deck: [deckTopCard, draw] },
    );
    const ownDeck = g.getCardInstanceIdsInZone("deck", PLAYER_ONE);
    const topId = g.findCardInstanceId(deckTopCard, "deck", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(campMate)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(
      g.asPlayerTwo().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_ONE)).toEqual(ownDeck);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_TWO)).toContain(topId!);
    expect(g.asPlayerTwo().isExerted(topId!)).toBe(true);
    expect(g.asServer().getAvailableInk(PLAYER_TWO)).toBe(0);
  });

  it("inks the top card rather than the bottom card of a multi-card deck", () => {
    const bottom = createMockItem({ id: "judy-daycamp-bottom", name: "Bottom Card", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [campMate, judyHoppsDayCampInstructor],
      inkwell: 4,
      deck: [bottom, deckTopCard],
    });
    expect(g.asPlayerOne().playCard(campMate)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(deckTopCard)).toBe("inkwell");
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([bottom.id]);
  });

  it("an existing character and an item played this turn do not satisfy Lend a Paw", () => {
    const item = createMockItem({ id: "judy-daycamp-item", name: "Camp Item", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [item, judyHoppsDayCampInstructor],
      play: [campMate],
      inkwell: 3,
      deck: [deckTopCard],
    });
    expect(g.asPlayerOne().playCard(item)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getBagCount()).toBe(0);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
    expect(g.asPlayerOne().getCardZone(deckTopCard)).toBe("deck");
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(3);
  });

  it("Support rejects Judy herself, supports an opposing character, and expires at turn end", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [{ card: judyHoppsDayCampInstructor, isDrying: false }], deck: 3 },
      { play: [campMate], deck: 3 },
    );
    expect(g.asPlayerOne().quest(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(g.getLore(PLAYER_ONE)).toBe(1);
    expect(
      g.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: true,
        targets: [judyHoppsDayCampInstructor],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: true,
        targets: [campMate],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(campMate)).toBe(3);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(campMate)).toBe(1);
  });

  it("may decline Support without changing another character's strength", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: judyHoppsDayCampInstructor, isDrying: false }, campMate],
      deck: 3,
    });
    expect(g.asPlayerOne().quest(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(campMate)).toBe(1);
    expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
  });

  it("LEND A PAW - does not trigger when no other character was played this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [judyHoppsDayCampInstructor],
      inkwell: judyHoppsDayCampInstructor.cost,
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
  });

  it("LEND A PAW - when another character was played this turn, may put the top card of your deck into your inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [campMate, judyHoppsDayCampInstructor],
      inkwell: campMate.cost + judyHoppsDayCampInstructor.cost,
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(campMate)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCard(deckTopCard).exerted).toBe(true);
    expect(testEngine.isCardFaceDown(deckTopCard, "inkwell", PLAYER_ONE)).toBe(true);
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(0);
    expect(testEngine.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(5);
  });

  it("LEND A PAW - declining leaves the deck untouched", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [campMate, judyHoppsDayCampInstructor],
      inkwell: campMate.cost + judyHoppsDayCampInstructor.cost,
      deck: [deckTopCard],
    });

    expect(testEngine.asPlayerOne().playCard(campMate)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(judyHoppsDayCampInstructor)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(judyHoppsDayCampInstructor, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(deckTopCard)).toBe("deck");
    expect(testEngine.asPlayerOne().getZonesCardCount().deck).toBe(1);
    expect(testEngine.asPlayerOne().getZonesCardCount().inkwell).toBe(
      campMate.cost + judyHoppsDayCampInstructor.cost,
    );
  });
});
