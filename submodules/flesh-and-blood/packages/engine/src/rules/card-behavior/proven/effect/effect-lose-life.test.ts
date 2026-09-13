/**
 * AAA test for effect:lose-life.
 * Representative card: Searing Shot (ARC069) — Ranger Action Arrow Attack, power 4.
 * Triggered ability: "If Searing Shot hits a hero, they lose 1{h}."
 * Tests that the lose-life effect fires correctly through a real combat sequence.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, deathDealer, nimblismBlue, searingShot } from "../../../fixtures.ts";
import { azalea } from "../../../../../../cards/src/cards/heroes/azalea.ts";

describe("effect: lose-life", () => {
  it("Arrange/Act/Assert: Searing Shot hit triggers lose-life 1 on the defending hero", () => {
    // Arrange — a Ranger (Azalea) has Searing Shot (power 4 attack with hit → lose-life 1).
    const game = FabTestEngine.start(
      { hero: azalea, weapon1: [deathDealer], arsenal: [searingShot], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walk priority/pitch timing by hand — opt out of smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    // Act — Attack with Searing Shot; Dash does not defend (undefended hit).
    game.as(azalea).attackWith(searingShot, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    // Assert — Dash lost 5 life: 4 from attack power + 1 from the lose-life trigger.
    expect(game.as(dash).life()).toBe(15);
  });

  it("AAA boundary: a partially blocked attack still hits and triggers lose-life", () => {
    // Arrange — Dash has nimblismBlue (defense 2) to block part of the 4-power attack.
    const game = FabTestEngine.start(
      { hero: azalea, weapon1: [deathDealer], arsenal: [searingShot], deck: 6 },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      // Walk priority/pitch timing by hand — opt out of smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const defender = game.as(dash);

    // Act — Attack with Searing Shot, then Dash blocks with nimblismBlue (defense 2).
    game.as(azalea).attackWith(searingShot, { from: "arsenal" });
    // 4 power - 2 defense = 2 damage → the attack still hits, so lose-life fires.
    defender.blockWith([nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    // Assert — Dash lost 3 life: 2 damage (4 power - 2 block) + 1 lose-life.
    expect(defender.life()).toBe(17);
  });
});
