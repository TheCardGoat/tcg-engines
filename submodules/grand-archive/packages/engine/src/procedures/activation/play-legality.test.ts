import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePrintedCost,
  GrandArchiveSupertype,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function champion(
  canonicalId: string,
  level: number,
  lineageName: string,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  subtypes: readonly string[] = [],
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
        lineageName,
        cost: { kind: "memory", amount: 0 },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: ["MAGE"],
          subtypes,
        },
        elements: ["NORM"],
        stats: { level, life: 20 },
        rulesText: "",
        abilities,
      },
    },
  };
}

function regalia(
  canonicalId: string,
  cost: GrandArchivePrintedCost,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  supertypes: readonly GrandArchiveSupertype[] = ["REGALIA"],
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
        cost,
        typeLine: {
          supertypes,
          types: ["ITEM"],
          classes: ["MAGE"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const filler = regalia("play-legality-filler", { kind: "none" }, [], []);

function setup(
  currentChampion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  materialCards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  mainCards: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[] = [],
) {
  const program = createGrandArchiveMatchProgram([
    currentChampion,
    ...materialCards,
    ...mainCards,
    filler,
  ]);
  const player = (
    id: string,
    includeMaterialCards: boolean,
    includeMainCards: boolean,
  ): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(includeMainCards
        ? mainCards.map((card) => ({ definitionId: card.canonicalId, count: 1 }))
        : []),
    ],
    materialDeck: [
      { definitionId: currentChampion.canonicalId, count: 1 },
      ...(includeMaterialCards
        ? materialCards.map((card) => ({ definitionId: card.canonicalId, count: 1 }))
        : []),
    ],
    startingChampionDefinitionId: currentChampion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", true, true), player("p2", false, false)],
      firstPlayerId: "p1",
      randomSeed: 213,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, initial };
}

function objectId(
  state: ReturnType<typeof createGrandArchiveMatchInitialState>,
  definitionId: string,
) {
  const p1 = grandArchivePlayerId("p1");
  return Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === definitionId,
  )!.id;
}

function enterMaterializePhase(state: ReturnType<typeof createGrandArchiveMatchInitialState>) {
  return new GrandArchiveTransactionKernel().transact(state, [
    { type: "opportunity-closed" },
    { type: "phase-changed", phase: "materialize" },
  ]).state;
}

describe("Grand Archive play and level-up legality", () => {
  it("rejects materialization of a card without a memory cost", () => {
    const current = champion("memory-only-current", 0, "MemoryOnly");
    const reserveRegalia = regalia("reserve-cost-regalia", { kind: "reserve", amount: 0 });
    const { program, initial } = setup(current, [reserveRegalia]);
    const p1 = grandArchivePlayerId("p1");
    const regaliaId = objectId(initial, reserveRegalia.canonicalId);
    const runtime = new GrandArchiveMatchRuntime(program, enterMaterializePhase(initial));
    const before = runtime.state;

    const result = runtime.execute({ move: "materialize", cardId: regaliaId }, { playerId: p1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("memory costs");
    expect(runtime.state).toBe(before);
  });

  it("enforces active prohibitions on natural materialization", () => {
    const current = champion("forbid-materialize-current", 0, "ForbidMaterialize");
    const target = regalia("forbidden-zero-regalia", { kind: "memory", amount: 0 });
    const blocker = regalia("materialization-blocker", { kind: "none" }, [
      {
        id: "materializationBlocker-a1",
        kind: "static",
        staticKind: "effects",
        text: "Players can't materialize cards with memory cost 0.",
        effects: [
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "materialize",
            subject: { kind: "player", player: "each-player" },
            filter: {
              kind: "numeric",
              comparison: {
                left: {
                  kind: "property",
                  subject: { kind: "candidate" },
                  property: "memory-cost",
                  basis: "base",
                },
                operator: "eq",
                right: 0,
              },
            },
            duration: { kind: "while-source-on-field" },
          },
        ],
      },
    ]);
    const { program, initial } = setup(current, [target], [blocker]);
    const p1 = grandArchivePlayerId("p1");
    const targetId = objectId(initial, target.canonicalId);
    const blockerId = objectId(initial, blocker.canonicalId);
    const positioned = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: blockerId,
        from: initial.objects[blockerId]!.zone,
        to: "field",
      },
      { type: "opportunity-closed" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, positioned);
    const result = runtime.execute({ move: "materialize", cardId: targetId }, { playerId: p1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toContain("forbidden");
  });

  it("uses an explicit level-up permission to override the default lineage and level rule", () => {
    const current = champion("same-level-current", 0, "Mordred", [
      {
        id: "sameLevelCurrent-a1",
        kind: "static",
        staticKind: "effects",
        text: "This champion can level up into champions of the same base level.",
        effects: [
          {
            kind: "rule-modification",
            mode: "allow",
            action: "level-up",
            subject: { kind: "source" },
            destinationFilter: {
              kind: "numeric",
              comparison: {
                left: {
                  kind: "property",
                  subject: { kind: "candidate" },
                  property: "level",
                  basis: "base",
                },
                operator: "eq",
                right: {
                  kind: "property",
                  subject: { kind: "source" },
                  property: "level",
                  basis: "base",
                },
              },
            },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const destination = champion("same-level-destination", 0, "Tristan");
    const { program, initial } = setup(current, [destination]);
    const p1 = grandArchivePlayerId("p1");
    const destinationId = objectId(initial, destination.canonicalId);
    const runtime = new GrandArchiveMatchRuntime(program, enterMaterializePhase(initial));

    const result = runtime.execute(
      { move: "materialize", cardId: destinationId },
      { playerId: p1 },
    );
    if (!result.ok) throw new Error(result.message);
    expect(runtime.state.stack.at(-1)).toMatchObject({
      kind: "materialization",
      cardId: destinationId,
    });
  });

  it("enforces level-up destination requirements and absolute prohibitions", () => {
    const requiredCurrent = champion(
      "required-lineage-current",
      0,
      "RequiredLineage",
      [
        {
          id: "requiredLineageCurrent-a1",
          kind: "static",
          staticKind: "effects",
          text: "This champion can only level up into an Alpha champion.",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "level-up",
              subject: { kind: "source" },
              destinationFilter: { kind: "subtype", oneOf: ["ALPHA"] },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
      ["ALPHA"],
    );
    const invalidDestination = champion(
      "required-lineage-destination",
      1,
      "RequiredLineage",
      [],
      ["BETA"],
    );
    const requiredFixture = setup(requiredCurrent, [invalidDestination]);
    const p1 = grandArchivePlayerId("p1");
    const invalidId = objectId(requiredFixture.initial, invalidDestination.canonicalId);
    const requiredRuntime = new GrandArchiveMatchRuntime(
      requiredFixture.program,
      enterMaterializePhase(requiredFixture.initial),
    );
    const requiredResult = requiredRuntime.execute(
      { move: "materialize", cardId: invalidId },
      { playerId: p1 },
    );
    expect(requiredResult.ok).toBe(false);
    if (!requiredResult.ok) expect(requiredResult.message).toContain("requirement");

    const forbiddenCurrent = champion("forbidden-level-current", 0, "ForbiddenLevel", [
      {
        id: "forbiddenLevelCurrent-a1",
        kind: "static",
        staticKind: "effects",
        text: "This champion can't level up.",
        effects: [
          {
            kind: "rule-modification",
            mode: "forbid",
            action: "level-up",
            subject: { kind: "source" },
            duration: { kind: "while-source-in-functional-zone" },
          },
        ],
      },
    ]);
    const otherwiseLegal = champion("forbidden-level-destination", 1, "ForbiddenLevel");
    const forbiddenFixture = setup(forbiddenCurrent, [otherwiseLegal]);
    const legalId = objectId(forbiddenFixture.initial, otherwiseLegal.canonicalId);
    const forbiddenRuntime = new GrandArchiveMatchRuntime(
      forbiddenFixture.program,
      enterMaterializePhase(forbiddenFixture.initial),
    );
    const forbiddenResult = forbiddenRuntime.execute(
      { move: "materialize", cardId: legalId },
      { playerId: p1 },
    );
    expect(forbiddenResult.ok).toBe(false);
    if (!forbiddenResult.ok) expect(forbiddenResult.message).toContain("forbidden");
  });
});
