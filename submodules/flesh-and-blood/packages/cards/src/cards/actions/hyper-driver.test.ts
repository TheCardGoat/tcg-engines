import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { throttleRed } from "./throttle.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { hyperDriverBlue } from "./hyper-driver.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { hyperDriverYellow } from "./hyper-driver.ts";

describe("Hyper Driver (DYN112) AAA", () => {
  it("happy: this enters the arena with 1 steam counter", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverBlue);
    game.untilIdle();

    expectFabCard(Teklo, hyperDriverBlue).toBeIn("arena").toHaveCounters(1, "steam");
  });

  it("boundary: boosting a card removes the last steam and destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverBlue, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverBlue);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, hyperDriverBlue).toBeIn("graveyard");
    expectFabPlayer(Teklo).toHaveResourceCount(1);
  });

  it("timing: without boosting this stays in the arena with 1 steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverBlue, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverBlue);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: false });
    game.closeCombat();

    expectFabCard(Teklo, hyperDriverBlue).toBeIn("arena").toHaveCounters(1, "steam");
  });
});

/**
 * Hyper Driver Red (ARC036) — Mechanologist Action Item.
 *
 * Printed: This enters the arena with 3 steam counters. When it has none,
 * destroy it. Once per turn, when you boost a card, remove a steam counter
 * from this and gain {r}.
 */

describe("Hyper Driver (ARC036) AAA", () => {
  it("happy: this enters the arena with 3 steam counters", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverRed);
    game.untilIdle();

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
  });

  it("boundary: boosting a card removes 1 steam and gains {r} without destroying this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverRed, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverRed);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(2, "steam");
    expectFabPlayer(Teklo).toHaveResourceCount(1);
  });

  it("timing: without boosting this keeps 3 steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverRed, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverRed);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: false });
    game.closeCombat();

    expectFabCard(Teklo, hyperDriverRed).toBeIn("arena").toHaveCounters(3, "steam");
  });
});

describe("Hyper Driver (DYN111) AAA", () => {
  it("happy: this enters the arena with 2 steam counters", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverYellow);
    game.untilIdle();

    expectFabCard(Teklo, hyperDriverYellow).toBeIn("arena").toHaveCounters(2, "steam");
  });

  it("boundary: boosting a card removes 1 steam and gains {r} without destroying this", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverYellow, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverYellow);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: true });
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Teklo, hyperDriverYellow).toBeIn("arena").toHaveCounters(1, "steam");
    expectFabPlayer(Teklo).toHaveResourceCount(1);
  });

  it("timing: without boosting this keeps 2 steam", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [hyperDriverYellow, throttleRed],
        deck: [grindingGearsBlue],
        resourcePoints: 3,
        actionPoints: 2,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.play(hyperDriverYellow);
    game.untilIdle();
    Teklo.attackWith(throttleRed, { boost: false });
    game.closeCombat();

    expectFabCard(Teklo, hyperDriverYellow).toBeIn("arena").toHaveCounters(2, "steam");
  });
});
