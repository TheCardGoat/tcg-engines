import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "../actions/hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { mbrioBaseCortex } from "./mbrio-base-cortex.ts";

describe("M'brio Base Cortex (PEN059) AAA", () => {
  it("happy: controlling a Hyper Driver raises the cortex to 2{d} while defending", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [hyperDriverRed], actionPoints: 1, chest: [mbrioBaseCortex], deck: 6 },
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.play(hyperDriverRed);
    Dash.endTurn();
    Blaze.playAttack(snatchRed);
    Dash.defendWith(mbrioBaseCortex);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, mbrioBaseCortex).toBeIn("chest");
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: without a Hyper Driver the cortex defends at printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [mbrioBaseCortex], deck: 6 },
      { hero: blazeFiremind, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.pass();
    Dash.endTurn();
    Blaze.playAttack(snatchRed);
    Dash.defendWith(mbrioBaseCortex);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, mbrioBaseCortex).toBeIn("chest");
    expectFabPlayer(Dash).toHaveLife(16);
  });
});
