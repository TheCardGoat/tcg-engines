import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../testing/test-engine.ts";
import { normalizeBaseObjectProperties } from "../cards.ts";
import { evaluateCanonicalCondition } from "./condition-evaluator.ts";
import type { FabTriggerSource } from "./trigger-matcher.ts";
import { createSyntheticFabObjectSnapshot } from "./snapshots.ts";
import { fabPlayerId } from "../game/identity.ts";

const effect: FabEffect = { type: "gain-life", amount: 1, target: { selector: "controller" } };

function setup() {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "canonical-conditions",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
  state.players.p1!.life = 10;
  state.players.p2!.life = 15;
  const source: FabTriggerSource = {
    abilityId: "ability-1",
    controllerId: "p1",
    source: createSyntheticFabObjectSnapshot({
      ref: { instanceId: "source-1", incarnation: 1 },
      canonicalId: "source",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      controllerId: "p1",
      zone: "permanent",
      zoneRef: { playerId: fabPlayerId("p1"), zone: "arena" },
      base: normalizeBaseObjectProperties({
        canonicalId: "source",
        name: "Source",
        types: ["Action", "Aura"],
        cost: 0,
        keywords: [{ name: "go-again" }],
      }),
      counterRecords: [
        { kind: "named", name: "aim", count: 1 },
        { kind: "numeric", property: "power", value: 1, count: 2 },
      ],
    }),
    trigger: {
      kind: "state",
      state: { type: "turn-player", who: "self" },
    },
    resolution: { kind: "effect", effect },
    layerKeywords: [],
    functionalZones: ["permanent"],
    origin: "static",
  };
  return { state, source };
}

describe("canonical FAB condition evaluator", () => {
  it("evaluates supported structural conditions without legacy fail-open behavior", () => {
    const { state, source } = setup();
    expect(
      evaluateCanonicalCondition(
        state,
        { type: "life-comparison", player: "self", vs: "opponent", op: "lt" },
        source,
        null,
      ),
    ).toBe(true);
    expect(
      evaluateCanonicalCondition(
        state,
        { type: "has-counter", counter: { kind: "named", name: "aim" } },
        source,
        null,
      ),
    ).toBe(true);
    expect(
      evaluateCanonicalCondition(
        state,
        {
          type: "has-counter",
          counter: { kind: "numeric", property: "power", value: 1 },
          comparison: { op: "eq", value: 2 },
        },
        source,
        null,
      ),
    ).toBe(true);
    expect(
      evaluateCanonicalCondition(state, { type: "has-keyword", keyword: "go-again" }, source, null),
    ).toBe(true);
    expect(
      evaluateCanonicalCondition(state, { type: "turn-player", who: "self" }, source, null),
    ).toBe(true);
  });

  it("fails closed when the required event history is not modeled", () => {
    const { state, source } = setup();
    expect(
      evaluateCanonicalCondition(
        state,
        {
          type: "damage-dealt",
          player: "controller",
          per: "turn",
          comparison: { op: "gte", value: 1 },
        },
        source,
        null,
      ),
    ).toBe(false);
  });

  it("reanchors a charged-card binding after the charged card changes incarnation", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "charged-card-binding",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: {
        canonicalIdsByInstance: { charged: "charged" },
        owners: { p1: ["charged"], p2: [] },
      },
      cardDefinitions: {
        charged: {
          canonicalId: "charged",
          name: "Yellow Charged Card",
          types: ["Action"],
          color: "Yellow",
        },
      },
    });
    const { source: template } = setup();
    const charged = state.objects.charged;
    if (!charged) throw new Error("charged fixture was not created");
    const previousIncarnation = charged.incarnation;
    state.containers.zonesByPlayerId.p1!.hand = [];
    state.containers.zonesByPlayerId.p1!.soul = [charged.instanceId];
    state.objects.charged = { ...charged, incarnation: previousIncarnation + 1 };
    const source = {
      ...template,
      source: createSyntheticFabObjectSnapshot({
        ...template.source,
        declarationFacts: [
          {
            kind: "charge",
            color: "yellow",
            chargedCard: {
              instanceId: charged.instanceId,
              incarnation: previousIncarnation,
            },
          },
        ],
      }),
    };

    expect(
      evaluateCanonicalCondition(
        state,
        { type: "binding-matches", binding: "chargedCard", filter: { color: ["yellow"] } },
        source,
        null,
      ),
    ).toBe(true);
  });
});
