import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleBeastCertainAsTheSun } from "./132-belle-beast-certain-as-the-sun";

const belleShiftBase = createMockCharacter({
  id: "belle-beast-sun-shift-base",
  name: "Belle",
  cost: 2,
});

const beastShiftBase = createMockCharacter({
  id: "belle-beast-sun-beast-shift-base",
  name: "Beast",
  cost: 2,
});

const inkwellCard = createMockCharacter({
  id: "belle-beast-sun-inkwell-card",
  name: "Inkwell Card",
  cost: 1,
});

const otherCharacter = createMockCharacter({
  id: "belle-beast-sun-other-character",
  name: "Other Character",
  cost: 2,
});

describe("Belle & Beast - Certain as the Sun", () => {
  it("can shift onto a character named Belle", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleBeastCertainAsTheSun],
      play: [belleShiftBase],
      inkwell: 6,
    });
    const shiftTarget = testEngine.findCardInstanceId(belleShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(belleBeastCertainAsTheSun, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(belleBeastCertainAsTheSun)).toBe("play");
  });

  it("can shift onto a character named Beast", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleBeastCertainAsTheSun],
      play: [beastShiftBase],
      inkwell: 6,
    });
    const shiftTarget = testEngine.findCardInstanceId(beastShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(belleBeastCertainAsTheSun, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(belleBeastCertainAsTheSun)).toBe("play");
  });

  it("readies all cards in your inkwell when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleBeastCertainAsTheSun],
      inkwell: [{ card: inkwellCard, exerted: true }],
    });
    const inkwellCardId = testEngine.findCardInstanceId(inkwellCard, "inkwell", PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(belleBeastCertainAsTheSun)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleBeastCertainAsTheSun),
      ).toBeSuccessfulCommand();
    }

    const state = testEngine.getAuthoritativeState();
    expect(state.ctx.zones.private.cardMeta[inkwellCardId]?.state).toBe("ready");
  });

  it("readies your other characters and prevents them from questing when activated", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleBeastCertainAsTheSun, { card: otherCharacter, exerted: true }],
      inkwell: 6,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(belleBeastCertainAsTheSun),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(otherCharacter)).toBe(false);
    expect(testEngine.asPlayerOne().isExerted(belleBeastCertainAsTheSun)).toBe(false);
    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.hasRestriction(otherCharacter, "cant-quest")).toBe(true);
  });
});
