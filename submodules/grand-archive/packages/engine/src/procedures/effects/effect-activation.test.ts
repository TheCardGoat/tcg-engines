import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchiveElement,
  GrandArchivePrintedCost,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION" | "ITEM",
  cost: GrandArchivePrintedCost,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  options: {
    readonly supertypes?: readonly "REGALIA"[];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
  } = {},
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
        ...(type === "CHAMPION" ? { lineageName: canonicalId } : {}),
        cost,
        typeLine: {
          supertypes: options.supertypes ?? [],
          types: [type],
          classes: ["MAGE"],
          subtypes: [],
        },
        elements: options.elements ?? ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("effect-activation-champion", "CHAMPION", {
  kind: "memory",
  amount: 0,
});
const filler = card("effect-activation-filler", "ACTION", { kind: "reserve", amount: 0 });

function sourceCard(
  effect: GrandArchiveEffect,
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return card("effect-activation-source", "ACTION", { kind: "reserve", amount: 0 }, [
    {
      id: "effectActivationSource-a1",
      kind: "card-resolution",
      text: "Choose and play the test card.",
      effect: {
        kind: "choose",
        selection: {
          id: "chosen-card",
          kind: "choice",
          declared: "resolution",
          chooser: "controller",
          count: { kind: "exactly", amount: 1 },
          candidates: {
            kind: "card",
            zones: ["banishment"],
            relationship: "zone-of",
            player: "controller",
          },
        },
        effect,
      },
    },
  ]);
}

function setup(
  source: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  played: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly sourceId: GrandArchiveObjectId;
  readonly playedId: GrandArchiveObjectId;
  readonly paymentId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([champion, filler, source, played]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: played.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 9 },
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
      randomSeed: 419,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  )!;
  const playedObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === played.canonicalId,
  )!;
  const paymentObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
  )!;
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    ...(sourceObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: sourceObject.id,
            from: sourceObject.zone,
            to: "hand" as const,
          },
        ]),
    {
      type: "object-moved",
      objectId: playedObject.id,
      from: playedObject.zone,
      to: "banishment",
      banishedBySourceId: sourceObject.id,
    },
    ...(paymentObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved" as const,
            objectId: paymentObject.id,
            from: paymentObject.zone,
            to: "hand" as const,
          },
        ]),
  ]).state;
  return {
    program,
    state,
    sourceId: sourceObject.id,
    playedId: playedObject.id,
    paymentId: paymentObject.id,
  };
}

function resolveToChoice(runtime: GrandArchiveMatchRuntime, sourceId: GrandArchiveObjectId): void {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: p1 }).ok).toBe(
    true,
  );
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
}

function answer(runtime: GrandArchiveMatchRuntime, answerValue: unknown): void {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a pending decision");
  const result = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: answerValue,
    },
    { playerId: decision.playerId },
  );
  if (!result.ok) throw new Error(result.message);
}

describe("effect-granted card activation and play", () => {
  it("announces a paid activation from banishment and defers it until the parent resolves", () => {
    const played = card("paid-effect-activation", "ACTION", { kind: "reserve", amount: 1 }, [
      {
        id: "paidEffectActivation-a1",
        kind: "card-resolution",
        text: "Draw a card.",
        effect: { kind: "draw", player: "controller", amount: 1 },
      },
    ]);
    const source = sourceCard({
      kind: "activate-card",
      subject: { kind: "bound", binding: "chosen-card" },
      payCosts: true,
    });
    const fixture = setup(source, played);
    let runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveToChoice(runtime, fixture.sourceId);
    answer(runtime, [fixture.playedId]);
    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-activation",
      playerId: grandArchivePlayerId("p1"),
      cardId: fixture.playedId,
      payCosts: true,
    });

    runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );
    answer(runtime, { reservePayment: [{ kind: "card", cardId: fixture.paymentId }] });
    expect(runtime.state.objects[fixture.playedId]?.zone).toBe("effects-stack");
    expect(runtime.state.objects[fixture.paymentId]?.zone).toBe("memory");
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "card-activation",
      cardId: fixture.playedId,
      controllerId: grandArchivePlayerId("p1"),
    });
  });

  it("applies effect cost modifiers and explicit element bypass", () => {
    const played = card(
      "modified-effect-activation",
      "ACTION",
      { kind: "reserve", amount: 3 },
      [],
      { elements: ["FIRE"] },
    );
    const source = sourceCard({
      kind: "activate-card",
      subject: { kind: "bound", binding: "chosen-card" },
      payCosts: true,
      ignoreElementRequirements: true,
      costModifiers: [{ operation: "subtract", amount: 3 }],
    });
    const fixture = setup(source, played);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveToChoice(runtime, fixture.sourceId);
    answer(runtime, [fixture.playedId]);
    answer(runtime, {});

    expect(runtime.state.objects[fixture.playedId]?.zone).toBe("effects-stack");
    expect(runtime.state.objects[fixture.paymentId]?.zone).toBe("hand");
  });

  it("activates without paying costs while preserving the announced stack item", () => {
    const played = card("free-effect-activation", "ACTION", { kind: "reserve", amount: 5 }, [], {
      elements: ["FIRE"],
    });
    const source = sourceCard({
      kind: "activate-card",
      subject: { kind: "bound", binding: "chosen-card" },
      payCosts: false,
      ignoreElementRequirements: true,
    });
    const fixture = setup(source, played);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveToChoice(runtime, fixture.sourceId);
    answer(runtime, [fixture.playedId]);
    answer(runtime, {});

    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "card-activation",
      cardId: fixture.playedId,
      paidCostKind: "none",
      activationPayment: [],
    });
  });

  it("dispatches generic play to materialization for a regalia card", () => {
    const played = card("generically-played-regalia", "ITEM", { kind: "memory", amount: 0 }, [], {
      supertypes: ["REGALIA"],
    });
    const source = sourceCard({
      kind: "play-card",
      subject: { kind: "bound", binding: "chosen-card" },
      payCosts: true,
    });
    const fixture = setup(source, played);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveToChoice(runtime, fixture.sourceId);
    answer(runtime, [fixture.playedId]);
    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-materialization",
      cardId: fixture.playedId,
    });
    answer(runtime, {});
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      cardId: fixture.playedId,
    });
  });

  it("plays the card tracked as banished by the resolving source", () => {
    const played = card("source-banished-action", "ACTION", { kind: "reserve", amount: 0 });
    const source = card("source-linked-play", "ACTION", { kind: "reserve", amount: 0 }, [
      {
        id: "sourceLinkedPlay-a1",
        kind: "card-resolution",
        text: "Play the card banished by this object.",
        effect: {
          kind: "play-card",
          subject: {
            kind: "each",
            collection: {
              zones: ["banishment"],
              host: { kind: "source" },
              relationship: "banished-by",
            },
          },
          payCosts: true,
        },
      },
    ]);
    const fixture = setup(source, played);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveToChoice(runtime, fixture.sourceId);

    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-activation",
      cardId: fixture.playedId,
    });
    answer(runtime, {});
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "card-activation",
      cardId: fixture.playedId,
    });
  });
});
