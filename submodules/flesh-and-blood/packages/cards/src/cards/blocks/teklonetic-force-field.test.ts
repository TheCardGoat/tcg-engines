import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { jollyBludgerYellow } from "../actions/jolly-bludger.ts";
import { snatchRed } from "../actions/snatch.ts";
import { tekloneticForceFieldRed } from "./teklonetic-force-field.ts";

/**
 * Teklonetic Force Field, Red (EVO231) — Mechanologist Block, 3{d}.
 * Printed: When this defends an attack with overpower, this gets +2{d}.
 */

describe("Teklonetic Force Field (EVO231) AAA", () => {
  it("happy: defending an overpower attack grants +2{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [jollyBludgerYellow], deck: 6, resourcePoints: 2 },
      { hero: dash, hand: [tekloneticForceFieldRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(jollyBludgerYellow);
    Dash.defendWith(tekloneticForceFieldRed);
    game.passBoth();

    expectFabCard(Dash, tekloneticForceFieldRed).toHaveDefense(5);
    expectCombat(game).toBeOpen();
  });

  it("boundary: defending an attack without overpower stays printed 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, hand: [tekloneticForceFieldRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(snatchRed);
    Dash.defendWith(tekloneticForceFieldRed);
    game.passBoth();

    expectFabCard(Dash, tekloneticForceFieldRed).toHaveDefense(3);
  });

  it("timing: +2{d} this turn still applies through chain close", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [jollyBludgerYellow], deck: 6, resourcePoints: 2 },
      { hero: dash, hand: [tekloneticForceFieldRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(jollyBludgerYellow);
    Dash.defendWith(tekloneticForceFieldRed);
    game.passBoth();
    expectFabCard(Dash, tekloneticForceFieldRed).toHaveDefense(5);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
