import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { sigilOfFyendalBlue } from "./sigil-of-fyendal.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { vantagePointRed } from "./vantage-point.ts";

/**
 * Vantage Point, Red (FLR010) — overpower if you've played or created an aura this turn.
 */

describe("Vantage Point (FLR010) AAA", () => {
  it("happy: after playing an aura this turn, this gets overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [sigilOfFyendalBlue, vantagePointRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(sigilOfFyendalBlue);
    game.helpers.resolveUntilIdle();
    Viserai.attackWith(vantagePointRed);
    expectCombat(game).toHaveKeyword("overpower");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(13);
  });

  it("boundary: without an aura this turn there is no overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vantagePointRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.attackWith(vantagePointRed);
    expectCombat(game).notToHaveKeyword("overpower");
    Dash.defendWith([snatchRed, nimblismBlue]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vantagePointRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Viserai.defendWith([vantagePointRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Viserai).toHaveLife(19);
  });
});
