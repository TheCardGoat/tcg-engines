import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { powhatansStaff } from "./036-powhatans-staff";
import { justInTime } from "../../001";

const staffFollower = createMockCharacter({
  id: "powhatans-staff-follower",
  name: "Staff Follower",
  cost: 1,
});

describe("Powhatan's Staff", () => {
  it("makes the next character you play this turn exerted with Bodyguard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [staffFollower],
      inkwell: 2,
      play: [powhatansStaff],
    });

    expect(testEngine.asPlayerOne().activateAbility(powhatansStaff)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().playCard(staffFollower)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().isExerted(staffFollower)).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(staffFollower, "Bodyguard")).toBe(true);
  });

  it("affects the next character you play through an action this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [justInTime, staffFollower],
      inkwell: justInTime.cost + 1,
      play: [powhatansStaff],
    });
    const followerId = testEngine.findCardInstanceId(staffFollower, "hand", "p1");

    expect(testEngine.asPlayerOne().activateAbility(powhatansStaff)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().playCard(justInTime, {
        resolveOptional: true,
        targets: [followerId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(justInTime)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(staffFollower)).toEqual("play");
    expect(testEngine.asPlayerOne().isExerted(staffFollower)).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(staffFollower, "Bodyguard")).toBe(true);
  });
});
