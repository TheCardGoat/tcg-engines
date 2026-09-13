import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { sigilOfCyclesBlue } from "./sigil-of-cycles.ts";

describe("Sigil of Cycles (ROS226) AAA", () => {
  it("happy: leaving the arena discards then draws", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [sigilOfCyclesBlue, nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfCyclesBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, sigilOfCyclesBlue).toBeIn("arena");
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: nimblismBlue.canonicalId });

    expectFabCard(Bravo, sigilOfCyclesBlue).toBeIn("graveyard");
    expectFabCard(Bravo, nimblismBlue).toBeIn("graveyard");
    expectFabCard(Bravo, snatchRed).toBeIn("hand");
  });

  it("boundary: an empty hand still destroys this and draws nothing extra", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfCyclesBlue], actionPoints: 1, deck: [snatchRed] },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(sigilOfCyclesBlue);
    game.helpers.resolveUntilIdle();
    Bravo.endTurn();
    Dash.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, sigilOfCyclesBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(0);
  });

  it("timing: go again refunds the play AP and this is not combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [sigilOfCyclesBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(sigilOfCyclesBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
