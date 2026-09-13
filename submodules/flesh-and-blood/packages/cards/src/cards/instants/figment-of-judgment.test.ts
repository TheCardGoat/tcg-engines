import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { figmentOfJudgmentYellow } from "./figment-of-judgment.ts";

describe("Figment of Judgment (DTD006) AAA", () => {
  it("happy: entering the arena may turn a banished card face-down", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfJudgmentYellow],
        banished: [snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfJudgmentYellow);
    game.untilIdle({ optionals: "accept", entityTargets: "minimum" });

    expectFabCard(Prism, figmentOfJudgmentYellow).toBeIn("arena");
    expectFabCard(Prism, snatchRed).toBeBanished();
    expectFabCard(Prism, snatchRed).toBeFaceDown();
  });

  it("boundary: declining the enter optional leaves the banished card face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfJudgmentYellow],
        banished: [snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfJudgmentYellow);
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Prism, figmentOfJudgmentYellow).toBeIn("arena");
    expectFabCard(Prism, snatchRed).toBeBanished();
  });

  it("timing: with an empty banished zone the figment still enters the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [figmentOfJudgmentYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(figmentOfJudgmentYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Prism, figmentOfJudgmentYellow).toBeIn("arena");
  });
});
