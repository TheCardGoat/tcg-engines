import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mauiHeroToAll, mickeyMouseBraveLittleTailor, peterPanNeverLanding } from "../characters";
import { coconutBasket } from "./166-coconut-basket";

describe("Coconut Basket", () => {
  it("removes up to 2 damage from a chosen character whenever you play a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peterPanNeverLanding, mickeyMouseBraveLittleTailor],
      inkwell: peterPanNeverLanding.cost + mickeyMouseBraveLittleTailor.cost,
      play: [coconutBasket, { card: mauiHeroToAll, damage: 4 }],
    });

    expect(testEngine.asPlayerOne().playCard(peterPanNeverLanding)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(coconutBasket, {
        targets: [mauiHeroToAll],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(peterPanNeverLanding)).toBe("play");
    expect(testEngine.asPlayerOne().getDamage(mauiHeroToAll)).toBe(2);

    expect(testEngine.asPlayerOne().playCard(mickeyMouseBraveLittleTailor)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(coconutBasket, {
        targets: [mauiHeroToAll],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(mickeyMouseBraveLittleTailor)).toBe("play");
    expect(testEngine.asPlayerOne().getDamage(mauiHeroToAll)).toBe(0);
  });

  it("does not trigger when an opponent plays a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [peterPanNeverLanding],
        inkwell: peterPanNeverLanding.cost,
      },
      {
        play: [coconutBasket, mauiHeroToAll],
      },
    );

    expect(testEngine.asPlayerOne().playCard(peterPanNeverLanding)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(mauiHeroToAll)).toBe(0);
  });

  it("regression: allows removing only 1 damage when character has exactly 1 damage (up to 2)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peterPanNeverLanding],
      inkwell: peterPanNeverLanding.cost,
      play: [coconutBasket, { card: mauiHeroToAll, damage: 1 }],
    });

    expect(testEngine.asPlayerOne().playCard(peterPanNeverLanding)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(coconutBasket, {
        targets: [mauiHeroToAll],
      }),
    ).toBeSuccessfulCommand();
    // Should remove only 1 damage (up to 2, but only 1 present)
    expect(testEngine.asPlayerOne().getDamage(mauiHeroToAll)).toBe(0);
  });

  it("regression: allows targeting an undamaged character (up to 2 includes 0)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [peterPanNeverLanding],
      inkwell: peterPanNeverLanding.cost,
      play: [coconutBasket, mauiHeroToAll],
    });

    expect(testEngine.asPlayerOne().playCard(peterPanNeverLanding)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Targeting an undamaged character should be valid with "up to 2"
    const result = testEngine.asPlayerOne().resolvePendingByCard(coconutBasket, {
      resolveOptional: true,
      targets: [mauiHeroToAll],
    });
    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getDamage(mauiHeroToAll)).toBe(0);
  });
});
