import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { crikeePartOfTheTeam } from "./131-cri-kee-part-of-the-team";

const exertedAllyOne = createMockCharacter({
  id: "crikee-test-ally-1",
  name: "Exerted Ally One",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const exertedAllyTwo = createMockCharacter({
  id: "crikee-test-ally-2",
  name: "Exerted Ally Two",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const readyAlly = createMockCharacter({
  id: "crikee-test-ally-3",
  name: "Ready Ally",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Cri-Kee - Part of the Team", () => {
  it("gains +2 lore while you have two other exerted characters in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        crikeePartOfTheTeam,
        { card: exertedAllyOne, exerted: true, isDrying: false },
        { card: exertedAllyTwo, exerted: true, isDrying: false },
        { card: readyAlly, exerted: false, isDrying: false },
      ],
      deck: 5,
    });

    const exertedAllyTwoId = testEngine.findCardInstanceId(exertedAllyTwo, "play", "player_one");
    const readyAllyId = testEngine.findCardInstanceId(readyAlly, "play", "player_one");

    expect(testEngine.asPlayerOne().getCardLore(crikeePartOfTheTeam)).toBe(3);

    expect(testEngine.asServer().manualReadyCard(exertedAllyTwoId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(crikeePartOfTheTeam)).toBe(1);

    expect(testEngine.asServer().manualExertCard(readyAllyId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardLore(crikeePartOfTheTeam)).toBe(3);
  });
});
