import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { professorTeklovossen } from "./professor-teklovossen.ts";
import { tekloBlaster } from "../weapons/teklo-blaster.ts";
import { evoCommandCenterYellow } from "../actions/evo-command-center.ts";
import { evoSteelSoulMemoryBlue } from "../actions/evo-steel-soul-memory.ts";

/**
 * Professor Teklovossen (TCC001) — Mechanologist Hero — Young — 20hp.
 *
 * Printed: "Evos cost {r} less to play for each opposing hero.
 * You may play Evos from your banished zone."
 *
 * Signature weapon: Teklo Blaster (TCC002).
 */

const opponentHero = dash;

describe("professor-teklovossen (TCC001) AAA", () => {
  it("core mechanic: an Evo costs {r} less (one opposing hero: 3{r} Evo plays for 2)", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        head: [evoSteelSoulMemoryBlue], // the Evo Base Head it upgrades
        hand: [evoCommandCenterYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Prof = game.as(professorTeklovossen);

    Prof.play(evoCommandCenterYellow);

    // The cost-3 Evo equips for 2{r} — one opposing hero discounts it by 1.
    expectFabPlayer(Prof).toHaveResourceCount(0);
    expectFabCard(Prof, evoCommandCenterYellow).toBeIn("head");
  });

  it("boundary: the discount alone is not enough — cost 3 Evo cannot play for 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        head: [evoSteelSoulMemoryBlue],
        hand: [evoCommandCenterYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Prof = game.as(professorTeklovossen);

    expectFabUnplayable(() => Prof.play(evoCommandCenterYellow), /cost|pay|resource|pitch/i);
    expectFabPlayer(Prof).toHaveHandCount(1);
  });

  it("core mechanic: may play an Evo from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        head: [evoSteelSoulMemoryBlue],
        banished: [evoCommandCenterYellow],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Prof = game.as(professorTeklovossen);

    Prof.play(evoCommandCenterYellow, { from: "banished" });

    expectFabCard(Prof, evoCommandCenterYellow).toBeIn("head");
    expectFabPlayer(Prof).toHaveResourceCount(0);
  });

  it("origin: the Evo discount applies when playing from arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        head: [evoSteelSoulMemoryBlue],
        arsenal: [evoCommandCenterYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, deck: 6 },
    );
    const Prof = game.as(professorTeklovossen);

    Prof.must.playFromArsenal(evoCommandCenterYellow);

    expectFabCard(Prof, evoCommandCenterYellow).toBeIn("head");
    expectFabPlayer(Prof).toHaveResourceCount(0);
  });

  it("signature weapon: Teklo Blaster (TCC002) attacks for {r}{r}{r} at power 2, once per turn", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        weapon1: [tekloBlaster],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prof = game.as(professorTeklovossen);

    Prof.activate(tekloBlaster);
    game.passBoth();

    expectFabPlayer(Prof).toHaveResourceCount(0);
    expectCombat(game).toBeOpen().toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });

    Prof.expectActivationRejected(tekloBlaster);
  });

  it("boundary: Teklo Blaster needs {r}{r}{r} — 2{r} with an empty hand cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: professorTeklovossen,
        weapon1: [tekloBlaster],
        resourcePoints: 2,
        actionPoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prof = game.as(professorTeklovossen);

    expectFabUnplayable(() => Prof.activate(tekloBlaster), /activation payment cannot be paid/i);
    expectCombat(game).toBeClosed();
  });
});
