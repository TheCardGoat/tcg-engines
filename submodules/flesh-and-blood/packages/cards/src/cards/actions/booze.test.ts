import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { boozeBlue } from "./booze.ts";
import { kayoUnderhandedCheat } from "../heroes/kayo-underhanded-cheat.ts";

/**
 * Booze! (SUP117) — Reviled Action - Aura (blue).
 *
 * Printed: "Go again\nWhen this enters or leaves the arena, the crowd boos
 * you.\nAt the start of your turn, destroy this."
 *
 * Rules: crowd boos per CR 8.5.57 (once per turn); each boo is observable
 * end-to-end through the Kayo SUP063 observer ("Whenever the crowd boos you,
 * create a Vigor token"), so each leg mints one token:vigor. The Vigor token
 * (TCC107) destroys itself and grants one resource at its controller's next
 * turn start, so at the turn-2 start the first Vigor pays out while the
 * leave-arena boo mints a fresh one — the committed crowd-boos event count is
 * the unambiguous boo ledger.
 */

const crowdBoosCount = (game: ReturnType<typeof FabTestEngine.start>) =>
  game.committedEvents().filter((event) => event.name === "crowd-boos").length;

describe("Booze! (SUP117) AAA", () => {
  it("happy: entering the arena draws the boos (one Vigor) and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [boozeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(boozeBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Kayo, boozeBlue).toBeIn("arena");
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
    expectFabPlayer(Kayo).toHaveAP(1);
  });

  it("boundary: the start-of-turn destroy is controller-scoped — the opponent's turn start leaves it seated", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [boozeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(boozeBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Kayo's end turn rolls into Dash's turn start — SUP117-a2 watches Kayo's
    // own start phase only, so the aura survives the opponent's turn.
    Kayo.endTurn();
    expectFabCard(Kayo, boozeBlue).toBeIn("arena");
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
  });

  it("timing: the next own-turn start destroys this, and the leave-arena leg draws a second boo", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoUnderhandedCheat,
        hand: [boozeBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayoUnderhandedCheat);

    Kayo.play(boozeBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Kayo.endTurn();
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Kayo, boozeBlue).toBeIn("graveyard");
    // Enter-arena boo (#1) plus the leave-arena boo fired by the turn-start
    // destroy (#2). Vigor #1 paid itself out at the same turn start, so one
    // fresh Vigor remains — the boo ledger itself counted two.
    expect(crowdBoosCount(game)).toBe(2);
    expectFabPlayer(Kayo).toHaveTokenCount("vigor", 1);
  });
});
