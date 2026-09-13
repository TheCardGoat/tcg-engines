import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { spellfireCloak } from "./spellfire-cloak.ts";

describe("Spellfire Cloak (UPR167) AAA", () => {
  it("happy: on the opponent's turn, destroy this to gain 1 resource", () => {
    const game = FabTestEngine.start(
      { hero: bravo, actionPoints: 1, deck: 6 },
      { hero: dash, chest: [spellfireCloak], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).pass();
    Dash.activate(spellfireCloak);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, spellfireCloak).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveResourceCount(1);
  });

  it("boundary: cannot activate on your own turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [spellfireCloak], actionPoints: 1, deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(spellfireCloak);
    expectFabCard(Dash, spellfireCloak).toBeIn("chest");
  });

  it("timing: Arcane Barrier still prevents 1 of Voltic Bolt", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, resourcePoints: 1, chest: [spellfireCloak], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, spellfireCloak).toBeIn("chest");
  });
});
