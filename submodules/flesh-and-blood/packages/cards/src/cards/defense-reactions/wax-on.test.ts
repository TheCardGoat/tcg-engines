import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cartilageCrushYellow } from "../actions/cartilage-crush.ts";
import { waxOnRed } from "./wax-on.ts";

/**
 * Wax On Red (EVR050) — Ninja Defense Reaction, 3{d}.
 *
 * Printed: While this is defending an attack action card with cost 0, it
 * gains +2{d}.
 */

describe("Wax On (EVR050) AAA", () => {
  it("happy: defending a cost-0 AAC, this is 5{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [waxOnRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Katsu = game.as(katsu);

    Dash.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Katsu.defendWith();
    game.toReaction("defender");
    Katsu.must.playReaction(waxOnRed);
    game.passBoth();

    expectFabCard(Katsu, waxOnRed).toHaveDefense(5);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveLife(20);
  });

  it("boundary: defending a cost-3 AAC stays printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [cartilageCrushYellow], resourcePoints: 3, actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [waxOnRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Katsu = game.as(katsu);

    Dash.playAttack(cartilageCrushYellow);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Katsu.defendWith();
    game.toReaction("defender");
    Katsu.must.playReaction(waxOnRed);
    game.passBoth();

    expectFabCard(Katsu, waxOnRed).toHaveDefense(3);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Katsu).toHaveLife(17);
  });

  it("timing: from hand it is not defending, so no +2{d} applies before play", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [waxOnRed], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(katsu), waxOnRed).toHaveDefense(3);
  });
});
