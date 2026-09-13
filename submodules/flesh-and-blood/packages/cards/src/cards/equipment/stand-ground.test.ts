import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { standGround } from "./stand-ground.ts";

/**
 * Stand Ground (BET007) — "If you control a Might token, this gets +1{d}.
 * If you control a Vigor token, this gets +1{d}. Temper"
 *
 * Mode B (fab-rules): each clause is an independent continuous static
 * (condition control-object token + modify-numeric defense) on the legs
 * piece, evaluated while defending. Temper (CR 8.3.10): after the equipment
 * defends it gets a -1{d} counter and is destroyed if defense reaches 0.
 */

describe("Stand Ground (BET007) AAA", () => {
  it("happy: Might and Vigor tokens each add +1{d} (0 -> 2) while defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        legs: [standGround],
        arena: [fabToken("might"), fabToken("vigor")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed); // 4{p}
    Bravo.defendWith(standGround); // 0 + 1 Might + 1 Vigor = 2{d}
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(18); // 20 - (4 - 2)
  });

  it("boundary: with only one token controlled, only that clause applies (1{d})", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        legs: [standGround],
        arena: [fabToken("vigor")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed); // 4{p}
    Bravo.defendWith(standGround); // 0 + 1 Vigor = 1{d}
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17); // 20 - (4 - 1)
  });

  it("timing: Temper adds a -1{d} counter after defending but the piece survives at 1{d} total", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        legs: [standGround],
        arena: [fabToken("might"), fabToken("vigor")],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    Bravo.defendWith(standGround); // 2{d} defended: counter brings total to 1
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, standGround).toHaveDefenseCounters(-1);
    expectFabCard(Bravo, standGround).toBeIn("legs"); // 2 - 1 = 1: not destroyed
  });
});
