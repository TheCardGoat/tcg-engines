import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { hyperDriverYellow } from "./hyper-driver.ts";
import { hyperDriverBlue } from "./hyper-driver.ts";
import { hyperScrapperBlue } from "./hyper-scrapper.ts";

describe("Hyper Scrapper (EVO100) AAA", () => {
  it("happy: additional-cost X GY item-banish is still an unmigrated effect-cost", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hyperScrapperBlue],
        graveyard: [hyperDriverRed, hyperDriverYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.playAttack(hyperScrapperBlue)).toThrow(/unmigrated effect-cost/);
    expectFabCard(Dash, hyperScrapperBlue).toBeIn("hand");
    expectCombat(game).toBeClosed();
  });

  it("boundary: empty graveyard is the same unmigrated effect-cost trapdoor", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hyperScrapperBlue],
        graveyard: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.playAttack(hyperScrapperBlue)).toThrow(/unmigrated effect-cost/);
    expectFabCard(Dash, hyperScrapperBlue).toBeIn("hand");
  });

  it("timing: three Hyper Drivers in GY still cannot begin play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [hyperScrapperBlue],
        graveyard: [hyperDriverRed, hyperDriverYellow, hyperDriverBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expect(() => Dash.playAttack(hyperScrapperBlue)).toThrow(/unmigrated effect-cost/);
    expectFabCard(Dash, hyperScrapperBlue).toBeIn("hand");
  });
});
