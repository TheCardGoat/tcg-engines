import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { hyperDriverRed } from "./hyper-driver.ts";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverYellow } from "./hyper-driver.ts";
import { hyperDriverBlue } from "./hyper-driver.ts";
import { blessingOfIngenuityRed, blessingOfIngenuityBlue } from "./blessing-of-ingenuity.ts";

describe("blessing-of-ingenuity family AAA", () => {
  it("happy: start of your turn destroys this then puts up to 3 Hyper Drivers into the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], life: 20, deck: 6 },
      {
        hero: dash,
        arena: [blessingOfIngenuityRed],
        graveyard: [hyperDriverRed, hyperDriverYellow],
        banished: [hyperDriverBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).endTurn();
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Dash, blessingOfIngenuityRed).toBeIn("graveyard");
    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabCard(Dash, hyperDriverYellow).toBeIn("arena");
    expectFabCard(Dash, hyperDriverBlue).toBeIn("arena");
  });

  it("boundary: choosing none leaves Hyper Drivers where they were", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], life: 20, deck: 6 },
      {
        hero: dash,
        arena: [blessingOfIngenuityRed],
        graveyard: [hyperDriverRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).endTurn();
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Dash, blessingOfIngenuityRed).toBeIn("graveyard");
    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [blessingOfIngenuityRed],
        graveyard: [hyperDriverRed],
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.endTurn();
    game.untilIdle();
    expectFabCard(Dash, blessingOfIngenuityRed).toBeIn("arena");
    expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
  });

  it("pitch scale: the blue aura puts up to 1 Hyper Driver into the arena", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], life: 20, deck: 6 },
      {
        hero: dash,
        arena: [blessingOfIngenuityBlue],
        graveyard: [hyperDriverRed, hyperDriverYellow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).endTurn();
    game.untilIdle({ entityTargets: "maximum" });

    expectFabCard(Dash, blessingOfIngenuityBlue).toBeIn("graveyard");
    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectFabCard(Dash, hyperDriverYellow).toBeIn("graveyard");
  });
});
