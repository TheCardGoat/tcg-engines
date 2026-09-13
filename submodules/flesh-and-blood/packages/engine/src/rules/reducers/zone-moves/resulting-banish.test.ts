import { describe, expect, it } from "vitest";
import { registerFabTestObject } from "../../../testing/test-fixtures.ts";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { invalidateFabRuntimeDerived } from "../../../runtime-derived.ts";
import { invalidateFabRulesViews } from "../../state-rules-view.ts";
import { snapshotObject } from "../../snapshots.ts";
import { moveKnownObject } from "../shared.ts";
import { reduceMove } from "./move.ts";
import { resultingZoneEvents, type FabPrimaryZoneEvent } from "./helpers.ts";

function state() {
  return FabTestEngine.createStateForRulesTest({
    seed: "resulting-banish",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
}

function register(match: ReturnType<typeof state>, instanceId: string, canonicalId: string) {
  registerFabTestObject(match, instanceId, canonicalId, "p1");
  match.cardDefinitions[canonicalId] = {
    canonicalId,
    slug: canonicalId,
    base: {
      names: [canonicalId],
      activeFaceIds: [`${canonicalId}:face:front`],
      color: null,
      typeBoxes: [{ metatypes: [], supertypes: [], types: ["Action"], subtypes: [] }],
      typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: [] },
      traits: [],
      textBoxIds: [canonicalId],
      numeric: {},
      keywords: [],
      abilities: [],
    },
    layout: { kind: "single" },
  };
}

/** Physically move a p1 hand card to the banished zone, then observe what
 * resultingZoneEvents derives for the already-performed transition. */
function landInBanished(
  match: ReturnType<typeof state>,
  instanceId: string,
  reason: "banish" | "move",
) {
  register(match, instanceId, `${instanceId}-definition`);
  match.containers.zonesByPlayerId.p1!.hand = [instanceId];
  invalidateFabRulesViews(match);
  invalidateFabRuntimeDerived(match);
  const before = snapshotObject(match, instanceId, "p1", "hand");
  expect(
    moveKnownObject(match, before, "hand", "banished", {
      instanceId,
      incarnation: match.counters.objectIncarnation + 1,
    }),
  ).toBe(true);
  invalidateFabRulesViews(match);
  invalidateFabRuntimeDerived(match);
  return {
    before,
    primary: {
      name: "move-zone",
      processId: "process-1",
      cause: { kind: "player-command", actorId: "p1", command: "test" },
      controllerId: "p1",
      source: null,
      affected: [before],
      bindings: {},
      data: {
        object: before,
        destinationRef: { instanceId, incarnation: match.counters.objectIncarnation },
        from: "hand",
        to: "banished",
        reason,
      },
    } as unknown as FabPrimaryZoneEvent,
  };
}

describe("resulting banish derivation (CR 8.5.1)", () => {
  it("derives a banish observation for a reason-banish move-zone landing in the banished zone", () => {
    const match = state();
    const { primary } = landInBanished(match, "card-a", "banish");

    const derived = resultingZoneEvents(match, primary).filter((event) => event.name === "banish");
    expect(derived).toHaveLength(1);
    expect(derived[0]!.bindings.resultingEvent).toBe(true);
    expect(derived[0]!.data).toMatchObject({ to: "banished", reason: "banish" });
    // The derived observation reduces as observation-only: the physical move
    // already happened under the primary name.
    expect(reduceMove(match, derived[0] as Parameters<typeof reduceMove>[1])).toEqual({
      state: match,
    });
  });

  it("CR 8.5.1a: a move into the banished zone by a non-banish instruction is not a banish", () => {
    const match = state();
    const { primary } = landInBanished(match, "card-b", "move");

    expect(resultingZoneEvents(match, primary).some((event) => event.name === "banish")).toBe(
      false,
    );
  });
});
