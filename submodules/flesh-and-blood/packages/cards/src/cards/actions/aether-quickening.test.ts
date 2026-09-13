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
import { aetherQuickeningRed } from "./aether-quickening.ts";

describe("Aether Quickening (DYN197) AAA", () => {
  it("happy: deals 4 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherQuickeningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(aetherQuickeningRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, aetherQuickeningRed).toBeIn("graveyard");
  });

  it("boundary: unpayable cost keeps the card in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherQuickeningRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    expectFabUnplayable(() => Blaze.play(aetherQuickeningRed, { target: game.as(dash).id }));
    expectFabCard(Blaze, aetherQuickeningRed).toBeIn("hand");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [aetherQuickeningRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(aetherQuickeningRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabCard(Blaze, aetherQuickeningRed).toBeIn("graveyard");
  });
});
