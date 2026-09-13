import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { aetherWildfireRed } from "./aether-wildfire.ts";

describe("Aether Wildfire (EVR123) AAA", () => {
  it("happy: deals 4 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherWildfireRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherWildfireRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, aetherWildfireRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherWildfireRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expectFabUnplayable(() => Blaze.play(aetherWildfireRed, { target: game.as(dash).id }));
    expectFabCard(Blaze, aetherWildfireRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherWildfireRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(aetherWildfireRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabCard(Blaze, aetherWildfireRed).toBeIn("graveyard");
  });
});
