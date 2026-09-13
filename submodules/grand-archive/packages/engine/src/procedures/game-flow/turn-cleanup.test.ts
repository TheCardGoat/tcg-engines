import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "./initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "./runtime.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
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
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: ["NORM"],
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 5 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("turn-cleanup-champion", "CHAMPION");
const ally = card("turn-cleanup-ally", "ALLY");
const filler = card("turn-cleanup-filler", "ACTION");

function setupPlayer(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive end-phase cleanup", () => {
  it("clears temporary ally damage while preserving permanent champion damage", () => {
    const program = createGrandArchiveMatchProgram([champion, ally, filler]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [setupPlayer("p1"), setupPlayer("p2")],
        firstPlayerId: "p1",
        randomSeed: 751,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const championId = initial.zones[p1].field[0]!;
    const allyId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: allyId, from: "main-deck", to: "field" },
      { type: "damage-marked", objectId: championId, amount: 3 },
      { type: "damage-marked", objectId: allyId, amount: 2 },
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: grandArchivePlayerId("p2") }).ok).toBe(
      true,
    );

    expect(runtime.state.objects[allyId]?.damage).toBe(0);
    expect(runtime.state.objects[championId]?.damage).toBe(3);
  });
});
