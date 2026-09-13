import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";

describe("Grinding Gears (EVO070) AAA", () => {
  it("happy: Action - 0 destroys the targeted hero's deck top", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: [nimblismBlue], deckTop: [snatchRed] },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);
    const Bravo = game.as(bravo);

    Teklo.play(grindingGearsBlue);
    game.untilIdle();
    Teklo.activate(grindingGearsBlue);
    game.untilIdle({ entityTargets: "pause" });
    Teklo.targetRequired(Bravo.cardsIn("deck", snatchRed)[0]!);
    game.untilIdle();

    expectFabCard(Bravo, snatchRed).toBeIn("graveyard");
  });

  it("boundary: declining crank leaves the steam counter so start-of-turn can keep this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(grindingGearsBlue, { crank: false });
    game.untilIdle();
    expectFabCard(Teklo, grindingGearsBlue).toHaveCounters(1, "steam");

    Teklo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("arena");
    expectFabCard(Teklo, grindingGearsBlue).toHaveCounters(0, "steam");
  });

  it("timing: after cranking, start of your turn destroys this with no steam left", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [grindingGearsBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(grindingGearsBlue);
    game.untilIdle();
    expectFabCard(Teklo, grindingGearsBlue).toHaveCounters(0, "steam");

    Teklo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("graveyard");
  });
});
