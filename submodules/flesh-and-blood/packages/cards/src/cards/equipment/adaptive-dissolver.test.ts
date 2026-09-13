import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { adaptiveDissolver } from "./adaptive-dissolver.ts";

describe("Adaptive Dissolver (ROS246) AAA", () => {
  it("happy: pay 1 resource to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 1,
        chest: [adaptiveDissolver],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Dash).toHaveResourceCount(0);
    expectFabCard(Dash, adaptiveDissolver).toBeIn("chest");
  });

  it("boundary: declining Arcane Barrier 1 takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: 20,
        resourcePoints: 1,
        chest: [adaptiveDissolver],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    Dash.expectDecision("option");
    Dash.chooseOptions();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabPlayer(Dash).toHaveResourceCount(1);
    expectFabCard(Dash, adaptiveDissolver).toHaveKeyword("arcane-barrier");
  });

  it("happy: Action - 0 re-equips this to another equipment zone", () => {
    const game = FabTestEngine.start(
      { hero: dash, chest: [adaptiveDissolver], actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.activate(adaptiveDissolver, { equipToZone: "arms" });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, adaptiveDissolver).toBeIn("arms");
    expect(Dash.zone("chest")).not.toContain(adaptiveDissolver.canonicalId);
  });
});
