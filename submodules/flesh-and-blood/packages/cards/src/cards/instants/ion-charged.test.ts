import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { underLoopBlue } from "../actions/under-loop.ts";
import { ionChargedYellow } from "./ion-charged.ts";

/**
 * Ion Charged Yellow (PEN242) — Lightning Instant.
 *
 * Printed: Until end of turn, Lightning and Elemental attacks get +1{p}
 * while they have go again.
 */

describe("Ion Charged (PEN242) AAA", () => {
  it("pin: a plain (non-go-again) Lightning attack gains nothing (§5 engine/ion-charged-ga-scope)", () => {
    const game = FabTestEngine.start(
      {
        hero: kano,
        hand: [ionChargedYellow, underLoopBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kano = game.as(kano);
    const Dash = game.as(dash);

    Kano.play(ionChargedYellow);
    game.helpers.resolveUntilIdle();

    // Under Loop is Lightning but carries NO go again — printed says the
    // +1{p} applies only while the attack has go again, so the unboosted 2
    // is correct behavior (boundary green; the GA-positive leg needs a
    // Lightning+GA attack donor, none cheap exists).
    Kano.playAttack(underLoopBlue);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(2); // no GA -> no boost
    Dash.defendWith();
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(18); // 20 - 2
  });
});
