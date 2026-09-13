import { describe, expect, it } from "vite-plus/test";
import type { FabResolvedBindings } from "./continuous/ir.ts";
import { EMPTY_RULES_FACTS, evaluateFabRules } from "./rules-evaluator.ts";
import type { FabRulesBaseObject, FabRulesFacts } from "./rules-view.ts";
import { fabPlayerId } from "../game/identity.ts";

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

// Engine coverage for the two EG-2 has-status handlers (plan §5):
//   - revealed-attack-and-non-attack-action-this-way
//     (ARC084 Tome of the Arknight (Blue) reveal-cohort gate)
//   - completed-a-contract-this-turn
//     (DYN123 Pay Day (Blue) contract-completion gate)
//
// SET/CLEAR transitions exercised elsewhere and proven end-to-end by the
// co-located card trios in packages/cards:
//   - the reveal effect stamps the whole revealed cohort on the
//     `revealed-this-way` object binding (card-movement-effects.ts) and
//     proposeSequence threads step-1 event bindings into later conditional
//     steps (layerWithEventBindings) — the ARC084 trio drives the full
//     reveal → conditional path;
//   - the complete-contract reducer (reducers/mechanics.ts, CR 8.4.7 /
//     8.5.39a) stamps history.turn.completedAContract on the completing
//     player, and emptyFabTurnHistory resets it at the turn boundary — the
//     DYN123 trio drives contract completion via the public playline and
//     asserts the this-turn scope.
//
// STOPPED (EG-2, plan §5): prevented-damage-this-way (AHA015 Toe the Line /
// OMN169-171 Glide Through Starlight). "If you prevent damage this way" is an
// additional modification of the prevention effect (CR 6.4.10/6.4.10h) that
// fires at damage-event time; a play-resolution conditional cannot express it.
// The canonical engine path is prevention additionalModification
// {type:"create-token"} (continuous-rule-effects.ts + replacements/apply.ts).

type RevealedTypes = FabRulesBaseObject["base"]["typeBox"]["types"];
type RevealedSubtypes = FabRulesBaseObject["base"]["typeBox"]["subtypes"];

function revealedObject(
  instanceId: string,
  types: RevealedTypes,
  subtypes: RevealedSubtypes = [],
): FabRulesBaseObject {
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: "p1",
    controllerId: "p1",
    zone: { playerId: fabPlayerId("p1"), zone: "deck" },
    zoneIndex: 0,
    visibility: "public",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: null,
      typeBox: { metatypes: [], supertypes: [], types, subtypes },
      typeBoxes: [{ metatypes: [], supertypes: [], types, subtypes }],
      traits: [],
      textBoxIds: [],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    counters: [],
    markers: [],
    history: { moves: [] },
  };
}

function sourceObject(instanceId: string): FabRulesBaseObject {
  return revealedObject(instanceId, ["Action"]);
}

const revealedAttackAndNonAttackAction = {
  type: "and",
  conditions: [
    {
      type: "compare-amount",
      amount: {
        type: "count",
        what: "revealed-this-way",
        filter: { typeBox: { types: ["Action"], subtypes: ["Attack"] } },
      },
      comparison: { op: "gte", value: 1 },
    },
    {
      type: "compare-amount",
      amount: {
        type: "count",
        what: "revealed-this-way",
        filter: { typeBox: { types: ["Action"], excludeSubtypes: ["Attack"] } },
      },
      comparison: { op: "gte", value: 1 },
    },
  ],
} as const;

describe("revealed-attack-and-non-attack-action-this-way has-status handler", () => {
  it("is true when the revealed cohort has an attack action and a non-attack action", () => {
    const attackAction = revealedObject("revealed-1", ["Action"], ["Attack"]);
    const plainAction = revealedObject("revealed-2", ["Action"]);
    const source = sourceObject("source-1");
    const view = evaluateFabRules({
      objects: [attackAction, plainAction, source],
      atoms: [],
      facts: EMPTY_RULES_FACTS,
    });
    const context = {
      controllerId: "p1",
      source: source.ref,
      bindings: {
        ...emptyBindings,
        objects: { "revealed-this-way": [attackAction.ref, plainAction.ref] },
      },
    };
    expect(view.evaluateCondition(revealedAttackAndNonAttackAction, context)).toBe(true);
  });

  it("is false when only attack actions were revealed", () => {
    const attackAction = revealedObject("revealed-1", ["Action"], ["Attack"]);
    const attackAction2 = revealedObject("revealed-2", ["Action"], ["Attack"]);
    const source = sourceObject("source-1");
    const view = evaluateFabRules({
      objects: [attackAction, attackAction2, source],
      atoms: [],
      facts: EMPTY_RULES_FACTS,
    });
    const context = {
      controllerId: "p1",
      source: source.ref,
      bindings: {
        ...emptyBindings,
        objects: { "revealed-this-way": [attackAction.ref, attackAction2.ref] },
      },
    };
    expect(view.evaluateCondition(revealedAttackAndNonAttackAction, context)).toBe(false);
  });

  it("is false when the non-Attack card revealed is not an Action (e.g. an Instant)", () => {
    const attackAction = revealedObject("revealed-1", ["Action"], ["Attack"]);
    const instant = revealedObject("revealed-2", ["Instant"]);
    const source = sourceObject("source-1");
    const view = evaluateFabRules({
      objects: [attackAction, instant, source],
      atoms: [],
      facts: EMPTY_RULES_FACTS,
    });
    const context = {
      controllerId: "p1",
      source: source.ref,
      bindings: {
        ...emptyBindings,
        objects: { "revealed-this-way": [attackAction.ref, instant.ref] },
      },
    };
    expect(view.evaluateCondition(revealedAttackAndNonAttackAction, context)).toBe(false);
  });

  it("is false with nothing revealed this way (empty bindings)", () => {
    const source = sourceObject("source-1");
    const view = evaluateFabRules({ objects: [source], atoms: [], facts: EMPTY_RULES_FACTS });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };
    expect(view.evaluateCondition(revealedAttackAndNonAttackAction, context)).toBe(false);
  });

  it("boundary: an Attack-subtype card that is not an Action never counts as the attack action", () => {
    // An attack reaction carries the Attack subtype but its type is
    // "Attack Reaction", not "Action" — the printed text demands an attack
    // ACTION card (CR 2.14/2.10).
    const attackReaction = revealedObject("revealed-1", ["Attack Reaction"], ["Attack"]);
    const plainAction = revealedObject("revealed-2", ["Action"]);
    const source = sourceObject("source-1");
    const view = evaluateFabRules({
      objects: [attackReaction, plainAction, source],
      atoms: [],
      facts: EMPTY_RULES_FACTS,
    });
    const context = {
      controllerId: "p1",
      source: source.ref,
      bindings: {
        ...emptyBindings,
        objects: { "revealed-this-way": [attackReaction.ref, plainAction.ref] },
      },
    };
    expect(view.evaluateCondition(revealedAttackAndNonAttackAction, context)).toBe(false);
  });

  it("boundary: also honors the plain `revealed` object binding channel", () => {
    // revealed-this-way-attack-reaction-card reads both channels; keep the
    // cohort semantics symmetric for reveals routed through `revealed`.
    const attackAction = revealedObject("revealed-1", ["Action"], ["Attack"]);
    const plainAction = revealedObject("revealed-2", ["Action"]);
    const source = sourceObject("source-1");
    const view = evaluateFabRules({
      objects: [attackAction, plainAction, source],
      atoms: [],
      facts: EMPTY_RULES_FACTS,
    });
    const context = {
      controllerId: "p1",
      source: source.ref,
      bindings: {
        ...emptyBindings,
        objects: { revealed: [attackAction.ref, plainAction.ref] },
      },
    };
    expect(view.evaluateCondition(revealedAttackAndNonAttackAction, context)).toBe(true);
  });
});

describe("completed-a-contract-this-turn has-status handler", () => {
  it("is true when the completing player's turn fact is set", () => {
    const source = sourceObject("pay-day");
    const view = evaluateFabRules({
      objects: [source],
      atoms: [],
      facts: {
        ...EMPTY_RULES_FACTS,
        playerCompletedAContractThisTurn: { p1: true },
      } satisfies FabRulesFacts,
    });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "completed-a-contract-this-turn" },
        context,
      ),
    ).toBe(true);
  });

  it("is false when no contract was completed this turn (fact unset)", () => {
    const source = sourceObject("pay-day");
    const view = evaluateFabRules({ objects: [source], atoms: [], facts: EMPTY_RULES_FACTS });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "completed-a-contract-this-turn" },
        context,
      ),
    ).toBe(false);
  });

  it("boundary: an opponent's completion does not satisfy the controller's gate", () => {
    // CR 8.5.39a: only the contracted player completes the contract.
    const source = sourceObject("pay-day");
    const view = evaluateFabRules({
      objects: [source],
      atoms: [],
      facts: {
        ...EMPTY_RULES_FACTS,
        playerCompletedAContractThisTurn: { p2: true },
      } satisfies FabRulesFacts,
    });
    const context = { controllerId: "p1", source: source.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "completed-a-contract-this-turn" },
        context,
      ),
    ).toBe(false);
  });
});
