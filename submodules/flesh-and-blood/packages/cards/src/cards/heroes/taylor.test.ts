import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { taylor } from "./taylor.ts";
import { ironrotHelm } from "../equipment/ironrot-helm.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";

/**
 * Taylor (LSS003) — Shapeshifter Hero — Young — 18hp.
 *
 * Printed: "You may have equipment of any class or talent in your inventory.
 * Each equipment in your starting inventory must have a different name.
 * At the start of your turn, you may banish an equipment you control. If you
 * do, equip a card of the same subtype from your inventory."
 *
 * The inventory rules are deckbuilding/table policy (out of engine scope).
 * The start-phase offer is proven here; the accept→banish→equip swap leg is
 * recorded as family trigger/taylor-start-phase-swap-targets-unavailable.
 */

const opponentHero = dash;

describe("taylor (LSS003) AAA", () => {
  it("core mechanic: the start-phase banish offer is optional — declining keeps the equipment", () => {
    const game = FabTestEngine.start(
      {
        hero: taylor,
        head: [ironrotHelm],
        inventory: [nullruneHood],
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Taylor = game.as(taylor);

    // Reach Taylor's next start phase, where the offer is presented.
    Taylor.endTurn();
    game.as(opponentHero).endTurn();

    game.advanceToDecision(Taylor, "boolean");
    Taylor.decline();
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Nothing was banished: the helm is still equipped.
    expectFabCard(Taylor, ironrotHelm).toBeIn("head");
    expectFabPlayer(Taylor).toHaveLife(18);
  });

  it("boundary: the opponent's turn does not present Taylor's start-phase offer", () => {
    const game = FabTestEngine.start(
      {
        hero: taylor,
        head: [ironrotHelm],
        inventory: [nullruneHood],
        deck: 6,
        hand: [],
      },
      { hero: opponentHero, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Taylor = game.as(taylor);
    const Opponent = game.as(opponentHero);

    Taylor.endTurn();

    // On the opponent's turn the opponent holds priority to act; the only
    // pending prompt belongs to the active player, not to Taylor's offer.
    expect(Opponent.hasPriority()).toBe(true);
  });
});
