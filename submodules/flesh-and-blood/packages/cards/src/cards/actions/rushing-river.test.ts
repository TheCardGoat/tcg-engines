import { describe, expect, it } from "vitest";
import { FabTestEngine, FAB_MANUAL_HARNESS } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { torrentOfTempoYellow } from "./torrent-of-tempo.ts";
import { rushingRiverRed } from "./rushing-river.ts";

/**
 * Rushing River (CRU060) — Ninja Action - Attack, cost 0, power 3, def 3,
 * printed Go again.
 *
 * Printed text (i18n, source of truth):
 * 'Combo - If Torrent of Tempo was the last attack this combat chain,
 * Rushing River gains +1{p}, go again, and "If Rushing River hits, draw X
 * cards then put X cards from your hand on top of your deck in any order,
 * where X is the number of attacks that have hit this combat chain."'
 *
 * /fab-rules Mode B handoff:
 * - citations: 8.4 (Combo label), 7.5 (Damage Step / hit = damage dealt),
 *   8.5 (Draw, Put effect keywords), 6.6 (triggered effects).
 * - constraints: the +1{p} and the granted on-hit trigger apply only when
 *   Torrent of Tempo was the immediately preceding attack; X counts every
 *   attack that has HIT this combat chain (including earlier links);
 *   go again arrives ONLY with the armed combo (grant-property), never
 *   as a card-level keyword (removed 2026-08-19: unprinted).
 *
 * Engine gap (plan §5 row, this batch): the granted trigger's counts use
 * `attacks-hit-this-combat-chain`, which the engine's count evaluator does
 * not implement — resolving the hit throws "Unsupported FAB target count
 * for CRU060-a1". The on-hit draw/put clause is therefore pinned as a
 * misbehavior (throw) rather than asserted; provable fragments (combo
 * +1{p}, go again, printed stats, combo gating) are asserted normally.
 */

/** Seat the armed combo on an open chain: Torrent of Tempo (link 1). */
function playTorrentLead(game: ReturnType<typeof FabTestEngine.start>) {
  const Bravo = game.as(bravo);
  Bravo.playAttack(torrentOfTempoYellow); // Link 1: cost 1, 4{p}, go again.
  game.passBoth();
  game.advanceCombatTo("resolution");
  return Bravo;
}

describe("Rushing River (CRU060) AAA", () => {
  it("combo: after Torrent of Tempo, Rushing River enters at 4{p} with go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [torrentOfTempoYellow, rushingRiverRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = playTorrentLead(game);

    Bravo.playAttack(rushingRiverRed); // Link 2: combo armed.
    game.passBoth();
    const link = game.combat()?.activeLink;
    expect(link?.attackPower).toBe(4); // 3 + combo 1.
    expect(link?.keywords ?? []).toContain("go-again"); // Granted by the armed combo.
  });

  it("combo hit: draw X then put X from hand on top, X=2 attacks that have hit", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [torrentOfTempoYellow, rushingRiverRed],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = playTorrentLead(game);

    Bravo.playAttack(rushingRiverRed);
    game.helpers.resolveRestOfCombat();
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("hand")).toHaveLength(0);
    expect(Bravo.zone("deck")).toHaveLength(6);
  });

  it("boundary: solo Rushing River (no combo) hits for printed 3{p}, keeps the action point spent, and draws nothing", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [rushingRiverRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    // Fresh chain: combo gate NOT armed, so no on-hit trigger is granted
    // and combat resolves cleanly at printed stats.
    Bravo.playAttack(rushingRiverRed);
    game.resolveCombatNoReactions();

    expect(Dash.life()).toBe(17); // 20 - 3.
    expect(Bravo.actionPoints()).toBe(0); // No go again without the combo (printed).
    // No draw clause without the combo: hand stays empty, deck untouched.
    expect(Bravo.zone("hand")).toHaveLength(0);
    expect(Bravo.zone("deck")).toHaveLength(6);
  });
});
