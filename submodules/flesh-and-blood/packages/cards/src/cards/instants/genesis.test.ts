import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prismSculptorOfArcLight } from "../heroes/prism-sculptor-of-arc-light.ts";
import { heraldOfEruditionYellow } from "../actions/herald-of-erudition.ts";
import { snatchRed } from "../actions/snatch.ts";
import { genesisYellow } from "./genesis.ts";

describe("Genesis (MON006) AAA", () => {
  it("happy: start-of-turn soul of a Light Illusionist creates Spectral Shield and draws", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: prismSculptorOfArcLight,
        arena: [genesisYellow],
        hand: [heraldOfEruditionYellow],
        deck: [snatchRed],
        resourcePoints: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Prism, heraldOfEruditionYellow).toBeIn("soul");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 1);
    expect(Prism.zone("hand")).toContain(snatchRed.canonicalId);
  });

  it("boundary: declining the soul put creates no Spectral Shield and does not draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: prismSculptorOfArcLight,
        arena: [genesisYellow],
        hand: [heraldOfEruditionYellow],
        deck: [snatchRed],
        resourcePoints: 0,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Prism, heraldOfEruditionYellow).toBeIn("hand");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: prismSculptorOfArcLight,
        arena: [genesisYellow],
        hand: [heraldOfEruditionYellow],
        deck: [snatchRed],
        resourcePoints: 0,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prismSculptorOfArcLight);

    game.as(prismSculptorOfArcLight).endTurn();
    game.untilIdle();

    expectFabCard(Prism, heraldOfEruditionYellow).toBeIn("hand");
    expectFabPlayer(Prism).toHaveTokenCount("spectral-shield", 0);
    expectFabCard(Prism, genesisYellow).toBeIn("arena");
  });
});
