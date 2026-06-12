/**
 * `recoverHP` action emits the `unitHealed` game event, which enqueues
 * triggered effects whose timing includes `whenHealed` — both on the
 * healed card itself and on any in-play observer.
 *
 * This is the own-card + observer parity test for the new event, modelled
 * on the `unitDestroyed` enqueue pattern in
 * `pending-effects-constant-events.test.ts`.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE } from "../../index.ts";
import { handleRecoverHPAction } from "./handlers/combat.ts";

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

/**
 * Unit carrying a triggered `whenHealed` effect. Directive is a harmless
 * `draw 1` — we only care that the effect lands on the pending-effects
 * queue when the unit is healed.
 */
function makeHealListenerUnit(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["whenHealed"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【When Healed】Draw 1.",
  };
  return {
    cardNumber: `TEST-HEAL-SELF-${Math.random().toString(36).slice(2, 8)}`,
    name: "Heal Self Listener",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function makeObserverUnit(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["whenHealed"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【When Healed】Draw 1.",
  };
  return {
    cardNumber: `TEST-HEAL-OBS-${Math.random().toString(36).slice(2, 8)}`,
    name: "Heal Observer",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 3,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function makePlainTarget(): UnitCard {
  return {
    cardNumber: `TEST-HEAL-TGT-${Math.random().toString(36).slice(2, 8)}`,
    name: "Heal Target",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
  };
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("recoverHP → unitHealed event", () => {
  it("enqueues a `whenHealed` trigger on the healed card itself", async () => {
    const unit = makeHealListenerUnit();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    // Seed damage so the heal actually reduces the damage counter.
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G }) => {
      G.damage[unitId] = 2;
    });

    // Fire the recoverHP handler directly — test-only drain short-circuit.
    let qLen = 0;
    let observedType: string | undefined;
    let observedTriggerType: string | undefined;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleRecoverHPAction([unitId] as never, 1, {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: unitId,
      });
      qLen = G.pendingEffects.length;
      const head = G.pendingEffects[G.pendingEffects.length - 1];
      observedType = head?.effect.type;
      observedTriggerType = head?.trigger?.type as string | undefined;
    });

    expect(qLen).toBeGreaterThan(0);
    expect(observedType).toBe("triggered");
    expect(observedTriggerType).toBe("unitHealed");
  });

  it("enqueues a `whenHealed` trigger on an in-play observer", async () => {
    const target = makePlainTarget();
    const observer = makeObserverUnit();
    const engine = GundamTestEngine.create({ play: [target, observer] }, {});
    const [targetId, observerId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea") as [
      string,
      string,
    ];

    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G }) => {
      G.damage[targetId] = 2;
    });

    let observerFired = false;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleRecoverHPAction([targetId] as never, 1, {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: targetId,
      });
      observerFired = G.pendingEffects.some((pe) => pe.sourceCardId === observerId);
    });

    expect(observerFired).toBe(true);
  });

  it("does NOT enqueue when the heal is a no-op (no damage to remove)", async () => {
    const unit = makeHealListenerUnit();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      // damage[unitId] is undefined (0) — heal is a no-op.
      handleRecoverHPAction([unitId] as never, 3, {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: unitId,
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBe(0);
  });
});
