import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import type { GrandArchiveProposedEvent } from "./events.ts";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";
import { serializeGrandArchiveMatchSnapshot } from "../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId,
    slug: canonicalId,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${canonicalId}:face:default`,
        catalogId: canonicalId,
        name: canonicalId,
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("transaction-safety-champion", "CHAMPION");
const filler = card("transaction-safety-filler", "ACTION");

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 8 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

class FailingTransactionKernel extends GrandArchiveTransactionKernel {
  #transactionCount = 0;

  public constructor(private readonly failureTransaction: number) {
    super();
  }

  public override transact(
    state: GrandArchiveMatchState,
    events: readonly GrandArchiveProposedEvent[],
  ): ReturnType<GrandArchiveTransactionKernel["transact"]> {
    this.#transactionCount += 1;
    if (this.#transactionCount === this.failureTransaction) {
      throw new Error(`Injected transaction ${this.failureTransaction} failure`);
    }
    return super.transact(state, events);
  }
}

describe("Grand Archive command transaction safety", () => {
  it("rejects zero-magnitude damage events at the mutation boundary", () => {
    const program = createGrandArchiveMatchProgram([champion, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 815,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const championId = initial.zones[grandArchivePlayerId("p1")].field[0]!;

    expect(() =>
      new GrandArchiveTransactionKernel().transact(initial, [
        { type: "damage-marked", objectId: championId, amount: 0 },
      ]),
    ).toThrow("Damage must be positive");
  });

  it("defensively owns the initial state received by the runtime", () => {
    const program = createGrandArchiveMatchProgram([champion, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 816,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const runtime = new GrandArchiveMatchRuntime(program, initial);
    const championId = initial.zones[grandArchivePlayerId("p1")].field[0]!;

    Reflect.set(initial.turn, "phase", "end");
    Reflect.set(initial.objects[championId]!, "damage", 99);

    expect(runtime.state).not.toBe(initial);
    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.objects[championId]?.damage).toBe(0);
  });

  it("rolls back every event batch when later automatic work fails", () => {
    const program = createGrandArchiveMatchProgram([champion, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 817,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const endPhase = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(
      program,
      endPhase,
      new FailingTransactionKernel(3),
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const retained = runtime.state;
    const retainedSnapshot = serializeGrandArchiveMatchSnapshot(retained);

    const rejected = runtime.execute({ move: "pass" }, { playerId: p2 });

    expect(rejected).toMatchObject({
      ok: false,
      code: "internal-error",
      diagnostic: {
        baseStateVersion: retained.stateVersion,
        cause: "Injected transaction 3 failure",
      },
    });
    expect(rejected.state).toBe(retained);
    expect(runtime.state).toBe(retained);
    expect(serializeGrandArchiveMatchSnapshot(runtime.state)).toEqual(retainedSnapshot);

    const retry = runtime.execute({ move: "pass" }, { playerId: p2 });
    expect(retry.ok).toBe(true);
    expect(runtime.state.stateVersion).toBeGreaterThan(retained.stateVersion);
  });

  it("refuses branching replacement expansion without publishing partial state", () => {
    const program = createGrandArchiveMatchProgram([champion, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 818,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const retainedSnapshot = serializeGrandArchiveMatchSnapshot(initial);
    const affectedPlayerId = grandArchivePlayerId("p1");
    const kernel = new GrandArchiveTransactionKernel({
      maximumReplacementDepth: 100,
      maximumTransactionSteps: 5,
      collectReplacements: (_state, event) => {
        const rule = event.cause?.kind === "rule" ? event.cause.rule : "";
        if (event.type !== "phase-changed" || !rule.startsWith("branch:")) return [];
        const generation = Number(rule.slice("branch:".length));
        if (!Number.isSafeInteger(generation) || generation >= 10) return [];
        return [
          {
            id: `branch:${generation}`,
            affectedPlayerId,
            apply: (proposed) => {
              if (proposed.type !== "phase-changed") return { kind: "unchanged" };
              const child: GrandArchiveProposedEvent = {
                ...proposed,
                cause: { kind: "rule", rule: `branch:${generation + 1}` },
              };
              return { kind: "replaced", events: [child, child] };
            },
          },
        ];
      },
    });

    expect(() =>
      kernel.transact(initial, [
        {
          type: "phase-changed",
          phase: "end",
          cause: { kind: "rule", rule: "branch:0" },
        },
      ]),
    ).toThrow("Transaction processing limit exceeded");
    expect(serializeGrandArchiveMatchSnapshot(initial)).toEqual(retainedSnapshot);
  });

  it("rejects invalid transaction-step limits at construction", () => {
    expect(() => new GrandArchiveTransactionKernel({ maximumTransactionSteps: 0 })).toThrow(
      "maximumTransactionSteps must be a positive safe integer",
    );
  });
});
