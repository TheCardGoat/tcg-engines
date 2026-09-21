import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bloodrushBellowYellow } from "../actions/bloodrush-bellow.ts";
import { brutalAssaultRed, brutalAssaultYellow } from "../actions/brutal-assault.ts";
import { snatchRed } from "../actions/snatch.ts";
import { coronetPeak } from "../equipment/coronet-peak.ts";
import { dash } from "./dash.ts";
import { rhinar } from "./rhinar.ts";

describe("Rhinar (RNR002) AAA", () => {
  it("happy: an exact 6{p} discard during his action phase intimidates face down, then returns at end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, brutalAssaultRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(bloodrushBellowYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Rhinar, brutalAssaultRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(0);
    expectFabCard(Dash, snatchRed).toBeIn("banished").toBeFaceDown();

    Rhinar.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Dash, snatchRed).toBeIn("hand").toBeFaceUp();
  });

  it("boundary: a 5{p} discard does not intimidate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [bloodrushBellowYellow, brutalAssaultYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.play(bloodrushBellowYellow);
    game.untilIdle({ ordering: "listed" });

    expectFabCard(Rhinar, brutalAssaultYellow).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("boundary: an opponent's 6{p} discard during Rhinar's action phase does not trigger Rhinar", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [coronetPeak],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [brutalAssaultRed, snatchRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.activate(coronetPeak);
    Rhinar.target(dash);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Dash, brutalAssaultRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });

  it("timing: Rhinar's 6{p} discard during the opponent's action phase does not trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        head: [coronetPeak],
        hand: [snatchRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: rhinar, hand: [brutalAssaultRed], resourcePoints: 0, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Rhinar = game.as(rhinar);

    Dash.activate(coronetPeak);
    Dash.target(rhinar);
    game.untilIdle({ optionals: "decline", entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Rhinar, brutalAssaultRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveHandCount(1);
    expectFabCard(Dash, snatchRed).toBeIn("hand");
  });
});
