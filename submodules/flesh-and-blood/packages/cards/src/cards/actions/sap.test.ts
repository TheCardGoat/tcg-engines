import { sapBlue } from "./sap.ts";
import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { sapRed } from "./sap.ts";

describe("Sap (DYN206) AAA", () => {
  it("happy: deals 3 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [sapRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sapRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, sapRed).toBeIn("graveyard");
  });

  it("boundary: dealing exactly 3 does not fire surge extras", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [sapRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sapRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Blaze).toHaveAP(0);
  });

  it("timing: after resolution the card is in the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [sapRed], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(sapRed, { target: game.as(dash).id });
    game.passBoth();

    expectFabCard(Blaze, sapRed).toBeIn("graveyard");
  });

  it("happy: deals 1 arcane without surge extras", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [sapBlue], resourcePoints: 0, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(sapBlue, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabPlayer(Blaze).toHaveHandCount(0);
    expectFabCard(Blaze, sapBlue).toBeIn("graveyard");
  });
});
