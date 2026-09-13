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
import { spellFrayTiara } from "./spell-fray-tiara.ts";

describe("Spell Fray Tiara (DYN236) AAA", () => {
  it("happy: Spellvoid 1 destroys this to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [spellFrayTiara], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, spellFrayTiara).toHaveKeyword("spellvoid");
    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, spellFrayTiara).toBeIn("graveyard");
  });

  it("boundary: declining Spellvoid takes the full 5 arcane and the tiara stays", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [spellFrayTiara], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(Dash, spellFrayTiara).toBeIn("head");
  });

  it("timing: unused tiara stays equipped through the end of turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [spellFrayTiara], hand: [], deck: 6 },
      { hero: blazeFiremind, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, spellFrayTiara).toBeIn("head");
    expectFabCard(Dash, spellFrayTiara).toHaveKeyword("spellvoid");
  });
});
