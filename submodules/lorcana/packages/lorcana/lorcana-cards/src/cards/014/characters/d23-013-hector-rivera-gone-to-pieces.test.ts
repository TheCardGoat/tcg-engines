import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockAction,
  createMockCharacter,
  createMockSong,
} from "@tcg/lorcana-engine/testing";
import { hctorRiveraGoneToPieces } from "./121-hector-rivera-gone-to-pieces";
import { hctorRiveraGoneToPiecesD23 } from "./d23-013-hector-rivera-gone-to-pieces";

const plainAttacker = createMockCharacter({
  id: "hector-d23-plain-attacker",
  name: "Plain Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
});

const evasiveAttacker = createMockCharacter({
  id: "hector-d23-evasive-attacker",
  name: "Evasive Attacker",
  cost: 2,
  strength: 3,
  willpower: 3,
  abilities: [
    {
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
  ],
});

const songCard = createMockSong({
  id: "hector-d23-song",
  name: "Some Song",
  cost: 2,
  text: "A song.",
});

const actionCard = createMockAction({
  id: "hector-d23-non-song",
  name: "Some Action",
  cost: 2,
  text: "An action.",
});

function loreOf(
  testEngine: ReturnType<typeof LorcanaMultiplayerTestEngine.createWithFixture>,
): number {
  const id = testEngine.findCardInstanceId(hctorRiveraGoneToPiecesD23, "play");
  return testEngine.asServer().getCard(id).lore ?? 0;
}

describe("Héctor Rivera - Gone to Pieces (D23 promo)", () => {
  it("copies the base card's abilities verbatim (G-07)", () => {
    expect(hctorRiveraGoneToPiecesD23.abilities).toEqual(hctorRiveraGoneToPieces.abilities);
    expect(hctorRiveraGoneToPiecesD23.cost).toBe(hctorRiveraGoneToPieces.cost);
    expect(hctorRiveraGoneToPiecesD23.strength).toBe(hctorRiveraGoneToPieces.strength);
    expect(hctorRiveraGoneToPiecesD23.willpower).toBe(hctorRiveraGoneToPieces.willpower);
    expect(hctorRiveraGoneToPiecesD23.lore).toBe(hctorRiveraGoneToPieces.lore);
  });

  it("shares the base card's Singer 6 keyword value", () => {
    const singerAbility = (hctorRiveraGoneToPiecesD23.abilities ?? []).find(
      (ability) => ability.type === "keyword" && ability.keyword === "Singer",
    );
    expect(singerAbility).toBeDefined();
    expect(singerAbility && "value" in singerAbility ? singerAbility.value : undefined).toBe(6);
  });

  it("can be played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [hctorRiveraGoneToPiecesD23],
      inkwell: hctorRiveraGoneToPiecesD23.cost,
      deck: 1,
    });

    expect(testEngine.asPlayerOne().playCard(hctorRiveraGoneToPiecesD23)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(hctorRiveraGoneToPiecesD23)).toBe("play");
  });

  it("Feel the Music: gets +1 {L} and gains Evasive while you have a song card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hctorRiveraGoneToPiecesD23],
      discard: [songCard],
      deck: 1,
    });

    expect(loreOf(testEngine)).toBe((hctorRiveraGoneToPiecesD23.lore ?? 0) + 1);
    expect(testEngine.hasKeyword(hctorRiveraGoneToPiecesD23, "Evasive")).toBe(true);
  });

  it("Feel the Music: has neither bonus without a song card in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [hctorRiveraGoneToPiecesD23],
      discard: [actionCard],
      deck: 1,
    });

    expect(loreOf(testEngine)).toBe(hctorRiveraGoneToPiecesD23.lore);
    expect(testEngine.hasKeyword(hctorRiveraGoneToPiecesD23, "Evasive")).toBe(false);
  });

  it("Feel the Music: cannot be challenged by a character without Evasive while the bonus is active", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: hctorRiveraGoneToPiecesD23, exerted: true }],
        discard: [songCard],
        deck: 1,
      },
      {
        play: [{ card: plainAttacker, isDrying: false }],
        deck: 1,
      },
    );

    testEngine.asPlayerOne().passTurn();
    expect(
      testEngine.asPlayerTwo().challenge(plainAttacker, hctorRiveraGoneToPiecesD23),
    ).not.toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(hctorRiveraGoneToPiecesD23)).toBe("play");
  });

  it("Feel the Music: can be challenged by an Evasive character while the bonus is active", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: hctorRiveraGoneToPiecesD23, exerted: true }],
        discard: [songCard],
        deck: 1,
      },
      {
        play: [{ card: evasiveAttacker, isDrying: false }],
        deck: 1,
      },
    );

    testEngine.asPlayerOne().passTurn();
    expect(
      testEngine.asPlayerTwo().challenge(evasiveAttacker, hctorRiveraGoneToPiecesD23),
    ).toBeSuccessfulCommand();
  });
});
