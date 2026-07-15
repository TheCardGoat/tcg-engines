import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { jamesRoleModel } from "./150-james-role-model";

describe("James - Role Model", () => {
  it("NEVER, EVER LOSE SIGHT - when banished, the controller may put James into their inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: jamesRoleModel }],
      deck: 1,
    });

    const jamesId = testEngine.findCardInstanceId(jamesRoleModel, "play");

    // Deal lethal damage to James (willpower 3) to banish him
    expect(
      testEngine.asServer().manualSetDamage(jamesId, jamesRoleModel.willpower),
    ).toBeSuccessfulCommand();

    // James should now be in discard
    expect(testEngine.asPlayerOne().getCardZone(jamesRoleModel)).toBe("discard");

    // The triggered ability should be in the bag (optional, so requires a choice)
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    // Resolve the optional trigger by accepting it
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jamesRoleModel, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    // James should now be in the inkwell
    expect(testEngine.asPlayerOne().getCardZone(jamesRoleModel)).toBe("inkwell");

    // James should be exerted (facedown and exerted per card text)
    expect(testEngine.asPlayerOne().isExerted(jamesRoleModel)).toBe(true);

    // James should be facedown in the inkwell
    expect(testEngine.isCardFaceDown(jamesRoleModel, "inkwell")).toBe(true);

    // No more pending bag effects
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("NEVER, EVER LOSE SIGHT - the controller may decline to put James into the inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: jamesRoleModel }],
      deck: 1,
    });

    const jamesId = testEngine.findCardInstanceId(jamesRoleModel, "play");

    // Deal lethal damage to banish James
    expect(
      testEngine.asServer().manualSetDamage(jamesId, jamesRoleModel.willpower),
    ).toBeSuccessfulCommand();

    // James should be in discard
    expect(testEngine.asPlayerOne().getCardZone(jamesRoleModel)).toBe("discard");

    // Decline the optional trigger
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(jamesRoleModel, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    // James should remain in discard (not moved to inkwell)
    expect(testEngine.asPlayerOne().getCardZone(jamesRoleModel)).toBe("discard");

    // No more pending bag effects
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });
});
