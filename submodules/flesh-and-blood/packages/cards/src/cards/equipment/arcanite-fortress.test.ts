import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { bravo } from "../heroes/bravo.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { snatchRed } from "../actions/snatch.ts";
import { arcaniteFortress } from "./arcanite-fortress.ts";

describe("Arcanite Fortress (ROS211) AAA", () => {
  it("happy: Spellvoid 1 destroys this to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [arcaniteFortress], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, arcaniteFortress).toHaveDefense(1);
    expectFabCard(Dash, arcaniteFortress).toHaveKeyword("spellvoid");
    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, arcaniteFortress).toBeIn("graveyard");
  });

  it("boundary: declining Spellvoid takes the full 5 arcane and the fortress stays", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [arcaniteFortress], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, arcaniteFortress).toBeIn("chest");
  });

  it("timing: Guardwell on defend keeps the chest with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [arcaniteFortress], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, arcaniteFortress).toHaveDefense(1);
    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(arcaniteFortress);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, arcaniteFortress).toBeIn("chest");
    expectFabCard(Dash, arcaniteFortress).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(17);
  });
});
