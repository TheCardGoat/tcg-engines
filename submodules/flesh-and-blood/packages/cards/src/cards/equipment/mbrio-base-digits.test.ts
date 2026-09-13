import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { goldenCog } from "../tokens/golden-cog.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mbrioBaseDigits } from "./mbrio-base-digits.ts";

describe("M'brio Base Digits (PEN060) AAA", () => {
  it("happy: tapping the digits and a cog blocks at 2{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [mbrioBaseDigits],
        arena: [goldenCog],
        deck: 6,
      },
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.endTurn();
    Blaze.playAttack(snatchRed);
    Dash.defendWith(mbrioBaseDigits);
    Blaze.pass();
    Dash.activate(mbrioBaseDigits);
    Dash.target(goldenCog);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, mbrioBaseDigits).toBeIn("arms");
  });

  it("boundary: un-activated digits block at printed 1{d} and Temper recycles them", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arms: [mbrioBaseDigits],
        arena: [goldenCog],
        deck: 6,
      },
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.endTurn();
    Blaze.playAttack(snatchRed);
    Dash.defendWith(mbrioBaseDigits);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, mbrioBaseDigits).toBeIn("graveyard");
  });
});
