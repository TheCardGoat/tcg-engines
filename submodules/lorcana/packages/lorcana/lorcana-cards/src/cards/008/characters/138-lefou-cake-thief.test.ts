import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { lefouCakeThief } from "./138-lefou-cake-thief";

const mockItem = createMockItem({
  id: "lefou-item",
  name: "Mock Item",
  cost: 1,
});

describe("LeFou - Cake Thief", () => {
  it("ALL FOR ME - chosen opponent loses 1 lore and you gain 1 lore after exerting and banishing an item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [lefouCakeThief, mockItem],
        lore: 5,
        deck: 1,
      },
      {
        lore: 5,
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(lefouCakeThief, {
      costs: {
        banishItems: [mockItem],
      },
    });

    expect(result).toBeSuccessfulCommand();

    // LeFou should be exerted
    expect(testEngine.asPlayerOne().isExerted(lefouCakeThief)).toBe(true);
    // Item should be banished
    expect(testEngine.asPlayerOne().getCardZone(mockItem)).toBe("discard");
    // Player one gains 1 lore (5 -> 6)
    expect(testEngine.getLore(PLAYER_ONE)).toBe(6);
    // Player two loses 1 lore (5 -> 4)
    expect(testEngine.getLore(PLAYER_TWO)).toBe(4);
  });

  it("ALL FOR ME - fails if no item is provided to banish", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [lefouCakeThief],
        lore: 5,
        deck: 1,
      },
      {
        lore: 5,
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(lefouCakeThief, {
      costs: {
        banishItems: [],
      },
    });

    expect(result).not.toBeSuccessfulCommand();
  });

  it("ALL FOR ME - fails if no items are in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [lefouCakeThief],
        lore: 5,
        deck: 1,
      },
      {
        lore: 5,
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(lefouCakeThief, {
        costs: {
          banishItems: [mockItem],
        },
      }),
    ).not.toBeSuccessfulCommand();
  });
});
