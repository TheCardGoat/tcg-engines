import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { riptide } from "../heroes/riptide.ts";
import { phoenixFlameRed } from "../actions/phoenix-flame.ts";
import { nimblismRed } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { collapsingTrapBlue } from "./collapsing-trap.ts";

/**
 * Collapsing Trap (OUT103) — Ranger Defense Reaction Trap, 3{d}.
 *
 * Printed: Legendary Riptide Specialization. When this defends an attack
 * with go again, the attacking hero discards their hand then draws that
 * many cards minus 1.
 *
 * Phoenix Flame carries the printed Go again keyword, so the attack already
 * has go again when the trap defends (Torrent of Tempo only gains it on hit).
 */

function seatTrapInArsenal(game: FabTestEngine, Riptide: ReturnType<FabTestEngine["as"]>): void {
  Riptide.must.playFromArsenal(collapsingTrapBlue);
  game.passBoth();
  game.untilIdle({ optionals: "decline" });
}

describe("Collapsing Trap (OUT103) family behavior AAA", () => {
  it("happy: a 2-card hand is discarded, then 1 card is drawn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arsenal: [{ card: phoenixFlameRed, state: { faceDown: false } }],
        hand: [nimblismRed, snatchRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed],
      },
      {
        hero: riptide,
        arsenal: [{ card: collapsingTrapBlue, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Riptide = game.as(riptide);

    Dash.playAttack(phoenixFlameRed, { from: "arsenal" });
    game.toReaction("defender");
    seatTrapInArsenal(game, Riptide);

    expectFabPlayer(Dash).toHaveHandCount(1); // discarded 2, drew 2-1
    expectFabPlayer(Riptide).toHaveLife(20); // Phoenix Flame is 0{p} here vs 3{d}.
  });

  it("boundary: defending an attack without go again does not cycle the hand", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, nimblismRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: riptide,
        arsenal: [{ card: collapsingTrapBlue, state: { faceDown: false } }],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Riptide = game.as(riptide);

    Dash.playAttack(snatchRed);
    game.toReaction("defender");
    seatTrapInArsenal(game, Riptide);

    // Snatch hit (4 vs 3{d}) and drew its on-hit card, so the hand is 2 —
    // the printed discard/draw cycle never ran without go again.
    expectFabPlayer(Dash).toHaveHandCount(2);
    expectFabCard(Dash, nimblismRed).toBeIn("hand");
  });
});
