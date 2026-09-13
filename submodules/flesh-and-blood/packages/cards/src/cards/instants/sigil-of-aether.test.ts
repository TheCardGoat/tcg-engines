import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iyslander } from "../heroes/iyslander.ts";
import { sigilOfAetherBlue } from "./sigil-of-aether.ts";

/**
 * Sigil of Aether (ROS168) — Wizard Instant Aura, Amp 1.
 *
 * Printed: At the beginning of your action phase, destroy this.
 * When this leaves the arena, deal 1 arcane damage to any target. If damage
 * is dealt this way, amp 1.
 */

describe("Sigil of Aether (ROS168) AAA", () => {
  it("happy: leaving the arena deals 1 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [sigilOfAetherBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(sigilOfAetherBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Iyslander, sigilOfAetherBlue).toBeIn("arena");

    Iyslander.endTurn();
    Dash.endTurn();
    game.untilIdle({ entityTargets: "pause" });
    Iyslander.target(Dash);
    game.helpers.resolveUntilIdle();

    expectFabCard(Iyslander, sigilOfAetherBlue).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(18);
  });

  it("boundary: this stays in the arena through the opponent's turn and deals no arcane yet", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [sigilOfAetherBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);
    const Dash = game.as(dash);

    Iyslander.play(sigilOfAetherBlue);
    game.helpers.resolveUntilIdle();
    Iyslander.endTurn();
    game.helpers.resolveUntilIdle();

    expectFabCard(Iyslander, sigilOfAetherBlue).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(19);
  });

  it("timing: playing this Instant does not spend the action point", () => {
    const game = FabTestEngine.start(
      { hero: iyslander, hand: [sigilOfAetherBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Iyslander = game.as(iyslander);

    Iyslander.play(sigilOfAetherBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Iyslander, sigilOfAetherBlue).toBeIn("arena");
    expectFabPlayer(Iyslander).toHaveAP(1);
  });
});
