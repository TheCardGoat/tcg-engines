import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabPlayerHandle } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { shiver } from "./shiver.ts";
import { boltNShotRed as boltNShot } from "../actions/bolt-n-shot.ts";

/**
 * Weapon behavior acceptance test — Shiver (ELE033).
 *
 * AAA trio:
 * - Happy: Instant activation puts arrow face-up into arsenal
 * - Boundary: no arrows in hand → optional effect declined
 * - Timing: once per turn
 *
 * Hero: Lexi (ELE032) — Elemental/Ranger
 * Arrow fixture: Bolt'N Shot Red (ELE216) — Ranger/Arrow/Attack, cost 0
 * FLUENT API ONLY.
 */

/**
 * Walk a bow's 3-decision chain: optional boolean → entity-target →
 * effect-resolution (choice). resolveUntilIdle cannot handle
 * effect-resolution with >1 option, so we answer all three manually.
 */
function resolveBowDecisions(game: FabTestEngine, player: FabPlayerHandle) {
  // After activate(), the rules layer is queued. A boolean decision may
  // already be pending (e.g. on 2nd+ activations), or a passBoth() may
  // be needed to trigger it (e.g. 1st activation). Handle both cases.
  if (!game.pendingDecision()) {
    game.passBoth();
  }

  // 1. Boolean: accept the optional "put arrow?" effect.
  player.expectDecision("boolean");
  game.answerDecision(player.id, { kind: "boolean", value: true });

  // 2. Entity-target: name an arrow from hand. A singleton is determined (CR 1.8.6c).
  const arrow = player.cardsIn("hand", boltNShot)[0];
  if (arrow) player.target(arrow);

  // 3. Effect-resolution: pick the first mode option.
  const erDecision = player.expectDecision("effect-resolution");
  game.answerDecision(player.id, {
    kind: "effect-resolution",
    optionId: erDecision.options[0]!.id,
  });
}

describe("Shiver (ELE033) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: activate costs 1 resource, puts arrow face-up into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [shiver],
        hand: [boltNShot],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(shiver);
    resolveBowDecisions(game, Lexi);

    // Arrow moved from hand to arsenal.
    expect(Lexi.zone("arsenal")).toContain(boltNShot.canonicalId);
    expect(Lexi.zone("hand")).not.toContain(boltNShot.canonicalId);
  });

  it("happy: activation is an Instant — no combat chain opened", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [shiver],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(shiver);
    // No arrows in hand → optional auto-declined, no decisions to answer.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(game.combat()?.open).toBeFalsy();
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: no arrows in hand — optional effect declined, nothing in arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [shiver],
        hand: [],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(shiver);
    // No arrows → optional auto-declined.
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Lexi.zone("arsenal")).toHaveLength(0);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: once per turn — second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [shiver],
        hand: [boltNShot],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(shiver);
    resolveBowDecisions(game, Lexi);

    Lexi.expectActivationRejected(shiver);
  });
});
