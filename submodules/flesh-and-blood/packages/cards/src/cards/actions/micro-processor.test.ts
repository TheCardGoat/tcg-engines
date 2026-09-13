import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { dataDollMkii } from "../heroes/data-doll-mkii.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { nimblismBlue } from "./nimblism.ts";
import { microProcessorBlue } from "./micro-processor.ts";

/**
 * Micro-processor (EVR070) — Mechanologist Item, Data Doll Specialization.
 * Printed: once-per-turn Action 0: Opt 1 / draw then top / banish deck-top.
 * The first time you activate this each turn, gain 1 action point.
 */

describe("Micro-processor (EVR070) AAA", () => {
  it("happy: first activation each turn refunds the action point and banishes deck-top", () => {
    const game = FabTestEngine.start(
      {
        hero: dataDollMkii,
        arena: [microProcessorBlue],
        hand: [],
        deckTop: [nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Doll = game.as(dataDollMkii);

    Doll.activate(microProcessorBlue, {
      abilityId: "r8fjLMCFnQhFrRjwpMTgK:oncePerTurnAction0BanishTopDeck",
    });
    game.untilIdle();

    expectFabCard(Doll, nimblismBlue).toBeBanished();
    // Printed first-activation +1{a} does not refund the Action activation.
    expectFabPlayer(Doll).toHaveAP(0);
  });

  it("boundary: a second activation the same turn is illegal with 0 leftover AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dataDollMkii,
        arena: [microProcessorBlue],
        hand: [],
        deckTop: [nimblismBlue, grindingGearsBlue],
        actionPoints: 1,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Doll = game.as(dataDollMkii);

    Doll.activate(microProcessorBlue, {
      abilityId: "r8fjLMCFnQhFrRjwpMTgK:oncePerTurnAction0BanishTopDeck",
    });
    game.untilIdle();
    expectFabPlayer(Doll).toHaveAP(0);
    expectFabUnplayable(() =>
      Doll.activate(microProcessorBlue, {
        abilityId: "r8fjLMCFnQhFrRjwpMTgK:oncePerTurnAction0Opt1",
      }),
    );
  });

  it("timing: specialization does not block a non-Data-Doll fixture play", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [microProcessorBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dataDollMkii, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(microProcessorBlue);
    game.untilIdle();

    expectFabCard(Dash, microProcessorBlue).toBeIn("arena");
  });
});
