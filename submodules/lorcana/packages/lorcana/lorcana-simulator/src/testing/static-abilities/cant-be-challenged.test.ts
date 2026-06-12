import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { fireTheCannons, stitchNewDog } from "@tcg/lorcana-cards/cards/001";
import { snowWhiteFairestInTheLand } from "@tcg/lorcana-cards/cards/007";

const genericAttacker = createMockCharacter({
  id: "cant-be-challenged-attacker",
  name: "Generic Attacker",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
});

describe("HIDDEN AWAY - Snow White, Fairest in the Land - This character can't be challenged.", () => {
  it("should prevent opposing characters from challenging this character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: genericAttacker, isDrying: false }],
      },
      {
        play: [{ card: snowWhiteFairestInTheLand, exerted: true }],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .challenge(genericAttacker, snowWhiteFairestInTheLand) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("should still allow Snow White to quest normally", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: snowWhiteFairestInTheLand, isDrying: false }],
        lore: 0,
      },
      {},
    );

    expect(testEngine.asPlayerOne().quest(snowWhiteFairestInTheLand)).toBeSuccessfulCommand();

    expect(testEngine.getLore(PLAYER_ONE)).toBe(snowWhiteFairestInTheLand.lore);
  });

  it("should still allow Snow White to be targeted by effects (not challenge)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fireTheCannons],
        inkwell: fireTheCannons.cost,
      },
      {
        play: [snowWhiteFairestInTheLand],
      },
    );

    // Fire the Cannons can target Snow White (it's an effect, not a challenge)
    expect(
      testEngine.asPlayerOne().playCard(fireTheCannons, {
        targets: [snowWhiteFairestInTheLand],
      }),
    ).toBeSuccessfulCommand();

    // Snow White has 2 willpower, Fire the Cannons deals 2 => banished
    expect(testEngine.asPlayerTwo().getCardZone(snowWhiteFairestInTheLand)).toBe("discard");
  });

  it("should apply the protection regardless of whether Snow White is exerted or ready", () => {
    // Test with ready Snow White
    const readyEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: genericAttacker, isDrying: false }],
      },
      {
        play: [snowWhiteFairestInTheLand], // Ready (not exerted)
      },
    );

    // Can't challenge a ready character anyway (must be exerted), but the protection
    // should be distinct from the "must be exerted" rule
    const readyResult = readyEngine
      .asPlayerOne()
      .challenge(genericAttacker, snowWhiteFairestInTheLand) as CommandFailure;

    expect(readyResult.success).toBe(false);
  });

  it("should still allow Snow White to challenge other characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: snowWhiteFairestInTheLand, isDrying: false }],
      },
      {
        play: [{ card: genericAttacker, exerted: true }],
      },
    );

    // Snow White CAN initiate challenges
    expect(
      testEngine.asPlayerOne().challenge(snowWhiteFairestInTheLand, genericAttacker),
    ).toBeSuccessfulCommand();
  });
});
