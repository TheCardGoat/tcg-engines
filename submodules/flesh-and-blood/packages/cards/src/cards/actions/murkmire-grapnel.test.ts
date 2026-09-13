import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { snatchRed } from "./snatch.ts";
import { feignDeathYellow } from "../instants/feign-death.ts";
import { murkmireGrapnelRed } from "./murkmire-grapnel.ts";

/**
 * Murkmire Grapnel (AZL010) — "If Murkmire Grapnel has an aim counter, it has
 * +1{p}. Damage that would be dealt by Murkmire Grapnel can't be prevented."
 *
 * Mode B (fab-rules): CR 6.4.10 — a one-off prevention shield (Feign Death)
 * stops the next damage event; a continuous "can't be prevented" restriction
 * on the damage source makes that event land in full. Both directions are
 * proven: the shield prevents a different source, but not Murkmire Grapnel.
 */

describe("Murkmire Grapnel (AZL010) AAA", () => {
  it("happy: an aim counter on the arsenal arrow raises power from 4 to 5", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: murkmireGrapnelRed, state: { aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).attackWith(murkmireGrapnelRed, { from: "arsenal" });

    expectCombat(game).toHaveAttackPower(5); // printed 4 + aimed 1
  });

  it("timing: aimed Murkmire Grapnel damage lands in full through a Feign Death shield", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [snatchRed],
        weapon1: [deathDealer],
        arsenal: [{ card: murkmireGrapnelRed, state: { aimCounters: 1 } }],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [feignDeathYellow], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    // Link 1: deal damage with another arrow so Feign Death becomes playable.
    Azalea.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4

    // Shield up: the next damage event this turn would be prevented.
    game.helpers.passPriorityTo(Dash);
    Dash.play(feignDeathYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    // Link 2: aimed Murkmire Grapnel (5{p}) — "can't be prevented".
    Azalea.attackWith(murkmireGrapnelRed, { from: "arsenal" });
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(11); // 16 - 5: shield ignored
  });

  it("boundary: the same Feign Death shield does prevent a different source", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        hand: [snatchRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [feignDeathYellow], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(16); // 20 - 4

    game.helpers.passPriorityTo(Dash);
    Dash.play(feignDeathYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    Azalea.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(16); // 4 damage fully prevented
  });
});
