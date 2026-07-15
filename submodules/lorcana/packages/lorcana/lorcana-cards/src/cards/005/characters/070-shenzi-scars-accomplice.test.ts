import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { shenziScarsAccomplice } from "./070-shenzi-scars-accomplice";

const undamagedDefender = createMockCharacter({
  id: "shenzi-undamaged-defender",
  name: "Undamaged Defender",
  cost: 2,
  strength: 1,
  willpower: 3,
});

const damagedDefender = createMockCharacter({
  id: "shenzi-damaged-defender",
  name: "Damaged Defender",
  cost: 2,
  strength: 1,
  willpower: 5,
});

describe("Shenzi - Scar's Accomplice", () => {
  it("does not get +2 strength when challenging an undamaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: shenziScarsAccomplice, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: undamagedDefender, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(shenziScarsAccomplice, undamagedDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(undamagedDefender)).toBe("play");
  });

  it("gets +2 strength when challenging a damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: shenziScarsAccomplice, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: damagedDefender, exerted: true, isDrying: false, damage: 2 }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(shenziScarsAccomplice, damagedDefender),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(damagedDefender)).toBe("discard");
  });
});
