/** DTD193 Nasreth the Soul Harrower — 6/6 Shadow Demon Ally with attack and hit trigger. */
import { describe, expect, it } from "vitest";
import { nasrethTheSoulHarrower } from "../../../../cards/src/cards/tokens/nasreth-the-soul-harrower.ts";
import { heraldOfProtectionRed } from "../../../../cards/src/cards/actions/herald-of-protection.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../rules/fixtures.ts";

describe("Nasreth the Soul Harrower token (DTD193)", () => {
  it("AAA: activate attack ability commits an attack event with Nasreth as source", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [nasrethTheSoulHarrower], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(nasrethTheSoulHarrower);
    game.passBoth();

    const attacks = game.committedEvents().filter((e) => e.name === "attack");
    expect(attacks.length).toBeGreaterThanOrEqual(1);
    expect(attacks[0]!.source!.canonicalId).toBe(nasrethTheSoulHarrower.canonicalId);
  });

  it("on hit: banishes a non-Light card from the defending hero's soul, no life gain (CR 8.6.24)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [nasrethTheSoulHarrower], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, soul: [snatchRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const lifeBefore = Bravo.life();

    Bravo.activate(nasrethTheSoulHarrower);
    game.passBoth();
    // Dash does not defend → the attack hits.
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("soul")).not.toContain(snatchRed.canonicalId);
    expect(Bravo.life()).toBe(lifeBefore);
  });

  it("on hit: if a Light card is banished this way, gain 1 life (CR 8.6.24)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [nasrethTheSoulHarrower], deck: 8, actionPoints: 1, resourcePoints: 0 },
      { hero: dash, soul: [heraldOfProtectionRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const lifeBefore = Bravo.life();

    Bravo.activate(nasrethTheSoulHarrower);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expect(Bravo.life()).toBe(lifeBefore + 1);
  });
});
