import { describe, expect, it } from "bun:test";
import { iagoPrettyPolly } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { aPiratesLife } from "~/game-engine/engines/lorcana/src/cards/definitions/009/actions/ruby/132-a-pirate-s-life";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";
import { dumboNinthWonderOfTheUniverse } from "./045-dumbo-ninth-wonder-of-the-universe";
import { dumboTheFlyingElephant } from "./046-dumbo-the-flying-elephant";

describe("Dumbo - Ninth Wonder of the Universe", () => {
  it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
    const testEngine = new TestEngine({
      play: [dumboNinthWonderOfTheUniverse],
    });

    const cardUnderTest = testEngine.getCardModel(
      dumboNinthWonderOfTheUniverse,
    );
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("BREAKING RECORDS {E}, 1 {I} – Draw a card and gain 1 lore.", async () => {
    const testEngine = new TestEngine({
      inkwell: 1,
      play: [dumboNinthWonderOfTheUniverse],
      deck: 3,
    });

    const cardUnderTest = testEngine.getCardModel(
      dumboNinthWonderOfTheUniverse,
    );

    await testEngine.activateCard(cardUnderTest);
    expect(testEngine.getPlayerLore()).toEqual(1);
    expect(testEngine.getCardsByZone("hand").length).toEqual(1);
  });

  it("MAKING HISTORY Your other characters with Evasive gain '{E}, 1 {I} – Draw a card and gain 1 lore.'", async () => {
    const testEngine = new TestEngine({
      inkwell: 1,
      play: [dumboNinthWonderOfTheUniverse, iagoPrettyPolly],
      deck: 3,
    });

    const cardUnderTest = testEngine.getCardModel(iagoPrettyPolly);

    await testEngine.activateCard(cardUnderTest);

    expect(cardUnderTest.ready).toEqual(false);
    expect(testEngine.getPlayerLore()).toEqual(1);
    expect(testEngine.getCardsByZone("hand").length).toEqual(1);
  });

  describe("Regressions", () => {
    it("Only give the ability to other characters", async () => {
      const testEngine = new TestEngine({
        play: [dumboNinthWonderOfTheUniverse],
      });

      const dumbo = testEngine.getCardModel(dumboNinthWonderOfTheUniverse);

      expect(dumbo.activatedAbilities).toHaveLength(2);
    });

    it("A Pirate's Life interaction", async () => {
      const testEngine = new TestEngine(
        {
          inkwell: 1,
          play: [dumboNinthWonderOfTheUniverse, dumboTheFlyingElephant],
          hand: [aPiratesLife],
          deck: 3,
        },
        {
          lore: 5,
        },
      );

      await testEngine.singSongTogether({
        singers: [dumboNinthWonderOfTheUniverse, dumboTheFlyingElephant],
        song: aPiratesLife,
      });

      expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
      expect(testEngine.getLoreForPlayer("player_two")).toBe(3);
    });
  });
});
