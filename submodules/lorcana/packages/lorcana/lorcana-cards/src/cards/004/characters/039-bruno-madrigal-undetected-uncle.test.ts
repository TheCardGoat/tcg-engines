import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../../003/characters";
import { brunoMadrigalUndetectedUncle } from "./039-bruno-madrigal-undetected-uncle";

describe("Bruno Madrigal - Undetected Uncle", () => {
  it("has Evasive keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [brunoMadrigalUndetectedUncle],
    });

    expect(testEngine.asPlayerOne().getCard(brunoMadrigalUndetectedUncle)?.keywords).toContain(
      "Evasive",
    );
  });

  it("puts the revealed card into your hand and gains 3 lore when it matches the named card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [simbaScrappyCub],
      play: [brunoMadrigalUndetectedUncle],
    });

    const result = testEngine.asPlayerOne().activateAbility(brunoMadrigalUndetectedUncle, {
      ability: "YOU JUST HAVE TO SEE IT",
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getPendingEffects()).toHaveLength(1);
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(brunoMadrigalUndetectedUncle, {
        namedCard: "Simba",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(brunoMadrigalUndetectedUncle)).toBe(true);
    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 1, deck: 0 });
    expect(testEngine.asPlayerOne().getCardZone(simbaScrappyCub)).toBe("hand");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(3);
  });

  it("keeps the revealed card on top of your deck and does not gain lore when it does not match", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [simbaScrappyCub],
      play: [brunoMadrigalUndetectedUncle],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(brunoMadrigalUndetectedUncle, {
        ability: "YOU JUST HAVE TO SEE IT",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingEffect(brunoMadrigalUndetectedUncle, {
        namedCard: "Jafar",
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne()).toHaveZoneCounts({ hand: 0, deck: 1 });
    expect(testEngine.asPlayerOne().getCardZone(simbaScrappyCub)).toBe("deck");
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
