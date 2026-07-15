import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { belleBeastCertainAsTheSunIconic } from "./245-belle-beast-certain-as-the-sun-iconic";

const beastShiftBase = createMockCharacter({
  id: "belle-beast-iconic-shift-base",
  name: "Beast",
  cost: 2,
});

const iconicInkwellCard = createMockCharacter({
  id: "belle-beast-iconic-inkwell-card",
  name: "Iconic Inkwell Card",
  cost: 1,
});

const iconicOtherCharacter = createMockCharacter({
  id: "belle-beast-iconic-other-character",
  name: "Iconic Other Character",
  cost: 2,
});

describe("Belle & Beast - Certain as the Sun Iconic", () => {
  it("can shift onto a character named Beast", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [belleBeastCertainAsTheSunIconic],
      play: [beastShiftBase],
      inkwell: 6,
    });
    const shiftTarget = testEngine.findCardInstanceId(beastShiftBase, "play", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().playCard(belleBeastCertainAsTheSunIconic, {
        cost: { cost: "shift", shiftTarget },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(belleBeastCertainAsTheSunIconic)).toBe("play");
  });

  it("readies all cards in your inkwell when questing", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleBeastCertainAsTheSunIconic],
      inkwell: [{ card: iconicInkwellCard, exerted: true }],
    });
    const inkwellCardId = testEngine.findCardInstanceId(iconicInkwellCard, "inkwell", PLAYER_ONE);

    expect(testEngine.asPlayerOne().quest(belleBeastCertainAsTheSunIconic)).toBeSuccessfulCommand();
    if (testEngine.asPlayerOne().getBagCount() > 0) {
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(belleBeastCertainAsTheSunIconic),
      ).toBeSuccessfulCommand();
    }

    const state = testEngine.getAuthoritativeState();
    expect(state.ctx.zones.private.cardMeta[inkwellCardId]?.state).toBe("ready");
  });

  it("readies your other characters and prevents them from questing when activated", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [belleBeastCertainAsTheSunIconic, { card: iconicOtherCharacter, exerted: true }],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(belleBeastCertainAsTheSunIconic),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(iconicOtherCharacter)).toBe(false);
    expect(testEngine.hasRestriction(iconicOtherCharacter, "cant-quest")).toBe(true);
  });
});
