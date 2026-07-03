import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicGoldenFlower } from "../../001/items/169-magic-golden-flower";
import { mirabelMadrigalFamilyGuardian } from "./025-mirabel-madrigal-family-guardian";

const protectedAlly = createMockCharacter({
  id: "mirabel-family-guardian-protected-ally",
  name: "Protected Ally",
  cost: 2,
  willpower: 5,
});

describe("Mirabel Madrigal - Family Guardian", () => {
  it("readies a healed character and stops them from questing or challenging this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        mirabelMadrigalFamilyGuardian,
        { card: protectedAlly, damage: 2, exerted: true },
        magicGoldenFlower,
      ],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(magicGoldenFlower, {
        targets: [protectedAlly],
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mirabelMadrigalFamilyGuardian, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(protectedAlly)).toBe(false);
    expect(
      testEngine.asPlayerOne().hasTemporaryRestriction(protectedAlly, "cant-quest-or-challenge"),
    ).toBe(true);
  });
});
