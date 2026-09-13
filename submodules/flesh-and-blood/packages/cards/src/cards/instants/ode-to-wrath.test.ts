import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { phantasmaclasmRed } from "../actions/phantasmaclasm.ts";
import { snatchRed } from "../actions/snatch.ts";
import { odeToWrathYellow } from "./ode-to-wrath.ts";

/**
 * Ode to Wrath (MON013) — Light Illusionist Instant Aura, Spectra, cost 4.
 * Printed: whenever a source you control deals damage to an opponent, they
 * lose 1{h}. Illusionist attack action cards you control get go again.
 */

describe("Ode to Wrath (MON013) AAA", () => {
  it("happy: Illusionist attack action cards you control get go again", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [odeToWrathYellow],
        hand: [phantasmaclasmRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(phantasmaclasmRed, { stopAt: "defend" });
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Prism).toHaveAP(1);
  });

  it("boundary: a Generic attack does not get go again from this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [odeToWrathYellow],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(snatchRed, { stopAt: "defend" });
    expectCombat(game).notToHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Prism).toHaveAP(0);
  });

  it("timing: damage from a source you control makes the opponent lose 1 extra {h}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arena: [odeToWrathYellow],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(prism).attackWith(snatchRed);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabCard(game.as(prism), odeToWrathYellow).toBeIn("arena");
  });
});
