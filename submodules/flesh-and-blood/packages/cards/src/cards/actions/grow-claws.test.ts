import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "./snatch.ts";
import { roninRenegadeRed } from "./ronin-renegade.ts";
import { growClawsRed } from "./grow-claws.ts";

/**
 * Grow Claws, Red (CIN013) — Ninja Attack Action.
 *
 * Printed: "If a Draconic attack was the last attack this combat chain,
 * this gets +1{p}. Go again"
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric on the
 *     chain link), CR 7.4 (the last attack of the combat chain — the
 *     previous chain link), CR 8.3.5 (Go again action-point refund),
 *     CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +1{p} applies only when the PREVIOUS chain link's attack is a
 *       Draconic attack; as the first link of the chain (or after a
 *       non-Draconic attack) the card stays at its printed 4{p}.
 *     - Go again refunds the action point when the link resolves.
 *   ENGINE GAP RESOLVED (FIX-5, plan §5 — module fixed): the condition
 *     was reshaped from `names: ["Draconic Attack"]` (a type-line
 *     pseudo-name no card carries; the engine compares condition names
 *     against the previous attack's printed card NAME by exact normalized
 *     match, so the condition never matched) to the MST164 typeBox filter
 *     `supertypes: ["Draconic"] + subtypes: ["Attack"]`.
 *   Fragment verdicts (all RESOLVED):
 *     - printed 4{p} first link; Go again AP refund;
 *     - non-Draconic last-attack boundary (4{p});
 *     - +1{p} after a Draconic last attack (5{p}) — proven below.
 */

describe("Grow Claws (CIN013) AAA", () => {
  it("playline: as the first link of the chain it reads printed 4{p} and Go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [growClawsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(growClawsRed);
    game.advanceCombatTo("defend");
    // No prior attack on the chain: the conditional +1 cannot apply.
    expectCombat(game).toHaveAttackPower(4);

    game.helpers.resolveRestOfCombat();
    // Printed Go again refunds the spent action point (CR 8.3.5).
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: a non-Draconic last attack grants nothing — 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [snatchRed, growClawsRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    // Snatch is a Generic attack action: a valid, non-Draconic last attack.
    Fai.must.playAttack(snatchRed);
    game.advanceCombatTo("resolution");

    Fai.must.playAttack(growClawsRed);
    game.advanceCombatTo("defend");
    // The last attack on the chain was not Draconic: printed 4{p}.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: after a Draconic last attack the +1{p} lands — 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [roninRenegadeRed, growClawsRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    // Ronin Renegade is a Draconic Ninja attack action (the printed
    // qualifier for the conditional).
    Fai.must.playAttack(roninRenegadeRed);
    game.advanceCombatTo("resolution");

    Fai.must.playAttack(growClawsRed);
    game.advanceCombatTo("defend");
    // The last attack on the chain was Draconic: printed 4{p} + 1{p} = 5{p}.
    expectCombat(game).toHaveAttackPower(5);

    game.helpers.resolveRestOfCombat();
    // 3 (Ronin Renegade) + 5 (Grow Claws) — the buff is combat-real.
    expectFabPlayer(Dash).toHaveLife(12);
  });
});
