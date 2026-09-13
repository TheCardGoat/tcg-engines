import { adventOfTheStormcaller } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { projectGrandArchiveViewerLog } from "../../log/projection.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("partition-champion", "CHAMPION");

function adventPartitionDestinations(): Extract<
  GrandArchiveEffect,
  { readonly kind: "move-partition" }
>["destinations"] {
  if (adventOfTheStormcaller.layout.kind !== "single-faced") {
    throw new Error("Advent of the Stormcaller must be single-faced");
  }
  const resolution = adventOfTheStormcaller.layout.face.abilities.find(
    (ability) => ability.kind === "card-resolution",
  );
  if (resolution?.kind !== "card-resolution" || resolution.effect?.kind !== "sequence") {
    throw new Error("Advent of the Stormcaller must have its catalog resolution sequence");
  }
  const partition = resolution.effect.effects.find(
    (effect): effect is Extract<GrandArchiveEffect, { readonly kind: "move-partition" }> =>
      effect.kind === "move-partition",
  );
  if (!partition) throw new Error("Advent of the Stormcaller must have a move partition");
  return partition.destinations;
}

const partitionSource = card("partition-source", "ACTION", [
  {
    id: "partitionSource-a1",
    kind: "card-resolution",
    text: "Put the cards in your graveyard on the top and/or bottom of your deck in any order.",
    effect: {
      kind: "move-partition",
      subject: {
        kind: "each",
        collection: { zones: ["graveyard"], player: "controller" },
      },
      chooser: "controller",
      destinations: adventPartitionDestinations(),
    },
  },
]);
const payloads = Array.from({ length: 5 }, (_, index) =>
  card(`partition-payload-${index}`, "ACTION"),
);

function setup(withGraveyard = true): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly sourceId: GrandArchiveObjectId;
  readonly affectedIds: readonly GrandArchiveObjectId[];
  readonly untouchedId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([champion, partitionSource, ...payloads]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [partitionSource, ...payloads].map((definition) => ({
      definitionId: definition.canonicalId,
      count: 1,
    })),
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 147,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = (definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId}`);
    return object.id;
  };
  const sourceId = objectId(partitionSource.canonicalId);
  const payloadIds = payloads.map((definition) => objectId(definition.canonicalId));
  const affectedIds = withGraveyard ? payloadIds.slice(0, 4) : [];
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: sourceId,
      from: initial.objects[sourceId]!.zone,
      to: "hand",
    },
    ...affectedIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "graveyard" as const,
    })),
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    sourceId,
    affectedIds,
    untouchedId: payloadIds[4]!,
  };
}

function resolveToPartition(fixture: ReturnType<typeof setup>) {
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  expect(
    fixture.runtime.execute({ move: "activate-card", cardId: fixture.sourceId }, { playerId: p1 })
      .ok,
  ).toBe(true);
  expect(fixture.runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(fixture.runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
  const decision = fixture.runtime.state.decision;
  if (!decision || decision.kind !== "resolve-move-partition") {
    throw new Error("Expected a move partition decision");
  }
  return decision;
}

describe("Grand Archive move partitions", () => {
  it("requires an exact ordered partition and applies top-to-bottom and bottom order", () => {
    const fixture = setup();
    const decision = resolveToPartition(fixture);
    const runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const answer = (partitions: readonly [readonly string[], readonly string[]]) =>
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: { partitions },
        },
        { playerId: decision.playerId },
      );

    expect(answer([[fixture.affectedIds[0]!], [fixture.affectedIds[1]!]]).ok).toBe(false);
    expect(
      answer([
        [fixture.affectedIds[0]!, fixture.affectedIds[0]!],
        [fixture.affectedIds[1]!, fixture.affectedIds[2]!, fixture.affectedIds[3]!],
      ]).ok,
    ).toBe(false);
    const accepted = answer([
      [fixture.affectedIds[2]!, fixture.affectedIds[0]!],
      [fixture.affectedIds[3]!, fixture.affectedIds[1]!],
    ]);
    expect(accepted.ok).toBe(true);
    if (!accepted.ok) throw new Error("Expected the exact move partition to be accepted");

    expect(runtime.state.zones[decision.playerId]["main-deck"]).toEqual([
      fixture.affectedIds[2],
      fixture.affectedIds[0],
      fixture.untouchedId,
      fixture.affectedIds[3],
      fixture.affectedIds[1],
    ]);
    expect(runtime.state.objects[fixture.sourceId]?.zone).toBe("graveyard");

    const privatePlacementMoves = accepted.events.filter(
      (event) =>
        event.type === "object-moved" && event.from === "graveyard" && event.to === "main-deck",
    );
    expect(privatePlacementMoves).toHaveLength(4);
    expect(
      privatePlacementMoves.map((event) =>
        event.type === "object-moved" ? event.orderedPrivatePlacementKnowledge : undefined,
      ),
    ).toEqual(Array.from({ length: 4 }, () => "owner-only"));

    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const ownerMoves = projectGrandArchiveViewerLog(
      fixture.program,
      runtime.state,
      p1,
      privatePlacementMoves,
    );
    const opponentMoves = projectGrandArchiveViewerLog(
      fixture.program,
      runtime.state,
      p2,
      privatePlacementMoves,
    );
    expect(ownerMoves.map((message) => message.key)).toEqual(
      Array.from({ length: 4 }, () => "grand-archive.card.moved"),
    );
    expect(opponentMoves.map((message) => message.key)).toEqual(
      Array.from({ length: 4 }, () => "grand-archive.card.moved.hidden"),
    );
    for (const payload of payloads.slice(0, 4)) {
      expect(JSON.stringify(opponentMoves)).not.toContain(payload.canonicalId);
    }

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(runtime.state))),
    );
    expect(
      restored.eventHistory
        .filter(
          (event) =>
            event.type === "object-moved" && event.from === "graveyard" && event.to === "main-deck",
        )
        .map((event) =>
          event.type === "object-moved" ? event.orderedPrivatePlacementKnowledge : undefined,
        ),
    ).toEqual(Array.from({ length: 4 }, () => "owner-only"));
  });

  it("does not ask for a partition when the affected set is empty", () => {
    const fixture = setup(false);
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    expect(
      fixture.runtime.execute({ move: "activate-card", cardId: fixture.sourceId }, { playerId: p1 })
        .ok,
    ).toBe(true);
    expect(fixture.runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(fixture.runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
    expect(fixture.runtime.state.decision).toBeNull();
    expect(fixture.runtime.state.objects[fixture.sourceId]?.zone).toBe("graveyard");
  });
});
