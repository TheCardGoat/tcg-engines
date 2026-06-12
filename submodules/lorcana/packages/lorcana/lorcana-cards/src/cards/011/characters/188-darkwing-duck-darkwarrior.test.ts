import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { archimedesResourcefulOwl } from "../../008/characters/113-archimedes-resourceful-owl";
import { hiddenTrap } from "../items/170-hidden-trap";
import { darkwingDuckDarkwarrior } from "./188-darkwing-duck-darkwarrior";

const opponent = createMockCharacter({
  id: "dw-darkwarrior-opponent",
  name: "Opponent Character",
  strength: 2,
  willpower: 5,
  cost: 2,
});

const opponentItem = createMockItem({
  id: "dw-darkwarrior-opponent-item",
  name: "Opponent Item",
  cost: 1,
});

describe("Darkwing Duck - Darkwarrior", () => {
  it("has Challenger keyword", () => {
    const testEngine = new LorcanaTestEngine({
      play: [darkwingDuckDarkwarrior],
    });

    const cardUnderTest = testEngine.getCardModel(darkwingDuckDarkwarrior);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });

  it("gains Resist when an item is banished during your turn via Hidden Trap self-banish", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckDarkwarrior, { card: hiddenTrap, isDrying: false }],
        deck: 5,
      },
      {
        play: [opponent],
      },
    );

    // Darkwing should not have Resist initially
    expect(testEngine.getKeywordValue(darkwingDuckDarkwarrior, "Resist")).toBe(null);

    // Activate Hidden Trap (exert + banish self) - choose to banish a target item
    // The self-banish should trigger INSTA-ARMOR
    expect(
      testEngine.asPlayerOne().activateAbility(hiddenTrap, {
        choiceIndex: 1,
        targets: [opponent],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(hiddenTrap)).toBe("discard");

    // INSTA-ARMOR should have triggered, giving Resist +1
    expect(testEngine.getKeywordValue(darkwingDuckDarkwarrior, "Resist")).toBe(1);
  });

  it("gains Resist when an opponent's item is banished during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [darkwingDuckDarkwarrior, archimedesResourcefulOwl],
        inkwell: 8,
      },
      {
        play: [opponentItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(darkwingDuckDarkwarrior)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(archimedesResourcefulOwl)).toBeSuccessfulCommand();

    const [banishBag] = testEngine.asPlayerOne().getBagEffects();
    expect(banishBag).toBeDefined();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(archimedesResourcefulOwl, { targets: [opponentItem] }),
    ).toBeSuccessfulCommand();

    const bagEffects = testEngine.asPlayerOne().getBagEffects();
    const darkwingBag = bagEffects.find(
      (bag) => (bag.payload as { abilityId?: string }).abilityId === "l0p-2",
    );
    expect(darkwingBag).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingDuckDarkwarrior),
    ).toBeSuccessfulCommand();

    const drawDiscardBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((bag) => (bag.payload as { abilityId?: string }).abilityId === "3sv-2");
    expect(drawDiscardBag).toBeDefined();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(archimedesResourcefulOwl, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
    expect(testEngine.getKeywordValue(darkwingDuckDarkwarrior, "Resist")).toBe(1);
  });

  it("INSTA-ARMOR - Resist expires at start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [darkwingDuckDarkwarrior, { card: hiddenTrap, isDrying: false }],
        deck: 5,
      },
      {
        play: [opponent],
      },
    );

    // Trigger INSTA-ARMOR by banishing the item
    expect(
      testEngine.asPlayerOne().activateAbility(hiddenTrap, {
        choiceIndex: 1,
        targets: [opponent],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.getKeywordValue(darkwingDuckDarkwarrior, "Resist")).toBe(1);

    // Pass turn to opponent and back
    testEngine.asServer().passTurn();
    testEngine.asServer().passTurn();

    // Resist should have expired at start of player one's next turn
    expect(testEngine.getKeywordValue(darkwingDuckDarkwarrior, "Resist")).toBe(null);
  });
});
