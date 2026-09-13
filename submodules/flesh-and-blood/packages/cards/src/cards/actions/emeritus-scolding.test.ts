import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { emeritusScoldingRed } from "./emeritus-scolding.ts";

describe("Emeritus Scolding (EVR125) AAA", () => {
  it("happy: deals 4 arcane on your turn", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [emeritusScoldingRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(emeritusScoldingRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Blaze, emeritusScoldingRed).toBeIn("graveyard");
  });

  it("boundary: 0 resources cannot pay the cost-2 action", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [emeritusScoldingRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() =>
      game.as(blazeFiremind).play(emeritusScoldingRed, { target: game.as(dash).id }),
    ).toThrow();
  });
});
