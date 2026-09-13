import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fang } from "../heroes/fang.ts";
import { forTheDracaiRed } from "../actions/for-the-dracai.ts";
import { obsidianFireVein } from "../weapons/obsidian-fire-vein.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { dragonscalerFlightPath } from "./dragonscaler-flight-path.ts";

/**
 * Dragonscaler Flight Path (HNT143) — Draconic Equipment Legs d1 Battleworn.
 *
 * Printed: Instant - {r}{r}{r}, destroy this: Target Draconic attack gets go
 * again. If it's a weapon or ally attack, you may attack with it an additional
 * time this turn. Costs {r} less per Draconic chain link you control.
 */

describe("Dragonscaler Flight Path (HNT143) AAA", () => {
  it("happy: destroy this to give a Draconic attack go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        legs: [dragonscalerFlightPath],
        hand: [forTheDracaiRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(forTheDracaiRed);
    game.advanceCombatTo("reaction");
    Fang.activate(dragonscalerFlightPath);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Fang, dragonscalerFlightPath).toBeIn("graveyard");
  });

  it("boundary: a non-Draconic attack is not a legal target", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        legs: [dragonscalerFlightPath],
        hand: [brutalAssaultBlue],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.playAttack(brutalAssaultBlue);
    game.advanceCombatTo("reaction");
    Fang.expectActivationRejected(dragonscalerFlightPath);
    expectFabCard(Fang, dragonscalerFlightPath).toBeIn("legs");
  });

  it("timing: a Draconic weapon attack may attack an additional time this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: fang,
        legs: [dragonscalerFlightPath],
        weapon1: [obsidianFireVein],
        resourcePoints: 5,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fang = game.as(fang);

    Fang.activateAttack(obsidianFireVein);
    game.advanceCombatTo("reaction");
    Fang.activate(dragonscalerFlightPath);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    game.closeCombat({ optionals: "decline" });

    Fang.expectActivationRejected(obsidianFireVein);
  });
});
