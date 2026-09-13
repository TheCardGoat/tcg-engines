import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { florian } from "../heroes/florian.ts";
import { germinateBlue } from "./germinate.ts";

/**
 * Germinate (ROS004) — Earth Runeblade Action, Florian Specialization, cost X.
 *
 * Printed: Create a Runechant or Embodiment of Earth token. Repeat this
 * process X more times. Gain X+1{h}
 */

describe("Germinate (ROS004) AAA", () => {
  it("happy: X=1 creates two tokens and gains 2{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [germinateBlue],
        resourcePoints: 1,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florian);

    Florian.play(germinateBlue, { xValue: 1 });
    game.passBoth();
    Florian.choose("runechant");
    Florian.choose("runechant");
    game.untilIdle();

    expectFabCard(Florian, germinateBlue).toBeIn("graveyard");
    expectFabPlayer(Florian).toHaveTokenCount("runechant", 2).toHaveLife(22);
  });

  it("boundary: X=0 still creates one token and gains 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [germinateBlue],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florian);

    Florian.play(germinateBlue, { xValue: 0 });
    game.passBoth();
    Florian.choose("runechant");
    game.untilIdle();

    expectFabCard(Florian, germinateBlue).toBeIn("graveyard");
    expectFabPlayer(Florian).toHaveTokenCount("runechant", 1).toHaveLife(21);
  });

  it("timing: Florian specialization does not block the play", () => {
    const game = FabTestEngine.start(
      {
        hero: florian,
        hand: [germinateBlue],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Florian = game.as(florian);

    Florian.play(germinateBlue, { xValue: 0 });
    expectFabCard(Florian, germinateBlue).toBeIn("stack");
    game.passBoth();
    Florian.choose("runechant");
    game.untilIdle();
    expectFabCard(Florian, germinateBlue).toBeIn("graveyard");
  });
});
