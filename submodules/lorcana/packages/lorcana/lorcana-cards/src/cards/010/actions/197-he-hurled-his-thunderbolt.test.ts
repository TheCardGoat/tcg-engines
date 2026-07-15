import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../../002";
import { simbaProtectiveCub } from "../../001";
import { herculesMightyLeader } from "../characters/118-hercules-mighty-leader";
import { heHurledHisThunderbolt } from "./197-he-hurled-his-thunderbolt";

// A character with Ward: cannot be targeted by opponent's effects.
const wardCharacter = createMockCharacter({
  id: "hhht-ward-character",
  name: "Ward Guard",
  cost: 3,
  strength: 2,
  willpower: 6,
  lore: 1,
  abilities: [
    {
      type: "keyword" as const,
      keyword: "Ward" as const,
      id: "hhht-ward-character-1",
    },
  ],
});

// A vanilla own character to use as a damage target (no Ward, no damage restrictions).
const ownVanillaCharacter = createMockCharacter({
  id: "hhht-own-vanilla",
  name: "Friendly Hero",
  cost: 3,
  strength: 2,
  willpower: 5,
  lore: 1,
});

describe("He Hurled His Thunderbolt", () => {
  it("when all opponent characters have Ward, the player must target their own character (correct behavior — no cancellation allowed)", () => {
    // RULES ASSESSMENT (BUG-18):
    // He Hurled His Thunderbolt targets "chosen character" with owner:"any".
    // Ward only prevents opponents' effects from targeting a character — it does NOT
    // prevent the controller from targeting their own characters.
    // When the opponent has only Ward characters, the player's own characters remain
    // valid targets. Per Lorcana rules, an action card cannot be cancelled after the
    // player has chosen to play it when valid targets still exist.
    // This behaviour is CORRECT: the player must target one of their own characters.
    // Note: Hercules Mighty Leader has EVER VIGILANT (can't be damaged unless being
    // challenged), so we use a vanilla own character as the target here.
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heHurledHisThunderbolt],
        inkwell: heHurledHisThunderbolt.cost,
        play: [{ card: ownVanillaCharacter, isDrying: false }],
      },
      {
        // All opponent characters have Ward
        play: [wardCharacter],
      },
    );

    const ownCharacterId = testEngine.findCardInstanceId(ownVanillaCharacter, "play", "player_one");

    // The player must target their own character — Ward protects the opponent's character
    const result = testEngine.asPlayerOne().playCard(heHurledHisThunderbolt, {
      targets: [ownCharacterId],
    });

    expect(result).toBeSuccessfulCommand();

    // 4 damage was dealt to own character (willpower 5 so not banished); Ward character untouched.
    expect(testEngine.asPlayerOne().getDamage(ownVanillaCharacter)).toBe(4);
    expect(testEngine.asPlayerTwo().getDamage(wardCharacter)).toBe(0);
  });

  it("does not allow targeting opponent Ward characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heHurledHisThunderbolt],
        inkwell: heHurledHisThunderbolt.cost,
        play: [{ card: ownVanillaCharacter, isDrying: false }],
      },
      {
        play: [wardCharacter],
      },
    );

    const wardCharacterId = testEngine.findCardInstanceId(wardCharacter, "play", "player_two");

    // Targeting a Ward character owned by the opponent should fail
    const result = testEngine.asPlayerOne().playCard(heHurledHisThunderbolt, {
      targets: [wardCharacterId],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerTwo().getDamage(wardCharacter)).toBe(0);
  });

  it("deals 4 damage and gives your Deity characters Challenger +2 this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [heHurledHisThunderbolt],
        inkwell: heHurledHisThunderbolt.cost,
        play: [herculesMightyLeader],
      },
      {
        play: [{ card: goofyKnightForADay, exerted: true }, simbaProtectiveCub],
      },
    );

    const playResult = testEngine.asPlayerOne().playCard(heHurledHisThunderbolt, {
      targets: [simbaProtectiveCub],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardZone(simbaProtectiveCub)).toBe("discard");
    expect(testEngine.asPlayerOne()).toHaveKeyword({
      card: herculesMightyLeader,
      keyword: "Challenger",
      value: 2,
    });
  });
});
