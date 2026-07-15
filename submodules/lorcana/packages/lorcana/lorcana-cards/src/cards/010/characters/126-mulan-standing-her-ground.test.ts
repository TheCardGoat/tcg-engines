import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mulanStandingHerGround } from "./126-mulan-standing-her-ground";
import { scroogeMcduckGhostlyEbenezer } from "../../011/characters/104-scrooge-mcduck-ghostly-ebenezer";

const opponentCharacter = createMockCharacter({
  id: "mulan-test-opponent",
  name: "Opponent Fighter",
  cost: 6,
  strength: 4,
  willpower: 6,
});

describe("Mulan - Standing Her Ground", () => {
  it("FLOWING BLADE - takes no damage from challenges when a card was put under a character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mulanStandingHerGround, scroogeMcduckGhostlyEbenezer],
        deck: 5,
        inkwell: 10,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 2,
      },
    );

    // Activate Scrooge's Boost to put a card under him
    expect(
      testEngine.asPlayerOne().activateAbility(scroogeMcduckGhostlyEbenezer, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    // Mulan challenges the exerted opponent character
    expect(
      testEngine.asPlayerOne().challenge(mulanStandingHerGround, opponentCharacter),
    ).toBeSuccessfulCommand();

    // Mulan should take no damage (FLOWING BLADE active: during your turn + card put under)
    expect(testEngine.asPlayerOne().getDamage(mulanStandingHerGround)).toBe(0);
    // Mulan should still be in play (not banished)
    const mulanCard = testEngine.asPlayerOne().getCard(mulanStandingHerGround);
    expect(mulanCard.zone).toBe("play");
  });

  it("should take damage from challenges when no card was put under this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mulanStandingHerGround],
        deck: 2,
      },
      {
        play: [{ card: opponentCharacter, exerted: true }],
        deck: 2,
      },
    );

    // Challenge without having put a card under any character
    expect(
      testEngine.asPlayerOne().challenge(mulanStandingHerGround, opponentCharacter),
    ).toBeSuccessfulCommand();

    // Mulan should take damage (4 strength from opponent, Mulan has 2 willpower -> banished)
    const mulanCard = testEngine.asPlayerOne().getCard(mulanStandingHerGround);
    expect(mulanCard.zone).toBe("discard");
  });

  it("should not prevent damage outside your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [mulanStandingHerGround, scroogeMcduckGhostlyEbenezer],
        deck: 5,
        inkwell: 10,
      },
      {
        play: [opponentCharacter],
        deck: 2,
      },
    );

    // Activate Scrooge's Boost to put a card under him
    expect(
      testEngine.asPlayerOne().activateAbility(scroogeMcduckGhostlyEbenezer, { ability: "Boost" }),
    ).toBeSuccessfulCommand();

    // Exert Mulan (quest) so she can be challenged
    expect(testEngine.asPlayerOne().quest(mulanStandingHerGround)).toBeSuccessfulCommand();

    // Pass turn to player two
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    // Player two challenges Mulan (opponent's turn, not Mulan's owner's turn)
    expect(
      testEngine.asPlayerTwo().challenge(opponentCharacter, mulanStandingHerGround),
    ).toBeSuccessfulCommand();

    // Mulan should take damage and be banished (4 strength vs 2 willpower)
    const mulanCard = testEngine.asPlayerOne().getCard(mulanStandingHerGround);
    expect(mulanCard.zone).toBe("discard");
  });
});
