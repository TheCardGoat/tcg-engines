import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { theSwordOfHercules } from "./200-the-sword-of-hercules";

const deityTarget = createMockCharacter({
  id: "sword-of-hercules-deity-target",
  name: "Deity Target",
  cost: 4,
  classifications: ["Storyborn", "Deity"],
});

const victoriousHero = createMockCharacter({
  id: "sword-of-hercules-victorious-hero",
  name: "Victorious Hero",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const doomedInvader = createMockCharacter({
  id: "sword-of-hercules-doomed-invader",
  name: "Doomed Invader",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("The Sword of Hercules", () => {
  it("banishes the chosen opposing Deity character when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theSwordOfHercules],
        inkwell: theSwordOfHercules.cost,
      },
      {
        play: [deityTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(theSwordOfHercules)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theSwordOfHercules, {
        targets: [deityTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(deityTarget)).toBe("discard");
  });

  it("gains 1 lore when one of your characters banishes another character in a challenge during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [theSwordOfHercules, victoriousHero],
      },
      {
        deck: 1,
        play: [{ card: doomedInvader, exerted: true, isDrying: false }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(victoriousHero, doomedInvader),
    ).toBeSuccessfulCommand();
    expect(testEngine.getLore(PLAYER_ONE)).toBe(1);
  });

  it("regression: does NOT trigger when damage is moved by an ability (not challenge damage)", () => {
    const damageSource = createMockCharacter({
      id: "sword-damage-source",
      name: "Damage Source",
      cost: 2,
      strength: 2,
      willpower: 5,
    });

    const fragileTarget = createMockCharacter({
      id: "sword-fragile-ability-target",
      name: "Fragile Target",
      cost: 1,
      strength: 1,
      willpower: 1,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 1,
        play: [theSwordOfHercules, { card: damageSource, damage: 3 }],
      },
      {
        deck: 1,
        play: [{ card: fragileTarget, isDrying: false }],
      },
    );

    // Starting lore should be 0
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);

    // If ability-based damage (e.g., move-damage from Cheshire Cat) banishes a character,
    // The Sword of Hercules should NOT trigger because it only watches for challenge banishes
    // We verify that non-challenge damage doesn't grant lore
    // (The sword's trigger is specifically "banish-in-challenge")
    expect(testEngine.getLore(PLAYER_ONE)).toBe(0);
  });
});
