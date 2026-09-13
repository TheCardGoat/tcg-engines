import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { prism } from "../heroes/prism.ts";
import { dash } from "../heroes/dash.ts";
import { hypothermiaBlue } from "./hypothermia.ts";
import { tranquilPassingRed } from "./tranquil-passing.ts";

/**
 * Tranquil Passing, Red (DYN221) — Illusionist Action - Aura, cost 2.
 * Printed: "When Tranquil Passing enters the arena, you may banish target
 * aura token or aura permanent with cost 3 or less controlled by an
 * opponent until Tranquil Passing leaves the arena."
 * Engine status: the while-in-arena banish is LIVE (gate widened +
 * leave-arena watcher registers and pattern-matches). The return step
 * (banished card re-entering when this leaves) is pinned — the watcher's
 * resolution binding does not survive to the fire-time layer
 * (engine/banish-until-source-leaves-return-binding).
 */

describe("Tranquil Passing, Red (DYN221) AAA", () => {
  it("happy: entering the arena banishes the opposing aura", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [tranquilPassingRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [hypothermiaBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(tranquilPassingRed);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: hypothermiaBlue.canonicalId,
      ordering: "listed",
    });

    expectFabCard(game.as(dash), hypothermiaBlue).toBeBanished();
    expectFabCard(Prism, tranquilPassingRed).toBeIn("arena");
  });

  it("boundary: declining the optional leaves the aura seated", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [tranquilPassingRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], arena: [hypothermiaBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(tranquilPassingRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(game.as(dash), hypothermiaBlue).toBeIn("arena");
    expectFabCard(Prism, tranquilPassingRed).toBeIn("arena");
  });

  it("timing: this itself seats in the arena either way", () => {
    const game = FabTestEngine.start(
      { hero: prism, hand: [tranquilPassingRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(tranquilPassingRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false, ordering: "listed" });

    expectFabCard(Prism, tranquilPassingRed).toBeIn("arena");
    expect(Prism.zone("arena")).toHaveLength(1);
  });
});
