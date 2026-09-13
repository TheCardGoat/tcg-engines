import { volticBoltBlue } from "./voltic-bolt.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";

describe("Voltic Bolt (ARC147) AAA", () => {
  it("happy: deals 5 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(15);
    expectFabCard(game.as(blazeFiremind), volticBoltRed).toBeIn("graveyard");
  });

  it("boundary: it is not a combat attack and does not open a chain", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(blazeFiremind).play(volticBoltRed, { target: game.as(dash).id });
    game.passBoth();
    expect(game.combat()).toBeNull();
  });

  it("happy: deals 3 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltBlue, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(game.as(blazeFiremind), volticBoltBlue).toBeIn("graveyard");
  });
});
