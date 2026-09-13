import { blessedClergy, lesserBoonOfRegret, titheProclamation } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
  GrandArchiveRulesType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { openGrandArchiveOpportunity } from "../../procedures/game-flow/opportunity.ts";
import { grandArchivePlayerActionCountThisTurn } from "../state/rule-modifications.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: Extract<GrandArchiveRulesType, "ACTION" | "CHAMPION" | "ITEM">,
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
        cost: type === "ACTION" ? { kind: "reserve", amount: 0 } : { kind: "memory", amount: 0 },
        typeLine: {
          supertypes: type === "ITEM" ? ["REGALIA"] : [],
          types: [type],
          classes: ["CLERIC"],
          subtypes: [],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities:
          type === "ACTION"
            ? [
                {
                  id: `${canonicalId}-a1`,
                  kind: "card-resolution",
                  text: "No effect.",
                  effect: { kind: "no-op" },
                },
              ]
            : [],
      },
    },
  };
}

const champion = card("player-limit-champion", "CHAMPION");
const action = card("player-limit-action", "ACTION");
const materialItem = card("player-limit-material-item", "ITEM");
const cards = [
  champion,
  action,
  materialItem,
  blessedClergy,
  lesserBoonOfRegret,
  titheProclamation,
] as const;

function setup() {
  const program = createGrandArchiveMatchProgram(cards);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: action.canonicalId, count: 12 },
      { definitionId: lesserBoonOfRegret.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: blessedClergy.canonicalId, count: 1 },
            { definitionId: titheProclamation.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: materialItem.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 977,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectIds(
  state: GrandArchiveMatchState,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
): readonly GrandArchiveObjectId[] {
  return Object.values(state.objects)
    .filter((object) => object.ownerId === ownerId && object.definitionId === definitionId)
    .map((object) => object.id);
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  options: {
    readonly controllerId?: ReturnType<typeof grandArchivePlayerId>;
    readonly sourceId?: GrandArchiveObjectId;
    readonly bindings?: Readonly<
      Record<string, readonly GrandArchiveObjectId[] | readonly string[]>
    >;
  } = {},
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: options.controllerId ?? fixture.p1,
      ...(options.sourceId ? { sourceId: options.sourceId } : {}),
      bindings: options.bindings ?? {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function titheOnField(fixture: ReturnType<typeof setup>, firstTurn: boolean) {
  const titheId = objectIds(fixture.state, fixture.p1, titheProclamation.canonicalId)[0]!;
  const events = [
    {
      type: "object-moved" as const,
      objectId: titheId,
      from: "main-deck" as const,
      to: "field" as const,
    },
    ...(firstTurn
      ? []
      : [
          {
            type: "turn-started" as const,
            playerId: fixture.p1,
            turnNumber: 3,
          },
        ]),
  ];
  return new GrandArchiveTransactionKernel().transact(fixture.state, events).state;
}

function blessedClergyPlayRule(): GrandArchiveEffect {
  if (blessedClergy.layout.kind !== "single-faced") {
    throw new Error("Blessed Clergy must be single-faced");
  }
  const ability = blessedClergy.layout.face.abilities.find(
    (candidate) => candidate.kind === "triggered" && candidate.id === "a3pmmloejo-a2",
  );
  if (
    !ability ||
    ability.kind !== "triggered" ||
    !ability.effect ||
    ability.effect.kind !== "conditional"
  ) {
    throw new Error("Blessed Clergy's play-limit effect is missing");
  }
  return ability.effect.then;
}

function passCurrentOpportunity(runtime: GrandArchiveMatchRuntime) {
  const first = runtime.state.opportunity?.holderId;
  if (!first) throw new Error("Expected an Opportunity holder");
  const firstPass = runtime.execute({ move: "pass" }, { playerId: first });
  if (!firstPass.ok) throw new Error(firstPass.message);
  const second = runtime.state.opportunity?.holderId;
  if (!second) throw new Error("Expected the next Opportunity holder");
  const secondPass = runtime.execute({ move: "pass" }, { playerId: second });
  if (!secondPass.ok) throw new Error(secondPass.message);
  return secondPass;
}

function playLimitState(fixture: ReturnType<typeof setup>) {
  const sourceId = objectIds(fixture.state, fixture.p1, blessedClergy.canonicalId)[0]!;
  const actionIds = objectIds(fixture.state, fixture.p2, action.canonicalId).slice(0, 3);
  const positioned = new GrandArchiveTransactionKernel().transact(
    fixture.state,
    actionIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "hand" as const,
    })),
  ).state;
  const limited = execute(fixture, positioned, blessedClergyPlayRule(), {
    sourceId,
    bindings: { "target-player": [fixture.p2] },
  }).state;
  const targetTurn = new GrandArchiveTransactionKernel().transact(limited, [
    { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
    { type: "phase-changed", phase: "main" },
  ]).state;
  const ready = new GrandArchiveTransactionKernel().transact(targetTurn, [
    {
      type: "opportunity-opened",
      window: openGrandArchiveOpportunity(targetTurn, fixture.p2, "phase-begin"),
    },
  ]).state;
  return { state: ready, actionIds };
}

describe("Grand Archive player action limits", () => {
  it("caps Tithe Proclamation draws discretely after a player's first turn", () => {
    const fixture = setup();
    const secondTurn = titheOnField(fixture, false);
    const result = execute(fixture, secondTurn, {
      kind: "draw",
      player: "controller",
      amount: 5,
    });

    expect(result.events.filter((event) => event.type === "object-moved")).toHaveLength(3);
    expect(grandArchivePlayerActionCountThisTurn(result.state, fixture.p1, "draw")).toBe(3);

    const firstTurn = execute(fixture, titheOnField(fixture, true), {
      kind: "draw",
      player: "controller",
      amount: 5,
    });
    expect(firstTurn.events.filter((event) => event.type === "object-moved")).toHaveLength(5);
  });

  it("counts prior effect draws and suppresses a capped turn draw without decking out", () => {
    const fixture = setup();
    const drawn = execute(fixture, titheOnField(fixture, false), {
      kind: "draw",
      player: "controller",
      amount: 3,
    });
    const kernel = new GrandArchiveTransactionKernel();
    const emptied = kernel.transact(
      drawn.state,
      drawn.state.zones[fixture.p1]["main-deck"].map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "graveyard" as const,
      })),
    ).state;
    const recollection = kernel.transact(emptied, [
      { type: "phase-changed", phase: "recollection" },
    ]).state;
    const ready = kernel.transact(recollection, [
      {
        type: "opportunity-opened",
        window: openGrandArchiveOpportunity(recollection, fixture.p1, "phase-begin"),
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, ready);
    const result = passCurrentOpportunity(runtime);

    expect(result.events.some((event) => event.type === "player-lost")).toBe(false);
    expect(
      result.events.some(
        (event) =>
          event.type === "object-moved" &&
          event.cause?.kind === "rule" &&
          event.cause.rule === "draw-turn-based-action",
      ),
    ).toBe(false);
    expect(runtime.state.turn.phase).toBe("main");
    expect(runtime.state.players[fixture.p1]?.lost).toBe(false);
  });

  it("shares Blessed Clergy's two-card cap across every way of playing a card", () => {
    const fixture = setup();
    const prepared = playLimitState(fixture);
    const boonId = objectIds(prepared.state, fixture.p2, lesserBoonOfRegret.canonicalId)[0]!;
    const boonReady = new GrandArchiveTransactionKernel().transact(prepared.state, [
      { type: "object-moved", objectId: boonId, from: "main-deck", to: "pantheon" },
    ]).state;
    const firstBoonRuntime = new GrandArchiveMatchRuntime(fixture.program, boonReady);
    const firstBoon = firstBoonRuntime.execute(
      { move: "bestow-boon", cardId: boonId },
      { playerId: fixture.p2 },
    );
    if (!firstBoon.ok) throw new Error(firstBoon.message);
    expect(grandArchivePlayerActionCountThisTurn(firstBoonRuntime.state, fixture.p2, "play")).toBe(
      1,
    );

    const materialId = objectIds(prepared.state, fixture.p2, materialItem.canonicalId)[0]!;
    const materialReady = new GrandArchiveTransactionKernel().transact(prepared.state, [
      { type: "opportunity-closed" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const firstMaterialRuntime = new GrandArchiveMatchRuntime(fixture.program, materialReady);
    const firstMaterial = firstMaterialRuntime.execute(
      { move: "materialize", cardId: materialId },
      { playerId: fixture.p2 },
    );
    if (!firstMaterial.ok) throw new Error(firstMaterial.message);
    expect(
      grandArchivePlayerActionCountThisTurn(firstMaterialRuntime.state, fixture.p2, "play"),
    ).toBe(1);

    const runtime = new GrandArchiveMatchRuntime(fixture.program, prepared.state);

    for (const cardId of prepared.actionIds.slice(0, 2)) {
      const activation = runtime.execute(
        { move: "activate-card", cardId },
        { playerId: fixture.p2 },
      );
      if (!activation.ok) throw new Error(activation.message);
      passCurrentOpportunity(runtime);
    }
    expect(grandArchivePlayerActionCountThisTurn(runtime.state, fixture.p2, "play")).toBe(2);

    const third = runtime.execute(
      { move: "activate-card", cardId: prepared.actionIds[2]! },
      { playerId: fixture.p2 },
    );
    expect(third).toMatchObject({ ok: false, code: "illegal-command" });

    const boonState = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-moved",
        objectId: boonId,
        from: "main-deck",
        to: "pantheon",
      },
    ]).state;
    const boonRuntime = new GrandArchiveMatchRuntime(fixture.program, boonState);
    expect(
      boonRuntime.execute({ move: "bestow-boon", cardId: boonId }, { playerId: fixture.p2 }),
    ).toMatchObject({ ok: false, code: "illegal-command" });

    const materialState = new GrandArchiveTransactionKernel().transact(runtime.state, [
      { type: "opportunity-closed" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const materialRuntime = new GrandArchiveMatchRuntime(fixture.program, materialState);
    expect(
      materialRuntime.execute(
        { move: "materialize", cardId: materialId },
        { playerId: fixture.p2 },
      ),
    ).toMatchObject({ ok: false, code: "illegal-command" });
  });
});
