import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { alanadaleRockinRooster } from "./020-alan-a-dale-rockin-rooster";

const simpleSong = createMockSong({
  id: "alan-test-song",
  name: "Test Song",
  cost: 2,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

const simpleAction = createMockAction({
  id: "alan-test-action",
  name: "Test Action",
  cost: 1,
  text: "Gain 1 lore.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "gain-lore",
      },
    },
  ],
});

describe("Alan-a-Dale - Rockin' Rooster", () => {
  it("FAN FAVORITE - gains 1 lore when you play a song", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [alanadaleRockinRooster],
      hand: [simpleSong],
      inkwell: simpleSong.cost,
      deck: 2,
    });

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().playCard(simpleSong)).toBeSuccessfulCommand();

    // The song's own effect (gain 1 lore) + the triggered ability (gain 1 lore) = 2 total
    // The gain-lore triggered ability is mandatory and targetless, so it auto-resolves
    // But we may need to resolve the bag if not auto-resolved
    const bagCount = testEngine.asPlayerOne().getBagCount();
    if (bagCount > 0) {
      // Resolve any pending triggered effects
      for (let i = 0; i < bagCount; i++) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(alanadaleRockinRooster);
        }
      }
    }

    // Song gives 1 lore + FAN FAVORITE gives 1 lore = 2 total
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 2);
  });

  it("FAN FAVORITE - does NOT trigger when you play a non-song action", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [alanadaleRockinRooster],
      hand: [simpleAction],
      inkwell: simpleAction.cost,
      deck: 2,
    });

    const loreBefore = testEngine.getLore(PLAYER_ONE);
    expect(testEngine.asPlayerOne().playCard(simpleAction)).toBeSuccessfulCommand();

    // Resolve any pending effects from the action itself
    const bagCount = testEngine.asPlayerOne().getBagCount();
    if (bagCount > 0) {
      for (let i = 0; i < bagCount; i++) {
        const effects = testEngine.asPlayerOne().getBagEffects();
        if (effects.length > 0) {
          testEngine.asPlayerOne().resolvePendingByCard(alanadaleRockinRooster);
        }
      }
    }

    // Only the action's own gain 1 lore, NO triggered ability
    expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
  });
});
