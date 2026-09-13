/**
 * OMN211 Gloves of Astral Sanctuary (Arms d0) + OMN212 Boots of Astral
 * Sanctuary (Legs d0) — siblings of proven OMN209 Helm of Astral Sanctuary.
 *
 * Printed: "Instant - {t} your hero, destroy this: Prevent the next 1 damage
 * that would be dealt to you this turn."
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, dawnblade } from "../../../fixtures.ts";
import { glovesOfAstralSanctuary } from "../../../../../../cards/src/cards/equipment/gloves-of-astral-sanctuary.ts";
import { bootsOfAstralSanctuary } from "../../../../../../cards/src/cards/equipment/boots-of-astral-sanctuary.ts";

const LIFE = 20;
const DAWN = 3;

describe("gloves-of-astral-sanctuary (OMN211)", () => {
  it("core mechanic: tap-hero + destroy → prevent next 1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        arms: [glovesOfAstralSanctuary],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    // Defender activates prevent Instant on their priority window.
    game.passBoth();
    Defender.activate(glovesOfAstralSanctuary);
    game.passBoth();

    expect(Defender.zone("arms")).not.toContain(glovesOfAstralSanctuary.canonicalId);
    expect(Defender.zone("graveyard")).toContain(glovesOfAstralSanctuary.canonicalId);

    // Attacker hits for 3, but 1 is prevented → 2 damage.
    Attacker.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - (DAWN - 1));
  });
});

describe("boots-of-astral-sanctuary (OMN212)", () => {
  it("core mechanic: tap-hero + destroy → prevent next 1 damage", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [dawnblade],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        legs: [bootsOfAstralSanctuary],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    game.passBoth();
    Defender.activate(bootsOfAstralSanctuary);
    game.passBoth();

    expect(Defender.zone("legs")).not.toContain(bootsOfAstralSanctuary.canonicalId);
    expect(Defender.zone("graveyard")).toContain(bootsOfAstralSanctuary.canonicalId);

    Attacker.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    expect(Defender.life()).toBe(LIFE - (DAWN - 1));
  });
});
