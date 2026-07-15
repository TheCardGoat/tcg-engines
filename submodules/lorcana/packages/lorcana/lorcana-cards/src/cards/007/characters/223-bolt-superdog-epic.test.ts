import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { boltSuperdogEpic } from "./223-bolt-superdog-epic";

const undamagedAlly = createMockCharacter({
  id: "bolt-superdog-epic-undamaged-ally",
  name: "Undamaged Ally",
  cost: 2,
});

const damagedAlly = createMockCharacter({
  id: "bolt-superdog-epic-damaged-ally",
  name: "Damaged Ally",
  cost: 2,
});

const illusionTarget = createMockCharacter({
  id: "bolt-superdog-epic-illusion-target",
  name: "Illusion Target",
  cost: 3,
  classifications: ["Dreamborn", "Ally", "Illusion"],
});

const nonIllusionTarget = createMockCharacter({
  id: "bolt-superdog-epic-non-illusion-target",
  name: "Non Illusion Target",
  cost: 3,
});

describe("Bolt - Superdog Epic", () => {
  it("MARK OF POWER - gains lore when this character becomes ready", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        { card: boltSuperdogEpic, isDrying: false },
        undamagedAlly,
        { card: damagedAlly, damage: 1 },
      ],
    });

    const boltId = testEngine.findCardInstanceId(boltSuperdogEpic, "play");

    expect(testEngine.asServer().manualExertCard(boltId)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualReadyCard(boltId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getLore("player_one")).toBe(1);
  });

  it("BOLT STARE - can only target an Illusion character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [boltSuperdogEpic],
        deck: 1,
      },
      {
        play: [illusionTarget, nonIllusionTarget],
        deck: 1,
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(boltSuperdogEpic, {
        targets: [illusionTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(illusionTarget)).toBe("discard");

    const secondAttempt = testEngine.asPlayerOne().activateAbility(boltSuperdogEpic, {
      targets: [nonIllusionTarget],
    });

    expect(secondAttempt.success).toBe(false);
    expect(testEngine.asPlayerTwo().getCardZone(nonIllusionTarget)).toBe("play");
  });
});
