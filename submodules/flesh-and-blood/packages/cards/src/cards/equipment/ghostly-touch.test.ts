import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { dunebreakerCenipaiBlue } from "../actions/dunebreaker-cenipai.ts";
import { demolitionCrewRed } from "../actions/demolition-crew.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ghostlyTouch } from "./ghostly-touch.ts";

describe("Ghostly Touch (UPR151) AAA", () => {
  it("happy: phantasm destroying an Illusionist attack puts a haunt counter on this", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [ghostlyTouch],
        hand: [dunebreakerCenipaiBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [demolitionCrewRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.attackWith(dunebreakerCenipaiBlue);
    game.as(dash).defendWith(demolitionCrewRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Prism, dunebreakerCenipaiBlue).toBeIn("graveyard");
    expectFabCard(Prism, ghostlyTouch).toHaveCounters(1, "haunt");
  });

  it("boundary: a non-Illusionist attack going to the graveyard does not add a haunt counter", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [ghostlyTouch],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.attackWith(snatchRed);
    game.closeCombat();

    expectFabCard(Prism, snatchRed).toBeIn("graveyard");
    expectFabCard(Prism, ghostlyTouch).toHaveCounters(0, "haunt");
  });

  it("timing: with no haunt counter the ally transform cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [ghostlyTouch],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    expect(() => Prism.activate(ghostlyTouch)).toThrow(/required counters/);
    expectFabCard(Prism, ghostlyTouch).toBeIn("arms");
    expectFabPlayer(Prism).toHaveAP(1);
  });
});
