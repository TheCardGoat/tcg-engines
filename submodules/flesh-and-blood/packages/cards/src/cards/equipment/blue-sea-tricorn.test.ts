import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { bravo } from "../heroes/bravo.ts";
import { blueSeaTricorn } from "./blue-sea-tricorn.ts";

/**
 * Blue Sea Tricorn (LGS392) — Pirate Head, Blade Break.
 * Printed: "Action - {r}{r}{r}, destroy this: Draw a card. Go again"
 */

describe("Blue Sea Tricorn (LGS392) AAA", () => {
  it("happy: paying 3 destroys the tricorn, draws a card and go again refunds the AP", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [blueSeaTricorn],
        hand: [],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.activate(blueSeaTricorn);
    game.helpers.resolveUntilIdle();

    expectFabCard(Gravy, blueSeaTricorn).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveResourceCount(0);
    expectFabPlayer(Gravy).toHaveHandCount(1);
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: with only 2 resources the Action cannot be activated", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        head: [blueSeaTricorn],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.expectActivationRejected(blueSeaTricorn);
    expectFabCard(Gravy, blueSeaTricorn).toBeIn("head");
    expectFabPlayer(Gravy).toHaveHandCount(0);
  });
});
