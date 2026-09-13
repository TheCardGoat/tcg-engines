import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { clampPressBlue } from "./clamp-press.ts";
import { quantumProcessorYellow } from "./quantum-processor.ts";

describe("Quantum Processor (EVO072) AAA", () => {
  it("happy: Instant puts a cost-0 Mechanologist item from hand into the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [quantumProcessorYellow, grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(quantumProcessorYellow, { crank: false });
    game.untilIdle();
    Teklo.activate(quantumProcessorYellow);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Teklo, grindingGearsBlue).toBeIn("arena");
  });

  it("boundary: a cost-2 Mechanologist item stays in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [quantumProcessorYellow, clampPressBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(quantumProcessorYellow, { crank: false });
    game.untilIdle();
    Teklo.activate(quantumProcessorYellow);
    game.untilIdle();

    expectFabCard(Teklo, clampPressBlue).toBeIn("hand");
  });

  it("timing: start of your turn destroys this after crank leaves no steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [quantumProcessorYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(quantumProcessorYellow);
    game.untilIdle();
    Teklo.endTurn();
    game.untilIdle();
    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Teklo, quantumProcessorYellow).toBeIn("graveyard");
  });
});
