/**
 * CR 1.9.2a: "one or more" draw triggers observe a multi-event once.
 * The contrasting per-card trigger is proved by cards/instants/brainstorm.test.ts.
 */
import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectWait,
} from "../../../../testing/index.ts";
import { oscilio } from "../../../../../../cards/src/cards/heroes/oscilio.ts";
import { valdaSeismicImpact } from "../../../../../../cards/src/cards/heroes/valda-seismic-impact.ts";
import { tomeOfFyendalYellow } from "../../../../../../cards/src/cards/actions/tome-of-fyendal.ts";
import { nimblismBlue } from "../../../../../../cards/src/cards/actions/nimblism.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";

const padding = () => [
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
  nimblismBlue,
];

describe("trigger: draw multi-event", () => {
  it("Tome draws two cards but Valda creates two Surges through one trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [tomeOfFyendalYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: valdaSeismicImpact, life: 40, hand: [], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Valda = game.as(valdaSeismicImpact);
    Oscilio.play(tomeOfFyendalYellow);
    // Two separate triggers would require a simultaneous-order decision and fail.
    game.untilIdle({ optionals: "throw", ordering: "throw", entityTargets: "throw" });
    expectFabPlayer(Oscilio).toHaveLife(20).toHaveHandCount(2).toHaveAP(0).toHaveResourceCount(0);
    expectFabPlayer(Valda).toHaveLife(40).toHaveTokenCount("seismic-surge", 2);
    expectWait(game).toBeIdle();
  });

  it("one Gold draw produces one Surge", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        life: 20,
        hand: [],
        arena: [gold],
        resourcePoints: 2,
        actionPoints: 1,
        deck: padding(),
      },
      { hero: valdaSeismicImpact, life: 40, hand: [], deck: padding() },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Valda = game.as(valdaSeismicImpact);
    Oscilio.activate(gold);
    game.untilIdle({ optionals: "throw", ordering: "throw", entityTargets: "throw" });
    expectFabPlayer(Oscilio)
      .toHaveLife(20)
      .toHaveHandCount(1)
      .toHaveAP(1)
      .toHaveResourceCount(0)
      .toHaveTokenCount("gold", 0);
    expectFabPlayer(Valda).toHaveLife(40).toHaveTokenCount("seismic-surge", 1);
    expectWait(game).toBeIdle();
  });
});
