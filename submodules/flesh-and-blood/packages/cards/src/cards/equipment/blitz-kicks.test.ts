import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { blinkBlue } from "../instants/blink.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blitzKicks } from "./blitz-kicks.ts";

describe("Blitz Kicks (AZS006) AAA", () => {
  it("happy: after playing an instant, pay 1 and destroy this to create Embodiment of Lightning", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [blitzKicks],
        hand: [blinkBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(blinkBlue);
    game.helpers.resolveUntilIdle();
    Dash.activate(blitzKicks);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, blitzKicks).toBeIn("graveyard");
    expect(Dash.zone("arena")).toContain("token:embodiment-of-lightning");
  });

  it("boundary: cannot activate without playing an instant this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, legs: [blitzKicks], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.expectActivationRejected(blitzKicks);
    expectFabCard(Dash, blitzKicks).toBeIn("legs");
  });

  it("timing: Arcane Barrier still prevents 1 of Voltic Bolt", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, resourcePoints: 1, legs: [blitzKicks], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, blitzKicks).toBeIn("legs");
  });
});
