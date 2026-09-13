import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { chane } from "../heroes/chane.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { wartuneHeraldRed } from "../actions/wartune-herald.ts";
import { empyreanRapture } from "./empyrean-rapture.ts";

/**
 * Empyrean Rapture — Light Illusionist Equipment - Chest.
 *
 * Printed:
 *   If a card with Herald in its name has been put into your hero's soul
 *   during your turn, the first hero ability you activate that turn costs
 *   {r}{r} less to activate.
 *   Once per Turn Instant - {r}: This gets ward 1 until end of turn.
 *
 * Prism's hero ability costs {r}{r} (plus banishing a card from soul), and
 * Wartune Herald's on-hit puts itself into Prism's soul.
 */

describe("Empyrean Rapture (DTD004) AAA", () => {
  it("happy: after a Herald enters the soul, Prism's hero ability is free", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [empyreanRapture],
        hand: [wartuneHeraldRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.playAttack(wartuneHeraldRed);
    game.helpers.resolveRestOfCombat();
    expectFabCard(Prism, wartuneHeraldRed).toBeIn("soul");

    // {r}{r} − {r}{r} (first hero ability) = free; only the soul banish is paid.
    Prism.activate(prism);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
    expectFabCard(Prism, wartuneHeraldRed).toBeIn("banished");
    expectFabPlayer(Prism).toHaveResourceCount(0);
  });

  it("boundary: without a Herald put into the soul, the ability costs full {r}{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [empyreanRapture],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.expectActivationRejected(prism);
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: the paid ward 1 prevents 1 of a hit this turn and destroys this", () => {
    const game = FabTestEngine.start(
      { hero: chane, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      {
        hero: prism,
        chest: [empyreanRapture],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Chane = game.as(chane);

    // The Instant ward is paid in the reaction window of Chane's attack —
    // still Chane's turn, so the grant is live at the damage step.
    Chane.playAttack(snatchRed);
    Prism.defendWith();
    game.helpers.passPriorityTo(Prism);
    Prism.activate(empyreanRapture);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    // Snatch 4{p} − 1 prevented by ward = 3 damage; the chest destroyed itself.
    expectFabPlayer(Prism).toHaveLife(17);
    expectFabCard(Prism, empyreanRapture).toBeIn("graveyard");
  });
});
