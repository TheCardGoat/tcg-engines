import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { willieTheGiantGhostOfChristmasPresent } from "./126-willie-the-giant-ghost-of-christmas-present";

const deckFiller = createMockCharacter({
  id: "willie-deck-filler",
  name: "Deck Filler",
  cost: 1,
  strength: 1,
  willpower: 2,
});

const opposingTarget = createMockCharacter({
  id: "willie-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 4,
});

describe("Willie the Giant - Ghost of Christmas Present", () => {
  it("is playable and enters play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [willieTheGiantGhostOfChristmasPresent],
      inkwell: willieTheGiantGhostOfChristmasPresent.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(willieTheGiantGhostOfChristmasPresent),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(willieTheGiantGhostOfChristmasPresent)).toBe(
      "play",
    );
  });

  it("regression: play remains legal after Willie is already in play (turnMetadata on THE FOOD OF GENEROSITY)", () => {
    // bugrep6Sg7rOzjFYF1GUVdvHKVT / bugrepjr4rHxKuNYyNot_msdyCu / bugrepxcyyJCsxAsTI7kQ1wqI1v
    // Playing Willie (or another card while Willie is in play) must not throw when the
    // static restriction condition reads turnMetadata.cardsUnderThisTurn.
    const secondWillieCopy = createMockCharacter({
      id: "willie-second-playable",
      name: "Ruby Filler",
      cost: 1,
      strength: 1,
      willpower: 1,
      inkable: true,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: willieTheGiantGhostOfChristmasPresent, isDrying: false }],
      hand: [secondWillieCopy],
      inkwell: secondWillieCopy.cost,
      deck: 2,
    });

    // Board projection / static registry must tolerate Willie's condition.
    expect(
      testEngine.asPlayerOne().getCard(willieTheGiantGhostOfChristmasPresent)?.hasQuestRestriction,
    ).toBe(true);

    expect(testEngine.asPlayerOne().playCard(secondWillieCopy)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(secondWillieCopy)).toBe("play");
  });

  it("THE FOOD OF GENEROSITY: cannot quest or challenge until a card is put under this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: willieTheGiantGhostOfChristmasPresent, isDrying: false }],
        inkwell: 3,
        deck: [deckFiller],
      },
      {
        play: [{ card: opposingTarget, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().getCard(willieTheGiantGhostOfChristmasPresent)?.hasQuestRestriction,
    ).toBe(true);
    expect(testEngine.asPlayerOne().quest(willieTheGiantGhostOfChristmasPresent).success).toBe(
      false,
    );
    expect(
      testEngine.asPlayerOne().challenge(willieTheGiantGhostOfChristmasPresent, opposingTarget)
        .success,
    ).toBe(false);

    // Boost 3 puts a card under Willie this turn → restriction lifts.
    expect(
      testEngine
        .asPlayerOne()
        .activateAbility(willieTheGiantGhostOfChristmasPresent, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveCardsUnder({
      card: willieTheGiantGhostOfChristmasPresent,
      count: 1,
    });
    expect(
      testEngine.asPlayerOne().getCard(willieTheGiantGhostOfChristmasPresent)?.hasQuestRestriction,
    ).toBe(false);
    expect(
      testEngine.asPlayerOne().challenge(willieTheGiantGhostOfChristmasPresent, opposingTarget),
    ).toBeSuccessfulCommand();
  });

  it("THE FOOD OF GENEROSITY: may quest after putting a card under this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: willieTheGiantGhostOfChristmasPresent, isDrying: false }],
      inkwell: 3,
      deck: [deckFiller],
    });

    expect(
      testEngine
        .asPlayerOne()
        .activateAbility(willieTheGiantGhostOfChristmasPresent, { ability: "Boost" }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().quest(willieTheGiantGhostOfChristmasPresent),
    ).toBeSuccessfulCommand();
  });

  it("THE FOOD OF GENEROSITY: external put-under (fixture cardsUnder) does not unlock without this-turn metadata", () => {
    // Cards already under from a prior turn should NOT satisfy
    // "unless you put a card under him this turn".
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        {
          card: willieTheGiantGhostOfChristmasPresent,
          isDrying: false,
          cardsUnder: [deckFiller],
        },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne()).toHaveCardsUnder({
      card: willieTheGiantGhostOfChristmasPresent,
      count: 1,
    });
    // Prior-turn under cards do not satisfy put-card-under-self-this-turn.
    expect(
      testEngine.asPlayerOne().getCard(willieTheGiantGhostOfChristmasPresent)?.hasQuestRestriction,
    ).toBe(true);
    expect(testEngine.asPlayerOne().quest(willieTheGiantGhostOfChristmasPresent).success).toBe(
      false,
    );
  });
});
