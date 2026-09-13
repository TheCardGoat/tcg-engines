import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { tagTheTargetRed } from "./tag-the-target.ts";

/**
 * Tag the Target Red (CIN020) — Ninja Attack Action. Go again.
 *
 * Printed: When this hits a hero, mark them.
 */

describe("Tag the Target (CIN020) AAA", () => {
  it("happy: an unblocked hit marks the defending hero and refunds an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [tagTheTargetRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    const Dash = game.as(dash);

    Katsu.playAttack(tagTheTargetRed);
    Dash.defendWith();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17); // 20 - 3
    expectFabPlayer(Dash).toBeMarked();
    expectFabCard(Katsu, tagTheTargetRed).toBeIn("graveyard");
    expectFabPlayer(Katsu).toHaveAP(1); // go again
  });
});
