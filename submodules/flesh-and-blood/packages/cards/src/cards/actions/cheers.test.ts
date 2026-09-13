import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cheersBlue } from "./cheers.ts";
import { tuffnut } from "../heroes/tuffnut.ts";

/**
 * Cheers! (SUP055) — Revered Action - Aura (blue).
 *
 * Printed: "Go again\nWhen this enters or leaves the arena, the crowd cheers
 * you.\nAt the start of your turn, destroy this."
 *
 * Rules: crowd cheers per CR 8.5.57 (once per turn); each cheer is observable
 * end-to-end through the Tuffnut SUP002 observer ("Whenever the crowd cheers
 * you, create a Toughness token"), so each leg mints one token:toughness. The
 * Toughness token (APS032) destroys itself at the start of its controller's
 * OPPONENT'S turn, so cheer #1's token pays out during Dash's turn while the
 * leave-arena cheer at Tuffnut's turn-2 start mints a fresh one — the
 * committed crowd-cheers event count is the unambiguous cheer ledger.
 */

const crowdCheersCount = (game: ReturnType<typeof FabTestEngine.start>) =>
  game.committedEvents().filter((event) => event.name === "crowd-cheers").length;

describe("Cheers! (SUP055) AAA", () => {
  it("happy: entering the arena draws the cheers (one Toughness) and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [cheersBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(cheersBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Tuffnut, cheersBlue).toBeIn("arena");
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
    expectFabPlayer(Tuffnut).toHaveAP(1);
  });

  it("boundary: the start-of-turn destroy is controller-scoped — the opponent's turn start leaves it seated", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [cheersBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(cheersBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Tuffnut's end turn rolls into Dash's turn start — SUP055-a2 watches
    // Tuffnut's own start phase only, so the aura survives the opponent's
    // turn (while the Toughness token from cheer #1 pays out, APS032-a1).
    Tuffnut.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabCard(Tuffnut, cheersBlue).toBeIn("arena");
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 0);
  });

  it("timing: the next own-turn start destroys this, and the leave-arena leg draws a second cheer", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [cheersBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Tuffnut = game.as(tuffnut);

    Tuffnut.play(cheersBlue);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    Tuffnut.endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    game.as(dash).endTurn();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    expectFabCard(Tuffnut, cheersBlue).toBeIn("graveyard");
    // Enter-arena cheer (#1) plus the leave-arena cheer fired by the
    // turn-start destroy (#2). Toughness #1 paid itself out during Dash's
    // turn, so one fresh Toughness remains — the cheer ledger counted two.
    expect(crowdCheersCount(game)).toBe(2);
    expectFabPlayer(Tuffnut).toHaveTokenCount("toughness", 1);
  });
});
