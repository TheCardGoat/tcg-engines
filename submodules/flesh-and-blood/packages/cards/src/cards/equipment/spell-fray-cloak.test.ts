import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { spellFrayCloak } from "./spell-fray-cloak.ts";

describe("Spell Fray Cloak (BOL006) AAA", () => {
  it("happy: Spellvoid 1 destroys this to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [spellFrayCloak], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, spellFrayCloak).toHaveKeyword("spellvoid");
    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, spellFrayCloak).toBeIn("graveyard");
  });

  it("boundary: declining Spellvoid takes the full 5 arcane and the cloak stays", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [spellFrayCloak], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, spellFrayCloak).toBeIn("chest");
  });

  it("timing: unused cloak stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [spellFrayCloak], hand: [], deck: 6 },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, spellFrayCloak).toBeIn("chest");
    expectFabCard(Dash, spellFrayCloak).toHaveKeyword("spellvoid");
  });
});
