import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { grandDukeAdvisorToTheKing } from "./009-grand-duke-advisor-to-the-king";
import { princePhillipDragonslayer } from "../../001/characters/016-prince-phillip-dragonslayer";
import { arielOnHumanLegs } from "../../001/characters/001-ariel-on-human-legs";
import { hadesKingOfOlympus } from "../../001/characters/005-hades-king-of-olympus";
import { elsaQueenRegent } from "../../001/characters/040-elsa-queen-regent";
import { aladdinStreetRat } from "../../001/characters/105-aladdin-street-rat";
import { jasmineQueenOfAgrabah } from "../../001/characters/149-jasmine-queen-of-agrabah";

describe("Grand Duke - Advisor to the King", () => {
  it("YES, YOUR MAJESTY - Grants +1 Strength to Prince, Princess, King, Queen", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: grandDukeAdvisorToTheKing },
        { card: princePhillipDragonslayer },
        { card: arielOnHumanLegs },
        { card: hadesKingOfOlympus },
        { card: elsaQueenRegent },
        { card: aladdinStreetRat },
      ],
    });

    const princeId = testEngine.findCardInstanceId(princePhillipDragonslayer, "play");
    const princessId = testEngine.findCardInstanceId(arielOnHumanLegs, "play");
    const kingId = testEngine.findCardInstanceId(hadesKingOfOlympus, "play");
    const queenId = testEngine.findCardInstanceId(elsaQueenRegent, "play");
    const heroId = testEngine.findCardInstanceId(aladdinStreetRat, "play");

    // Prince: 3 base + 1 = 4
    expect(testEngine.asServer().getCard(princeId).strength).toBe(
      princePhillipDragonslayer.strength + 1,
    );

    // Princess: 3 base + 1 = 4
    expect(testEngine.asServer().getCard(princessId).strength).toBe(arielOnHumanLegs.strength + 1);

    // King: 6 base + 1 = 7
    expect(testEngine.asServer().getCard(kingId).strength).toBe(hadesKingOfOlympus.strength + 1);

    // Queen: 4 base + 1 = 5
    expect(testEngine.asServer().getCard(queenId).strength).toBe(elsaQueenRegent.strength + 1);

    // Hero: 2 base + 0 = 2
    expect(testEngine.asServer().getCard(heroId).strength).toBe(aladdinStreetRat.strength);
  });

  it("applies the royal bonus only once to characters with multiple matching classifications", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: grandDukeAdvisorToTheKing }, { card: jasmineQueenOfAgrabah }],
    });

    const jasmineId = testEngine.findCardInstanceId(jasmineQueenOfAgrabah, "play");

    expect(testEngine.asServer().getCard(jasmineId).strength).toBe(
      jasmineQueenOfAgrabah.strength + 1,
    );
  });
});
