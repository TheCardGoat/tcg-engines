import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { doublingSeasonRed } from "./doubling-season.ts";

/**
 * Doubling Season (PEN218) — Earth Action Attack, 0{p}.
 *
 * Printed: While this is face-up in any zone, if it would gain {p}, instead
 * it gains that much plus 1.
 *
 * Re-encode to Back Heel Kick amplify gain-power. Might is the next-attack
 * +1 that is not cost-gated (this is cost 3).
 */

describe("Doubling Season (PEN218) AAA", () => {
  it("happy: Might +1{p} is amped to +2 while this is face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [doublingSeasonRed, nimblismBlue],
        arena: [fabToken("might")],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.endTurn();
    game.untilIdle({ ordering: "listed", optionals: "decline" });
    Dash.endTurn();
    game.untilIdle({ ordering: "listed", optionals: "decline" });

    Briar.must.pitch(nimblismBlue).playAttack(doublingSeasonRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: without a {p} gain this stays printed 0", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [doublingSeasonRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(briar).playAttack(doublingSeasonRed);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(0);
  });
});
