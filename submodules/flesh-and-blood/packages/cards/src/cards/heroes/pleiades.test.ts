import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { tensionInTheAirRed } from "../instants/tension-in-the-air.ts";
import { momentMaker } from "../weapons/moment-maker.ts";
import { pleiades } from "./pleiades.ts";

/**
 * Hero behavior acceptance test — Pleiades (APS002) with Moment Maker (APS003).
 *
 * Printed ability: Instant — {t}, remove a suspense counter from an aura you
 * control: You may put a suspense counter on an aura of suspense you control.
 */

const opponentHero = dash;

describe("pleiades + moment-maker AAA", () => {
  it("moves a suspense counter between chosen auras through the printed instant", () => {
    const game = FabTestEngine.start(
      { hero: pleiades, arena: [tensionInTheAirRed, tensionInTheAirRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Pleiades = game.as(pleiades);
    const [source, destination] = Pleiades.cardsIn("arena", tensionInTheAirRed);
    expect(source).toBeDefined();
    expect(destination).toBeDefined();
    expectFabCard(Pleiades, source!).toHaveCounters(2, "suspense");
    expectFabCard(Pleiades, destination!).toHaveCounters(2, "suspense");

    // The instant's activation surfaces the exact source-cost choice among
    // multiple legal auras — keep the declaration prompt visible.
    Pleiades.activate(pleiades);
    game.advanceToDecision(Pleiades, "entity-target");
    Pleiades.chooseTargets(source!);
    game.advanceToDecision(Pleiades, "boolean");
    Pleiades.chooseBoolean(true);
    game.advanceToDecision(Pleiades, "entity-target");
    Pleiades.chooseTargets(destination!);
    game.passBoth();

    expectFabCard(Pleiades, pleiades).toBeTapped();
    expectFabCard(Pleiades, source!).toHaveCounters(1, "suspense");
    expectFabCard(Pleiades, destination!).toHaveCounters(3, "suspense");
    expectFabPlayer(Pleiades).toHaveAP(1);
  });

  it("declines the optional placement after paying the counter-removal cost", () => {
    const game = FabTestEngine.start(
      { hero: pleiades, arena: [tensionInTheAirRed], deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Pleiades = game.as(pleiades);
    const [aura] = Pleiades.cardsIn("arena", tensionInTheAirRed);
    expect(aura).toBeDefined();

    Pleiades.activate(pleiades);
    game.advanceToDecision(Pleiades, "boolean");
    Pleiades.chooseBoolean(false);
    game.passBoth();

    expectFabCard(Pleiades, aura!).toHaveCounters(1, "suspense");
    expectFabCard(Pleiades, pleiades).toBeTapped();
  });

  it("rejects the instant when no aura has a suspense counter to remove", () => {
    const game = FabTestEngine.start(
      { hero: pleiades, deck: 6 },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(pleiades).expectActivationRejected(pleiades);
  });

  it("uses Moment Maker at its three-suspense-aura threshold", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiades,
        weapon1: [momentMaker],
        arena: [tensionInTheAirRed, tensionInTheAirRed, tensionInTheAirRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Pleiades = game.as(pleiades);

    Pleiades.activate(momentMaker);
    game.passBoth();
    game.passBoth();

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    game.helpers.resolveRestOfCombat();
  });
});
