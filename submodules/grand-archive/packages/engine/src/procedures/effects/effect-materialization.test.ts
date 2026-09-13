import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveElement,
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
  cost: { readonly kind: "reserve" | "memory"; readonly amount: number },
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  options: {
    readonly supertypes?: readonly "REGALIA"[];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
    readonly level?: number;
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
        stats:
          type === "CHAMPION"
            ? { level: options.level ?? 0, life: 20 }
            : type === "ITEM"
              ? { durability: 1 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("effect-materialize-champion", "CHAMPION", {
  kind: "memory",
  amount: 0,
});
const filler = card("effect-materialize-filler", "ACTION", { kind: "reserve", amount: 0 });

function setup(
  source: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  materialCard: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
  readonly sourceId: GrandArchiveObjectId;
  readonly materialCardIds: Readonly<Record<"p1" | "p2", GrandArchiveObjectId>>;
} {
  const program = createGrandArchiveMatchProgram([champion, filler, source, materialCard]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 9 },
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: materialCard.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 317,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const sourceObject = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === source.canonicalId,
  )!;
  const materialCardIds = {
    p1: Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === materialCard.canonicalId,
    )!.id,
    p2: Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === materialCard.canonicalId,
    )!.id,
  };
  const paymentCards = [p1, p2].map(
    (playerId) =>
      Object.values(initial.objects).find(
        (object) => object.ownerId === playerId && object.definitionId === filler.canonicalId,
      )!,
  );
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
    ...paymentCards.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: object.zone,
      to: "memory" as const,
    })),
  ]).state;
  return {
    program,
    state,
    sourceId: sourceObject.id,
    materialCardIds,
  };
}

function resolveSourceToChoice(
  runtime: GrandArchiveMatchRuntime,
  sourceId: GrandArchiveObjectId,
): void {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: p1 }).ok).toBe(
    true,
  );
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
}

function answerCurrentDecision(
  runtime: GrandArchiveMatchRuntime,
  player: "p1" | "p2",
  answer: unknown,
): void {
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a pending decision");
  const result = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer,
    },
    { playerId: grandArchivePlayerId(player) },
  );
  if (!result.ok) throw new Error(result.message);
}

describe("effect-granted materialization", () => {
  it("announces, pays, defers, and resolves a materialization during another resolution", () => {
    const materialCard = card(
      "effect-materialized-regalia",
      "ITEM",
      { kind: "memory", amount: 1 },
      [],
      { supertypes: ["REGALIA"] },
    );
    const source = card("effect-materialize-source", "ACTION", { kind: "reserve", amount: 0 }, [
      {
        id: "effect-materialize-source-a1",
        kind: "card-resolution",
        text: "Materialize a regalia card from your material deck.",
        effect: {
          kind: "choose",
          selection: {
            id: "chosen-material-card",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            candidates: {
              kind: "card",
              zones: ["material-deck"],
              relationship: "zone-of",
              player: "controller",
              filter: { kind: "supertype", oneOf: ["REGALIA"] },
            },
          },
          effect: {
            kind: "materialize-card",
            subject: { kind: "bound", binding: "chosen-material-card" },
            payCosts: true,
          },
        },
      },
    ]);
    const fixture = setup(source, materialCard);
    let runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveSourceToChoice(runtime, fixture.sourceId);

    expect(runtime.state.decision?.kind).toBe("resolve-effect-choice");
    answerCurrentDecision(runtime, "p1", [fixture.materialCardIds.p1]);
    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-materialization",
      playerId: grandArchivePlayerId("p1"),
      cardId: fixture.materialCardIds.p1,
      payCosts: true,
    });

    runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
      ),
    );

    answerCurrentDecision(runtime, "p1", {});
    expect(runtime.state.objects[fixture.materialCardIds.p1]?.zone).toBe("effects-stack");
    expect(runtime.state.zones[grandArchivePlayerId("p1")].memory).toHaveLength(0);
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      cardId: fixture.materialCardIds.p1,
      controllerId: grandArchivePlayerId("p1"),
    });

    expect(runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p1") }).ok).toBe(
      true,
    );
    expect(runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p2") }).ok).toBe(
      true,
    );
    expect(runtime.state.objects[fixture.materialCardIds.p1]?.zone).toBe("field");
  });

  it("uses the explicitly named materializer instead of the effect controller", () => {
    const materialCard = card(
      "opponent-materialized-regalia",
      "ITEM",
      { kind: "memory", amount: 1 },
      [],
      { supertypes: ["REGALIA"] },
    );
    const source = card("opponent-materialize-source", "ACTION", { kind: "reserve", amount: 0 }, [
      {
        id: "opponent-materialize-source-a1",
        kind: "card-resolution",
        text: "Target opponent may materialize a card from their material deck.",
        effect: {
          kind: "choose",
          selection: {
            id: "opponent-material-card",
            kind: "choice",
            declared: "resolution",
            chooser: "opponent",
            count: { kind: "exactly", amount: 1 },
            candidates: {
              kind: "card",
              zones: ["material-deck"],
              relationship: "zone-of",
              player: "opponent",
              filter: { kind: "supertype", oneOf: ["REGALIA"] },
            },
          },
          effect: {
            kind: "materialize-card",
            subject: { kind: "bound", binding: "opponent-material-card" },
            materializer: "opponent",
            payCosts: true,
          },
        },
      },
    ]);
    const fixture = setup(source, materialCard);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveSourceToChoice(runtime, fixture.sourceId);

    answerCurrentDecision(runtime, "p2", [fixture.materialCardIds.p2]);
    expect(runtime.state.decision).toMatchObject({
      kind: "announce-effect-materialization",
      playerId: grandArchivePlayerId("p2"),
    });
    answerCurrentDecision(runtime, "p2", {});
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      controllerId: grandArchivePlayerId("p2"),
      cardId: fixture.materialCardIds.p2,
    });
    expect(runtime.state.zones[grandArchivePlayerId("p2")].memory).toHaveLength(0);
  });

  it("gives an effect-permitted opposing card to its materializer on the Effects Stack", () => {
    const materialCard = card(
      "cross-owner-materialized-regalia",
      "ITEM",
      { kind: "memory", amount: 0 },
      [],
      { supertypes: ["REGALIA"] },
    );
    const source = card(
      "cross-owner-materialize-source",
      "ACTION",
      { kind: "reserve", amount: 0 },
      [
        {
          id: "cross-owner-materialize-source-a1",
          kind: "card-resolution",
          text: "Materialize an opponent's regalia card under your control without paying its costs.",
          effect: {
            kind: "choose",
            selection: {
              id: "opposing-material-card",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "card",
                zones: ["material-deck"],
                relationship: "zone-of",
                player: "opponent",
                filter: { kind: "supertype", oneOf: ["REGALIA"] },
              },
            },
            effect: {
              kind: "materialize-card",
              subject: { kind: "bound", binding: "opposing-material-card" },
              materializer: "controller",
              payCosts: false,
            },
          },
        },
      ],
    );
    const fixture = setup(source, materialCard);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveSourceToChoice(runtime, fixture.sourceId);

    answerCurrentDecision(runtime, "p1", [fixture.materialCardIds.p2]);
    answerCurrentDecision(runtime, "p1", {});

    expect(runtime.state.objects[fixture.materialCardIds.p2]).toMatchObject({
      zone: "effects-stack",
      ownerId: grandArchivePlayerId("p2"),
      baseControllerId: grandArchivePlayerId("p1"),
      controllerId: grandArchivePlayerId("p1"),
    });
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      cardId: fixture.materialCardIds.p2,
      controllerId: grandArchivePlayerId("p1"),
    });
  });

  it("honors an effect that ignores elemental requirements", () => {
    const materialCard = card(
      "ignored-element-regalia",
      "ITEM",
      { kind: "memory", amount: 0 },
      [],
      { supertypes: ["REGALIA"], elements: ["FIRE"] },
    );
    const source = card("ignore-element-source", "ACTION", { kind: "reserve", amount: 0 }, [
      {
        id: "ignore-element-source-a1",
        kind: "card-resolution",
        text: "Materialize a regalia card, ignoring its elemental requirements.",
        effect: {
          kind: "choose",
          selection: {
            id: "ignored-element-card",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            candidates: {
              kind: "card",
              zones: ["material-deck"],
              relationship: "zone-of",
              player: "controller",
              filter: { kind: "supertype", oneOf: ["REGALIA"] },
            },
          },
          effect: {
            kind: "materialize-card",
            subject: { kind: "bound", binding: "ignored-element-card" },
            ignoreElementRequirements: true,
          },
        },
      },
    ]);
    const fixture = setup(source, materialCard);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveSourceToChoice(runtime, fixture.sourceId);
    answerCurrentDecision(runtime, "p1", [fixture.materialCardIds.p1]);
    answerCurrentDecision(runtime, "p1", {});
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      cardId: fixture.materialCardIds.p1,
    });
  });

  it("lets an explicitly tracked materialization attempt fail without applying its consequence", () => {
    const materialCard = card(
      "attempted-materialized-regalia",
      "ITEM",
      { kind: "memory", amount: 1 },
      [],
      { supertypes: ["REGALIA"] },
    );
    const source = card("attempt-materialize-source", "ACTION", { kind: "reserve", amount: 0 }, [
      {
        id: "attempt-materialize-source-a1",
        kind: "card-resolution",
        text: "Materialize a regalia card. If you do, draw a card.",
        effect: {
          kind: "choose",
          selection: {
            id: "attempted-material-card",
            kind: "choice",
            declared: "resolution",
            chooser: "controller",
            count: { kind: "exactly", amount: 1 },
            candidates: {
              kind: "card",
              zones: ["material-deck"],
              relationship: "zone-of",
              player: "controller",
              filter: { kind: "supertype", oneOf: ["REGALIA"] },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "attempt",
                bindSucceededAs: "materialization-succeeded",
                effect: {
                  kind: "materialize-card",
                  subject: { kind: "bound", binding: "attempted-material-card" },
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "effect-succeeded",
                  binding: "materialization-succeeded",
                },
                then: { kind: "draw", player: "controller", amount: 1 },
              },
            ],
          },
        },
      },
    ]);
    const fixture = setup(source, materialCard);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    resolveSourceToChoice(runtime, fixture.sourceId);
    answerCurrentDecision(runtime, "p1", [fixture.materialCardIds.p1]);
    const handBefore = runtime.state.zones[grandArchivePlayerId("p1")].hand.length;
    answerCurrentDecision(runtime, "p1", false);

    expect(runtime.state.objects[fixture.materialCardIds.p1]?.zone).toBe("material-deck");
    expect(runtime.state.zones[grandArchivePlayerId("p1")].hand).toHaveLength(handBefore);
    expect(runtime.state.stack).toHaveLength(0);
  });
});
