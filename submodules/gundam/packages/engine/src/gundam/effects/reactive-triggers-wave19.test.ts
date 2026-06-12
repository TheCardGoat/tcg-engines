/**
 * Wave-19 reactive triggers: effectDamageReceived, apReducedByEnemy, exResourcePlaced
 *
 * Tests that the new event timings enqueue correctly through
 * `enqueueOwnCardTriggers` and `enqueueObserverTriggers`.
 */

import { describe, expect, it } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../index.ts";
import { enqueueOwnCardTriggers, enqueueObserverTriggers } from "./pending-effects.ts";
import { handleDealDamageAction } from "./handlers/combat.ts";
import { handleStatModifierAction } from "./handlers/modifiers.ts";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeEffectDamageListener(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["onEnemyEffectDamage"], restrictions: [{ type: "oncePerTurn" }] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "When this Unit receives enemy effect damage, draw 1.",
  };
  return {
    cardNumber: `TEST-EFFDMG-${Math.random().toString(36).slice(2, 8)}`,
    name: "Effect Damage Listener",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 2,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function makeApReductionListener(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["onApReducedByEnemy"], restrictions: [{ type: "oncePerTurn" }] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "When this Unit's AP is reduced by an enemy effect, draw 1.",
  };
  return {
    cardNumber: `TEST-APRED-${Math.random().toString(36).slice(2, 8)}`,
    name: "AP Reduction Listener",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 4,
    hp: 5,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function makeExResourceListener(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["onExResourcePlaced"], restrictions: [{ type: "oncePerTurn" }] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "When you place an EX Resource, draw 1.",
  };
  return {
    cardNumber: `TEST-EXRES-${Math.random().toString(36).slice(2, 8)}`,
    name: "EX Resource Listener",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 2,
    hp: 3,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

// ---------------------------------------------------------------------------
// effectDamageReceived
// ---------------------------------------------------------------------------

describe("effectDamageReceived timing", () => {
  it("enqueues on the damaged card's own effect via enqueueOwnCardTriggers", () => {
    const unit = makeEffectDamageListener();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    let triggerType: string | undefined;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "effectDamageReceived", cardId: unitId, ownerId: PLAYER_ONE, playerId: PLAYER_TWO },
        unitId,
        PLAYER_ONE,
        framework,
      );
      qLen = G.pendingEffects.length;
      triggerType = G.pendingEffects[G.pendingEffects.length - 1]?.trigger?.type as string;
    });

    expect(qLen).toBeGreaterThan(0);
    expect(triggerType).toBe("effectDamageReceived");
  });

  it("handleDealDamageAction fires effectDamageReceived for enemy damage", () => {
    const unit = makeEffectDamageListener();
    const engine = GundamTestEngine.create({ play: [unit], deck: 5 }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleDealDamageAction([unitId] as never, 1, {
        G,
        framework,
        sourcePlayerId: PLAYER_TWO,
        sourceCardId: "enemy-card",
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBeGreaterThan(0);
  });

  it("handleDealDamageAction does NOT fire for friendly damage", () => {
    const unit = makeEffectDamageListener();
    const engine = GundamTestEngine.create({ play: [unit], deck: 5 }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleDealDamageAction([unitId] as never, 1, {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: "own-card",
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// apReducedByEnemy
// ---------------------------------------------------------------------------

describe("apReducedByEnemy timing", () => {
  it("enqueues on the affected card's own effect via enqueueOwnCardTriggers", () => {
    const unit = makeApReductionListener();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    let triggerType: string | undefined;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "apReducedByEnemy", cardId: unitId, ownerId: PLAYER_ONE, playerId: PLAYER_TWO },
        unitId,
        PLAYER_ONE,
        framework,
      );
      qLen = G.pendingEffects.length;
      triggerType = G.pendingEffects[G.pendingEffects.length - 1]?.trigger?.type as string;
    });

    expect(qLen).toBeGreaterThan(0);
    expect(triggerType).toBe("apReducedByEnemy");
  });

  it("handleStatModifierAction fires apReducedByEnemy for enemy AP reduction", () => {
    const unit = makeApReductionListener();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleStatModifierAction([unitId] as never, "ap", -2, "thisTurn", {
        G,
        framework,
        sourcePlayerId: PLAYER_TWO,
        sourceCardId: "enemy-card",
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBeGreaterThan(0);
  });

  it("handleStatModifierAction does NOT fire for friendly AP reduction", () => {
    const unit = makeApReductionListener();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleStatModifierAction([unitId] as never, "ap", -1, "thisTurn", {
        G,
        framework,
        sourcePlayerId: PLAYER_ONE,
        sourceCardId: "own-card",
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBe(0);
  });

  it("handleStatModifierAction does NOT fire for positive AP modifier", () => {
    const unit = makeApReductionListener();
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      handleStatModifierAction([unitId] as never, "ap", 2, "thisTurn", {
        G,
        framework,
        sourcePlayerId: PLAYER_TWO,
        sourceCardId: "enemy-card",
      });
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// exResourcePlaced
// ---------------------------------------------------------------------------

describe("exResourcePlaced timing", () => {
  it("enqueues on an in-play observer via enqueueObserverTriggers", () => {
    const observer = makeExResourceListener();
    const engine = GundamTestEngine.create({ play: [observer] }, {});
    const observerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    let sourceCardId: string | undefined;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueObserverTriggers(
        G,
        { type: "exResourcePlaced", cardId: "ex-token", playerId: PLAYER_ONE, ownerId: PLAYER_ONE },
        framework,
        undefined,
      );
      qLen = G.pendingEffects.length;
      sourceCardId = G.pendingEffects[G.pendingEffects.length - 1]?.sourceCardId;
    });

    expect(qLen).toBeGreaterThan(0);
    expect(sourceCardId).toBe(observerId);
  });

  it("enqueues via enqueueOwnCardTriggers on the observer", () => {
    const observer = makeExResourceListener();
    const engine = GundamTestEngine.create({ play: [observer] }, {});
    const observerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "exResourcePlaced", cardId: "ex-token", playerId: PLAYER_ONE, ownerId: PLAYER_ONE },
        observerId,
        PLAYER_ONE,
        framework,
      );
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBeGreaterThan(0);
  });
});
