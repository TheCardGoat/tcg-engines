import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goBananasYellow } from "./go-bananas.ts";

describe("Go Bananas (LSS002) AAA", () => {
  it("happy: plays as a 0-cost instant to the graveyard without spending AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [goBananasYellow],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(goBananasYellow);

    expectFabCard(Dash, goBananasYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(1).toHaveLife(20);
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("boundary: playing it does not open combat or deal damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [goBananasYellow], actionPoints: 1, life: 20, deck: 6 },
      { hero: bravo, hand: [], life: 20, deck: 6 },
    );

    game.as(dash).play(goBananasYellow);

    expect(game.combat()).toBeNull();
    expectFabPlayer(game.as(bravo)).toHaveLife(20);
  });

  it("timing: can be played on the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [goBananasYellow], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.pass();
    Bravo.play(goBananasYellow);
    game.passBoth();

    expectFabCard(Bravo, goBananasYellow).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(20);
    expect(game.combat()).toBeNull();
  });
});
