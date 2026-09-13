import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { nimblismBlue } from "./nimblism.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { quantumProcessorYellow } from "./quantum-processor.ts";
import { prismaticLensYellow } from "./prismatic-lens.ts";

describe("Prismatic Lens (EVO071) AAA", () => {
  it("happy: Instant reveals deck top then puts a same-color Mechanologist item from banished on top", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [prismaticLensYellow],
        banished: [grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
        deckTop: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(prismaticLensYellow, { crank: false });
    game.untilIdle();
    Teklo.activate(prismaticLensYellow);
    game.untilIdle({ entityTargets: "minimum" });

    expect(Teklo.cardsIn("deck", grindingGearsBlue)).toHaveLength(1);
  });

  it("boundary: a yellow Mechanologist item in banished is not put on top of a blue reveal", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [prismaticLensYellow],
        banished: [quantumProcessorYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: [nimblismBlue],
        deckTop: [nimblismBlue],
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(prismaticLensYellow, { crank: false });
    game.untilIdle();
    Teklo.activate(prismaticLensYellow);
    game.untilIdle();

    expectFabCard(Teklo, quantumProcessorYellow).toBeIn("banished");
  });

  it("timing: start of your turn destroys this after crank leaves no steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [prismaticLensYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(prismaticLensYellow);
    game.untilIdle();

    Teklo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Teklo, prismaticLensYellow).toBeIn("graveyard");
  });
});
