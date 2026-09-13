/**
 * AAA test for trigger:counter-removed.
 * Representative card: Hyper Driver Red (ARC036) — Mechanologist Item.
 * Triggered ability a2: "When it has none [steam counters], destroy it."
 * Trigger pattern: { name: "counter-removed", remaining: 0 }.
 *
 * Hyper Driver enters with 3 steam counters (enter-arena replacement) and
 * removes one per boost (ability a3, limit 1/turn). After three boosts across
 * three turns, the last counter is removed and the counter-removed trigger
 * destroys it.
 */
import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { hyperDriverRed } from "../../../../../../cards/src/cards/actions/hyper-driver.ts";
import { fastAndFuriousRed } from "../../../../../../cards/src/cards/actions/fast-and-furious.ts";

describe("trigger: counter-removed", () => {
  it(
    "AAA: Hyper Driver is destroyed when its last steam counter is removed (CR 8.3.9)",
    { timeout: 30_000 },
    () => {
      // Arrange — Dash will play Hyper Driver from hand (so its enter-arena
      // replacement grants 3 steam counters), then boost across 3 turns.
      const game = FabTestEngine.start(
        {
          hero: dash,
          hand: [hyperDriverRed, fastAndFuriousRed, fastAndFuriousRed, fastAndFuriousRed],
          deck: 6,
          resourcePoints: 1,
        },
        { hero: bravo, deck: 4 },
      );
      const Dash = game.as(dash);
      const Bravo = game.as(bravo);

      // Turn 1 — play Hyper Driver; its enter-arena replacement adds 3 steam counters.
      Dash.play(hyperDriverRed);
      expectFabCard(Dash, hyperDriverRed).toHaveCounters(3, "steam");
      Dash.endTurn();
      Bravo.endTurn();

      // Turn 2 — boost: Hyper Driver a3 removes 1 steam counter (2 remain).
      Dash.play(fastAndFuriousRed, { boost: true, target: Bravo.id });
      // `passBoth()` submits the explicit no-blockers declaration, then
      // advances this response-free combat window. Turns end via `endTurn()`.
      game.passBoth();
      expectFabCard(Dash, hyperDriverRed).toHaveCounters(2, "steam");
      Dash.endTurn();
      Bravo.endTurn();

      // Turn 3 — boost: removes another steam counter (1 remains).
      Dash.play(fastAndFuriousRed, { boost: true, target: Bravo.id });
      game.passBoth();
      expectFabCard(Dash, hyperDriverRed).toHaveCounters(1, "steam");
      Dash.endTurn();
      Bravo.endTurn();

      // Turn 4 — boost: removes the last steam counter (0 remain) → a2 destroys it.
      Dash.play(fastAndFuriousRed, { boost: true, target: Bravo.id });
      game.passBoth();

      // Assert — Hyper Driver was destroyed by its counter-removed trigger.
      expectFabCard(Dash, hyperDriverRed).toBeIn("graveyard");
    },
  );
});
