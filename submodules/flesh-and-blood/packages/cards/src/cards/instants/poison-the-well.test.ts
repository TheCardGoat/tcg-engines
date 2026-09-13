import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { sigilOfSolaceRed } from "./sigil-of-solace.ts";
import { poisonTheWellBlue } from "./poison-the-well.ts";

describe("Poison the Well (DTD231) AAA", () => {
  it("happy: the next hero life gain becomes an equal life loss", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [poisonTheWellBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [sigilOfSolaceRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    const Bravo = game.as(bravo);

    Dash.play(poisonTheWellBlue);
    game.passBoth();
    Dash.pass();
    Bravo.play(sigilOfSolaceRed);
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeIn("graveyard");
  });

  it("boundary: only the next life gain is replaced", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [poisonTheWellBlue],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: bravo, hand: [sigilOfSolaceRed, sigilOfSolaceRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.play(poisonTheWellBlue);
    game.passBoth();
    Dash.pass();
    Bravo.play(sigilOfSolaceRed);
    game.passBoth();
    Dash.pass();
    Bravo.play(sigilOfSolaceRed);
    game.passBoth();

    expectFabCard(Dash, poisonTheWellBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("timing: resolving the instant does not open combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [poisonTheWellBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
    );
    const Dash = game.as(dash);

    Dash.play(poisonTheWellBlue);
    expect(game.combat()).toBeNull();
  });
});
