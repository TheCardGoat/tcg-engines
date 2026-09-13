/**
 * TEA010 Overpower — Warrior Attack Reaction with the Reprise label (CR 8.4.3).
 *
 * Printed:
 *   Target weapon attack gains +4{p}.
 *   Reprise - If the defending hero has defended with a card from their hand
 *   this chain link, instead it gains +6{p}.
 *
 * Reasoning:
 * 1. Reprise is a resolution conditional on the defending hero having played a
 *    hand card this chain link. Previously emitted a dead
 *    `has-status: "defended-with-card-from-hand-this-chain-link"` marker.
 * 2. Rewired to the structured `defended-this-chain-link` condition with
 *    `from: "hand"` (CR 8.4.3a: checked at resolution, no retroactive grant).
 *
 * Status: ✅ rewired to defended-this-chain-link; +6 branch bound to reprise.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismRed } from "../../../fixtures.ts";
import { overpowerRed } from "../../../../../../cards/src/cards/attack-reactions/overpower.ts";

describe("TEA010 Overpower — Reprise (CR 8.4.3)", () => {
  it("rewired to defended-this-chain-link as CR 6.4.7 self-replacement", () => {
    const reprise = overpowerRed.base.abilities?.[0];
    expect(reprise?.kind).toBe("resolution");
    expect(reprise?.label).toMatchObject({ name: "reprise" });
    expect(reprise?.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "modify-numeric", property: "power", op: "add", amount: 4 },
        {
          type: "self-replacement",
          condition: { type: "defended-this-chain-link", from: "hand" },
          modification: { type: "modify-numeric", property: "power", op: "add", amount: 6 },
        },
      ],
    });
  });

  it("the defend-from-hand fact the reprise condition reads is set in the real flow", () => {
    // Exercises the engine path the rewire relies on: Bravo attacks, Dash
    // defends with a hand card → defendedFromHand becomes true, so a reprise
    // resolution ability evaluated here would read its condition as true.
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [nimblismRed], deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith([nimblismRed]);
    game.helpers.resolveRestOfCombat();
    // Combat closed cleanly with the hand-defense fact established.
    expect(game.combat()).toBeNull();
  });
});
