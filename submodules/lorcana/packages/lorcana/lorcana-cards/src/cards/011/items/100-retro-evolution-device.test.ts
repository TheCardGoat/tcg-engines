import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { retroEvolutionDevice } from "./100-retro-evolution-device";

const inkReserve = createMockCharacter({
  id: "retro-evolution-device-ink-reserve",
  name: "Ink Reserve",
  cost: 1,
});

const sacrificialIntern = createMockCharacter({
  id: "retro-evolution-device-sacrificial-intern",
  name: "Sacrificial Intern",
  cost: 1,
});

const evolvedChampion = createMockCharacter({
  id: "retro-evolution-device-evolved-champion",
  name: "Evolved Champion",
  cost: 3,
});

const oversizedEvolution = createMockCharacter({
  id: "retro-evolution-device-oversized-evolution",
  name: "Oversized Evolution",
  cost: 4,
});

describe("Retro Evolution Device", () => {
  it("banishes your chosen character and plays an eligible character for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [retroEvolutionDevice, sacrificialIntern],
      hand: [evolvedChampion],
      inkwell: [inkReserve],
    });
    const banishId = testEngine.findCardInstanceId(sacrificialIntern, "play", PLAYER_ONE);
    const playId = testEngine.findCardInstanceId(evolvedChampion, "hand", PLAYER_ONE);

    const result = testEngine.asPlayerOne().activateAbility(retroEvolutionDevice, {
      effectSelections: {
        effectBanishCharacterIds: [banishId],
        effectPlayCardFromHandIds: [playId],
      },
    });

    expect(result).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().getCardZone(retroEvolutionDevice)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(retroEvolutionDevice)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(sacrificialIntern)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(evolvedChampion)).toBe("play");
  });

  it("does not play a character whose cost is greater than the banished character cost plus 2", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [retroEvolutionDevice, sacrificialIntern],
      hand: [oversizedEvolution],
      inkwell: [inkReserve],
    });
    const banishId = testEngine.findCardInstanceId(sacrificialIntern, "play", PLAYER_ONE);
    const playId = testEngine.findCardInstanceId(oversizedEvolution, "hand", PLAYER_ONE);

    expect(
      testEngine.asPlayerOne().activateAbility(retroEvolutionDevice, {
        effectSelections: {
          effectBanishCharacterIds: [banishId],
          effectPlayCardFromHandIds: [playId],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(testEngine.asPlayerOne().isExerted(retroEvolutionDevice)).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(sacrificialIntern)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(oversizedEvolution)).toBe("hand");
    expect(testEngine.asServer().getState().ctx.priority.pendingChoice).toBeUndefined();
  });
});
