/**
 * ROS167 Eternal Inferno — Wizard Action with the Surge label (CR 8.4.8).
 *
 * Printed:
 *   Deal 4 arcane damage to any target.
 *   Surge - If this deals more than 4 damage, banish it. You may play it this
 *   turn.
 *
 * Reasoning:
 * 1. Surge is a per-SOURCE damage gate. Previously emitted a dead
 *    `has-status: "this-deals-more-than-4-damage"` marker the engine never
 *    computed, so the surge branch never fired.
 * 2. Rewired to the new `source-damage-dealt` condition (gt 4, per turn).
 * 3. At exactly the base 4 arcane damage, Surge (>4) is FALSE → the card is
 *    NOT banished by surge and resolves to the graveyard normally.
 *
 * Status: ✅ rewired to source-damage-dealt; boundary (4 ≯ 4) does not fire.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash } from "../../../fixtures.ts";
import { blazeFiremind } from "../../../../../../cards/src/cards/heroes/blaze-firemind.ts";
import { eternalInfernoRed } from "../../../../../../cards/src/cards/actions/eternal-inferno.ts";

describe("ROS167 Eternal Inferno — Surge (CR 8.4.8)", () => {
  it("rewired to source-damage-dealt with the surge label", () => {
    const surge = eternalInfernoRed.base.abilities?.[1];
    expect(surge?.label).toMatchObject({ name: "surge" });
    expect(surge?.condition).toMatchObject({
      type: "source-damage-dealt",
      per: "turn",
      comparison: { op: "gt", value: 4 },
    });
  });

  it("Surge does not fire at base 4 damage: card is played and not surge-banished", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [eternalInfernoRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
    );
    const Blaze = game.as(blazeFiremind);
    Blaze.play(eternalInfernoRed, { target: game.as(dash).id });
    game.passBoth();
    // The card left hand (the action was played)…
    expect(Blaze.zone("hand")).not.toContain(eternalInfernoRed.canonicalId);
    // …and at base 4 damage the Surge gate (gt 4) is false, so the card is NOT
    // banished by surge. (A Surge fire would move it to the banished zone.)
    expect(Blaze.zone("banished")).not.toContain(eternalInfernoRed.canonicalId);
  });
});
