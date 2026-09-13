import { describe, expect, it } from "vitest";
import { mutateInPlace, observeFabCopyOnWrite, type FabStateDraft } from "../copy-on-write.ts";
import { FabTestEngine } from "../testing/test-engine.ts";
import type { FabMatchState } from "../state.ts";
import type { ProposedEvent } from "./events.ts";
import {
  commitProposedEventBatch,
  commitProposedEventBatchDraft,
  type FabEventReducer,
  type FabReplacementEffect,
} from "../kernel/transaction-kernel.ts";

function createState(): FabMatchState {
  const state = FabTestEngine.createStateForRulesTest({
    seed: "event-kernel",
    player1Id: "p1",
    player2Id: "p2",
    cardsMaps: { canonicalIdsByInstance: {}, owners: { p1: [], p2: [] } },
  });
  state.counters.process = 1;
  return state;
}

function gainLife(playerId: string, amount: number): ProposedEvent<"gain-life"> {
  return {
    name: "gain-life",
    processId: "process-1",
    cause: { kind: "rule", rule: "kernel-test", controllerId: playerId },
    controllerId: playerId,
    source: null,
    affected: [],
    bindings: {},
    data: { playerId, amount },
  };
}

const lifeReducer: FabEventReducer = (snapshot, event) => {
  if (event.name !== "gain-life" || event.data.amount === 0) return null;
  const state = snapshot as FabMatchState;
  state.players[event.data.playerId]!.life += event.data.amount;
  return { state };
};

describe("FAB rules event transaction kernel", () => {
  it("distinguishes a proposal from a deterministic committed event", () => {
    const initial = createState();
    const proposal = gainLife("p1", 2);

    const result = commitProposedEventBatch(initial, [proposal], lifeReducer);

    expect("eventId" in proposal).toBe(false);
    expect(initial.players.p1!.life).toBe(20);
    expect(result.state.players.p1!.life).toBe(22);
    expect(result.batch?.batchId).toBe("batch-1");
    expect(result.batch?.events[0]).toMatchObject({
      eventId: "event-1",
      batchId: "batch-1",
      batchIndex: 0,
      batchSize: 1,
      name: "gain-life",
    });
  });

  it("commits a batch through its caller's existing Mutative draft", () => {
    const initial = createState();
    let copyOnWriteCalls = 0;
    observeFabCopyOnWrite(() => {
      copyOnWriteCalls += 1;
    });
    try {
      let result: ReturnType<typeof commitProposedEventBatchDraft> | undefined;
      const committed = mutateInPlace(initial, (draft) => {
        result = commitProposedEventBatchDraft(
          draft as FabStateDraft,
          [gainLife("p1", 2)],
          lifeReducer,
        );
      });
      expect(initial.players.p1!.life).toBe(20);
      expect(committed.players.p1!.life).toBe(22);
      expect(result?.batch?.events[0]?.eventId).toBe("event-1");
      expect(copyOnWriteCalls).toBe(1);
    } finally {
      observeFabCopyOnWrite(null);
    }
  });

  it("publishes prepared nested-array changes exactly once across outer-draft batches", () => {
    const initial = createState();
    const appendReducer: FabEventReducer = (snapshot, event) => {
      if (event.name !== "gain-life") return null;
      const candidate = snapshot as FabMatchState;
      candidate.players.p1!.history.turn.playedCardNames.push(`gain-${event.data.amount}`);
      return { state: candidate };
    };

    const committed = mutateInPlace(initial, (draft) => {
      commitProposedEventBatchDraft(draft as FabStateDraft, [gainLife("p1", 1)], appendReducer);
      commitProposedEventBatchDraft(draft as FabStateDraft, [gainLife("p1", 2)], appendReducer);
    });

    expect(initial.players.p1!.history.turn.playedCardNames).toEqual([]);
    expect(committed.players.p1!.history.turn.playedCardNames).toEqual(["gain-1", "gain-2"]);
  });

  it("does not commit an instruction that changes nothing", () => {
    const initial = createState();
    const result = commitProposedEventBatch(initial, [gainLife("p1", 0)], lifeReducer);

    expect(result.batch).toBeNull();
    expect(result.state.counters).toEqual(initial.counters);
    expect(result.state).not.toHaveProperty("committedEvents");
  });

  it("discards mutations made by a reducer that reports does-not-occur", () => {
    const initial = createState();
    const actionPointsBefore = initial.players.p1!.actionPoints;
    const invalidReducer: FabEventReducer = (snapshot, event) => {
      if (event.name !== "gain-life") return null;
      const candidate = snapshot as FabMatchState;
      candidate.players.p1!.life = 1;
      candidate.players.p1!.actionPoints = 99;
      return null;
    };

    const result = commitProposedEventBatch(initial, [gainLife("p1", 2)], invalidReducer);

    expect(result.batch).toBeNull();
    expect(result.state.players.p1).toMatchObject({ life: 20, actionPoints: actionPointsBefore });
    expect(initial.players.p1).toMatchObject({ life: 20, actionPoints: actionPointsBefore });
  });

  it("reports cancelled, replaced, and no-op cost events distinctly for conditional receipts", () => {
    const replacement = (
      replacementId: string,
      replace: FabReplacementEffect["replace"],
    ): FabReplacementEffect => ({
      replacementId,
      controllerId: "p1",
      optional: false,
      replacementKind: "standard",
      applicationScope: { kind: "original-event" },
      applies: (_state, event) => event.name === "gain-life",
      replace,
    });
    const cancelled = commitProposedEventBatch(createState(), [gainLife("p1", 1)], lifeReducer, {
      replacements: [replacement("cancel-cost", () => ({ event: null }))],
    });
    expect(cancelled.batch).toBeNull();
    expect(cancelled.cancelledEvents).toEqual([
      expect.objectContaining({ replacementIds: ["cancel-cost"] }),
    ]);

    const noOp = commitProposedEventBatch(createState(), [gainLife("p1", 1)], lifeReducer, {
      replacements: [
        replacement("make-cost-no-op", (_state, event) =>
          event.name === "gain-life"
            ? { event: { ...event, data: { ...event.data, amount: 0 } } }
            : { event },
        ),
      ],
    });
    expect(noOp.batch).toBeNull();
    expect(noOp.cancelledEvents).toEqual([]);

    const replaced = commitProposedEventBatch(createState(), [gainLife("p1", 1)], lifeReducer, {
      replacements: [
        replacement("replace-cost", (_state, event) =>
          event.name === "gain-life"
            ? { event: { ...event, data: { ...event.data, playerId: "p2" } } }
            : { event },
        ),
      ],
    });
    expect(replaced.batch?.events).toEqual([
      expect.objectContaining({
        name: "gain-life",
        replacementIds: ["replace-cost"],
        data: expect.objectContaining({ playerId: "p2" }),
      }),
    ]);
    expect(replaced.state.players.p1!.life).toBe(20);
    expect(replaced.state.players.p2!.life).toBe(21);
  });

  it("re-evaluates one replacement independently for each original event", () => {
    const initial = createState();
    const result = commitProposedEventBatch(
      initial,
      [gainLife("p1", 1), gainLife("p1", 1)],
      lifeReducer,
      {
        replacements: [
          {
            replacementId: "gain-one-more",
            controllerId: "p1",
            optional: false,
            replacementKind: "standard",
            applicationScope: { kind: "original-event" },
            applies: (_state, event) => event.name === "gain-life",
            replace: (_state, event) => {
              if (event.name !== "gain-life") return { event };
              return {
                event: { ...event, data: { ...event.data, amount: event.data.amount + 1 } },
              };
            },
          },
        ],
      },
    );

    expect(result.state.players.p1!.life).toBe(24);
    expect(result.batch?.events).toHaveLength(2);
    expect(result.batch?.events[0]!.replacementIds).toEqual(["gain-one-more"]);
    expect(result.batch?.events[1]!.replacementIds).toEqual(["gain-one-more"]);
    expect(result.batch?.events.every((event) => event.batchSize === 2)).toBe(true);
  });

  it("uses one application only when the replacement explicitly replaces the multi-event", () => {
    const initial = createState();
    const result = commitProposedEventBatch(
      initial,
      [gainLife("p1", 1), gainLife("p1", 1)],
      lifeReducer,
      {
        replacements: [
          {
            replacementId: "multi-event-gain-one-more",
            controllerId: "p1",
            optional: false,
            replacementKind: "standard",
            applicationScope: { kind: "multi-event", scopeId: "draw-or-gain-group-1" },
            applies: (_state, event) => event.name === "gain-life",
            replace: (_state, event) =>
              event.name === "gain-life"
                ? { event: { ...event, data: { ...event.data, amount: event.data.amount + 1 } } }
                : { event },
          },
        ],
      },
    );

    expect(result.state.players.p1!.life).toBe(23);
    expect(result.batch?.events[0]!.replacementIds).toEqual(["multi-event-gain-one-more"]);
    expect(result.batch?.events[1]!.replacementIds).toEqual([]);
  });

  it("recollects applicability after each same-stage modification", () => {
    const initial = createState();
    const replaceAmount = (
      replacementId: string,
      applies: (amount: number) => boolean,
      transform: (amount: number) => number,
    ): FabReplacementEffect => ({
      replacementId,
      controllerId: "p1",
      optional: false,
      replacementKind: "standard",
      applicationScope: { kind: "original-event" },
      applies: (_state, event) => event.name === "gain-life" && applies(event.data.amount),
      replace: (_state, event) =>
        event.name === "gain-life"
          ? { event: { ...event, data: { ...event.data, amount: transform(event.data.amount) } } }
          : { event },
    });

    const newlyActive = commitProposedEventBatch(initial, [gainLife("p1", 1)], lifeReducer, {
      // The first candidate is initially inactive. Applying the later candidate
      // makes it active, so the stage must be scanned again.
      replacements: [
        replaceAmount(
          "active-after-set-two",
          (amount) => amount === 2,
          (amount) => amount + 10,
        ),
        replaceAmount(
          "set-two",
          (amount) => amount === 1,
          () => 2,
        ),
      ],
    });
    expect(newlyActive.state.players.p1!.life).toBe(32);
    expect(newlyActive.batch?.events[0]?.replacementIds).toEqual([
      "set-two",
      "active-after-set-two",
    ]);

    const madeInactive = commitProposedEventBatch(initial, [gainLife("p1", 1)], lifeReducer, {
      replacements: [
        replaceAmount(
          "set-two-first",
          (amount) => amount === 1,
          () => 2,
        ),
        replaceAmount(
          "only-while-one",
          (amount) => amount === 1,
          (amount) => amount + 100,
        ),
      ],
    });
    expect(madeInactive.state.players.p1!.life).toBe(22);
    expect(madeInactive.batch?.events[0]?.replacementIds).toEqual(["set-two-first"]);
  });

  it("orders each stage by the selected player and preserves each controller's order", () => {
    const initial = createState();
    const replacement = (
      replacementId: string,
      controllerId: string,
      transform: (amount: number) => number,
    ): FabReplacementEffect => ({
      replacementId,
      controllerId,
      optional: false,
      replacementKind: "standard",
      applicationScope: { kind: "original-event" },
      applies: (_state, event) => event.name === "gain-life",
      replace: (_state, event) =>
        event.name === "gain-life"
          ? { event: { ...event, data: { ...event.data, amount: transform(event.data.amount) } } }
          : { event },
    });
    const replacements = [
      replacement("p2-multiply", "p2", (amount) => amount * 10),
      replacement("p1-add-one", "p1", (amount) => amount + 1),
    ];

    const p1First = commitProposedEventBatch(initial, [gainLife("p1", 1)], lifeReducer, {
      replacements,
      replacementPlayerOrder: (_event, controllers) => {
        expect(controllers).toEqual(["p2", "p1"]);
        return ["p1", "p2"];
      },
    });
    expect(p1First.state.players.p1!.life).toBe(40);
    expect(p1First.batch?.events[0]?.replacementIds).toEqual(["p1-add-one", "p2-multiply"]);

    const p2First = commitProposedEventBatch(initial, [gainLife("p1", 1)], lifeReducer, {
      replacements,
      replacementPlayerOrder: () => ["p2", "p1"],
    });
    expect(p2First.state.players.p1!.life).toBe(31);
    expect(p2First.batch?.events[0]?.replacementIds).toEqual(["p2-multiply", "p1-add-one"]);
  });

  it("enforces CR replacement-kind stages while preserving order within a stage", () => {
    const initial = createState();
    const replaceAmount = (
      replacementId: string,
      replacementKind: "self-or-identity" | "standard" | "prevention" | "outcome",
      transform: (amount: number) => number,
    ): FabReplacementEffect => ({
      replacementId,
      controllerId: "p1",
      optional: false,
      replacementKind,
      applicationScope: { kind: "original-event" },
      applies: (_state, event): boolean => event.name === "gain-life",
      replace: (_state, event) =>
        event.name === "gain-life"
          ? { event: { ...event, data: { ...event.data, amount: transform(event.data.amount) } } }
          : { event },
    });

    const result = commitProposedEventBatch(initial, [gainLife("p1", 1)], lifeReducer, {
      // Deliberately reverse the kind stages. The two standards remain in the
      // declared within-stage order: +5, then ×2.
      replacements: [
        replaceAmount("outcome", "outcome", (amount) => amount * 10),
        replaceAmount("prevention", "prevention", (amount) => amount + 100),
        replaceAmount("standard-add", "standard", (amount) => amount + 5),
        replaceAmount("standard-multiply", "standard", (amount) => amount * 2),
        replaceAmount("self", "self-or-identity", (amount) => amount + 3),
      ],
    });

    // (((1 + 3) + 5) × 2 + 100) × 10 = 1180, then base life 20.
    expect(result.state.players.p1!.life).toBe(1_200);
    expect(result.batch?.events[0]?.replacementIds).toEqual([
      "self",
      "standard-add",
      "standard-multiply",
      "prevention",
      "outcome",
    ]);
  });

  it("commits nested events in deterministic order and guards recursion", () => {
    const initial = createState();
    const nestedReducer: FabEventReducer = (snapshot, event) => {
      if (event.name !== "gain-life" || event.data.amount === 0) return null;
      const state = snapshot as FabMatchState;
      state.players[event.data.playerId]!.life += event.data.amount;
      return event.data.amount === 2
        ? { state, followUpEvents: [gainLife(event.data.playerId, 1)] }
        : { state };
    };

    const result = commitProposedEventBatch(initial, [gainLife("p1", 2)], nestedReducer);
    expect(result.state.players.p1!.life).toBe(23);
    expect(result.batch?.events.map((event) => event.eventId)).toEqual(["event-1", "event-2"]);

    const loopingReducer: FabEventReducer = (snapshot, event) => ({
      state: snapshot as FabMatchState,
      followUpEvents: [event],
    });
    expect(() =>
      commitProposedEventBatch(initial, [gainLife("p1", 1)], loopingReducer, {
        maxIterations: 3,
      }),
    ).toThrow("FAB loop iteration limit exceeded (transaction-kernel: event queue)");
  });
});
