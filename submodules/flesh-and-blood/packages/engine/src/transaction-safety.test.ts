import { describe, expect, it } from "vitest";
import { bravo, dash } from "./rules/fixtures.ts";
import {
  mutateCommandState,
  mutateFabStateSavepointWithResult,
  observeFabCopyOnWrite,
} from "./copy-on-write.ts";
import {
  FAB_RUNTIME_TEST_FAILURE,
  FAB_RUNTIME_TEST_RECEIPT,
  type FabRuntimeTestFailureStage,
} from "./runtime-access.ts";
import {
  observeFabSnapshotSerialization,
  serializeFabMatchSnapshot,
} from "./snapshot/match-context.ts";
import { FabTestEngine } from "./testing/test-engine.ts";

function realMatch() {
  return FabTestEngine.start(
    { hero: bravo, deck: 8 },
    { hero: dash, deck: 8 },
    { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
  );
}

describe("FAB command transaction safety", () => {
  for (const stage of ["handler", "automation", "validator"] as const) {
    it(`rolls back an injected ${stage} failure without publishing receipts`, () => {
      const game = realMatch();
      const runtime = game.getRuntime();
      const actorId = game.as(bravo).id;
      const retained = runtime.getState();
      const beforeSnapshot = serializeFabMatchSnapshot(retained);
      const beforeReceipt = runtime[FAB_RUNTIME_TEST_RECEIPT]();
      const receiptLengths = {
        events: beforeReceipt.committedEvents.length,
        playerLogs: beforeReceipt.playerLogs.length,
        moveLogs: beforeReceipt.moveLogs.length,
        playerNarratives: beforeReceipt.playerNarratives.length,
      };

      runtime[FAB_RUNTIME_TEST_FAILURE](stage satisfies FabRuntimeTestFailureStage);
      const rejected = runtime.applyCommand(
        actorId,
        { move: "pass" },
        { commandId: `transaction-safety:${stage}`, timestamp: 1 },
      );

      expect(rejected).toMatchObject({
        success: false,
        errorCode: "internal_error",
        currentStateID: beforeSnapshot.stateID,
        diagnostic: {
          commandId: `transaction-safety:${stage}`,
          failedInvariant: `Injected FAB ${stage} failure.`,
          baseStateID: beforeSnapshot.stateID,
        },
      });
      expect(runtime.getState()).toBe(retained);
      expect(serializeFabMatchSnapshot(retained)).toEqual(beforeSnapshot);
      const afterReceipt = runtime[FAB_RUNTIME_TEST_RECEIPT]();
      expect(afterReceipt.committedEvents).toHaveLength(receiptLengths.events);
      expect(afterReceipt.playerLogs).toHaveLength(receiptLengths.playerLogs);
      expect(afterReceipt.moveLogs).toHaveLength(receiptLengths.moveLogs);
      expect(afterReceipt.playerNarratives).toHaveLength(receiptLengths.playerNarratives);

      const next = runtime.applyCommand(actorId, { move: "pass" });
      expect(next).toMatchObject({ success: true, stateID: beforeSnapshot.stateID + 1 });
    });
  }

  it("uses one outer finalization and one snapshot serialization for an accepted command", () => {
    const game = realMatch();
    const runtime = game.getRuntime();
    const actorId = game.as(bravo).id;
    const retained = runtime.getState();
    const retainedSnapshot = serializeFabMatchSnapshot(retained);
    let copyOnWriteFinalizations = 0;
    let snapshotSerializations = 0;
    observeFabCopyOnWrite(() => {
      copyOnWriteFinalizations += 1;
    });
    observeFabSnapshotSerialization(() => {
      snapshotSerializations += 1;
    });

    try {
      expect(runtime.applyCommand(actorId, { move: "pass" })).toMatchObject({ success: true });
    } finally {
      observeFabCopyOnWrite(null);
      observeFabSnapshotSerialization(null);
    }

    expect(copyOnWriteFinalizations).toBe(1);
    expect(snapshotSerializations).toBe(1);
    expect(serializeFabMatchSnapshot(retained)).toEqual(retainedSnapshot);
  });

  it("does not finalize or serialize an early legality rejection", () => {
    const game = realMatch();
    const runtime = game.getRuntime();
    let copyOnWriteFinalizations = 0;
    let snapshotSerializations = 0;
    observeFabCopyOnWrite(() => {
      copyOnWriteFinalizations += 1;
    });
    observeFabSnapshotSerialization(() => {
      snapshotSerializations += 1;
    });

    try {
      expect(runtime.applyCommand("not-seated", { move: "pass" })).toMatchObject({
        success: false,
        errorCode: "unknown_actor",
      });
    } finally {
      observeFabCopyOnWrite(null);
      observeFabSnapshotSerialization(null);
    }

    expect(copyOnWriteFinalizations).toBe(0);
    expect(snapshotSerializations).toBe(0);
  });

  it("consumes an injected failure even when the next command rejects before that stage", () => {
    const game = realMatch();
    const runtime = game.getRuntime();
    const actorId = game.as(bravo).id;

    runtime[FAB_RUNTIME_TEST_FAILURE]("validator");
    expect(runtime.applyCommand("not-seated", { move: "pass" })).toMatchObject({
      success: false,
      errorCode: "unknown_actor",
    });
    expect(runtime.applyCommand(actorId, { move: "pass" })).toMatchObject({ success: true });
  });

  it("rolls back a rejected nested transition before the outer candidate continues", () => {
    const game = realMatch();
    const base = game.getRuntime().cloneState();

    const transaction = mutateCommandState(base, (draft) => {
      const stateID = draft.stateID;
      const nested = mutateFabStateSavepointWithResult(draft, (savepoint) => {
        savepoint.stateID += 10;
        savepoint.decision = null;
        return { accepted: false as const, error: "stale_process" };
      });
      expect(nested.result).toEqual({ accepted: false, error: "stale_process" });
      expect(draft.stateID).toBe(stateID);
      return { accepted: true as const };
    });

    expect(transaction.state.stateID).toBe(base.stateID);
  });
});
