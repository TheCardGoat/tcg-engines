import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { contestTheMindfieldBlue } from "./contest-the-mindfield.ts";

/**
 * Contest the Mindfield Blue (EVO243) — Wizard Action Aura.
 *
 * Printed: All heroes get -1{i}.
 * At the start of your turn, destroy this.
 */

describe("Contest the Mindfield (EVO243) AAA", () => {
  it("happy: seats into the arena and destroys itself at own turn start", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [contestTheMindfieldBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);

    Kano.play(contestTheMindfieldBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Kano, contestTheMindfieldBlue).toBeIn("arena");

    // Turn cycle: at Kano's next turn start the aura destroys itself.
    Kano.endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", optionalBoolean: false });

    expectFabCard(Kano, contestTheMindfieldBlue).toBeIn("graveyard");
  });
});
