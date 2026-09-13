import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kassai } from "../heroes/kassai.ts";
import { snatchRed } from "../actions/snatch.ts";
import { valahaiRivenYellow } from "./valahai-riven.ts";

/**
 * Valahai Riven (GEM115) — Guardian Block, 3{d}.
 *
 * Printed: "When this defends, you may pay up to {r}{r}{r}. Create that many
 * Seismic Surge tokens."
 */

describe("Valahai Riven (GEM115) AAA", () => {
  it("happy: paying 3 while defending creates 3 Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [valahaiRivenYellow],
        resourcePoints: 3,
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(valahaiRivenYellow);
    game.passBoth(); // resolve the defend trigger up to the pay optional
    Dash.accept();
    Dash.chooseNumeric(3);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    // 4 vs 3{d} — 1 damage; paid 3{r} of the seeded 3.
    expectFabPlayer(Dash).toHaveTokenCount("seismic-surge", 3).toHaveLife(19);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("boundary: declining the payment creates no Seismic Surge tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [valahaiRivenYellow],
        resourcePoints: 3,
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: kassai },
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith(valahaiRivenYellow);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveTokenCount("seismic-surge", 0).toHaveLife(19);
    expectFabPlayer(Dash).toHaveResourceCount(3);
  });
});
