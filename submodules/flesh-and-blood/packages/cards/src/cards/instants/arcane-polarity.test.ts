import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { flashBoltRed } from "./flash-bolt.ts";
import { arcanePolarityRed } from "./arcane-polarity.ts";

describe("Arcane Polarity family AAA", () => {
  it("happy: after arcane damage this turn, the red printing gains 4 life", () => {
    const game = FabTestEngine.start(
      { hero: dash, life: 20, hand: [arcanePolarityRed], deck: 6 },
      { hero: blazeFiremind, hand: [flashBoltRed], resourcePoints: 2, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.pass();
    Blaze.play(flashBoltRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(17);

    Dash.play(arcanePolarityRed);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(21);
    expectFabCard(Dash, arcanePolarityRed).toBeIn("graveyard");
  });

  it("boundary: without arcane damage this turn, the red printing gains only 1 life", () => {
    const game = FabTestEngine.start(
      { hero: dash, life: 20, hand: [arcanePolarityRed], deck: 6 },
      { hero: blazeFiremind, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(arcanePolarityRed);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(21);
    expectFabCard(Dash, arcanePolarityRed).toBeIn("graveyard");
  });
});
