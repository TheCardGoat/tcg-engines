import { flawlessSpiritOfMordred, mordredBurnishedAvenger } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveLevelUpCandidates } from "../../procedures/activation/activation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const decoySpirit: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "lineage-keyword-decoy-spirit",
  slug: "lineage-keyword-decoy-spirit",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lineage-keyword-decoy-spirit:face:default",
      catalogId: "lineage-keyword-decoy-spirit",
      name: "Mordred Decoy Spirit",
      lineageName: "Mordred",
      cost: { kind: "memory", amount: 0 },
      typeLine: { supertypes: [], types: ["CHAMPION"], classes: ["SPIRIT"], subtypes: [] },
      elements: ["WATER"],
      stats: { level: 0, life: 15 },
      rulesText: "",
      abilities: [],
    },
  },
};

const memoryCard: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "lineage-keyword-memory-card",
  slug: "lineage-keyword-memory-card",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lineage-keyword-memory-card:face:default",
      catalogId: "lineage-keyword-memory-card",
      name: "Lineage Keyword Memory Card",
      cost: { kind: "reserve", amount: 0 },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["SPIRIT"], subtypes: [] },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

describe("Grand Archive Lineage keyword", () => {
  it("requires the candidate's named previous champion in discovery and admission", () => {
    const program = createGrandArchiveMatchProgram([
      decoySpirit,
      flawlessSpiritOfMordred,
      mordredBurnishedAvenger,
      memoryCard,
    ]);
    const player = (
      id: string,
      startingChampionDefinitionId: string,
    ): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: memoryCard.canonicalId, count: 2 }],
      materialDeck: [
        { definitionId: startingChampionDefinitionId, count: 1 },
        { definitionId: mordredBurnishedAvenger.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [
          player("p1", decoySpirit.canonicalId),
          player("p2", flawlessSpiritOfMordred.canonicalId),
        ],
        firstPlayerId: "p1",
        randomSeed: 1901,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const champion = (playerId: typeof p1) => initial.objects[initial.zones[playerId].field[0]!]!;
    const candidate = (playerId: typeof p1) =>
      initial.zones[playerId]["material-deck"].find(
        (id) => initial.objects[id]?.definitionId === mordredBurnishedAvenger.canonicalId,
      )!;

    expect(
      grandArchiveLevelUpCandidates(program, initial, champion(p1), {
        program,
        state: initial,
        controllerId: p1,
        bindings: {},
      }),
    ).toHaveLength(0);
    expect(
      grandArchiveLevelUpCandidates(program, initial, champion(p2), {
        program,
        state: initial,
        controllerId: p2,
        bindings: {},
      }).map((card) => card.id),
    ).toEqual([candidate(p2)]);

    const memoryId = initial.zones[p1]["main-deck"][0]!;
    const prepared = {
      ...initial,
      turn: { ...initial.turn, phase: "materialize" as const, materializeChoicePending: true },
      opportunity: null,
      zones: {
        ...initial.zones,
        [p1]: {
          ...initial.zones[p1],
          "main-deck": initial.zones[p1]["main-deck"].filter((id) => id !== memoryId),
          memory: [memoryId],
        },
      },
      objects: {
        ...initial.objects,
        [memoryId]: { ...initial.objects[memoryId]!, zone: "memory" as const },
      },
    };
    const result = new GrandArchiveMatchRuntime(program, prepared).execute(
      { move: "materialize", cardId: candidate(p1) },
      { playerId: p1 },
    );
    expect(result).toMatchObject({ ok: false, code: "illegal-command" });
    if (result.ok) throw new Error("The decoy champion unexpectedly satisfied Lineage");
    expect(result.message).toContain("Lineage restriction");
  });
});
