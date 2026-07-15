import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockItem,
} from "@tcg/lorcana-engine/testing";
import { beastFrustratedDesigner } from "./136-beast-frustrated-designer";

const targetCharacter = createMockCharacter({
  id: "beast-target",
  name: "Target Character",
  cost: 3,
  willpower: 10,
});

const itemOne = createMockItem({
  id: "beast-item-1",
  name: "Item One",
  cost: 1,
});

const itemTwo = createMockItem({
  id: "beast-item-2",
  name: "Item Two",
  cost: 1,
});

describe("Beast - Frustrated Designer", () => {
  it("I'VE HAD IT! - deals 5 damage to chosen character after paying all costs", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [beastFrustratedDesigner, itemOne, itemTwo],
        inkwell: 2,
        deck: 1,
      },
      {
        play: [targetCharacter],
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(beastFrustratedDesigner, {
      targets: [targetCharacter],
      costs: {
        banishItems: [itemOne, itemTwo],
      },
    });
    expect(result).toBeSuccessfulCommand();

    // Beast should be exerted
    expect(testEngine.asPlayerOne().isExerted(beastFrustratedDesigner)).toBe(true);
    // Both items should be banished
    expect(testEngine.asPlayerOne().getCardZone(itemOne)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(itemTwo)).toBe("discard");
    // Target should have taken 5 damage
    expect(testEngine.asPlayerTwo().getDamage(targetCharacter)).toBe(5);
  });

  it("fails if only 1 item is provided as banish cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [beastFrustratedDesigner, itemOne],
        inkwell: 2,
        deck: 1,
      },
      {
        play: [targetCharacter],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(beastFrustratedDesigner, {
        targets: [targetCharacter],
        costs: {
          banishItems: [itemOne],
        },
      }),
    ).not.toBeSuccessfulCommand();
  });

  it("fails if not enough ink to pay the 2 ink cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [beastFrustratedDesigner, itemOne, itemTwo],
        inkwell: 1,
        deck: 1,
      },
      {
        play: [targetCharacter],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(beastFrustratedDesigner, {
        targets: [targetCharacter],
        costs: {
          banishItems: [itemOne, itemTwo],
        },
      }),
    ).not.toBeSuccessfulCommand();
  });

  it("banishes target character when damage equals or exceeds willpower", () => {
    const weakTarget = createMockCharacter({
      id: "beast-weak-target",
      name: "Weak Target",
      cost: 2,
      willpower: 5,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [beastFrustratedDesigner, itemOne, itemTwo],
        inkwell: 2,
        deck: 1,
      },
      {
        play: [weakTarget],
        deck: 1,
      },
    );

    const result = testEngine.asPlayerOne().activateAbility(beastFrustratedDesigner, {
      targets: [weakTarget],
      costs: {
        banishItems: [itemOne, itemTwo],
      },
    });
    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(weakTarget)).toBe("discard");
  });

  it("fails if there are not enough items in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [beastFrustratedDesigner, itemOne],
        inkwell: 2,
        deck: 1,
      },
      {
        play: [targetCharacter],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(beastFrustratedDesigner, {
        targets: [targetCharacter],
        costs: {
          banishItems: [itemOne],
        },
      }),
    ).not.toBeSuccessfulCommand();
  });
});
