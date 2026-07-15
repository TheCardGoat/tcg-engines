import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { darkwingDuckDrakeMallard } from "../characters";
import { darkwingsChairSet } from "./168-darkwings-chair-set";

const secretInk = createMockCharacter({
  id: "darkwings-chair-set-secret-ink",
  name: "Secret Ink",
  cost: 1,
});

const injuredAlly = createMockCharacter({
  id: "darkwings-chair-set-injured-ally",
  name: "Injured Ally",
  cost: 2,
});

describe("Darkwing's Chair Set", () => {
  it("may put the top card of your deck into your inkwell facedown and exerted when you play it", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingsChairSet],
      deck: [secretInk],
      inkwell: darkwingsChairSet.cost,
    });

    expect(testEngine.asPlayerOne().playCard(darkwingsChairSet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingsChairSet),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secretInk)).toBe("inkwell");
    expect(testEngine.asPlayerOne().isExerted(secretInk)).toBe(true);
  });

  it("can decline Secret Entrance and leave the top card in the deck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [darkwingsChairSet],
      deck: [secretInk],
      inkwell: darkwingsChairSet.cost,
    });

    expect(testEngine.asPlayerOne().playCard(darkwingsChairSet)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(darkwingsChairSet, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(secretInk)).toBe("deck");
    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("play");
  });

  it("removes up to 2 damage from a non-Darkwing Duck character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, injuredAlly],
      deck: 2,
    });

    testEngine.asServer().manualSetDamage(injuredAlly, 2);

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [injuredAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: injuredAlly, value: 0 });
  });

  it("removes up to 4 damage instead of 2 when the chosen character is named Darkwing Duck", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [darkwingsChairSet, { card: darkwingDuckDrakeMallard, damage: 4 }],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(darkwingsChairSet, {
        ability: "SUDDEN SPIN",
        targets: [darkwingDuckDrakeMallard],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(darkwingsChairSet)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveDamage({ card: darkwingDuckDrakeMallard, value: 0 });
  });
});
