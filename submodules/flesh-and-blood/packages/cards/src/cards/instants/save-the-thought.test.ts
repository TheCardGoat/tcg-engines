import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { saveTheThoughtBlue, saveTheThoughtRed, saveTheThoughtYellow } from "./save-the-thought.ts";

const variants = [
  { label: "Save the Thought Red (ROS179)", card: saveTheThoughtRed, count: 3 },
  { label: "Save the Thought Yellow (ROS180)", card: saveTheThoughtYellow, count: 2 },
  { label: "Save the Thought Blue (ROS181)", card: saveTheThoughtBlue, count: 1 },
] as const;

describe.each(variants)("$label family behavior AAA", ({ card, count }) => {
  it(`happy: shuffles eligible actions up to ${count} and creates a Ponder`, () => {
    const eligible = Array.from({ length: count }, () => nimblismBlue);
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [card],
        graveyard: eligible,
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(card);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expect(Oscilio.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
    expect(Oscilio.zone("deck")).toHaveLength(6 + count);
    expectFabToken(game, "ponder").toHaveCount(1);
    expectFabCard(Oscilio, card).toBeIn("graveyard");
  });

  it("boundary: an attack action remains in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [card],
        graveyard: [snatchRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(card);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum" });

    expectFabCard(Oscilio, snatchRed).toBeIn("graveyard");
    expect(Oscilio.zone("deck")).toContain(nimblismBlue.canonicalId);
    expectFabToken(game, "ponder").toHaveCount(1);
  });

  it("timing: choosing zero still creates a Ponder", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [card],
        graveyard: [nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(card);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Oscilio, nimblismBlue).toBeIn("graveyard");
    expectFabToken(game, "ponder").toHaveCount(1);
  });
});
