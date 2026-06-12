import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import {
  mickeyMouseArtfulRogue,
  mickeyMouseDetective,
  mickeyMouseTrueFriend,
  simbaProtectiveCub,
} from "../../001";
import { beyondTheHorizon } from "./202-beyond-the-horizon";

describe("Beyond the Horizon", () => {
  it("regression: draws 3 cards when you choose yourself with an empty hand after singing together", () => {
    const singerA = createMockCharacter({
      id: "beyond-the-horizon-singer-a",
      name: "Beyond the Horizon Singer A",
      cost: 4,
      strength: 1,
      willpower: 1,
    });
    const singerB = createMockCharacter({
      id: "beyond-the-horizon-singer-b",
      name: "Beyond the Horizon Singer B",
      cost: 3,
      strength: 1,
      willpower: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [beyondTheHorizon],
      play: [singerA, singerB],
      deck: [mickeyMouseArtfulRogue, mickeyMouseDetective, simbaProtectiveCub],
    });
    const singerAId = testEngine.findCardInstanceId(singerA, "play");
    const singerBId = testEngine.findCardInstanceId(singerB, "play");

    expect(
      testEngine.asPlayerOne().playCard(beyondTheHorizon, {
        choiceIndex: 1,
        cost: { cost: "singTogether", singers: [singerAId, singerBId] },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, discard: 1 });
    expect(testEngine.asPlayerOne().getCardZone(beyondTheHorizon)).toBe("discard");
  });

  it("makes both players discard their hands and draw 3 cards in the first mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beyondTheHorizon, simbaProtectiveCub, mickeyMouseTrueFriend],
        inkwell: beyondTheHorizon.cost,
        deck: [mickeyMouseArtfulRogue, mickeyMouseDetective, simbaProtectiveCub],
      },
      {
        hand: [mickeyMouseArtfulRogue, mickeyMouseDetective],
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend, mickeyMouseArtfulRogue],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithChoice(beyondTheHorizon, 0),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, discard: 3 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 3, discard: 2 });
  });

  it("makes you discard your hand and draw 3 cards in the second mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beyondTheHorizon, simbaProtectiveCub, mickeyMouseTrueFriend],
        inkwell: beyondTheHorizon.cost,
        deck: [mickeyMouseArtfulRogue, mickeyMouseDetective, simbaProtectiveCub],
      },
      {
        hand: [mickeyMouseArtfulRogue, mickeyMouseDetective],
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend, mickeyMouseArtfulRogue],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithChoice(beyondTheHorizon, 1),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 3, discard: 3 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 2, discard: 0 });
  });

  it("makes your opponent discard their hand and draw 3 cards in the third mode", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [beyondTheHorizon, simbaProtectiveCub, mickeyMouseTrueFriend],
        inkwell: beyondTheHorizon.cost,
        deck: [mickeyMouseArtfulRogue, mickeyMouseDetective, simbaProtectiveCub],
      },
      {
        hand: [mickeyMouseArtfulRogue, mickeyMouseDetective],
        deck: [simbaProtectiveCub, mickeyMouseTrueFriend, mickeyMouseArtfulRogue],
      },
    );

    expect(
      testEngine.asPlayerOne().playCardWithChoice(beyondTheHorizon, 2),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 2, discard: 1 });
    expect(testEngine.asPlayerTwo()).toHaveZoneCounts({ hand: 3, discard: 2 });
  });
});
