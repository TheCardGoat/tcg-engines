import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { hauntingSpecterYellow } from "../actions/haunting-specter.ts";
import { calmingCloak } from "./calming-cloak.ts";

/**
 * Calming Cloak — Illusionist Chest, Arcane Barrier 1.
 * Printed: "Instant - {r}, destroy this: The next aura you play this turn
 * costs {r}{r} less to play."
 * Haunting Specter (a real 2-cost Illusionist aura) rides the load.
 */

describe("Calming Cloak (ROS249) AAA", () => {
  it("happy: destroying the cloak makes the next aura cost 2 less", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [calmingCloak],
        hand: [hauntingSpecterYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.activate(calmingCloak);
    game.untilIdle({ optionals: "decline", ordering: "listed" });
    expectFabCard(Prism, calmingCloak).toBeIn("graveyard");

    // 2{r} printed cost minus the 2{r} discount is free.
    Prism.play(hauntingSpecterYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Prism, hauntingSpecterYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveResourceCount(2);
  });

  it("boundary: without the cloak the aura costs its full 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        chest: [calmingCloak],
        hand: [hauntingSpecterYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(hauntingSpecterYellow);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabCard(Prism, calmingCloak).toBeIn("chest");
    expectFabCard(Prism, hauntingSpecterYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveResourceCount(0);
  });
});
