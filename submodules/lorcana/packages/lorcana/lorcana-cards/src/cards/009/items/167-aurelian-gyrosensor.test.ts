import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { aurelianGyrosensor } from "./167-aurelian-gyrosensor";
import { heartOfTeFiti } from "./168-heart-of-te-fiti";

const gyrosensorQuester = createMockCharacter({
  id: "aurelian-gyrosensor-quester",
  name: "Gyrosensor Quester",
  cost: 2,
});

const topDeckCard = createMockCharacter({
  id: "aurelian-gyrosensor-top",
  name: "Top Deck Card",
  cost: 1,
});

const secondDeckCard = createMockCharacter({
  id: "aurelian-gyrosensor-second",
  name: "Second Deck Card",
  cost: 1,
});

describe("Aurelian Gyrosensor", () => {
  it("can leave the top card where it is by declining the optional effect", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      deck: [topDeckCard, secondDeckCard],
      play: [aurelianGyrosensor, heartOfTeFiti, { card: gyrosensorQuester, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(gyrosensorQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(aurelianGyrosensor, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().activateAbility(heartOfTeFiti)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(secondDeckCard)).toBe("deck");
  });

  it("puts the looked-at card on the bottom after one of your characters quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      deck: [topDeckCard, secondDeckCard],
      play: [aurelianGyrosensor, heartOfTeFiti, { card: gyrosensorQuester, isDrying: false }],
    });

    expect(testEngine.asPlayerOne().quest(gyrosensorQuester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(aurelianGyrosensor),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "deck-bottom", cards: [secondDeckCard] },
        ],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().activateAbility(heartOfTeFiti)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(secondDeckCard)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("deck");
  });
});
