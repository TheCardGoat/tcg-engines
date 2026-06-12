import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { createMockAction, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goliathClanLeader } from "@tcg/lorcana-cards/cards/010";

const p1Keep1 = createMockCharacter({ id: "the-939-p1-keep-1", name: "P1 Keep 1", cost: 1 });
const p1Keep2 = createMockCharacter({ id: "the-939-p1-keep-2", name: "P1 Keep 2", cost: 1 });
const p1Discard1 = createMockCharacter({
  id: "the-939-p1-discard-1",
  name: "P1 Discard 1",
  cost: 1,
});
const p1Discard2 = createMockCharacter({
  id: "the-939-p1-discard-2",
  name: "P1 Discard 2",
  cost: 1,
});
const p1DeckDraw1 = createMockCharacter({
  id: "the-939-p1-deck-draw-1",
  name: "P1 Deck Draw 1",
  cost: 1,
});
const p1DeckDraw2 = createMockCharacter({
  id: "the-939-p1-deck-draw-2",
  name: "P1 Deck Draw 2",
  cost: 1,
});

const p2Keep1 = createMockCharacter({ id: "the-939-p2-keep-1", name: "P2 Keep 1", cost: 1 });
const p2Keep2 = createMockCharacter({ id: "the-939-p2-keep-2", name: "P2 Keep 2", cost: 1 });
const p2Discard1 = createMockCharacter({
  id: "the-939-p2-discard-1",
  name: "P2 Discard 1",
  cost: 1,
});
const p2Discard2 = createMockCharacter({
  id: "the-939-p2-discard-2",
  name: "P2 Discard 2",
  cost: 1,
});
const p2Discard3 = createMockCharacter({
  id: "the-939-p2-discard-3",
  name: "P2 Discard 3",
  cost: 1,
});
const p2DeckDraw1 = createMockCharacter({
  id: "the-939-p2-deck-draw-1",
  name: "P2 Deck Draw 1",
  cost: 1,
});
const p2DeckDraw2 = createMockCharacter({
  id: "the-939-p2-deck-draw-2",
  name: "P2 Deck Draw 2",
  cost: 1,
});

const p2TurnDeckCard1 = createMockCharacter({
  id: "the-939-p2-turn-deck-1",
  name: "P2 Turn Deck 1",
  cost: 1,
});
const p2TurnDeckCard2 = createMockCharacter({
  id: "the-939-p2-turn-deck-2",
  name: "P2 Turn Deck 2",
  cost: 1,
});
const p2TurnDeckCard3 = createMockCharacter({
  id: "the-939-p2-turn-deck-3",
  name: "P2 Turn Deck 3",
  cost: 1,
});
const p2TurnCard = createMockAction({
  id: "the-939-p2-turn-card",
  name: "P2 Turn Card",
  cost: 0,
});

describe("THE-939 - Goliath end-of-turn normalization", () => {
  it("regression: opponent draws up to 2 when ending turn empty-handed", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goliathClanLeader],
        hand: [p1Keep1, p1Keep2],
        deck: 2,
      },
      {
        hand: [],
        deck: [p2TurnDeckCard1, p2TurnDeckCard2, p2TurnDeckCard3],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 1 });
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goliathClanLeader),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2, deck: 1 });
  });

  it("regression: opponent discards down to 2 when ending turn above 2 cards", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goliathClanLeader],
        hand: [p1Keep1, p1Keep2],
        deck: 2,
      },
      {
        hand: [p2Keep1, p2Keep2, p2Discard1],
        deck: [p2Discard2, p2DeckDraw1],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 4 });
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const p2DiscardTargets = testEngine
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter((cardInstanceId) => {
        const cardDefinitionId = testEngine.getCardDefinitionId(cardInstanceId);
        return cardDefinitionId !== p2Keep1.id && cardDefinitionId !== p2Keep2.id;
      })
      .slice(0, 2);
    expect(p2DiscardTargets.length).toBe(2);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goliathClanLeader),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerTwo().resolvePendingByCard(goliathClanLeader, {
        targets: p2DiscardTargets,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2, discard: 2 });
  });

  it("regression: both sides controlling Goliath normalize consistently on each turn end", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goliathClanLeader],
        hand: [p1Keep1, p1Keep2, p1Discard1, p1Discard2],
        deck: [p1DeckDraw1, p1DeckDraw2],
      },
      {
        play: [goliathClanLeader],
        hand: [p2Keep1, p2Discard1, p2Discard2, p2TurnCard],
        deck: [p2Keep2, p2DeckDraw1, p2DeckDraw2],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);

    const p1ControllerBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((effect) => effect.controllerId === PLAYER_ONE);
    expect(p1ControllerBag).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolveBag(p1ControllerBag!.id, {
        targets: [p1Discard1, p1Discard2],
      }),
    ).toBeSuccessfulCommand();

    const p2ControllerBag = testEngine
      .asPlayerOne()
      .getBagEffects()
      .find((effect) => effect.controllerId === PLAYER_TWO);
    expect(p2ControllerBag).toBeDefined();
    expect(testEngine.asPlayerTwo().resolveBag(p2ControllerBag!.id)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, discard: 2 });
    expect(testEngine.asPlayerOne().getCardZone(p1Keep1)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(p1Keep2)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(p1Discard1)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(p1Discard2)).toBe("discard");

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 5 });
    expect(testEngine.asPlayerTwo().playCard(p2TurnCard)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 4 });
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(2);

    const p2DiscardTargets = testEngine
      .getCardInstanceIdsInZone("hand", PLAYER_TWO)
      .filter((cardInstanceId) => {
        const cardDefinitionId = testEngine.getCardDefinitionId(cardInstanceId);
        return cardDefinitionId !== p2Keep1.id;
      })
      .slice(0, 3);
    expect(p2DiscardTargets.length).toBe(3);

    const p2ControllerBagOnP2Turn = testEngine
      .asPlayerTwo()
      .getBagEffects()
      .find((effect) => effect.controllerId === PLAYER_TWO);
    expect(p2ControllerBagOnP2Turn).toBeDefined();
    expect(
      testEngine.asPlayerTwo().resolveBag(p2ControllerBagOnP2Turn!.id, {
        targets: p2DiscardTargets,
      }),
    ).toBeSuccessfulCommand();

    const p1ControllerBagOnP2Turn = testEngine
      .asPlayerTwo()
      .getBagEffects()
      .find((effect) => effect.controllerId === PLAYER_ONE);
    expect(p1ControllerBagOnP2Turn).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolveBag(p1ControllerBagOnP2Turn!.id),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2, discard: 3 });
    expect(testEngine.asPlayerTwo().getCardZone(p2Keep1)).toBe("hand");
  });

  it("regression: automation resolves opponent discard-to-2 window", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [goliathClanLeader],
        hand: [p1Keep1, p1Keep2],
        deck: 3,
      },
      {
        hand: [p2Keep1, p2Discard1, p2Discard2],
        deck: [p2DeckDraw1, p2DeckDraw2],
      },
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    testEngine.asPlayerOne().resolveAllBagEffects({ maxIterations: 10 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 4 });

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    let safety = 0;
    while (
      safety < 10 &&
      (testEngine.asPlayerOne().getBagCount() > 0 ||
        testEngine.asPlayerOne().getPendingEffects().length > 0) &&
      !testEngine.asServer().isGameOver()
    ) {
      testEngine.asServer().takeAutomatedActionForCurrentActor();
      safety += 1;
    }

    expect(safety).toBeLessThan(10);
    expect(testEngine.asServer().isGameOver()).toBe(false);
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getPendingEffects().length).toBe(0);
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2, discard: 2 });
  });
});
