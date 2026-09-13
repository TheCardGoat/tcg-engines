import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { arcaneTwiningRed } from "./arcane-twining.ts";

describe("Arcane Twining (OSC012) AAA", () => {
  it("happy: deals 3 arcane to the targeted hero", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [arcaneTwiningRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(arcaneTwiningRed, { target: Dash.id });
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Blaze, arcaneTwiningRed).toBeIn("graveyard");
  });

  it("boundary: Instant — discard this amps the next arcane packet by 1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [arcaneTwiningRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.activate(arcaneTwiningRed);
    game.helpers.resolveUntilIdle();
    expectFabCard(Blaze, arcaneTwiningRed).toBeIn("graveyard");

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    // Voltic Bolt 5 + Amp 1.
    expectFabPlayer(Dash).toHaveLife(14);
  });
});
