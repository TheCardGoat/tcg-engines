/**
 * Event-reactive effects must be encoded as `type: "triggered"`.
 * Continuous state gates like `duringLink` / `duringPair` live in
 * `activation.conditions`; they are not timing markers.
 *
 * Coverage:
 *  - Triggered + event timing fires via `enqueueOwnCardTriggers`.
 *  - Same effect does NOT fire when the continuous precondition is
 *    unmet (e.g. unit isn't a Link Unit for a `duringLink` timing).
 *  - Pure constant effects are NOT enqueued as triggers — they
 *    stay in the passive / derived-state continuous-scan path.
 *  - The continuous scan does not apply triggered stat modifiers passively.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../index.ts";
import { markAsLinkUnit } from "../testing/command-test-helpers.ts";
import { enqueueOwnCardTriggers } from "./pending-effects.ts";
import { getEffectiveStats } from "../rules/derived-state.ts";

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

/**
 * Unit carrying a triggered effect with timing `["destroyed"]`.
 * Directive is a harmless `draw 1` so we can observe the fire without
 * needing combat plumbing. Fires via unitDestroyed event + duringLink
 * continuous gate.
 */
function makeDyingLinkUnit(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["destroyed"], conditions: [{ type: "duringLink" }] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【During Link】【Destroyed】Draw 1.",
  };
  return {
    cardNumber: `TEST-DYING-LINK-${Math.random().toString(36).slice(2, 8)}`,
    name: "Dying Link Unit",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 1,
    linkCondition: "[Synthetic Pilot]",
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function makePureConstantStatUnit(): UnitCard {
  const effect: CardEffect = {
    type: "constant",
    activation: {},
    directives: [
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: 1,
          duration: "permanent",
          target: { owner: "self" },
        },
      },
    ],
    sourceText: "This Unit gets AP+1.",
  };
  return {
    cardNumber: `TEST-PURE-CONST-${Math.random().toString(36).slice(2, 8)}`,
    name: "Pure Constant Unit",
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

function makeLinkAttackApDebuffUnit(): UnitCard {
  // Mirrors GD01-071 Gundam Pharact: `["attack"]` with a
  // statModifier directive. The point of the test is that the passive
  // scan must NOT apply the AP-2 continuously — only the queue fires it.
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["attack"], conditions: [{ type: "duringLink" }] },
    directives: [
      {
        action: {
          action: "statModifier",
          stat: "ap",
          amount: -2,
          duration: "thisBattle",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ],
    sourceText: "【During Link】【Attack】AP-2.",
  };
  return {
    cardNumber: `TEST-LINK-ATK-DEBUFF-${Math.random().toString(36).slice(2, 8)}`,
    name: "Link Attack Debuff Unit",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 3,
    hp: 4,
    linkCondition: "[Synthetic Pilot]",
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

function makeBasicEnemy(): UnitCard {
  return {
    cardNumber: `TEST-ENEMY-${Math.random().toString(36).slice(2, 8)}`,
    name: "Enemy",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 4,
    hp: 4,
    keywordEffects: [],
    rarity: "common",
  };
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("Pending effects — triggered effects with state conditions", () => {
  it("enqueues a triggered `destroyed` effect on unitDestroyed when linked", () => {
    const unitDef = makeDyingLinkUnit();
    const engine = GundamTestEngine.create({ play: [unitDef] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    // Pair a synthetic pilot so duringLink gate holds.
    markAsLinkUnit(engine, unitId);

    let observedKind: string | undefined;
    let observedType: string | undefined;
    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "unitDestroyed", cardId: unitId, ownerId: PLAYER_ONE },
        unitId,
        PLAYER_ONE,
        framework,
      );
      qLen = G.pendingEffects.length;
      const head = G.pendingEffects[G.pendingEffects.length - 1];
      observedKind = head?.kind;
      observedType = head?.effect.type;
    });

    expect(qLen).toBeGreaterThan(0);
    // deriveKind classifies as triggered (tier 1/2), not activated (tier 3).
    expect(observedKind).toBe("triggered");
    expect(observedType).toBe("triggered");
  });

  it("does NOT enqueue the same effect when the unit is not a Link Unit", () => {
    const unitDef = makeDyingLinkUnit();
    // Deploy with no paired pilot → not a Link Unit → duringLink gate fails.
    const engine = GundamTestEngine.create({ play: [unitDef] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let qLen = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueOwnCardTriggers(
        G,
        { type: "unitDestroyed", cardId: unitId, ownerId: PLAYER_ONE },
        unitId,
        PLAYER_ONE,
        framework,
      );
      qLen = G.pendingEffects.length;
    });

    expect(qLen).toBe(0);
  });

  it("does NOT enqueue a pure constant effect on any event — passive-scan only", () => {
    const unitDef = makePureConstantStatUnit();
    const engine = GundamTestEngine.create({ play: [unitDef] }, {});
    const unitId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let totalEnqueued = 0;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      for (const evt of [
        "unitDeployed",
        "unitDestroyed",
        "attackDeclared",
        "shieldDestroyed",
      ] as const) {
        enqueueOwnCardTriggers(
          G,
          { type: evt, cardId: unitId, ownerId: PLAYER_ONE },
          unitId,
          PLAYER_ONE,
          framework,
        );
      }
      totalEnqueued = G.pendingEffects.length;
    });

    expect(totalEnqueued).toBe(0);

    // Yet the passive continuous scan still picks up the AP+1.
    const g = engine.getG();
    const framework = engine["runtime"].getFrameworkReadAPI();
    const stats = getEffectiveStats(unitId, g, framework.cards, framework);
    expect(stats.ap).toBe(unitDef.ap + 1);
  });

  it("derived-state scan does NOT apply a triggered statModifier continuously", () => {
    // Regression guard for the double-fire concern: GD01-071 Pharact-
    // shaped effect (duringLink + attack + statModifier AP-2 target
    // opponent) must not constantly drain enemy AP while linked — it
    // should only fire on attackDeclared through the queue.
    const attacker = makeLinkAttackApDebuffUnit();
    const enemy = makeBasicEnemy();
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [enemy] });
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    markAsLinkUnit(engine, attackerId);

    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    const g = engine.getG();
    const framework = engine["runtime"].getFrameworkReadAPI();
    const stats = getEffectiveStats(enemyId, g, framework.cards, framework);
    // Enemy AP must be its base (4), not 4 - 2 = 2.
    expect(stats.ap).toBe(enemy.ap);
  });
});
