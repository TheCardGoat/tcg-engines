import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { rafikisBakoraStaff } from "./099-rafikis-bakora-staff";

const omenDraw = createMockCharacter({
  id: "rafikis-bakora-staff-omen-draw",
  name: "Omen Draw",
  cost: 1,
});

const omenDiscard = createMockCharacter({
  id: "rafikis-bakora-staff-omen-discard",
  name: "Omen Discard",
  cost: 1,
});

const bonkTarget = createMockCharacter({
  id: "rafikis-bakora-staff-bonk-target",
  name: "Bonk Target",
  cost: 2,
});

describe("Rafiki's Bakora Staff", () => {
  it("draws a card, then lets you choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [omenDraw],
      hand: [omenDiscard],
      inkwell: 1,
      play: [rafikisBakoraStaff],
    });
    const discardId = testEngine.findCardInstanceId(omenDiscard, "hand", "p1");

    expect(
      testEngine.asPlayerOne().activateAbility(rafikisBakoraStaff, {
        ability: "READ THE OMENS",
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [discardId],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(omenDraw)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(omenDiscard)).toBe("discard");
  });

  it("can banish itself to deal 1 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 1,
        play: [rafikisBakoraStaff],
      },
      {
        play: [bonkTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(rafikisBakoraStaff, {
        ability: "BONK! 1",
        targets: [bonkTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(rafikisBakoraStaff)).toBe("discard");
    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: bonkTarget, value: 1 });
  });
});
