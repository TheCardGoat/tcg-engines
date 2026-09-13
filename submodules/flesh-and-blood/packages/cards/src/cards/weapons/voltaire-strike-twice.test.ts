import { describe, expect, it } from "vitest";
import { FabTestEngine, type FabPlayerHandle } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { lexi } from "../heroes/lexi.ts";
import { voltaireStrikeTwice } from "./voltaire-strike-twice.ts";
import { boltNShotRed as boltNShot } from "../actions/bolt-n-shot.ts";

/**
 * Weapon behavior acceptance test — Voltaire, Strike Twice (ELE034).
 *
 * AAA trio:
 * - Happy: Instant activation puts arrow face-up into arsenal (2×/turn)
 * - Boundary: third activation same turn is rejected
 * - Timing: no combat chain opened (Instant ability)
 *
 * Hero: Lexi (ELE032) — Elemental/Ranger
 * Arrow fixture: Bolt'N Shot Red (ELE216) — Ranger/Arrow/Attack, cost 0
 * FLUENT API ONLY.
 */

/**
 * Walk a bow's 3-decision chain: the ability is queued on the rules stack
 * after activate(), so passBoth() is needed to start resolution. Then
 * resolveUntilIdle cannot handle effect-resolution with >1 option, so we
 * answer all three decisions manually.
 *
 * 1. Boolean — "use optional effect?"  (accept)
 * 2. Entity-target — "choose arrow from hand"  (pick first)
 * 3. Effect-resolution — "choose 1"  (pick first option)
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

describe("Voltaire, Strike Twice (ELE034) AAA", () => {
  // ── Happy path ────────────────────────────────────────────────────────────

  it("happy: first activation puts arrow face-up into arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(voltaireStrikeTwice);
    resolveBowDecisions(game, Lexi);

    expect(Lexi.zone("arsenal")).toContain(boltNShot.canonicalId);
  });

  it("happy: second activation same turn also succeeds (2×/turn limit)", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot, boltNShot],
        resourcePoints: 2,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    // First activation — arrow goes to the single arsenal slot.
    Lexi.activate(voltaireStrikeTwice);
    resolveBowDecisions(game, Lexi);
    expect(Lexi.zone("arsenal")).toHaveLength(1);

    // Second activation — within the 2×/turn limit. Arsenal capacity is 1
    // (base), so the move-card is a no-op; the arrow stays in hand.
    Lexi.activate(voltaireStrikeTwice);
    resolveBowDecisions(game, Lexi);
    expect(Lexi.zone("hand")).toHaveLength(1);
  });

  // ── Boundary ───────────────────────────────────────────────────────────────

  it("boundary: third activation same turn is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot, boltNShot, boltNShot],
        resourcePoints: 3,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(voltaireStrikeTwice);
    resolveBowDecisions(game, Lexi);

    Lexi.activate(voltaireStrikeTwice);
    resolveBowDecisions(game, Lexi);

    // Third exceeds the 2×/turn limit.
    Lexi.expectActivationRejected(voltaireStrikeTwice);
  });

  // ── Timing / interaction ───────────────────────────────────────────────────

  it("timing: activation is an Instant — no combat chain opened", () => {
    const game = FabTestEngine.start(
      {
        hero: lexi,
        weapon1: [voltaireStrikeTwice],
        hand: [boltNShot],
        resourcePoints: 1,
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Lexi = game.as(lexi);

    Lexi.activate(voltaireStrikeTwice);
    resolveBowDecisions(game, Lexi);

    expect(game.combat()?.open).toBeFalsy();
  });
});
