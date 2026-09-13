import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { kayo } from "../heroes/kayo.ts";
import { turnHeadsBlue } from "./turn-heads.ts";

/**
 * Turn Heads (SUP176) — Guardian Instant Aura, Suspense.
 *
 * Printed: When this leaves the arena, {t} target Brute hero. They don't {u}
 * during their next end phase.
 *
 * Hungry for More already proves suspense exhaustion as the leave-arena
 * driver. This trio proves the tap + no-untap rider.
 */

function exhaustSuspense(
  Bravo: ReturnType<FabTestEngine["as"]>,
  Opponent: ReturnType<FabTestEngine["as"]>,
  game: FabTestEngine,
): void {
  for (let i = 0; i < 6 && Bravo.zone("arena").includes(turnHeadsBlue.canonicalId); i += 1) {
    Bravo.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });
    Opponent.endTurn();
    game.untilIdle({ optionals: "decline", ordering: "listed", entityTargets: "minimum" });
  }
}

describe("Turn Heads (SUP176) AAA", () => {
  it("happy: leaving the arena taps the opposing Brute hero", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [turnHeadsBlue], resourcePoints: 3, deck: 6 },
      { hero: kayo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Kayo = game.as(kayo);

    Bravo.play(turnHeadsBlue);
    game.untilIdle({ ordering: "listed" });
    expectFabCard(Bravo, turnHeadsBlue).toBeIn("arena");

    exhaustSuspense(Bravo, Kayo, game);

    expectFabCard(Bravo, turnHeadsBlue).toBeIn("graveyard");
    expectFabCard(Kayo, kayo).toBeTapped();
  });

  it("boundary: a non-Brute hero is not tapped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [turnHeadsBlue], resourcePoints: 3, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(turnHeadsBlue);
    game.untilIdle({ ordering: "listed" });
    exhaustSuspense(Bravo, Dash, game);

    expectFabCard(Bravo, turnHeadsBlue).toBeIn("graveyard");
    expectFabCard(Dash, dash).toBeReady();
  });
});
