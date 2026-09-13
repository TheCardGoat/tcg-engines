import { describe, expect, it } from "vite-plus/test";
import type { FabResolvedBindings } from "./continuous/ir.ts";
import { EMPTY_RULES_FACTS, evaluateFabRules } from "./rules-evaluator.ts";
import type { FabRulesBaseObject, FabRulesFacts } from "./rules-view.ts";
import { fabPlayerId } from "../game/identity.ts";

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

function objectAt(
  instanceId: string,
  zone: FabRulesBaseObject["zone"]["zone"],
  extras: {
    color?: FabRulesBaseObject["base"]["color"];
    types?: FabRulesBaseObject["base"]["typeBox"]["types"];
    ownerId?: string;
    controllerId?: string;
    playerId?: string;
    declarationFacts?: FabRulesBaseObject["declarationFacts"];
  } = {},
): FabRulesBaseObject {
  const playerId = fabPlayerId((extras.playerId ?? extras.controllerId ?? "p2") as "p1" | "p2");
  const types = extras.types ?? ["Action"];
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: extras.ownerId ?? extras.controllerId ?? "p2",
    controllerId: extras.controllerId ?? "p2",
    zone: { playerId, zone },
    zoneIndex: 0,
    visibility: "public",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: extras.color ?? "yellow",
      typeBox: { metatypes: [], supertypes: [], types, subtypes: [] },
      typeBoxes: [{ metatypes: [], supertypes: [], types, subtypes: [] }],
      traits: [],
      textBoxIds: [],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    counters: [],
    markers: [],
    declarationFacts: extras.declarationFacts,
    history: { moves: [] },
  };
}

describe("P0 sibling has-status handlers", () => {
  it("does not throw for the sibling markers", () => {
    const view = evaluateFabRules({ objects: [], atoms: [] });
    const context = { controllerId: "p1", source: null, bindings: emptyBindings };
    for (const status of [
      "played-at-chain-link-3-or-higher",
      "yellow-card-in-pitch-zone",
      "defending-hero-has-cards-in-soul",
      "defended-by-action",
      "defended-by-attack-action",
      "defended-by-attack-action-card",
      "charged-to-play",
      "played-or-activated-this-chain-link-attack-reaction",
      "attacking",
      "this-is-defending",
    ] as const) {
      expect(
        () => view.evaluateCondition({ type: "has-status", status }, context),
        status,
      ).not.toThrow();
    }
  });

  it("yellow-card-in-pitch-zone reads the controller's pitch zone", () => {
    const yellow = objectAt("yellow-pitch", "pitch", {
      color: "yellow",
      controllerId: "p1",
      ownerId: "p1",
      playerId: "p1",
    });
    const view = evaluateFabRules({ objects: [yellow], atoms: [] });
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "yellow-card-in-pitch-zone" },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "yellow-card-in-pitch-zone" },
        { controllerId: "p2", source: null, bindings: emptyBindings },
      ),
    ).toBe(false);
  });

  it("been-booed-this-turn reads the crowd-booed turn fact", () => {
    const facts: FabRulesFacts = {
      ...EMPTY_RULES_FACTS,
      playerCrowdBooed: { p1: true, p2: false },
      playerPerformedThisTurn: {
        p1: { ...EMPTY_RULES_FACTS.playerPerformedThisTurn.p1, booed: true },
        p2: EMPTY_RULES_FACTS.playerPerformedThisTurn.p2,
      },
    };
    const view = evaluateFabRules({ objects: [], atoms: [], facts });
    expect(
      view.evaluateCondition(
        { type: "performed-this-turn", event: "booed", player: "controller" },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        { type: "performed-this-turn", event: "booed", player: "controller" },
        { controllerId: "p2", source: null, bindings: emptyBindings },
      ),
    ).toBe(false);
  });

  it("boosts-this-turn counts gate the printed 2+/3+ thresholds", () => {
    const facts: FabRulesFacts = {
      ...EMPTY_RULES_FACTS,
      playerBoostsThisTurn: { p1: 2, p2: 1 },
    };
    const view = evaluateFabRules({ objects: [], atoms: [], facts });
    expect(
      view.evaluateCondition(
        {
          type: "compare-amount",
          amount: { type: "count", what: "boosts-this-turn" },
          comparison: { op: "gte", value: 2 },
        },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(true);
    expect(
      view.evaluateCondition(
        {
          type: "compare-amount",
          amount: { type: "count", what: "boosts-this-turn" },
          comparison: { op: "gte", value: 3 },
        },
        { controllerId: "p1", source: null, bindings: emptyBindings },
      ),
    ).toBe(false);
  });

  it("charged-to-play reads the charge declaration fact on the subject", () => {
    const charged = objectAt("charged-attack", "combatChain", {
      controllerId: "p1",
      ownerId: "p1",
      declarationFacts: [{ kind: "charge" }],
    });
    const view = evaluateFabRules({ objects: [charged], atoms: [] });
    expect(
      view.evaluateCondition(
        { type: "has-status", status: "charged-to-play" },
        { controllerId: "p1", source: charged.ref, subject: charged.ref, bindings: emptyBindings },
      ),
    ).toBe(true);
  });
});
