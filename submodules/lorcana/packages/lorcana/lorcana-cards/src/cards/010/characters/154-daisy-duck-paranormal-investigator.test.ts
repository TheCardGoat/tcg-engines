import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { daisyDuckParanormalInvestigator } from "./154-daisy-duck-paranormal-investigator";

const allyCharacter = createMockCharacter({
  id: "daisy-support-ally",
  name: "Support Ally",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const opponentInkwellCard = createMockCharacter({
  id: "daisy-paranormal-investigator-opponent-ink-card",
  name: "Opponent Ink Card",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const exertOpponentInkAction = createMockAction({
  id: "daisy-paranormal-investigator-ink-action",
  name: "Eerie Ink",
  cost: 1,
  text: "Put chosen card from an opponent's hand into their inkwell facedown.",
  abilities: [
    {
      id: "daisy-paranormal-investigator-ink-action-1",
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "hand",
        target: "OPPONENT",
      },
    },
  ],
});

describe.skip("Daisy Duck - Paranormal Investigator", () => {
  it("does not exert opponent cards entering inkwells while Daisy is ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: daisyDuckParanormalInvestigator, isDrying: false }],
        deck: 1,
      },
      {
        hand: [opponentInkwellCard],
        deck: 1,
      },
    );
    const opponentInkwellCardId = testEngine.findCardInstanceId(
      opponentInkwellCard,
      "hand",
      PLAYER_TWO,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().ink(opponentInkwellCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckParanormalInvestigator),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(opponentInkwellCardId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(opponentInkwellCardId)).toEqual(
      expect.objectContaining({
        exerted: false,
        zone: "inkwell",
      }),
    );
  });

  it("exerts opponent cards entering inkwells while Daisy is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          {
            card: daisyDuckParanormalInvestigator,
            exerted: true,
            isDrying: false,
          },
        ],
        deck: 1,
      },
      {
        hand: [opponentInkwellCard],
        deck: 1,
      },
    );
    const opponentInkwellCardId = testEngine.findCardInstanceId(
      opponentInkwellCard,
      "hand",
      PLAYER_TWO,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().ink(opponentInkwellCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(bagEffect).toBeDefined();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckParanormalInvestigator),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(opponentInkwellCardId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(opponentInkwellCardId)).toEqual(
      expect.objectContaining({
        exerted: true,
        zone: "inkwell",
      }),
    );
  });

  it("exerts opponent cards put into inkwells by an effect while Daisy is exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          {
            card: daisyDuckParanormalInvestigator,
            exerted: true,
            isDrying: false,
          },
        ],
        hand: [exertOpponentInkAction],
        inkwell: exertOpponentInkAction.cost,
        deck: 1,
      },
      {
        hand: [opponentInkwellCard],
        deck: 1,
      },
    );
    const opponentInkwellCardId = testEngine.findCardInstanceId(
      opponentInkwellCard,
      "hand",
      PLAYER_TWO,
    );

    expect(testEngine.asPlayerOne().playCard(exertOpponentInkAction)).toBeSuccessfulCommand();

    // The put-into-inkwell effect requires selecting which opponent card to put in inkwell
    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opponentInkwellCardId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentInkwellCardId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(opponentInkwellCardId)).toEqual(
      expect.objectContaining({
        exerted: true,
        zone: "inkwell",
      }),
    );
  });
});

describe("Daisy Duck - Paranormal Investigator — Support", () => {
  it("gives exactly +4 strength (Daisy's base strength) to chosen ally when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: daisyDuckParanormalInvestigator, isDrying: false }, allyCharacter],
        deck: 1,
      },
      { deck: 1 },
    );

    expect(testEngine.asPlayerOne().quest(daisyDuckParanormalInvestigator)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    expect(
      testEngine.asPlayerOne().resolvePendingByCard(daisyDuckParanormalInvestigator, {
        resolveOptional: true,
        targets: [allyCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
      allyCharacter.strength + daisyDuckParanormalInvestigator.strength,
    );
  });
});
