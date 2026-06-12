import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { megaraSecretKeeper } from "../characters/086-megara-secret-keeper";
import { blessedBagpipes } from "./101-blessed-bagpipes";
import { webbysDiary } from "./031-webbys-diary";
import { theBlackCauldron } from "./032-the-black-cauldron";

const topDeckCard = createMockCharacter({
  id: "webbys-diary-top-deck-card",
  name: "Top Deck Card",
  cost: 1,
});

const drawnCard = createMockCharacter({
  id: "webbys-diary-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const raisedSoldier = createMockCharacter({
  id: "webbys-diary-raised-soldier",
  name: "Raised Soldier",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const opponentHost = createMockCharacter({
  id: "webbys-diary-opponent-host",
  name: "Opponent Host",
  cost: 2,
});

const opponentChild = createMockCharacter({
  id: "webbys-diary-opponent-child",
  name: "Opponent Child",
  cost: 1,
});

describe("Webby's Diary", () => {
  it("triggers and lets you pay 1 ink to draw a card when a card is put under one of your characters", () => {
    // Blessed Bagpipes puts top of deck under a Boost character when played.
    // Webby's Diary triggers on any put-card-under on your characters/locations.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [webbysDiary, megaraSecretKeeper],
      hand: [blessedBagpipes],
      inkwell: blessedBagpipes.cost + 1,
      deck: [topDeckCard, drawnCard],
    });

    expect(testEngine.asPlayerOne().playCard(blessedBagpipes)).toBeSuccessfulCommand();

    // Blessed Bagpipes MCDUCK HEIRLOOM triggers
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [bagpipesBagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolveBag(bagpipesBagEffect!.id, {
        resolveOptional: true,
        targets: [megaraSecretKeeper],
      }),
    ).toBeSuccessfulCommand();

    // Webby's Diary LATEST ENTRY triggers after card placed under megaraSecretKeeper
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [webbysBagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolveBag(webbysBagEffect!.id)).toBeSuccessfulCommand();

    // topDeckCard is drawn via the Webby's Diary effect (drawnCard was put under megaraSecretKeeper)
    expect(testEngine.asPlayerOne().getCardZone(topDeckCard)).toBe("hand");
  });

  it("regression: does NOT trigger when a card is put under The Black Cauldron (an item, not a character or location)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [webbysDiary, theBlackCauldron],
      discard: [raisedSoldier],
      inkwell: 1,
      deck: 2,
    });

    // Use The Black Cauldron's THE CAULDRON CALLS to put a character under the item
    expect(
      testEngine.asPlayerOne().activateAbility(theBlackCauldron, {
        ability: "THE CAULDRON CALLS",
        targets: [raisedSoldier],
      }),
    ).toBeSuccessfulCommand();

    // Webby's Diary should NOT trigger because The Black Cauldron is an item, not a character or location
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not trigger when an opponent puts a card under one of their characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [webbysDiary],
      },
      {
        play: [opponentHost, opponentChild],
      },
    );

    testEngine.putCardUnder(opponentHost, opponentChild);

    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
