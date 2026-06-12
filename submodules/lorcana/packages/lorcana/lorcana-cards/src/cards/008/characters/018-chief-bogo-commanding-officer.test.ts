import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { chiefBogoCommandingOfficer } from "./018-chief-bogo-commanding-officer";

const bodyguardCharacter = createMockCharacter({
  id: "chief-bogo-bodyguard",
  name: "Bodyguard Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  abilities: [
    {
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
  ],
});

const lowCostCharacter = createMockCharacter({
  id: "chief-bogo-top-deck-character",
  name: "Top Deck Character",
  cost: 4,
  strength: 4,
  willpower: 4,
});

const highCostCharacter = createMockCharacter({
  id: "chief-bogo-high-cost-character",
  name: "High Cost Character",
  cost: 6,
  strength: 4,
  willpower: 4,
});

const topDeckAction = createMockAction({
  id: "chief-bogo-top-deck-action",
  name: "Top Deck Action",
  cost: 2,
});

describe("Chief Bogo - Commanding Officer", () => {
  it("SENDING BACKUP - during an opponent's turn, banishing one of your Bodyguard characters can reveal and free-play a low-cost character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoCommandingOfficer, bodyguardCharacter],
      deck: [lowCostCharacter],
    });

    const bodyguardId = testEngine.findCardInstanceId(bodyguardCharacter, "play");
    const lowCostCharacterId = testEngine.findCardInstanceId(lowCostCharacter, "deck");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(bodyguardId, 10)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chiefBogoCommandingOfficer, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().resolveNextPending({
        destinations: [{ zone: "play", cards: [lowCostCharacterId] }],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(lowCostCharacterId)).toBe("play");
    expect(testEngine.asServer().getCard(lowCostCharacterId).exerted).toBe(false);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({
      deck: 0,
      play: 2,
      discard: 1,
    });
  });

  it("does not trigger on your own turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoCommandingOfficer, bodyguardCharacter],
      deck: [lowCostCharacter],
    });

    const bodyguardId = testEngine.findCardInstanceId(bodyguardCharacter, "play");

    expect(testEngine.asServer().manualSetDamage(bodyguardId, 10)).toBeSuccessfulCommand();

    // Board-state condition is checked at trigger time, ability is not queued when condition is false.
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("keeps a revealed character with cost 6 on top of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoCommandingOfficer, bodyguardCharacter],
      deck: [highCostCharacter],
    });

    const bodyguardId = testEngine.findCardInstanceId(bodyguardCharacter, "play");
    const highCostCharacterId = testEngine.findCardInstanceId(highCostCharacter, "deck");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(bodyguardId, 10)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chiefBogoCommandingOfficer, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(highCostCharacterId)).toBe("deck");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({
      deck: 1,
      play: 1,
      discard: 1,
    });
  });

  it("keeps a revealed non-character on top of the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoCommandingOfficer, bodyguardCharacter],
      deck: [topDeckAction],
    });

    const bodyguardId = testEngine.findCardInstanceId(bodyguardCharacter, "play");
    const topDeckActionId = testEngine.findCardInstanceId(topDeckAction, "deck");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(bodyguardId, 10)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chiefBogoCommandingOfficer, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({ destinations: [] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(topDeckActionId)).toBe("deck");
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({
      deck: 1,
      play: 1,
      discard: 1,
    });
  });

  it("can decline revealing the top card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [chiefBogoCommandingOfficer, bodyguardCharacter],
      deck: [lowCostCharacter],
    });

    const bodyguardId = testEngine.findCardInstanceId(bodyguardCharacter, "play");
    const lowCostCharacterId = testEngine.findCardInstanceId(lowCostCharacter, "deck");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualSetDamage(bodyguardId, 10)).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(chiefBogoCommandingOfficer, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(lowCostCharacterId)).toBe("deck");
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
