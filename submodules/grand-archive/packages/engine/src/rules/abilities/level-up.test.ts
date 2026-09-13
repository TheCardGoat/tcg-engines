import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import type { GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function champion(
  canonicalId: string,
  level: number,
  lineageName: string,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        cost: { kind: "memory", amount: level },
        typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: { level, life: 20 },
        rulesText: "",
        abilities,
      },
    },
  };
}

function action(
  canonicalId: string,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: ["ACTION"], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        speed: "slow",
        stats: {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const baseChampion = champion("level-up-base", 0, "Spirit");
const firstLevel = champion("level-up-first", 1, "Test Hero", [
  {
    id: "levelUpFirst-a1",
    kind: "triggered",
    text: "On Enter: Put an entered counter on this champion.",
    trigger: {
      kind: "event",
      event: { name: "object-entered-field", subject: { kind: "source" } },
    },
    effect: {
      kind: "add-counter",
      subject: { kind: "source" },
      counter: { named: "entered" },
      amount: 1,
    },
  },
]);
const alternateFirstLevel = champion("level-up-alternate", 1, "Another Hero");
const wrongLevel = champion("level-up-wrong-level", 2, "Test Hero");
const wrongLineage = champion("level-up-wrong-lineage", 1, "Other Hero", [
  {
    id: "wrong-lineage-a1",
    kind: "static",
    staticKind: "intrinsic",
    text: "Other Hero Lineage",
    keyword: { name: "lineage", lineageName: "Other Hero" },
  },
]);
const filler = action("level-up-filler");
const source = action("level-up-source", [
  {
    id: "levelUpSource-a1",
    kind: "card-resolution",
    text: "Level up your champion.",
    effect: {
      kind: "level-up",
      subject: { kind: "champion", player: "controller" },
    },
  },
]);

function setup(includeAlternate: boolean): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly championId: GrandArchiveObjectId;
  readonly sourceId: GrandArchiveObjectId;
  readonly firstLevelId: GrandArchiveObjectId;
  readonly alternateFirstLevelId?: GrandArchiveObjectId;
  readonly wrongLevelId: GrandArchiveObjectId;
  readonly wrongLineageId: GrandArchiveObjectId;
} {
  const definitions = [
    baseChampion,
    firstLevel,
    alternateFirstLevel,
    wrongLevel,
    wrongLineage,
    filler,
    source,
  ];
  const program = createGrandArchiveMatchProgram(definitions);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: source.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 9 },
    ],
    materialDeck: [
      { definitionId: baseChampion.canonicalId, count: 1 },
      { definitionId: firstLevel.canonicalId, count: id === "p1" ? 1 : 0 },
      {
        definitionId: alternateFirstLevel.canonicalId,
        count: id === "p1" && includeAlternate ? 1 : 0,
      },
      { definitionId: wrongLevel.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: wrongLineage.canonicalId, count: id === "p1" ? 1 : 0 },
    ],
    startingChampionDefinitionId: baseChampion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 744,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const object = (definitionId: string) =>
    Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    )!;
  const championObject = object(baseChampion.canonicalId);
  const sourceObject = object(source.canonicalId);
  const firstLevelObject = object(firstLevel.canonicalId);
  const alternateObject = includeAlternate ? object(alternateFirstLevel.canonicalId) : undefined;
  const wrongLevelObject = object(wrongLevel.canonicalId);
  const wrongLineageObject = object(wrongLineage.canonicalId);
  const prepared = new GrandArchiveTransactionKernel().transact(
    initial,
    sourceObject.zone === "hand"
      ? []
      : [
          {
            type: "object-moved",
            objectId: sourceObject.id,
            from: sourceObject.zone,
            to: "hand",
          },
        ],
  ).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    championId: championObject.id,
    sourceId: sourceObject.id,
    firstLevelId: firstLevelObject.id,
    ...(alternateObject ? { alternateFirstLevelId: alternateObject.id } : {}),
    wrongLevelId: wrongLevelObject.id,
    wrongLineageId: wrongLineageObject.id,
  };
}

function resolveSource(runtime: GrandArchiveMatchRuntime, sourceId: GrandArchiveObjectId): void {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(runtime.execute({ move: "activate-card", cardId: sourceId }, { playerId: p1 }).ok).toBe(
    true,
  );
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
}

describe("Grand Archive effect-driven champion level-up", () => {
  it("levels directly into the sole compatible material-deck card and creates On Enter", () => {
    const fixture = setup(false);
    resolveSource(fixture.runtime, fixture.sourceId);

    expect(fixture.runtime.state.decision).toBeNull();
    expect(fixture.runtime.state.objects[fixture.championId]?.activeDefinitionId).toBe(
      firstLevel.canonicalId,
    );
    expect(fixture.runtime.state.objects[fixture.firstLevelId]).toMatchObject({
      zone: "inner-lineage",
      hostId: fixture.championId,
      facing: "face-up",
    });
    expect(fixture.runtime.state.stack.at(-1)).toMatchObject({
      kind: "triggered-ability",
      sourceId: fixture.championId,
      ability: { id: "levelUpFirst-a1" },
    });
  });

  it("keeps lineage face-up and returns a delevel card face-down to the material deck", () => {
    const fixture = setup(false);
    resolveSource(fixture.runtime, fixture.sourceId);

    const leveledCard = fixture.runtime.state.objects[fixture.firstLevelId];
    const leveledChampionVersion = fixture.runtime.state.objects[fixture.championId]!.objectVersion;
    expect(leveledCard).toMatchObject({
      zone: "inner-lineage",
      hostId: fixture.championId,
      facing: "face-up",
    });

    const deleveled = new GrandArchiveTransactionKernel().transact(fixture.runtime.state, [
      {
        type: "champion-deleveled",
        championId: fixture.championId,
        cardId: fixture.firstLevelId,
      },
    ]).state;

    expect(deleveled.objects[fixture.firstLevelId]).toMatchObject({
      zone: "material-deck",
      hostId: undefined,
      facing: "face-down",
    });
    expect(deleveled.objects[fixture.championId]?.activeDefinitionId).toBe(
      baseChampion.canonicalId,
    );
    expect(deleveled.objects[fixture.championId]?.objectVersion).toBe(leveledChampionVersion + 1);
  });

  it("offers only compatible next-level cards and preserves the choice in snapshots", () => {
    const fixture = setup(true);
    resolveSource(fixture.runtime, fixture.sourceId);
    expect(fixture.runtime.state.decision).toMatchObject({
      kind: "resolve-level-up",
      championId: fixture.championId,
      candidateCardIds: expect.arrayContaining([
        fixture.firstLevelId,
        fixture.alternateFirstLevelId,
      ]),
    });
    const decision = fixture.runtime.state.decision;
    if (!decision || decision.kind !== "resolve-level-up") {
      throw new Error("Expected a level-up choice");
    }
    expect(decision.candidateCardIds).not.toContain(fixture.wrongLevelId);
    expect(decision.candidateCardIds).not.toContain(fixture.wrongLineageId);

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const invalid = restored.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: fixture.wrongLevelId,
      },
      { playerId: decision.playerId },
    );
    expect(invalid.ok).toBe(false);
    const selected = restored.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: fixture.alternateFirstLevelId,
      },
      { playerId: decision.playerId },
    );
    if (!selected.ok) throw new Error(selected.message);
    expect(restored.state.objects[fixture.championId]?.activeDefinitionId).toBe(
      alternateFirstLevel.canonicalId,
    );
    expect(restored.state.objects[fixture.alternateFirstLevelId!]).toMatchObject({
      zone: "inner-lineage",
      hostId: fixture.championId,
    });
    expect(restored.state.objects[fixture.firstLevelId]?.zone).toBe("material-deck");
  });
});
