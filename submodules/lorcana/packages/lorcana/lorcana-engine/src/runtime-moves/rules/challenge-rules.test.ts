import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "../../testing";

const discardFodder = createMockCharacter({
  id: "challenge-rules-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

const discardOutlet = createMockCharacter({
  id: "challenge-rules-discard-outlet",
  name: "Discard Outlet",
  cost: 2,
  abilities: [
    {
      id: "challenge-rules-discard-outlet-ability",
      type: "activated",
      name: "DISCARD OUTLET",
      text: "Choose and discard a card - This character gains Challenger +1 this turn.",
      cost: {
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        value: 1,
        duration: "this-turn",
        target: "SELF",
      },
    },
  ],
});

const conditionalReadyChallenger = createMockCharacter({
  id: "challenge-rules-conditional-ready-challenger",
  name: "Conditional Ready Challenger",
  cost: 3,
  strength: 3,
  willpower: 4,
  abilities: [
    {
      id: "challenge-rules-conditional-ready-challenger-ability",
      type: "static",
      name: "READY CHALLENGE",
      text: "If you discarded a card this turn, this character can challenge ready characters.",
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
    },
  ],
});

const readyDefender = createMockCharacter({
  id: "challenge-rules-ready-defender",
  name: "Ready Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe("challenge rules", () => {
  it("evaluates turn-metric conditions for static can-challenge-ready grants", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: conditionalReadyChallenger, isDrying: false },
          { card: discardOutlet, isDrying: false },
        ],
        hand: [discardFodder],
      },
      {
        play: [readyDefender],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(conditionalReadyChallenger, readyDefender)).toBe(
      false,
    );

    const discardId = testEngine.findCardInstanceId(discardFodder, "hand", "player_one");
    expect(
      testEngine.asPlayerOne().activateAbility(discardOutlet, {
        ability: "DISCARD OUTLET",
        costs: {
          discardCards: [discardId],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().canChallenge(conditionalReadyChallenger, readyDefender)).toBe(
      true,
    );
    expect(
      testEngine.asPlayerOne().challenge(conditionalReadyChallenger, readyDefender),
    ).toBeSuccessfulCommand();
  });
});
