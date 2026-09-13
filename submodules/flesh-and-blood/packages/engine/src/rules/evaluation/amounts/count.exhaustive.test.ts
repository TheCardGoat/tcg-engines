import { describe, expect, it } from "vite-plus/test";
import { evaluateAmount } from "../evaluate-amount.ts";
import type { FabEvalContext, FabRulesFacts } from "../../rules-view.ts";
import { createMutableObject, refKey } from "../mutable.ts";
import type { FabRulesBaseObject } from "../../rules-view.ts";
import { fabPlayerId } from "../../../game/identity.ts";
import { EMPTY_RULES_FACTS } from "../../rules-evaluator.ts";
import { FabRulesEvaluationError } from "../errors.ts";

function handCard(
  instanceId: string,
  controllerId: string,
  numeric: FabRulesBaseObject["base"]["numeric"] = {},
): FabRulesBaseObject {
  const playerId = fabPlayerId(controllerId);
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: playerId,
    controllerId: playerId,
    zone: { playerId, zone: "hand" },
    zoneIndex: 0,
    visibility: "private",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: "red",
      typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: [] },
      typeBoxes: [{ metatypes: [], supertypes: [], types: ["Action"], subtypes: [] }],
      traits: [],
      textBoxIds: [],
      numeric,
      keywords: [],
      abilities: [],
    },
    counters: [],
    markers: [],
    history: { moves: [] },
  };
}

function evalContext(facts: Partial<FabRulesFacts> = {}): FabEvalContext {
  return {
    controllerId: "p1",
    source: null,
    bindings: { numbers: {}, objects: {}, strings: {} },
    facts: { ...EMPTY_RULES_FACTS, ...facts },
  } satisfies FabEvalContext;
}

describe("evaluateAmount count exhaustiveness", () => {
  it("evaluateAmount counts cards-in-hand for the controller", () => {
    const controllerId = "p1";
    const a = createMutableObject(handCard("c1", controllerId));
    const b = createMutableObject(handCard("c2", controllerId));
    const objects = new Map([
      [refKey(a.input.ref), a],
      [refKey(b.input.ref), b],
    ]);
    expect(
      evaluateAmount(
        { type: "count", what: "cards-in-hand", player: "controller" },
        evalContext({ playerLife: { p1: 20, p2: 20 } }),
        objects,
      ),
    ).toBe(2);
  });

  it("evaluateAmount counts seated heroes for heroes-started-game", () => {
    expect(
      evaluateAmount(
        { type: "count", what: "heroes-started-game" },
        evalContext({
          playerLife: { p1: 20, p2: 20 },
          heroRefs: {
            p1: { instanceId: "h1", incarnation: 1 },
            p2: { instanceId: "h2", incarnation: 1 },
          },
        }),
        new Map(),
      ),
    ).toBe(2);
  });

  it("evaluateAmount counts the trailing chain-link hit run", () => {
    const combat = {
      attack: { instanceId: "atk", incarnation: 1 },
      previousAttack: null,
      attackingPlayerId: "p1",
      defendingPlayerId: "p2",
      heroTargetPlayerId: "p2",
      attackTarget: null,
      chainLinkNumber: 3,
      closedLinkHits: [false, true],
      resolvedAttacks: [],
      didHit: true,
      defending: [],
      defendedFromHand: false,
      playedCardOrActivatedAbilityThisReactionStep: false,
      attackReactionPlayedOrActivated: false,
    } satisfies NonNullable<FabRulesFacts["combat"]>;
    expect(
      evaluateAmount(
        { type: "count", what: "consecutive-chain-links-that-hit" },
        evalContext({ combat }),
        new Map(),
      ),
    ).toBe(2);
  });

  it("evaluateAmount reads greatest-base-stat-among from the declared property", () => {
    const controllerId = "p1";
    const a = createMutableObject(handCard("c1", controllerId, { power: 3, defense: 5 }));
    const b = createMutableObject(handCard("c2", controllerId, { power: 7, defense: 1 }));
    const objects = new Map([
      [refKey(a.input.ref), a],
      [refKey(b.input.ref), b],
    ]);
    const context = evalContext({ playerLife: { p1: 20, p2: 20 } });
    expect(
      evaluateAmount(
        { type: "count", what: "greatest-base-stat-among", property: "defense" },
        context,
        objects,
      ),
    ).toBe(5);
    expect(() =>
      evaluateAmount({ type: "count", what: "greatest-base-stat-among" }, context, objects),
    ).toThrow(FabRulesEvaluationError);
  });

  it("evaluateAmount sums the printed base defense of cards discarded this way", () => {
    const a = createMutableObject(handCard("c1", "p1", { defense: 2 }));
    const b = createMutableObject(handCard("c2", "p1", { defense: 3 }));
    a.properties.numeric.defense = 9;
    const objects = new Map([
      [refKey(a.input.ref), a],
      [refKey(b.input.ref), b],
    ]);
    const context = {
      ...evalContext(),
      bindings: {
        numbers: {},
        objects: { "discarded-this-way": [a.input.ref, b.input.ref] },
        strings: {},
      },
    } satisfies FabEvalContext;

    expect(
      evaluateAmount(
        { type: "count", what: "discarded-this-way", property: "defense" },
        context,
        objects,
      ),
    ).toBe(5);
  });
});
