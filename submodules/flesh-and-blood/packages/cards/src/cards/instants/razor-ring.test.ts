import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { razorRingBlue } from "./razor-ring.ts";

/**
 * Razor Ring (OMN233) — Ninja Legendary Shuriken Item, 1{p}/2{d}.
 *
 * Printed:
 *   Action - {r}, {t}, destroy this when the combat chain closes: Attack.
 *   Go again
 *   When this hits a hero, the next action card they defend with this combat
 *   chain gets -1{d} until end of turn.
 */

describe("Razor Ring (OMN233) AAA", () => {
  it("timing: the Shuriken stays in the arena through its attack and is destroyed when the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [razorRingBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    // Act — play the Legendary Item, then pay {r} and tap it for Attack.
    Dash.play(razorRingBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Dash, razorRingBlue).toBeIn("arena");
    Dash.activateAttack(razorRingBlue);

    // Defect proof — destruction is deferred, not paid at activation: the
    // ring is still in the arena as the active attack.
    expectCombat(game).toHaveAttackPower(1);
    expectFabCard(Dash, razorRingBlue).toBeIn("arena");
    game.closeCombat({ ordering: "listed" });

    // Assert — hit lands (20 − 1), then the close-destroy fires and go again
    // refunded the action point this attack spent.
    expectFabPlayer(Azalea).toHaveLife(19);
    // Item plays spend no action point (not an Action): seed 2 − attack 1
    // + Go again refund 1 = 2. A missing refund would read 1.
    expectFabPlayer(Dash).toHaveAP(2);
    expectFabCard(Dash, razorRingBlue).toBeIn("graveyard");
  });

  it("boundary: closing an unrelated chain without activating leaves the Shuriken alone", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [razorRingBlue, snatchRed],
        resourcePoints: 4,
        actionPoints: 3,
        deck: 6,
      },
      { hero: azalea, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Azalea = game.as(azalea);

    // Act — swing with Snatch while the ring sits unactivated; that chain
    // closes after its own link resolves.
    Dash.play(razorRingBlue);
    game.untilIdle({ ordering: "listed" });
    Dash.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });

    // Assert — the deferred destroy only arms on Razor Ring's own Attack:
    // Snatch's chain closed and the ring survived in the arena.
    expectFabPlayer(Azalea).toHaveLife(16); // 20 − 4{p}
    expectFabCard(Dash, razorRingBlue).toBeIn("arena");
    expectFabCard(Dash, snatchRed).toBeIn("graveyard"); // action went to GY, not the item
  });
});
