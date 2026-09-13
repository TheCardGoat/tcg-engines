import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { shiyanaDiamondGemini } from "./shiyana-diamond-gemini.ts";

/**
 * Shiyana, Diamond Gemini (CRU097) — Shapeshifter Hero — Young — 20hp.
 *
 * Printed: "You may have specialization cards of any hero in your deck.
 * At the beginning of your action phase, Shiyana becomes a copy of target
 * hero until the start of your next turn, and gains 'Cards you own are the
 * class of your hero in addition to their other class types.'"
 *
 * The copy is observed rule-visibly through the copied hero class on
 * Shiyana's card; the deckbuilding meta-static is out of engine scope.
 */

const opponentHero = dash;

describe("shiyana-diamond-gemini (CRU097) AAA", () => {
  it("happy: at the beginning of her action phase Shiyana becomes a copy of the target hero", () => {
    const game = FabTestEngine.start(
      { hero: shiyanaDiamondGemini, deck: 6 },
      { hero: opponentHero, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Shiyana = game.as(shiyanaDiamondGemini);

    // Pass the first turn; the trigger fires at the beginning of her next
    // action phase and asks for the hero to copy.
    Shiyana.endTurn();
    game.as(opponentHero).endTurn();

    game.advanceToDecision(Shiyana, "entity-target");
    Shiyana.targetRequired(game.as(opponentHero));
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Copied Dash's Mechanologist class until the start of her next turn.
    expectFabCard(Shiyana, shiyanaDiamondGemini).toHaveSupertype("Mechanologist");
    expectFabPlayer(Shiyana).toHaveLife(20);
  });

  it("boundary: the copy trigger does not fire during the opponent's turn", () => {
    const game = FabTestEngine.start(
      { hero: shiyanaDiamondGemini, deck: 6 },
      { hero: opponentHero, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Shiyana = game.as(shiyanaDiamondGemini);
    const Opponent = game.as(opponentHero);

    Shiyana.endTurn();

    // During Dash's turn Dash holds priority to act; no copy decision for
    // Shiyana is pending and she has not copied anything yet.
    expect(Opponent.hasPriority()).toBe(true);
    expectFabCard(Shiyana, shiyanaDiamondGemini).notToHaveSupertype("Mechanologist");
  });
});
