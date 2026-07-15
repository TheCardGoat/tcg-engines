import { describe, expect, it } from "vite-plus/test";
import { asPlayerId, enumerateAvailableMovesDetailed, type PlayerId } from "@tcg/gundam-engine";

import { DEV_PLAYER_ONE, DEV_PLAYER_TWO } from "./dev-runtime.ts";
import { loadBurstShieldDemo } from "./fixtures/burst-shield-demo.ts";
import { loadMainPhaseDemo } from "./fixtures/main-phase-demo.ts";
import { loadDeployUnitDemo } from "./fixtures/deploy-unit-demo.ts";
import { attachAutoPassBot } from "./fixtures/auto-pass.ts";
import { reconstructFromSnapshot, snapshotFromDevRuntime } from "./snapshot.ts";

/**
 * Regression suite for the SSR snapshot roundtrip. The e2e burst-shield
 * spec fails under the snapshot pipeline because the opponent's
 * auto-pass bot doesn't advance the action step — these focused tests
 * isolate "engine semantics after loadState" from "React timing" so
 * the root cause surfaces without a browser in the loop.
 */
describe("Snapshot roundtrip · engine semantics", () => {
  it("reconstructed runtime has the same state as the source (stateID, phase, zones)", () => {
    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    const originalState = dev.runtime.getState();
    const reconstructedState = match.runtime.getState();

    expect(reconstructedState.ctx._stateID).toBe(originalState.ctx._stateID);
    expect(reconstructedState.ctx.status.phase).toBe(originalState.ctx.status.phase);
    expect(reconstructedState.ctx.status.step).toBe(originalState.ctx.status.step);
    expect(reconstructedState.ctx.status.activePlayer).toBe(originalState.ctx.status.activePlayer);
  });

  it("reconstructed runtime has identical card instance ids in every zone", () => {
    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    const originalZones = dev.runtime.getState().ctx.zones.private.zoneCards;
    const reconstructedZones = match.runtime.getState().ctx.zones.private.zoneCards;

    expect(Object.keys(reconstructedZones).sort()).toEqual(Object.keys(originalZones).sort());
    for (const key of Object.keys(originalZones)) {
      expect(reconstructedZones[key]).toEqual(originalZones[key]);
    }
  });

  it("opponent has no passActionStep available at load time (p1 holds priority to pass block first)", () => {
    const dev = loadBurstShieldDemo();
    const p2 = asPlayerId(DEV_PLAYER_TWO) as PlayerId;

    // `burst-shield-demo` lands in block-step after the opponent's
    // own enterBattle, so p2 shouldn't have `passActionStep` yet —
    // the viewer (p1) holds priority to pass block first. Asserting
    // this explicitly gives us a fixture-state baseline before the
    // roundtrip + command assertions below depend on it.
    const movesBeforeViewerPass = enumerateAvailableMovesDetailed(
      dev.runtime.getState(),
      p2,
      dev.staticResources,
    );
    expect(movesBeforeViewerPass.map((m) => m.moveName)).not.toContain("passActionStep");
  });

  it("reconstructed G is structurally equal to source G (catches any silent serialization loss)", () => {
    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    expect(match.runtime.getState().G).toEqual(dev.runtime.getState().G);
    expect(match.runtime.getState().ctx).toEqual(dev.runtime.getState().ctx);
  });

  it("executeCommand(passBlock) on the reconstructed runtime advances the stateID", () => {
    const p1 = asPlayerId(DEV_PLAYER_ONE) as PlayerId;

    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);
    const stateIdBefore = match.runtime.getState().ctx._stateID;

    const result = match.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passBlock",
        prevStateID: stateIdBefore,
        actorRole: "player",
        args: {},
      },
      p1,
    );

    // If the command fails silently (validation error), the UI would
    // never see the phase transition. Fail loudly here instead.
    expect(result.success, `passBlock rejected: ${JSON.stringify(result)}`).toBe(true);
    expect(match.runtime.getState().ctx._stateID).toBeGreaterThan(stateIdBefore);
  });

  it("AFTER viewer passBlock, opponent's available moves match between original and reconstructed runtimes", () => {
    const p1 = asPlayerId(DEV_PLAYER_ONE) as PlayerId;
    const p2 = asPlayerId(DEV_PLAYER_TWO) as PlayerId;

    // Original runtime: simulate the test's PASS BLOCK click.
    const dev = loadBurstShieldDemo();
    const originalState = dev.runtime.getState();
    dev.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passBlock",
        prevStateID: originalState.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );
    const movesAfterOriginal = enumerateAvailableMovesDetailed(
      dev.runtime.getState(),
      p2,
      dev.staticResources,
    );

    // Reconstructed runtime: same flow.
    const dev2 = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev2);
    const match = reconstructFromSnapshot(snapshot);
    const reconstructedState = match.runtime.getState();
    match.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passBlock",
        prevStateID: reconstructedState.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );
    const movesAfterReconstructed = enumerateAvailableMovesDetailed(
      match.runtime.getState(),
      p2,
      match.staticResources,
    );

    expect(movesAfterReconstructed.map((m) => m.moveName).sort()).toEqual(
      movesAfterOriginal.map((m) => m.moveName).sort(),
    );
  });

  it("attachAutoPassBot on reconstructed runtime DOES auto-pass when state transitions into the opponent's action step", () => {
    const p1 = asPlayerId(DEV_PLAYER_ONE) as PlayerId;

    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    // Attach the auto-pass bot to the RECONSTRUCTED runtime — same
    // as `useClientBot` does on the client.
    const unsubscribe = attachAutoPassBot(match.runtime, match.staticResources, DEV_PLAYER_TWO);

    // Simulate viewer's PASS BLOCK.
    const state = match.runtime.getState();
    match.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "passBlock",
        prevStateID: state.ctx._stateID,
        actorRole: "player",
        args: {},
      },
      p1,
    );

    // If the bot's subscription fired, the engine has already
    // advanced past the opponent's action step — so the viewer
    // should now hold priority in their own action step. Concretely:
    // `passActionStep` should be available to p1, not p2.
    const postBotState = match.runtime.getState();
    expect(postBotState.ctx.status.activePlayer).toBe(p1);

    unsubscribe();
  });
});

describe("Snapshot roundtrip · registry coverage", () => {
  it("instance registry matches between source and reconstructed for a fixture with placed cards", () => {
    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    const sourceInstances = [...dev.runtime.getStaticResources().cardsMaps.instances.entries()];
    const reconstructedInstances = [...match.staticResources.cardsMaps.instances.entries()];

    // Both maps must carry the exact same `instanceId → {definitionId, ownerID}`
    // pairs — `createStaticResources` alone only covers deck +
    // resourceDeck cards, so without replaying the snapshot's
    // instances on reconstruction, placed cards would be missing.
    expect(reconstructedInstances.length).toBe(sourceInstances.length);
    expect(reconstructedInstances.map((e) => e.instanceId).sort()).toEqual(
      sourceInstances.map((e) => e.instanceId).sort(),
    );
  });

  it("definitions map carries every definition referenced by an instance", () => {
    const dev = loadBurstShieldDemo();
    const snapshot = snapshotFromDevRuntime("burst-shield-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    const definitions = match.staticResources.cardsMaps.definitions;
    const referencedDefinitionIds = new Set(
      [...match.staticResources.cardsMaps.instances.entries()].map((e) => e.definitionId),
    );
    for (const defId of referencedDefinitionIds) {
      expect(
        definitions.has(defId),
        `definition missing for ${defId} — effect resolution depends on cardsMaps.definitions lookups`,
      ).toBe(true);
    }
  });

  it("roundtrips a main-phase fixture (cards in hand + battleArea)", () => {
    const dev = loadMainPhaseDemo();
    const snapshot = snapshotFromDevRuntime("main-phase-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    const originalState = dev.runtime.getState();
    const reconstructedState = match.runtime.getState();
    expect(reconstructedState.G).toEqual(originalState.G);
    expect(reconstructedState.ctx).toEqual(originalState.ctx);
  });

  it("roundtrips a minimal deploy-unit fixture", () => {
    const dev = loadDeployUnitDemo();
    const snapshot = snapshotFromDevRuntime("deploy-unit-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    expect(match.runtime.getState().ctx._stateID).toBe(dev.runtime.getState().ctx._stateID);
    expect(match.runtime.getState().G).toEqual(dev.runtime.getState().G);
  });

  it("executing a deploy on the reconstructed runtime moves the card from hand → battleArea", () => {
    // Absolute-state comparison isn't useful here: mock-card factories
    // use a module-scope counter, so two successive `loadDeployUnitDemo`
    // calls produce different instance ids. Instead, assert the
    // topological shape: the deployed card leaves `hand:p1` and
    // appears in `battleArea:p1`. A reconstructed-runtime regression
    // (missing definition lookups, etc.) would have the deploy fail
    // silently and the card stay in hand.
    const p1 = asPlayerId(DEV_PLAYER_ONE) as PlayerId;
    const dev = loadDeployUnitDemo();
    const snapshot = snapshotFromDevRuntime("deploy-unit-demo", dev);
    const match = reconstructFromSnapshot(snapshot);

    const before = match.runtime.getState();
    const handId = before.ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`]?.[0];
    expect(handId).toBeDefined();
    expect(before.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`] ?? []).toHaveLength(
      0,
    );

    const result = match.runtime.executeCommand(
      {
        commandID: crypto.randomUUID(),
        move: "deployUnit",
        prevStateID: before.ctx._stateID,
        actorRole: "player",
        args: { cardId: handId },
      },
      p1,
    );
    expect(result.success, `deployUnit rejected: ${JSON.stringify(result)}`).toBe(true);

    const after = match.runtime.getState();
    expect(after.ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? []).toHaveLength(0);
    expect(after.ctx.zones.private.zoneCards[`battleArea:${DEV_PLAYER_ONE}`]).toContain(handId);
  });
});

describe("Snapshot roundtrip · botConfig", () => {
  it("omits botConfig when none is supplied", () => {
    const dev = loadMainPhaseDemo();
    const snapshot = snapshotFromDevRuntime("main-phase-demo", dev);
    expect(snapshot.botConfig).toBeUndefined();
    const match = reconstructFromSnapshot(snapshot);
    expect(match.botConfig).toBeUndefined();
  });

  it("round-trips a botConfig.strategy value", () => {
    const dev = loadMainPhaseDemo();
    const snapshot = snapshotFromDevRuntime("main-phase-demo", dev, {
      botConfig: { strategy: "pass-only" },
    });
    expect(snapshot.botConfig).toEqual({ strategy: "pass-only" });
    const match = reconstructFromSnapshot(snapshot);
    expect(match.botConfig).toEqual({ strategy: "pass-only" });
  });
});
