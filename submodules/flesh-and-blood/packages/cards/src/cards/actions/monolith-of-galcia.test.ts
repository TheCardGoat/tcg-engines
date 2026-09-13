import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { putOnIceBlue } from "./put-on-ice.ts";
import { nekria } from "../allies/nekria.ts";
import { cromai } from "../allies/cromai.ts";
import { monolithOfGalciaBlue } from "./monolith-of-galcia.ts";

/**
 * Monolith of Galcia (PEN225) — Ice Guardian Action, blue.
 *
 * Printed: Choose 1 or more;
 * - Destroy target frozen ally.
 * - Destroy target frozen aura.
 * - Destroy target frozen equipment.
 * - Destroy target frozen item.
 */

describe("Monolith of Galcia (PEN225) AAA", () => {
  it("happy: the frozen-ally mode destroys the frozen ally, not its unfrozen kin", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [putOnIceBlue, monolithOfGalciaBlue],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 6,
      },
      // Nekria is the sole freezable candidate; Cromai stands beside her as
      // the unfrozen kin the destroy mode must not touch.
      {
        hero: dash,
        arena: [nekria, cromai],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    // Name the "up to 1" freeze target at play time — an unnamed up-to
    // target defaults to declining (CR 1.8.5e), which would freeze nothing.
    Blaze.play(putOnIceBlue, {
      targetInstanceId: Dash.findCardInZone("arena", nekria),
    });
    game.helpers.resolveUntilIdle();

    Blaze.play(monolithOfGalciaBlue, { modeIndexes: [0] });
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nekria).toBeIn("graveyard");
    expectFabCard(Dash, cromai).toBeIn("arena");
  });

  it("boundary: printed 'Choose 1 or more' rejects an empty mode selection", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [monolithOfGalciaBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arena: [nekria], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);
    const Dash = game.as(dash);

    // The modal declaration demands at least one mode; a zero-selection
    // answer is rejected and the layer never resolves.
    expect(() => Blaze.play(monolithOfGalciaBlue, { modeIndexes: [] })).toThrow(
      /requires explicit modeIds or modeIndexes|at least one|minimum/i,
    );
    expectFabCard(Blaze, monolithOfGalciaBlue).toBeIn("hand");
    expectFabCard(Dash, nekria).toBeIn("arena");
  });
});
