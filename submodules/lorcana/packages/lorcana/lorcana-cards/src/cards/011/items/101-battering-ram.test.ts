import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { motunuiIslandParadise } from "../../003/locations";
import { batteringRam } from "./101-battering-ram";

const damagedTarget = createMockCharacter({
  id: "battering-ram-damaged-target",
  name: "Damaged Target",
  cost: 2,
});

describe("Battering Ram", () => {
  it("deals 1 damage to a chosen damaged character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [batteringRam],
      },
      {
        play: [{ card: damagedTarget, damage: 1 }],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(batteringRam, {
        ability: "FULL FORCE",
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({ card: damagedTarget, value: 2 });
  });

  it("banishes itself to banish a chosen location", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [batteringRam],
      },
      {
        play: [motunuiIslandParadise],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(batteringRam, {
        ability: "BREAK THROUGH",
        targets: [motunuiIslandParadise],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(batteringRam)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(motunuiIslandParadise)).toBe("discard");
  });
});
