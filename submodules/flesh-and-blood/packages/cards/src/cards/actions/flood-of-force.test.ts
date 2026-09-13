import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { craneDanceRed } from "./crane-dance.ts";
import { rushingRiverRed } from "./rushing-river.ts";
import { floodOfForceYellow } from "./flood-of-force.ts";

/**
 * Flood of Force (CRU055) — Ninja Action - Attack, cost 0, power 1, def 3.
 *
 * Printed text (i18n, source of truth):
 * "Combo - If Rushing River or Flood of Force was the last attack this
 * combat chain, when you attack with Flood of Force, reveal the top card of
 * your deck. If it's a card with combo, put it into your hand then Flood of
 * Force gains +3{p} and go again."
 *
 * /fab-rules Mode B handoff (behavior constraints):
 * - No printed Go again at card level; go again is granted ONLY by the combo
 *   effect (and only when the revealed top card has combo).
 * - The +3{p}/go-again reward is gated on the revealed card having combo.
 * - The revealed combo card is put into the attacker's hand.
 *
 * FIX-5 (plan §5): the module was re-encoded as the MST161 combo-gated
 * on-attack trigger with the MST075 reveal → binding-matches → conditional
 * idiom. The suite proves the full printed trio in both directions:
 *   1. Armed chain + combo top card → revealed card joins the hand, +3{p}
 *      lands, go again refunds the action point.
 *   2. Armed chain + non-combo top card → the revealed card stays in the
 *      deck, no +3{p}, no refund.
 *   3. Solo Flood (gate disarmed) → no reveal effect at all, even with a
 *      combo card on top: nothing moves, no +3{p}, no refund.
 */

const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

/**
 * Seat the armed combo on an open chain: Rushing River (link 1).
 * The controller's deck top is the LAST array element.
 */
function playArmedFlood(
  game: ReturnType<typeof FabTestEngine.start>,
): ReturnType<ReturnType<typeof FabTestEngine.start>["as"]> {
  const Bravo = game.as(bravo);
  Bravo.playAttack(rushingRiverRed); // Link 1: Rushing River.
  game.passBoth();
  game.advanceCombatTo("resolution");
  Bravo.playAttack(floodOfForceYellow); // Link 2: combo gate armed.
  game.passBoth();
  return Bravo;
}

describe("Flood of Force (CRU055) AAA", () => {
  it("happy: armed combo reveals a combo card into hand, +3{p} lands, go again refunds", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rushingRiverRed, floodOfForceYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, craneDanceRed], // top: combo card
        actionPoints: 2,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = playArmedFlood(game);

    // Resolve the flood link and close the chain.
    game.advanceCombatTo("resolution");
    game.helpers.resolveUntilIdle();

    // Printed: "If it's a card with combo, put it into your hand."
    expect(Bravo.zone("hand")).toContain(craneDanceRed.canonicalId);
    expect(Bravo.zone("deck")).not.toContain(craneDanceRed.canonicalId);

    // Printed: "then Flood of Force gains +3{p}" — Rushing 3 + Flood 1+3 = 7.
    expect(game.as(dash).life()).toBe(13);

    // Printed: "...and go again" — 2 AP: Rushing -1, Flood -1, Flood's
    // combo go again +1 => 1. (Rushing River itself has no printed go again
    // without its own Torrent-of-Tempo combo.)
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("boundary: a non-combo revealed top card stays in the deck — no +3{p}, no refund", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rushingRiverRed, floodOfForceYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed], // top: NO combo
        actionPoints: 2,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Dash = game.as(dash);
    const Bravo = playArmedFlood(game);

    // Resolve the flood link and close the chain.
    game.advanceCombatTo("resolution");
    game.helpers.resolveUntilIdle();

    // Printed: the reveal only hands off a combo card; Snatch stays on top.
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(snatchRed.canonicalId);

    // Printed damage: Rushing 3 + Flood 1 = 4 (no +3{p} for a non-combo top).
    expect(Dash.life()).toBe(16);

    // No go again without the combo leg: 2 AP: Rushing -1, Flood -1 => 0.
    expect(Bravo.actionPoints()).toBe(0);
  });

  it("boundary: solo Flood on a fresh chain never reveals — even with a combo card on top", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [floodOfForceYellow],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, craneDanceRed], // top: combo card
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      manual,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(floodOfForceYellow); // Fresh chain: combo gate NOT armed.
    game.passBoth();
    game.resolveCombatNoReactions();

    // Printed: the combo leg is disarmed — the top card never moves...
    expect(Bravo.zone("hand")).not.toContain(craneDanceRed.canonicalId);
    expect(Bravo.zone("deck")).toContain(craneDanceRed.canonicalId);
    // ...no +3{p} (Flood hits for its printed 1)...
    expect(Dash.life()).toBe(19);
    // ...and no card-level go again refunds the spent action point.
    expect(Bravo.actionPoints()).toBe(0);
  });
});
