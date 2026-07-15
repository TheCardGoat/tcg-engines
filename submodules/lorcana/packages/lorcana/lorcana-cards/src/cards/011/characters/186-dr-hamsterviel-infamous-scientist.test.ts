import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { drHamstervielInfamousScientist } from "./186-dr-hamsterviel-infamous-scientist";

const opponentCharacter = createMockCharacter({
  id: "hamsterviel-opponent-char",
  name: "Opponent Character",
  strength: 2,
  willpower: 4,
  cost: 3,
});

const playerOneCharacter = createMockCharacter({
  id: "hamsterviel-p1-char",
  name: "Player One Character",
  strength: 1,
  willpower: 3,
  cost: 2,
});

function makeAlienCharacters(count: number) {
  return Array.from({ length: count }, (_, i) =>
    createMockCharacter({
      id: `hamsterviel-alien-${i}`,
      name: `Alien Character ${i}`,
      cost: 2,
      strength: 1,
      willpower: 2,
      classifications: ["Storyborn", "Alien"],
    }),
  );
}

function makeNonAlienCharacters(count: number) {
  return Array.from({ length: count }, (_, i) =>
    createMockCharacter({
      id: `hamsterviel-nonalien-${i}`,
      name: `Non-Alien Character ${i}`,
      cost: 2,
      strength: 1,
      willpower: 2,
      classifications: ["Storyborn", "Hero"],
    }),
  );
}

describe("Dr. Hamsterviel - Infamous Scientist", () => {
  it("can be placed in play", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [drHamstervielInfamousScientist],
    });

    expect(testEngine.asPlayerOne().getCardZone(drHamstervielInfamousScientist)).toBe("play");
  });

  it("has CONTROLLED VARIABLES and AWESTRUCK ability text defined", () => {
    const texts = drHamstervielInfamousScientist.text;
    expect(texts).toHaveLength(2);
    const text0 = texts?.[0];
    const text1 = texts?.[1];
    expect(typeof text0 === "object" && text0 !== null && "title" in text0 ? text0.title : "").toBe(
      "CONTROLLED VARIABLES",
    );
    expect(typeof text1 === "object" && text1 !== null && "title" in text1 ? text1.title : "").toBe(
      "AWESTRUCK",
    );
  });

  it("has Alien classification for CONTROLLED VARIABLES synergy", () => {
    expect(drHamstervielInfamousScientist.classifications).toContain("Alien");
  });

  describe("CONTROLLED VARIABLES - For each Alien character card in your discard, you pay 1 {I} less to play this character", () => {
    it("should reduce cost by 1 for each Alien character in discard", () => {
      const alienCards = makeAlienCharacters(3);
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drHamstervielInfamousScientist],
        discard: alienCards,
        inkwell: drHamstervielInfamousScientist.cost - 3, // cost 8 - 3 aliens = 5
        deck: 5,
      });

      expect(
        testEngine.asPlayerOne().playCard(drHamstervielInfamousScientist),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(drHamstervielInfamousScientist)).toBe("play");
    });

    it("should have full cost with no Alien characters in discard", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drHamstervielInfamousScientist],
        inkwell: drHamstervielInfamousScientist.cost - 1,
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(drHamstervielInfamousScientist);
      expect(result.success).toBe(false);
    });

    it("should not reduce cost for non-Alien characters in discard", () => {
      const nonAlienCards = makeNonAlienCharacters(3);
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [drHamstervielInfamousScientist],
        discard: nonAlienCards,
        inkwell: drHamstervielInfamousScientist.cost - 1,
        deck: 5,
      });

      const result = testEngine.asPlayerOne().playCard(drHamstervielInfamousScientist);
      expect(result.success).toBe(false);
    });
  });

  it("AWESTRUCK - chosen opposing character can't challenge during their next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [drHamstervielInfamousScientist],
        play: [{ card: playerOneCharacter, exerted: true }],
        inkwell: drHamstervielInfamousScientist.cost,
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, exerted: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(drHamstervielInfamousScientist),
    ).toBeSuccessfulCommand();

    // AWESTRUCK should queue a bag effect to choose target
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(drHamstervielInfamousScientist, {
        targets: [opponentCharacter],
      }),
    ).toBeSuccessfulCommand();

    // Pass turn to opponent
    testEngine.asServer().passTurn();

    // Opponent character should not be able to challenge during their turn
    expect(testEngine.asPlayerTwo().canChallenge(opponentCharacter, playerOneCharacter)).toBe(
      false,
    );
  });
});
