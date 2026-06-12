/**
 * Destroy-event observer-scan + qualification-actor coverage
 * (rule 10-1-6 triggered-effect enqueue on `unitDestroyed`).
 *
 * Two gaps closed in this PR:
 *
 *  (1) `handleUnitDefeated` previously enqueued only the dying card's
 *      own 【Destroyed】 triggers. Observer triggers on other in-play
 *      cards (e.g. ST02-003 Heavyarms: "when this Unit destroys an
 *      enemy Unit …") must also enqueue for the same event — mirror of
 *      the `attackDeclared` pattern in `lifecycle/battle-phase/attack-step.ts`.
 *
 *  (2) `resolveQualificationActorId` learns a `unitDestroyed` →
 *      `event.cardId` mapping so cards like GD02-003 Gundam Mk-II
 *      (Titans), which print `activation.qualification` on a
 *      【Destroyed】 trigger, stop failing closed.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "../../index.ts";
import { enqueueObserverTriggers, enqueueOwnCardTriggers } from "./pending-effects.ts";

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

/**
 * Observer unit with a plain triggered 【Destroyed】 effect. The
 * directive is a harmless `draw 1` so we can observe enqueue without
 * additional plumbing. Fires on *any* unitDestroyed event — i.e. this
 * card is an observer of the dying card.
 */
function makeObserverOnDestroyUnit(): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: { timing: ["destroyed"] },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: "【Destroyed (observer)】Draw 1.",
  };
  return {
    cardNumber: `TEST-OBS-DESTROY-${Math.random().toString(36).slice(2, 8)}`,
    name: "Observer On Destroy",
    type: "unit",
    traits: [],
    level: 1,
    cost: 1,
    ap: 1,
    hp: 1,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

/**
 * Self-destroy unit with a `【Destroyed】` trigger gated by an
 * `activation.qualification` that inspects the destroyed unit's own
 * `level`. Shape mirrors GD02-003 Gundam Mk-II (Titans) qualification
 * but with a draw directive so the test remains harness-local.
 */
function makeQualifiedOnDestroyUnit(maxLevel: number, ownLevel: number): UnitCard {
  const effect: CardEffect = {
    type: "triggered",
    activation: {
      timing: ["destroyed"],
      qualification: { attribute: "level", comparison: "lte", value: maxLevel },
    },
    directives: [{ action: { action: "draw", count: 1 } }],
    sourceText: `【Destroyed】(if Lv≤${maxLevel}) Draw 1.`,
  };
  return {
    cardNumber: `TEST-QUAL-DESTROY-${Math.random().toString(36).slice(2, 8)}`,
    name: "Qualified Destroy Unit",
    type: "unit",
    traits: [],
    level: ownLevel,
    cost: 1,
    ap: 1,
    hp: 1,
    keywordEffects: [],
    rarity: "common",
    effects: [effect],
  };
}

// -----------------------------------------------------------------------------
// Gap 1 — observer scan for unitDestroyed
// -----------------------------------------------------------------------------

describe("enqueueObserverTriggers — unitDestroyed", () => {
  it("enqueues an in-play observer's 【Destroyed】 trigger when another unit is destroyed", () => {
    const observer = makeObserverOnDestroyUnit();
    const victim = makeObserverOnDestroyUnit(); // any unit will do as the dying card
    const engine = GundamTestEngine.create({ play: [observer, victim] }, {});
    const observerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const victimId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[1]!;

    let observerEnqueued = false;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueObserverTriggers(
        G,
        { type: "unitDestroyed", cardId: victimId, playerId: PLAYER_ONE },
        framework,
        victimId,
      );
      // The observer (not the dying card) must appear in the queue.
      observerEnqueued = G.pendingEffects.some((pe) => pe.sourceCardId === observerId);
    });

    expect(observerEnqueued).toBe(true);
  });

  it("skips the dying card itself — the own-triggers enqueue path handles that", () => {
    const victim = makeObserverOnDestroyUnit();
    const engine = GundamTestEngine.create({ play: [victim] }, {});
    const victimId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    let victimInQueue = false;
    engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
      enqueueObserverTriggers(
        G,
        { type: "unitDestroyed", cardId: victimId, playerId: PLAYER_ONE },
        framework,
        victimId,
      );
      victimInQueue = G.pendingEffects.some((pe) => pe.sourceCardId === victimId);
    });

    expect(victimInQueue).toBe(false);
  });
});

// -----------------------------------------------------------------------------
// Gap 2 — unitDestroyed qualification-actor mapping
// -----------------------------------------------------------------------------

describe("resolveQualificationActorId — unitDestroyed → event.cardId", () => {
  it("enqueues when the destroyed card itself satisfies the qualification", () => {
    // ownLevel 2 ≤ maxLevel 3 → qualification holds.
    const unitDef = makeQualifiedOnDestroyUnit(3, 2);
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

    expect(qLen).toBe(1);
  });

  it("fails closed when the destroyed card does not satisfy the qualification", () => {
    // ownLevel 5 > maxLevel 3 → qualification fails → no enqueue.
    const unitDef = makeQualifiedOnDestroyUnit(3, 5);
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
});

// -----------------------------------------------------------------------------
// End-to-end: observer scan wired through `handleUnitDefeated`
// -----------------------------------------------------------------------------

describe("handleUnitDefeated — observer scan end-to-end", () => {
  it("enqueues an opposing-side observer's 【Destroyed】 trigger via combat", () => {
    // Observer lives on P1; P2 has a frail unit that dies to P1 attack.
    // P1's observer should enqueue its draw trigger on the P2-unit destruction.
    const observer = makeObserverOnDestroyUnit();
    // Force observer to be ready and stronger so it kills the defender.
    const attacker = {
      ...makeObserverOnDestroyUnit(),
      ap: 5,
      hp: 5,
      effects: undefined,
      cardNumber: `TEST-ATT-${Math.random().toString(36).slice(2, 8)}`,
    } as UnitCard;
    const defender = {
      ...makeObserverOnDestroyUnit(),
      ap: 1,
      hp: 1,
      effects: undefined,
      cardNumber: `TEST-DEF-${Math.random().toString(36).slice(2, 8)}`,
    } as UnitCard;

    const engine = GundamTestEngine.create(
      { play: [attacker, observer], deck: 5 },
      { play: [defender] },
    );

    const p1Cards = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    const attackerId = p1Cards[0]!;
    const defenderId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;
    engine.getG().exhausted[attackerId] = false;

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.resolveCombat({ attackerId, target: defenderId });

    // Observer's draw fires: deck shrank by exactly 1.
    const deckAfter = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    expect(deckAfter).toBe(deckBefore - 1);
  });
});
