/**
 * MPG012 Tremor of Resistance — Guardian Off-Hand d0 (bladeBreak).
 *
 * Printed:
 *   If you control a Seismic Surge token, this gets +2{d}.
 *
 * Reasoning (hand-authored):
 * 1. Static continuous: while the controller's arena has a Seismic Surge token,
 *    this off-hand's defense is +2 (d0 → d2).
 * 2. Off-hand is seated via the `weapon2` slot (defendWith resolves Off-Hand
 *    from weapon2 — see equipment-ab0-lifecycle).
 * 3. Happy: with a Seismic Surge token seeded, defending blocks 2 of snatch's 4
 *    power → 2 damage; bladeBreak destroys it at chain close.
 * 4. Boundary: without the token, the static does not apply → d0 → full 4
 *    damage; still blade-breaks.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";

import { tremorOfResistance } from "../../../../../../cards/src/cards/equipment/tremor-of-resistance.ts";
import { seismicSurge } from "../../../../../../cards/src/cards/tokens/seismic-surge.ts";

const SNATCH_POWER = 4;
const STARTING_LIFE = 40;

describe("tremor-of-resistance (MPG012)", () => {
  it("core mechanic: +2{d} while controlling a Seismic Surge token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [tremorOfResistance],
        arena: [seismicSurge],
        life: STARTING_LIFE,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    expect(Bravo.zone("weapon2")).toContain(tremorOfResistance.canonicalId);

    Dash.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Bravo.defendWith(tremorOfResistance);
    game.helpers.resolveRestOfCombat();

    // Static +2{d} applied: snatch 4 − (d0 + 2) = 2 damage.
    expect(Bravo.life()).toBe(STARTING_LIFE - (SNATCH_POWER - 2));
    // bladeBreak at chain close: off-hand destroyed.
    expect(Bravo.zone("weapon2")).not.toContain(tremorOfResistance.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(tremorOfResistance.canonicalId);
  });

  it("boundaries: without a Seismic Surge token the static does not apply (d0)", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [tremorOfResistance],
        life: STARTING_LIFE,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Bravo.defendWith(tremorOfResistance);
    game.helpers.resolveRestOfCombat();

    // No Seismic Surge → no +2{d} → d0 → full snatch damage.
    expect(Bravo.life()).toBe(STARTING_LIFE - SNATCH_POWER);
    expect(Bravo.zone("graveyard")).toContain(tremorOfResistance.canonicalId);
  });
});
