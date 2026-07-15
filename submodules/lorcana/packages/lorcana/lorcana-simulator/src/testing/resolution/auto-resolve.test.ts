import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { stealFromTheRich } from "@tcg/lorcana-cards/cards/001";
import { mauiHalfshark } from "@tcg/lorcana-cards/cards/006";

const quester = createMockCharacter({
  id: "auto-resolve-quester",
  name: "Auto Resolve Quester",
  cost: 2,
  lore: 1,
});

const optionalQuestWatcher = createMockCharacter({
  id: "optional-quest-watcher",
  name: "Optional Quest Watcher",
  cost: 2,
  lore: 1,
  abilities: [
    {
      id: "optional-quest-watcher-1",
      name: "Optional Quest Watcher",
      text: "Whenever one of your characters quests, you may gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "gain-lore",
        },
        type: "optional",
      },
    },
  ],
});

describe("Auto Resolve", () => {
  it("optional triggers always require user confirmation", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [quester, optionalQuestWatcher],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(quester)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId, {
          resolveOptional: true,
        }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(quester.lore + 1);
  });

  it("single mandatory no-target trigger auto-resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
  });

  it("multiple mandatory no-target triggers require ordering, last auto-resolves", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [stealFromTheRich],
      inkwell: stealFromTheRich.cost,
      play: [mauiHalfshark, mauiHalfshark],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(stealFromTheRich)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(2);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(testEngine.asPlayerOne().getBagEffects()[0]!.sourceId),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(2);
  });
});
