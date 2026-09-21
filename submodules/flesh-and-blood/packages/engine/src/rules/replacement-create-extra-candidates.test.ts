import { describe, expect, it } from "vitest";

import { normalizeBaseObjectProperties } from "../cards.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import { fabPlayerId } from "../game/identity.ts";
import type { ProposedEvent } from "./events.ts";
import {
  collectApplicableReplacementCandidates,
  collectPotentialReplacementCandidates,
} from "../kernel/replacements/index.ts";
import { createSyntheticFabObjectSnapshot } from "./snapshots.ts";
import {
  createFabMatchContext,
  restoreFabMatchSnapshot,
  serializeFabMatchSnapshot,
} from "../index.ts";

describe("persisted create-extra candidate topology", () => {
  it("expands one typed candidate per token identity and survives snapshot restore", () => {
    const state = FabTestEngine.createStateForRulesTest({
      seed: "persisted-create-extra-candidates",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
    });
    const base = normalizeBaseObjectProperties({
      canonicalId: "source",
      name: "Source",
      types: ["Action"],
    });
    const source = createSyntheticFabObjectSnapshot({
      ref: { instanceId: "source", incarnation: 1 },
      canonicalId: "source",
      objectKind: "catalog-card",
      baseSource: { kind: "registered" },
      ownerId: "p1",
      controllerId: "p1",
      zone: "graveyard",
      zoneRef: { playerId: fabPlayerId("p1"), zone: "graveyard" },
      base,
    });
    state.replacementEffects.push({
      replacementId: "persisted-plus-one",
      controllerId: "p1",
      source,
      effect: {
        type: "replacement",
        replacementKind: "standard",
        replaces: { name: "create", creator: "controller", occurrences: "every" },
        modification: {
          type: "modify-numeric",
          property: "count",
          op: "add",
          amount: 1,
          target: { selector: "self" },
          duration: "permanent",
        },
        duration: "this-turn",
      },
      createdByEventId: null,
      expiresAt: { kind: "turn", turnNumber: state.turnNumber },
      consumptionPolicy: { kind: "never" },
      applicationPolicy: { kind: "mandatory" },
    });
    const create = (canonicalId: string, index: number): ProposedEvent<"create"> => {
      const object = createSyntheticFabObjectSnapshot({
        ref: { instanceId: `token-${index}`, incarnation: index + 1 },
        canonicalId,
        objectKind: "created-token",
        baseSource: { kind: "registered" },
        ownerId: "p1",
        controllerId: "p1",
        zone: "unknown",
        zoneRef: { playerId: fabPlayerId("p1"), zone: "arena" },
        base: normalizeBaseObjectProperties({
          canonicalId,
          name: canonicalId,
          types: ["Token", "Aura"],
        }),
      });
      return {
        name: "create",
        processId: "process-1",
        cause: { kind: "rule", rule: "create-extra-candidate-test", controllerId: "p1" },
        controllerId: "p1",
        source,
        affected: [object],
        bindings: {},
        data: { playerId: "p1", object },
      };
    };
    const events = [create("token:runechant", 1), create("token:quicken", 2)];

    const assertCandidates = (candidateState: typeof state) => {
      const candidates = collectApplicableReplacementCandidates(candidateState, events);
      expect(
        candidates
          .map((candidate) => candidate.createTokenKey)
          .sort((a, b) => (a ?? "").localeCompare(b ?? "")),
      ).toEqual(["token:quicken", "token:runechant"]);
      expect(
        candidates.every((candidate) => candidate.originReplacementId === "persisted-plus-one"),
      ).toBe(true);
      expect(collectPotentialReplacementCandidates(candidateState, events)).toEqual(candidates);
    };
    assertCandidates(state);
    const restored = restoreFabMatchSnapshot(
      serializeFabMatchSnapshot(state),
      createFabMatchContext(state.cardDefinitions, state.publicCardIdentities),
    );
    assertCandidates(restored);
  });
});
