import { zapBlue } from "./zap.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { zapRed } from "./zap.ts";

/**
 * Zap Red (ARC144) — "Deal 3 arcane damage to target hero."
 */

describe("Zap (ARC144) AAA", () => {
  it("happy: deals 3 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [zapRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(zapRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Blaze, zapRed).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
  });

  it("boundary: Arcane Barrier 1 prevents 1 of the 3 arcane damage", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [zapRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, resourcePoints: 1, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(zapRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabPlayer(Dash).toHaveResourceCount(0);
  });

  it("timing: printed target hero is any hero — the caster may self-target", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        life: 20,
        hand: [zapRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(zapRed, { target: Blaze.id });
    game.passBoth();

    expectFabPlayer(Blaze).toHaveLife(17);
    expectFabCard(Blaze, zapRed).toBeIn("graveyard");
  });

  it("happy: deals 1 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [zapBlue], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(zapBlue, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Blaze, zapBlue).toBeIn("graveyard");
    expect(game.combat()).toBeNull();
  });
});
