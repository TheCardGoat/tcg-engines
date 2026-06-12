import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { theSorcerersHat } from "./065-the-sorcerers-hat";

describe("The Sorcerer's Hat", () => {
  it("puts the revealed top card into your hand when it matches the named card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [simbaScrappyCub],
      inkwell: 1,
      play: [theSorcerersHat],
    });

    const result = testEngine.asPlayerOne().activateAbility(theSorcerersHat, {
      ability: "INCREDIBLE ENERGY",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(theSorcerersHat, {
        namedCard: "Simba",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(theSorcerersHat)).toBe(true);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
    expect(testEngine.asPlayerOne().getCardZone(simbaScrappyCub)).toBe("hand");
  });

  it("keeps the revealed card on top of your deck when it does not match the named card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [simbaScrappyCub],
      inkwell: 1,
      play: [theSorcerersHat],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(theSorcerersHat, {
        ability: "INCREDIBLE ENERGY",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(theSorcerersHat, {
        namedCard: "Jafar",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1 });
    expect(testEngine.asPlayerOne().getCardZone(simbaScrappyCub)).toBe("deck");
  });
});
