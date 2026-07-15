import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { healingDecanter } from "./030-healing-decanter";
import { sapphireChromicon } from "./168-sapphire-chromicon";

describe("Sapphire Chromicon", () => {
  it("enters play exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      hand: [sapphireChromicon],
      inkwell: sapphireChromicon.cost,
    });

    expect(testEngine.asPlayerOne().playCard(sapphireChromicon)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(sapphireChromicon)).toBe("play");
    expect(testEngine.asPlayerOne().isExerted(sapphireChromicon)).toBe(true);
  });

  it("banishes one of your items to gain 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [],
      inkwell: 2,
      play: [sapphireChromicon, healingDecanter],
    });

    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
    expect(
      testEngine.asPlayerOne().activateAbility(sapphireChromicon, {
        costs: {
          banishItems: [healingDecanter],
        },
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(sapphireChromicon)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(healingDecanter)).toBe("discard");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(2);
  });
});
