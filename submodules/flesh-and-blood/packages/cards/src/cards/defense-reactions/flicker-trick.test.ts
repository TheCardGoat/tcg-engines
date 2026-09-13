import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dromai } from "../heroes/dromai.ts";
import { ragingOnslaughtRed } from "../actions/raging-onslaught.ts";
import { snatchRed } from "../actions/snatch.ts";
import { flickerTrickRed } from "./flicker-trick.ts";

/**
 * Flicker Trick Red (DTD218) — Illusionist Defense Reaction, 4{d}.
 * Printed: Mirage — destroy this if it is defending a non-Illusionist attack
 * with 6 or more {p}. Combat-close emits a real destroy for any defending
 * origin (not only equipment), so a 6{p} block is destroyed and a 4{p} block
 * stays on the chain through damage.
 */

describe("Flicker Trick (DTD218) AAA", () => {
  it("happy: defends a 6-power attack for its printed 4{d} and closes in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [ragingOnslaughtRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dromai, hand: [flickerTrickRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Dromai = game.as(dromai);

    Dash.attackWith(ragingOnslaughtRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Dromai.play(flickerTrickRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dromai, flickerTrickRed).toBeIn("graveyard");
    expectFabPlayer(Dromai).toHaveLife(18); // 6{p} vs 4{d}
  });

  it("boundary: a power-4 attack leaves Flicker Trick on the chain through the damage step", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dromai, hand: [flickerTrickRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Dromai = game.as(dromai);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dash.pass();
    Dromai.play(flickerTrickRed);
    game.passBoth();
    game.passBoth();
    // Below the 6-power Mirage threshold the card is not destroyed mid-link.
    expectFabCard(Dromai, flickerTrickRed).toBeIn("combatChain");
    expectFabPlayer(Dromai).toHaveLife(20);

    game.helpers.resolveRestOfCombat();
    expectFabCard(Dromai, flickerTrickRed).toBeIn("graveyard");
    expectFabPlayer(Dromai).toHaveLife(20); // full 4{d} block
  });
});
