import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { cinderingForesightRed } from "./cindering-foresight.ts";

describe("Cindering Foresight (CRU165) AAA", () => {
  it("happy: next arcane-damage card this turn deals +1", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [cinderingForesightRed, volticBoltRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(cinderingForesightRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();

    // Voltic Bolt is 5 arcane + 1 from Cindering Foresight.
    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Blaze, cinderingForesightRed).toBeIn("graveyard");
  });

  it("boundary: without Cindering Foresight, Voltic Bolt deals printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    Blaze.play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    expectFabPlayer(Dash).toHaveLife(15);
  });

  it("timing: may be played as an instant on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: blazeFiremind, hand: [cinderingForesightRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Blaze = game.as(blazeFiremind);

    Dash.play(volticBoltRed, { target: Blaze.id });
    Dash.pass();
    Blaze.play(cinderingForesightRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    game.passBoth();

    expectFabCard(Blaze, cinderingForesightRed).toBeIn("graveyard");
    // Opponent's Voltic Bolt is not "the next card you play" — Blaze takes printed 5.
    expectFabPlayer(Blaze).toHaveLife(12);
  });
});
