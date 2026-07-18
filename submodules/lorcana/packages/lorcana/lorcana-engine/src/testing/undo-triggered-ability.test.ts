import { describe, expect, it } from "bun:test";
import { createMockCharacter } from "./card-mocks";
import { LorcanaMultiplayerTestEngine } from "./lorcana-multiplayer-test-engine";

const triggeredCharacter = createMockCharacter({
  id: "undo-triggered-character",
  name: "Undo Triggered Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  abilities: [
    {
      id: "undo-triggered-character-on-play",
      name: "ON PLAY",
      text: "ON PLAY When you play this character, draw a card.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
});

describe("undo across triggered abilities", () => {
  it("restores a played card and clears its unresolved trigger in one undo", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [triggeredCharacter],
      inkwell: triggeredCharacter.cost,
      deck: 2,
    });
    const player = testEngine.asPlayerOne();

    expect(player.playCard(triggeredCharacter)).toBeSuccessfulCommand();
    expect(player.getCardZone(triggeredCharacter)).toBe("play");
    expect(player.getBagCount()).toBe(1);
    expect(player.canUndo()).toBe(true);

    expect(player.undo()).toBeSuccessfulCommand();
    expect(player.getCardZone(triggeredCharacter)).toBe("hand");
    expect(player.getBagCount()).toBe(0);
  });
});
