import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { edgeLadenPlate } from "./edge-laden-plate.ts";

/**
 * Edge Laden Plate — Warrior Chest d1 Battleworn.
 *
 * Printed: Instant - Destroy this: Gain {r}. Activate this only if you've
 * sharpened a sword this turn.
 */

describe("Edge Laden Plate AAA", () => {
  it("happy: after sharpening a sword, destroying this gains {r}", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        chest: [edgeLadenPlate],
        weapon1: [zenithBlade],
        hand: [],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.activate(halaBladesaintOfTheVow);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: zenithBlade.canonicalId,
      entityTargets: "minimum",
      ordering: "listed",
      optionalBoolean: false,
    });

    Hala.must.activate(zenithBlade);
    game.toReaction("attacker");
    Hala.activate(edgeLadenPlate);
    game.untilIdle({ optionals: "decline" });
    expectFabCard(Hala, edgeLadenPlate).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveResourceCount(2);
  });

  it("boundary: without a sharpened sword the Instant is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        chest: [edgeLadenPlate],
        weapon1: [zenithBlade],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(halaBladesaintOfTheVow);

    Hala.expectActivationRejected(edgeLadenPlate);
    expectFabCard(Hala, edgeLadenPlate).toBeIn("chest");
    expectFabPlayer(Hala).toHaveResourceCount(3);
  });
});
