import { describe, expect, it } from "vitest";
import type { FabResolvedBindings } from "./continuous/ir.ts";
import { EMPTY_RULES_FACTS, evaluateFabRules } from "./rules-evaluator.ts";
import type { FabRulesBaseObject, FabRulesFacts } from "./rules-view.ts";
import { fabPlayerId } from "../game/identity.ts";

const emptyBindings: FabResolvedBindings = { objects: {}, numbers: {}, strings: {} };

/** A played card object with an explicit move history and play facts. */
function playedObject(
  instanceId: string,
  moves: ReadonlyArray<{ from: string; to: string }>,
  facts: FabRulesBaseObject["declarationFacts"],
  zone = "combatChain",
): FabRulesBaseObject {
  return {
    ref: { instanceId, incarnation: 1 },
    canonicalId: instanceId,
    ownerId: "p1",
    controllerId: "p1",
    zone: { playerId: fabPlayerId("p1"), zone: zone as "combatChain" },
    zoneIndex: 0,
    visibility: "public",
    base: {
      names: [instanceId],
      activeFaceIds: [`${instanceId}:face:front`],
      color: null,
      typeBoxes: [{ metatypes: [], supertypes: [], types: ["Action"], subtypes: ["Attack"] }],
      typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: ["Attack"] },
      traits: [],
      textBoxIds: [instanceId],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    counters: [],
    markers: [],
    declarationFacts: facts,
    history: {
      moves: moves.map((move) => ({
        from: { playerId: fabPlayerId("p1"), zone: move.from as "hand" },
        to: { playerId: fabPlayerId("p1"), zone: move.to as "stack" },
        eventId: "event-1",
        turnNumber: 1,
        combatNumber: null,
        chainLinkNumber: null,
        lki: `lki:${instanceId}`,
      })),
    },
  } as unknown as FabRulesBaseObject;
}

function statusOf(source: FabRulesBaseObject, status: string): boolean {
  const facts: FabRulesFacts = { ...EMPTY_RULES_FACTS };
  const view = evaluateFabRules({ objects: [source], atoms: [], facts });
  return view.evaluateCondition(
    { type: "has-status", status: status as never },
    { controllerId: "p1", source: source.ref, bindings: emptyBindings },
  );
}

describe("played-from statuses scope to the current play", () => {
  it("arsenal → hand → play is NOT played from arsenal (regression: history scan was lifetime-sticky)", () => {
    const roundTrip = playedObject(
      "round-trip",
      [
        { from: "arsenal", to: "hand" },
        { from: "hand", to: "stack" },
        { from: "stack", to: "combatChain" },
      ],
      [{ kind: "played-from", zone: "hand" }],
    );
    expect(statusOf(roundTrip, "played-from-arsenal")).toBe(false);
    expect(statusOf(roundTrip, "played-from-banished-zone")).toBe(false);
  });

  it("a genuine arsenal play keeps the status for this play", () => {
    const fromArsenal = playedObject(
      "from-arsenal",
      [
        { from: "arsenal", to: "stack" },
        { from: "stack", to: "combatChain" },
      ],
      [{ kind: "played-from", zone: "arsenal" }],
    );
    expect(statusOf(fromArsenal, "played-from-arsenal")).toBe(true);
  });

  it("a genuine banished-zone play keeps the status for this play", () => {
    const fromBanished = playedObject(
      "from-banished",
      [
        { from: "banished", to: "stack" },
        { from: "stack", to: "combatChain" },
      ],
      [{ kind: "played-from", zone: "banished" }],
    );
    expect(statusOf(fromBanished, "played-from-banished-zone")).toBe(true);
    expect(statusOf(fromBanished, "played-from-arsenal")).toBe(false);
  });

  it("pre-play quote: the card still seated in arsenal counts as a prospective arsenal play", () => {
    const quoted = playedObject("quoted", [], [], "arsenal");
    expect(statusOf(quoted, "played-from-arsenal")).toBe(true);
  });
});
