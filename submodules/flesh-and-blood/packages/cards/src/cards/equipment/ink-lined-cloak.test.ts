import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { sigilOfForethoughtBlue } from "../instants/sigil-of-forethought.ts";
import { inkLinedCloak } from "./ink-lined-cloak.ts";

/**
 * Ink-lined Cloak (OSC004) — Wizard Chest d0.
 *
 * Printed: "Instant - Destroy this: Gain {r}. Activate this only if you
 * control an aura permanent with Sigil in its name."
 */
describe("Ink-lined Cloak (OSC004) AAA", () => {
  it("happy: with Sigil of Forethought in the arena, destroying the cloak pays 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        life: 20,
        chest: [inkLinedCloak],
        hand: [sigilOfForethoughtBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
    );
    const Kano = game.as(kano);

    Kano.play(sigilOfForethoughtBlue);
    game.untilIdle();
    expectFabCard(Kano, sigilOfForethoughtBlue).toBeIn("arena");

    Kano.activate(inkLinedCloak);
    game.untilIdle();

    expectFabPlayer(Kano).toHaveResourceCount(1);
    expectFabCard(Kano, inkLinedCloak).toBeIn("graveyard");
  });

  it("boundary: without a Sigil aura in play the Instant is illegal", () => {
    const game = FabTestEngine.start(
      { hero: kano, life: 20, chest: [inkLinedCloak], hand: [], deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
    );
    const Kano = game.as(kano);

    Kano.expectActivationRejected(inkLinedCloak);
    expectFabCard(Kano, inkLinedCloak).toBeIn("chest");
  });
});
