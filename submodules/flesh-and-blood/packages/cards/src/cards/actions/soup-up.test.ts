import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { soupUpRed } from "./soup-up.ts";

/**
 * Soup Up, Red (EVO111) — Mechanologist Action - Attack, cost 0, 4{p}.
 * Printed: "If an item you control has been destroyed this turn, this gets
 * go again."
 */

describe("Soup Up (EVO111) AAA", () => {
  it("happy: an item destroyed this turn arms the printed go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [soupUpRed, zeroToSixtyRed],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // Boost frees the driver's last counter and it self-destructs.
    Dash.playAttack(zeroToSixtyRed, { boost: true, stopAt: "on-attack" });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    game.closeCombat({ entityTargets: "minimum", ordering: "listed" });

    Dash.playAttack(soupUpRed);
    game.advanceCombatTo("defend");
    expectFabCard(Dash, soupUpRed).toHaveKeyword("go-again");
    game.closeCombat({ entityTargets: "minimum", ordering: "listed" });
  });

  it("boundary: without an item destroyed there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [soupUpRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(soupUpRed);
    game.advanceCombatTo("defend");

    expectFabCard(Dash, soupUpRed).notToHaveKeyword("go-again");
    game.closeCombat({ entityTargets: "minimum", ordering: "listed" });
  });
});
