import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { matchesGrandArchiveCardFilter } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { collectGrandArchiveActionRules } from "./rule-modifications.ts";

function card(
  id: string,
  name: string,
  type: "ACTION" | "ALLY" | "CHAMPION" | "ITEM",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name,
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { life: 2, power: 1 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("tracked-champion", "Tracked Champion", "CHAMPION");
const chosenAlly = card("tracked-chosen-ally", "Chosen Ally", "ALLY");
const filler = card("tracked-filler", "Tracked Filler", "ACTION");
const trackingItem = card("tracked-item", "Tracking Item", "ITEM", [
  {
    id: "trackedItem-a1",
    kind: "activated",
    activation: "ability",
    cost: { kind: "pay-reserve", amount: 0 },
    text: "Choose an ally card name.",
    effect: {
      kind: "choose-value",
      selection: {
        id: "entry-choice",
        kind: "choice",
        declared: "event-processing",
        chooser: "controller",
        count: { kind: "exactly", amount: 1 },
        candidates: {
          kind: "characteristic",
          characteristic: "card-name",
          optionsFrom: { kind: "type", oneOf: ["ALLY"] },
        },
      },
      trackAs: "chosen-card-name",
    },
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([champion, chosenAlly, filler, trackingItem]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: chosenAlly.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 5 },
      ...(id === "p1" ? [{ definitionId: trackingItem.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1201,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const source = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === trackingItem.canonicalId,
  )!;
  const candidate = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === chosenAlly.canonicalId,
  )!;
  const p2 = grandArchivePlayerId("p2");
  const opponentCandidate = Object.values(initial.objects).find(
    (object) => object.ownerId === p2 && object.definitionId === chosenAlly.canonicalId,
  )!;
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: source.id, from: source.zone, to: "field" },
  ]).state;
  return {
    program,
    prepared,
    p1,
    p2,
    sourceId: source.id,
    candidateId: candidate.id,
    opponentCandidateId: opponentCandidate.id,
  };
}

describe("Grand Archive tracked characteristics", () => {
  it("persists a filtered characteristic choice for the current object incarnation", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.prepared);
    expect(
      runtime.execute(
        { move: "activate-ability", sourceId: fixture.sourceId, abilityId: "trackedItem-a1" },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p2") }).ok).toBe(
      true,
    );
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected a characteristic choice");
    }
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: "Chosen Ally",
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);

    const source = runtime.state.objects[fixture.sourceId]!;
    const candidate = runtime.state.objects[fixture.candidateId]!;
    expect(runtime.state.trackedCharacteristics[source.id]).toEqual({
      incarnation: source.incarnation,
      values: { "chosen-card-name": ["Chosen Ally"] },
    });
    expect(
      matchesGrandArchiveCardFilter(
        candidate,
        {
          kind: "matches-tracked-characteristic",
          key: "chosen-card-name",
          characteristic: "card-name",
        },
        {
          program: fixture.program,
          state: runtime.state,
          controllerId: fixture.p1,
          sourceId: source.id,
          abilityBearerId: source.id,
          bindings: {},
        },
      ),
    ).toBe(true);

    const changedZone = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "object-moved", objectId: source.id, from: "field", to: "graveyard" },
    ]).state;
    expect(
      matchesGrandArchiveCardFilter(
        changedZone.objects[fixture.candidateId]!,
        {
          kind: "matches-tracked-characteristic",
          key: "chosen-card-name",
          characteristic: "card-name",
        },
        {
          program: fixture.program,
          state: changedZone,
          controllerId: fixture.p1,
          sourceId: source.id,
          abilityBearerId: source.id,
          bindings: {},
        },
      ),
    ).toBe(false);
  });

  it("rejects a characteristic excluded by the choice's card filter", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.prepared);
    runtime.execute(
      { move: "activate-ability", sourceId: fixture.sourceId, abilityId: "trackedItem-a1" },
      { playerId: fixture.p1 },
    );
    runtime.execute({ move: "pass" }, { playerId: fixture.p1 });
    runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p2") });
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected a characteristic choice");
    }
    const invalid = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: "Tracking Item",
      },
      { playerId: fixture.p1 },
    );
    expect(invalid.ok).toBe(false);
    if (invalid.ok) throw new Error("Filtered characteristic choice unexpectedly succeeded");
    expect(invalid.message).toContain("not available");
  });

  it("captures a tracked characteristic in a lasting rule before the source changes zones", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const executed = executeGrandArchiveEffect(
      {
        kind: "sequence",
        effects: [
          {
            kind: "track-characteristic",
            subject: { kind: "bound", binding: "named-card" },
            characteristic: "card-name",
            trackAs: "forbidden-name",
          },
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "activate",
            subject: { kind: "player", player: "each-opponent" },
            filter: {
              kind: "matches-tracked-characteristic",
              key: "forbidden-name",
              characteristic: "card-name",
            },
            duration: { kind: "permanent" },
          },
        ],
      },
      {
        program: fixture.program,
        state: fixture.prepared,
        controllerId: fixture.p1,
        sourceId: fixture.sourceId,
        abilityBearerId: fixture.sourceId,
        bindings: { "named-card": [fixture.candidateId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(executed.bindings["tracked:forbidden-name"]).toBe("Chosen Ally");
    expect(executed.state.ruleModifications[0]?.bindings["tracked:forbidden-name"]).toBe(
      "Chosen Ally",
    );

    const sourceMoved = kernel.transact(executed.state, [
      {
        type: "object-moved",
        objectId: fixture.sourceId,
        from: "field",
        to: "graveyard",
      },
    ]).state;
    expect(sourceMoved.trackedCharacteristics[fixture.sourceId]).toBeUndefined();
    expect(
      collectGrandArchiveActionRules({
        action: "activate",
        activationKind: "card",
        playerId: fixture.p2,
        candidateId: fixture.opponentCandidateId,
        fromZone: sourceMoved.objects[fixture.opponentCandidateId]!.zone,
        evaluation: {
          program: fixture.program,
          state: sourceMoved,
          controllerId: fixture.p2,
          sourceId: fixture.opponentCandidateId,
          abilityBearerId: fixture.opponentCandidateId,
          bindings: {},
        },
      }).some((rule) => rule.effect.mode === "forbid"),
    ).toBe(true);
  });
});
