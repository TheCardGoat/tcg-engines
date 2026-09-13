import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { escalateBloodshedRed } from "./escalate-bloodshed.ts";

/**
 * Escalate Bloodshed (SEA253) — Warrior Instant - Aura, cost 0.
 *
 * Printed: "Whenever a hero draws a card during an action phase, they lose
 * 1{h}. / At the beginning of each hero's action phase, they draw a card. /
 * At the beginning of each hero's end phase, if a weapon did not attack this
 * turn, destroy this."
 *
 * The draw trigger binds the event actor, while each action-phase trigger uses
 * the current turn player. Those identities remain valid outside combat.
 */

describe("Escalate Bloodshed (SEA253) AAA", () => {
  it("happy: an action-phase draw makes the hero who drew lose 1 life", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [escalateBloodshedRed, snatchRed],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.play(escalateBloodshedRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabCard(Bravo, escalateBloodshedRed).toBeIn("arena");

    // Snatch hits the undefended Dash; its on-hit draw commits inside the
    // action phase, so SEA253-a1 queues a lose-life for that draw.
    Bravo.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    const names = game.committedEvents().map((event) => event.name);
    expect(names.filter((name) => name === "draw")).toHaveLength(1);
    expect(names.filter((name) => name === "lose-life")).toHaveLength(1);
    expect(Bravo.zone("hand")).toHaveLength(1); // the drawn card

    expectFabPlayer(Bravo).toHaveLife(19);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("timing: with no weapon attack this turn the end-phase destroy resolves", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [escalateBloodshedRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.play(escalateBloodshedRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });
    expectFabCard(Bravo, escalateBloodshedRed).toBeIn("arena");

    // No weapon attacked this turn — the printed gate HOLDS, so the
    // end-phase destroy resolves and the aura leaves the arena.
    Bravo.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, escalateBloodshedRed).toBeIn("graveyard");
  });
});
