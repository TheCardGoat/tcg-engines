import { describe, expect, it } from "vite-plus/test";
import { isGraveyardToBanishReplacement, supportedCanonicalReplacement } from "./admission.ts";
import { kernelReplacementFor, unhandledAdmittedReplacement } from "./apply.ts";
import type { FabReplacementCandidate } from "../../rules/process.ts";
import type { FabObjectSnapshot, ProposedEvent } from "../../rules/events.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash } from "../../rules/fixtures.ts";
import { snapshotObject } from "../../rules/snapshots.ts";
import { findObjectZone } from "../../rules/state-rules-view.ts";

function proposedDestroy(actorId: string, source: FabObjectSnapshot): ProposedEvent<"destroy"> {
  return {
    name: "destroy",
    processId: "process-1",
    controllerId: actorId,
    source,
    affected: [source],
    cause: { kind: "effect", abilityId: "test", source, controllerId: actorId },
    bindings: {},
    data: {
      object: source,
      from: "permanent",
      to: "graveyard",
      reason: "destroy",
      destinationRef: null,
    },
  } satisfies ProposedEvent<"destroy">;
}

function proposedDraw(actorId: string, source: FabObjectSnapshot): ProposedEvent<"draw"> {
  return {
    name: "draw",
    processId: "process-1",
    controllerId: actorId,
    source,
    affected: [],
    cause: { kind: "effect", abilityId: "test", source, controllerId: actorId },
    bindings: {},
    data: {
      playerId: actorId,
      object: source,
      destinationRef: source.ref,
    },
  } satisfies ProposedEvent<"draw">;
}

const graveyardToBanish = {
  type: "replacement",
  replacementKind: "standard",
  replaces: { name: "destroy", to: "graveyard" },
  modification: { type: "banish", target: { selector: "self" } },
} as const;

describe("replacement apply fail-closed", () => {
  it("admits the graveyard-to-banish shape", () => {
    expect(isGraveyardToBanishReplacement(graveyardToBanish)).toBe(true);
    expect(supportedCanonicalReplacement(graveyardToBanish)).toBe(true);
  });

  it("rewrites a destroy-to-graveyard event instead of echoing it", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 8 }, { hero: dash, deck: 8 });
    const state = game.getState();
    const actorId = game.as(bravo).id;
    const heroId = state.players[actorId]!.heroCardId;
    if (!heroId) throw new Error("missing hero");
    const zone = findObjectZone(state, heroId);
    if (!zone) throw new Error("missing hero zone");
    const source = snapshotObject(state, heroId, actorId, zone.zone);
    const candidate: FabReplacementCandidate = {
      replacementId: "test-gy-banish",
      controllerId: actorId,
      source,
      replacementKind: "standard",
      applicationScope: { kind: "original-event" },
      effect: graveyardToBanish,
      origin: "static",
      consumptionPolicy: { kind: "on-application" },
      optional: false,
    };
    const event = proposedDestroy(actorId, source);
    const result = kernelReplacementFor(candidate).replace(state, event);
    expect(result.event).not.toBeNull();
    expect(result.event).not.toBe(event);
    expect(result.event && "to" in result.event.data ? result.event.data.to : null).toBe(
      "banished",
    );
  });

  it("throws instead of identity-passthrough for an unhandled admitted candidate", () => {
    const game = FabTestEngine.start({ hero: bravo, deck: 8 }, { hero: dash, deck: 8 });
    const state = game.getState();
    const actorId = game.as(bravo).id;
    const heroId = state.players[actorId]!.heroCardId;
    if (!heroId) throw new Error("missing hero");
    const zone = findObjectZone(state, heroId);
    if (!zone) throw new Error("missing hero zone");
    const source = snapshotObject(state, heroId, actorId, zone.zone);
    const unsupported = {
      type: "replacement",
      replacementKind: "standard",
      replaces: { name: "draw" },
      modification: { type: "gain-life", amount: 1, target: { selector: "self" } },
    } as const;
    expect(supportedCanonicalReplacement(unsupported)).toBe(false);
    const candidate: FabReplacementCandidate = {
      replacementId: "test-unhandled",
      controllerId: actorId,
      source,
      replacementKind: "standard",
      applicationScope: { kind: "original-event" },
      effect: unsupported,
      origin: "static",
      consumptionPolicy: { kind: "on-application" },
      optional: false,
    };
    const event = proposedDraw(actorId, source);
    expect(() => kernelReplacementFor(candidate).replace(state, event)).toThrow(
      /Unhandled admitted FAB replacement/,
    );
    expect(() => unhandledAdmittedReplacement(candidate, event)).toThrow(
      /Unhandled admitted FAB replacement test-unhandled/,
    );
  });
});
