import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { cruelAmbitionRed } from "./cruel-ambition.ts";

/**
 * Cruel Ambition (SUP118) — Reviled Action, cost 0, go again.
 * Printed: "Create 3 Might tokens."
 */

describe("Cruel Ambition (Red) (SUP118) AAA", () => {
  it("happy: creates 3 Might tokens and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: kayoStrongArm, hand: [cruelAmbitionRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.play(cruelAmbitionRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Kayo).toHaveTokenCount("might", 3);
    expectFabPlayer(Kayo).toHaveAP(1);
    expectFabCard(Kayo, cruelAmbitionRed).toBeIn("graveyard");
  });

  it("boundary: the opponent receives none", () => {
    const game = FabTestEngine.start(
      { hero: kayoStrongArm, hand: [cruelAmbitionRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoStrongArm);

    Kayo.play(cruelAmbitionRed);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(game.as(dash)).toHaveTokenCount("might", 0);
  });
});
