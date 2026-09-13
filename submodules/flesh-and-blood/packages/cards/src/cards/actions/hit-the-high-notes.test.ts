import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../heroes/briar.ts";
import { dash } from "../heroes/dash.ts";
import { channelMountIsenBlue } from "./channel-mount-isen.ts";
import { hitTheHighNotesRed } from "./hit-the-high-notes.ts";

/**
 * Hit the High Notes (AUA011) — Runeblade Action-Attack (red).
 *
 * Printed:
 *   If you've played or created an aura this turn, this gets +2{p}.
 *
 * fab-rules Mode B handoff:
 *   citations: CR 5.3 (resolution ability generates its effect when the
 *     card-layer resolves), CR 6.2 (layer-continuous modify-numeric bound
 *     to the attack itself), CR 8.6.4-class status facts (the
 *     played-or-created-aura-this-turn status is stamped by any aura
 *     play/creation this turn), CR 2.9 (power).
 *   behaviorConstraints:
 *     - The +2{p} applies only when the controller has played or created an
 *       aura THIS TURN; without it the attack reads its printed 4{p}.
 *     - The condition is satisfied by an earlier aura play the same turn.
 *     - The buffed power carries into the damage step.
 *   testImplications:
 *     - After playing Channel Mount Isen (a cost-0 Aura action) this turn,
 *       the attack reads 4 + 2 = 6 and deals 6 damage (20 → 14); with no
 *       aura played it reads 4 and deals 4 damage (20 → 16).
 */

describe("Hit the High Notes (AUA011) AAA", () => {
  it("happy: after playing an aura this turn, the attack gets +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountIsenBlue, hitTheHighNotesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    // Channel Mount Isen (cost-0 Aura action) stamps the
    // played-or-created-aura-this-turn fact.
    Briar.play(channelMountIsenBlue);
    game.helpers.resolveRestOfCombat();

    Briar.must.playAttack(hitTheHighNotesRed);
    game.advanceCombatTo("defend");
    // Base 4 + 2 from the aura condition = 6.
    expectCombat(game).toHaveAttackPower(6);
  });

  it("boundary: with no aura played this turn the attack stays at 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [hitTheHighNotesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.must.playAttack(hitTheHighNotesRed);
    game.advanceCombatTo("defend");
    // No aura this turn: printed base 4, no +2.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: the +2{p} carries into the damage step", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [channelMountIsenBlue, hitTheHighNotesRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const Dash = game.as(dash);

    Briar.play(channelMountIsenBlue);
    game.helpers.resolveRestOfCombat();

    Briar.must.playAttack(hitTheHighNotesRed);
    game.helpers.resolveRestOfCombat();

    // The buffed 6{p} attack resolves for 6 damage.
    expectFabPlayer(Dash).toHaveLife(14);
  });
});
