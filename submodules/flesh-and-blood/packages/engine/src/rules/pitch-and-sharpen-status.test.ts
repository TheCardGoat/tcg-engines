import { describe, expect, it } from "vite-plus/test";
import type { FabResolvedBindings } from "./continuous/ir.ts";
import { EMPTY_RULES_FACTS, evaluateFabRules } from "./rules-evaluator.ts";
import type { FabRulesBaseObject, FabRulesFacts } from "./rules-view.ts";
import { fabPlayerId } from "../game/identity.ts";

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

// Engine coverage for the three EG-1 has-status handlers (plan §5):
//   - sharpened (Display of Craftsmanship / Deadly Display / Zenith Blade)
//   - weapon-sharpened-this-turn (AHA010 Silverdrop Downpour (Red) play-cost gate)
//   - pitched-attack-and-non-attack-action-to-play-this (DYN172 Annals of Sutcliffe)
//
// SET transitions exercised elsewhere and proven end-to-end by the co-located
// card trios in packages/cards:
//   - the sharpen reducer (counters-status.ts, CR 8.5.58) stamps
//     {kind:"status", value:"sharpened-this-turn"} on the sword;
//   - payment.ts (activations) and finalize.ts (plays) stamp the pitch
//     binding only when BOTH an attack action and a non-attack action were
//     pitched to pay for this play/activation (CR 1.14.2d/1.14.3).
// CLEAR: no end-phase removal exists yet (CR 8.5.58a removes +1{p} counters
// at the beginning of the end phase) — a pre-existing engine limitation
// tracked separately; these tests characterize the current behavior.

function weaponObject(
  instanceId: string,
  markers: FabRulesBaseObject["markers"] = [],
): FabRulesBaseObject {
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: "p1",
    controllerId: "p1",
    zone: { playerId: fabPlayerId("p1"), zone: "weapon1" },
    zoneIndex: 0,
    visibility: "public",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: null,
      typeBox: { metatypes: [], supertypes: ["Warrior"], types: ["Weapon"], subtypes: ["Sword"] },
      typeBoxes: [
        { metatypes: [], supertypes: ["Warrior"], types: ["Weapon"], subtypes: ["Sword"] },
      ],
      traits: [],
      textBoxIds: [],
      numeric: { power: 3 },
      keywords: [],
      abilities: [],
    },
    counters: [],
    markers,
    history: { moves: [] },
  };
}

function reactionObject(
  instanceId: string,
  markers: FabRulesBaseObject["markers"] = [],
): FabRulesBaseObject {
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: "p1",
    controllerId: "p1",
    zone: { playerId: fabPlayerId("p1"), zone: "stack" },
    zoneIndex: 0,
    visibility: "public",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: "red",
      typeBox: {
        metatypes: [],
        supertypes: [],
        types: ["Attack Reaction"],
        subtypes: [],
      },
      typeBoxes: [{ metatypes: [], supertypes: [], types: ["Attack Reaction"], subtypes: [] }],
      traits: [],
      textBoxIds: [],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    counters: [],
    markers,
    history: { moves: [] },
  };
}

function combatFacts(attack: FabRulesBaseObject["ref"] | null): FabRulesFacts {
  return {
    ...EMPTY_RULES_FACTS,
    combat: attack
      ? {
          attack,
          previousAttack: null,
          attackingPlayerId: "p1",
          heroTargetPlayerId: null,
          defendingPlayerId: "p2",
          attackTarget: null,
          chainLinkNumber: 1,
          resolvedAttacks: [],
          didHit: false,
          defending: [],
          defendedFromHand: false,
          playedCardOrActivatedAbilityThisReactionStep: false,
          attackReactionPlayedOrActivated: false,
        }
      : null,
  };
}

describe("weapon-sharpened-this-turn has-status handler", () => {
  it("is true when the active attack's source weapon carries the sharpened marker", () => {
    // The weapon attack's proxy keeps sourceObjectId pointed at the seated
    // sword, so facts.combat.attack resolves to the weapon that the sharpen
    // reducer stamped (CR 8.5.58).
    const zenith = weaponObject("weapon-1", [{ kind: "status", value: "sharpened-this-turn" }]);
    const reaction = reactionObject("reaction-1");
    const view = evaluateFabRules({
      objects: [zenith, reaction],
      atoms: [],
      facts: combatFacts(zenith.ref),
    });
    // Mirrors playStaticResourceCostReduction: source is the reaction card
    // itself and bindings are empty — "the weapon" can only come from combat.
    const context = { controllerId: "p1", source: reaction.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition({ type: "has-status", status: "weapon-sharpened-this-turn" }, context),
    ).toBe(true);
  });

  it("is false while the chain is open but the weapon was not sharpened", () => {
    const zenith = weaponObject("weapon-1");
    const reaction = reactionObject("reaction-1");
    const view = evaluateFabRules({
      objects: [zenith, reaction],
      atoms: [],
      facts: combatFacts(zenith.ref),
    });
    const context = { controllerId: "p1", source: reaction.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition({ type: "has-status", status: "weapon-sharpened-this-turn" }, context),
    ).toBe(false);
  });

  it("is false with no open combat (no referent for 'the weapon')", () => {
    const reaction = reactionObject("reaction-1");
    const view = evaluateFabRules({
      objects: [reaction],
      atoms: [],
      facts: combatFacts(null),
    });
    const context = { controllerId: "p1", source: reaction.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition({ type: "has-status", status: "weapon-sharpened-this-turn" }, context),
    ).toBe(false);
  });

  it("reads only the active attack's weapon, never the evaluating source card", () => {
    // Boundary: a sharpened-this-turn marker stamped on the reaction card
    // itself must NOT satisfy the condition.
    const zenith = weaponObject("weapon-1");
    const stampedReaction = reactionObject("reaction-1", [
      { kind: "status", value: "sharpened-this-turn" },
    ]);
    const view = evaluateFabRules({
      objects: [zenith, stampedReaction],
      atoms: [],
      facts: combatFacts(zenith.ref),
    });
    const context = { controllerId: "p1", source: stampedReaction.ref, bindings: emptyBindings };
    expect(
      view.evaluateCondition({ type: "has-status", status: "weapon-sharpened-this-turn" }, context),
    ).toBe(false);
  });
});

describe("sharpened has-status handler", () => {
  it("is true when the evaluated subject was sharpened this turn", () => {
    const zenith = weaponObject("weapon-1", [{ kind: "status", value: "sharpened-this-turn" }]);
    const view = evaluateFabRules({ objects: [zenith], atoms: [], facts: EMPTY_RULES_FACTS });

    expect(
      view.evaluateCondition(
        { type: "has-status", status: "sharpened" },
        { controllerId: "p1", source: zenith.ref, bindings: emptyBindings },
      ),
    ).toBe(true);
  });

  it("is false when the evaluated subject has no sharpen marker", () => {
    const zenith = weaponObject("weapon-1");
    const view = evaluateFabRules({ objects: [zenith], atoms: [], facts: EMPTY_RULES_FACTS });

    expect(
      view.evaluateCondition(
        { type: "has-status", status: "sharpened" },
        { controllerId: "p1", source: zenith.ref, bindings: emptyBindings },
      ),
    ).toBe(false);
  });

  it("reads the subject marker rather than an unrelated source object", () => {
    const zenith = weaponObject("weapon-1");
    const reaction = reactionObject("reaction-1", [
      { kind: "status", value: "sharpened-this-turn" },
    ]);
    const view = evaluateFabRules({
      objects: [zenith, reaction],
      atoms: [],
      facts: EMPTY_RULES_FACTS,
    });

    expect(
      view.evaluateCondition(
        { type: "has-status", status: "sharpened" },
        {
          controllerId: "p1",
          source: reaction.ref,
          subject: zenith.ref,
          bindings: { ...emptyBindings, objects: { it: [zenith.ref] } },
        },
      ),
    ).toBe(false);
  });
});

describe("pitched-attack-and-non-attack-action-to-play-this has-status handler", () => {
  it("is true when the payment stamped the binding (both kinds pitched this way)", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const stamped = {
      controllerId: "p1",
      source: null,
      bindings: {
        ...emptyBindings,
        strings: { "pitched-attack-and-non-attack-action-to-play-this": "true" },
      },
    };
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "pitched-attack-and-non-attack-action-to-play-this" },
        stamped,
      ),
    ).toBe(true);
  });

  it("is false when nothing was pitched this way (empty bindings)", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "pitched-attack-and-non-attack-action-to-play-this" },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(false);
  });

  it("is false for an explicitly negative stamp or unrelated bindings", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const rejected = {
      controllerId: "p1",
      source: null,
      bindings: {
        ...emptyBindings,
        strings: { "pitched-attack-and-non-attack-action-to-play-this": "false" },
      },
    };
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "pitched-attack-and-non-attack-action-to-play-this" },
        rejected,
      ),
    ).toBe(false);
    const unrelated = {
      controllerId: "p1",
      source: null,
      bindings: {
        ...emptyBindings,
        strings: { "pitched-this-way-earth-card": "true" },
      },
    };
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "pitched-attack-and-non-attack-action-to-play-this" },
        unrelated,
      ),
    ).toBe(false);
  });
});
