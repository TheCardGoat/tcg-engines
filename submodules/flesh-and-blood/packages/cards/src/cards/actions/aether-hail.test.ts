import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { aetherHailRed } from "./aether-hail.ts";

describe("Aether Hail (UPR127) AAA", () => {
  it("happy: deals 4 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [aetherHailRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherHailRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, aetherHailRed).toBeIn("graveyard");
  });

  it("boundary: Arcane Barrier 1 prevents 1 of the 4 arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [aetherHailRed], resourcePoints: 1, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherHailRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: printed any target includes the caster", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        life: 20,
        hand: [aetherHailRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(aetherHailRed, { target: Blaze.id });
    game.passBoth();

    expectFabPlayer(Blaze).toHaveLife(16);
    expectFabCard(Blaze, aetherHailRed).toBeIn("graveyard");
  });
});
