import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { shuffleGrandArchiveObjects } from "../../game/random.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("shuffle-champion", "CHAMPION");
const cards = Array.from({ length: 6 }, (_, index) => card(`shuffle-card-${index}`, "ACTION"));

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: cards.map((definition) => ({ definitionId: definition.canonicalId, count: 1 })),
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive shuffle effects", () => {
  it("randomizes the complete ordered zone deterministically and preserves it in snapshots", () => {
    const program = createGrandArchiveMatchProgram([champion, ...cards]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 550,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const before = initial.zones[p1]["main-deck"];
    const expected = shuffleGrandArchiveObjects(before, initial.random);
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      { kind: "shuffle", player: "controller", zone: "main-deck" },
      { program, state: initial, controllerId: p1, bindings: {} },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    expect(result.state.zones[p1]["main-deck"]).toEqual(expected.value);
    expect(result.state.random).toEqual(expected.random);
    expect(new Set(result.state.zones[p1]["main-deck"])).toEqual(new Set(before));
    expect(result.events.map((event) => event.type)).toEqual([
      "random-state-changed",
      "zone-reordered",
    ]);
    const restored = restoreGrandArchiveMatchSnapshot(
      program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(result.state))),
    );
    expect(restored.zones[p1]["main-deck"]).toEqual(expected.value);
    expect(restored.random).toEqual(expected.random);
  });
});
