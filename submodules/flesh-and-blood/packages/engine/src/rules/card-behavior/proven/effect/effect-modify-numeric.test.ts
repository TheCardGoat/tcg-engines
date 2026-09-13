/**
 * AAA test for effect:modify-numeric.
 * Representative card: Over Flex (ELE219) — Ranger Action, cost 1, go again.
 * Resolution effect: "Your next arrow attack this turn gains +4{p}."
 * Uses the `modify-numeric` effect with `target.selector: "this-attack"` and
 * `appliesTo: { next: { subtypes: ["Arrow"] } }` to create a floating modifier.
 *
 * Test verifies that after playing Over Flex, the next arrow attack deals
 * increased damage from the floating +4 power modifier. Uses a Ranger hero
 * (Azalea) since arrows are Ranger cards (CR 8.2.6a: arsenal + bow).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { azalea, dash, deathDealer, nimblismBlue, searingShot } from "../../../fixtures.ts";
import { overFlexRed as overFlex } from "../../../../../../cards/src/cards/actions/over-flex.ts";

describe("effect: modify-numeric", () => {
  it("Arrange/Act/Assert: Over Flex floating +4 power increases the next arrow attack damage", () => {
    // Arrange — Azalea has Over Flex (buff) and Searing Shot (arrow attack, power 4).
    // resourcePoints: 1 pays Over Flex's cost without pitching Searing Shot.
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        hand: [overFlex, nimblismBlue],
        arsenal: [{ card: searingShot, state: { faceDown: false } }],
        deck: 6,
        resourcePoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Azalea = game.as(azalea);

    // Act 1 — Play Over Flex to create the floating +4 power modifier.
    Azalea.play(overFlex);
    game.helpers.resolveUntilIdle();

    // Act 2 — Play Searing Shot (Arrow Attack, base power 4) targeting Dash.
    Azalea.playFromArsenal(searingShot, { target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();

    // Assert — Dash lost 9 life: 8 damage (4+4 power) + 1 lose-life trigger.
    expect(game.as(dash).life()).toBe(11);
  });

  it("AAA boundary: without Over Flex, the arrow attack deals only base damage", () => {
    // Arrange — Azalea has Searing Shot without any power buff.
    const game = FabTestEngine.start(
      { hero: azalea, weapon1: [deathDealer], arsenal: [searingShot], deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );

    // Act — Play Searing Shot without any prior buff.
    game.as(azalea).play(searingShot, { from: "arsenal", target: game.as(dash).id });
    game.helpers.resolveRestOfCombat();

    // Assert — Dash lost 5 life: 4 base damage + 1 lose-life trigger.
    expect(game.as(dash).life()).toBe(15);
  });
});
