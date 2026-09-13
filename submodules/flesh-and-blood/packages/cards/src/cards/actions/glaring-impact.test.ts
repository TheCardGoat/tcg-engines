import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { seepingShadowsYellow } from "./seeping-shadows.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { glaringImpactRed } from "./glaring-impact.ts";

/**
 * Glaring Impact, Red (DTD063) — Light Warrior Action - Attack, cost 1, 4{p}, 3{d}.
 *
 * Printed: "As an additional cost to play this, you may charge your hero's
 * soul.\nIf a yellow card is charged this way, this gets overpower."
 *
 * CRU151-class defect: the module declares `keywords: [overpower]` but the
 * printed text has NO unconditional overpower — overpower is granted only by
 * DTD063-a2 when a YELLOW card was charged this way. The unconditional module
 * keyword makes the printed conditional clause unverifiable in both
 * directions (engine gap row in plan §5).
 *
 * Provable fragments proven here: the charge playline (a1 additional cost,
 * driving the a2 yellow-charge condition through the public charge play
 * option) and the printed stats. The overpower clause is pinned as a
 * misbehavior: with NO charge this turn the link still carries overpower and
 * still rejects a two-card defense.
 */

describe("Glaring Impact (DTD063) AAA", () => {
  it("playline: charging a yellow card to the soul arms the printed overpower condition", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [glaringImpactRed, seepingShadowsYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // a1 optional additional cost: charge Seeping Shadows (yellow) to the soul.
    Boltyn.attackWith(glaringImpactRed, {
      charge: true,
      chargeCard: seepingShadowsYellow,
    });
    expect(Boltyn.zone("soul")).toContain(seepingShadowsYellow.canonicalId);
    // The a2 condition is satisfied on this playline, so the link carries
    // overpower.
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();

    // Unblocked 4{p} hit.
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: with no yellow charge the link does not overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [glaringImpactRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Nothing was charged this turn: per the printed text the a2 overpower
    // grant must NOT fire.
    Boltyn.attackWith(glaringImpactRed);
    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("overpower");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(20);
    expect(Boltyn.zone("graveyard")).toContain(glaringImpactRed.canonicalId);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [glaringImpactRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    // Dash's turn: 4{p} Snatch into a 3{d} block leaves 1 damage.
    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Boltyn.defendWith([glaringImpactRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Boltyn).toHaveLife(19);
    expect(Boltyn.zone("graveyard")).toContain(glaringImpactRed.canonicalId);
  });
});
