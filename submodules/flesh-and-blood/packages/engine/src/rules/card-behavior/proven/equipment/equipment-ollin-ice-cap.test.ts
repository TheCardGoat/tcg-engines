/**
 * AJV004 Ollin Ice Cap — Ice Guardian Head d1 bladeBreak.
 *
 * Printed (i18n):
 *   When this defends together with an Ice card, create a Frostbite token
 *   under the attacking hero's control.
 *   Blade Break
 *
 * Model:
 *   static triggered on defend togetherWith { supertypes: [Ice] }
 *   → create-token frostbite controller: opponent
 *   (1v1: opponent of the defending controller is the attacking hero)
 *
 * Reasoning:
 * 1. "Defends together with" requires a multi-defender cohort filter. The
 *    trigger matcher previously fail-closed all togetherWith/alone patterns;
 *    fixed to inspect activeLink.defendingInstanceIds + filter partners.
 * 2. Ice talent is a class/talent supertype on both the equipment and partner
 *    (weave-ice-blue). Partner must be a different defending card.
 * 3. Frostbite lands under the attacking hero (opponent of defender in 1v1).
 * 4. Alone defend / defend with non-Ice hand card → no Frostbite.
 * 5. Blade Break destroys the head after the block (d1).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { ollinIceCap } from "../../../../../../cards/src/cards/equipment/ollin-ice-cap.ts";
import { weaveIceBlue } from "../../../../../../cards/src/cards/actions/weave-ice.ts";

const SNATCH = 4;
const LIFE = 20;

describe("ollin-ice-cap (AJV004)", () => {
  it("core mechanic: defend together with Ice hand card → Frostbite on attacker + bladeBreak", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [ollinIceCap],
        hand: [weaveIceBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    // Defend with equipment + Ice action from hand together.
    Defender.defendWith([ollinIceCap, weaveIceBlue]);
    game.helpers.resolveRestOfCombat();

    // Frostbite under attacking hero (Bravo).
    expect(Attacker.zone("arena").some((id) => id.toLowerCase().includes("frostbite"))).toBe(true);
    // Blade Break: head gone to GY.
    expect(Defender.zone("head")).not.toContain(ollinIceCap.canonicalId);
    expect(Defender.zone("graveyard")).toContain(ollinIceCap.canonicalId);
    // Blocked for d1 equipment + weave defense 3 (if weave has d).
    expect(Defender.life()).toBeGreaterThan(LIFE - SNATCH);
  });

  it("boundaries: defend alone (no Ice partner) → no Frostbite, still bladeBreaks", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [ollinIceCap],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith(ollinIceCap);
    game.helpers.resolveRestOfCombat();

    expect(Attacker.zone("arena").some((id) => id.toLowerCase().includes("frostbite"))).toBe(false);
    expect(Defender.zone("graveyard")).toContain(ollinIceCap.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 1));
  });

  it("boundaries: defend together with non-Ice hand card → no Frostbite", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        head: [ollinIceCap],
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    Defender.defendWith([ollinIceCap, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expect(Attacker.zone("arena").some((id) => id.toLowerCase().includes("frostbite"))).toBe(false);
  });
});
