import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  collectExpiredGrandArchiveContinuousEffects,
  grandArchiveObjectTimestamp,
} from "./continuous.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { grandArchiveMasteryTimestamp } from "../../game/mastery.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  level = 0,
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
        stats:
          type === "CHAMPION" ? { level, life: 20 } : type === "ALLY" ? { power: 1, life: 3 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const baseChampion = card("timestamp-base-champion", "CHAMPION");
const levelChampion = card("timestamp-level-champion", "CHAMPION", 1);
const firstAlly = card("timestamp-first-ally", "ALLY");
const secondAlly = card("timestamp-second-ally", "ALLY");
const boonStandIn = card("timestamp-boon-stand-in", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    baseChampion,
    levelChampion,
    firstAlly,
    secondAlly,
    boonStandIn,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck:
      id === "p1"
        ? [
            { definitionId: firstAlly.canonicalId, count: 1 },
            { definitionId: secondAlly.canonicalId, count: 1 },
            { definitionId: boonStandIn.canonicalId, count: 1 },
          ]
        : [{ definitionId: firstAlly.canonicalId, count: 1 }],
    materialDeck: [
      { definitionId: baseChampion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: levelChampion.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: baseChampion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 643,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const objectId = (definitionId: string) => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing timestamp fixture ${definitionId}`);
    return object.id;
  };
  return {
    program,
    state,
    p1,
    championId: state.zones[p1].field[0]!,
    levelId: objectId(levelChampion.canonicalId),
    firstAllyId: objectId(firstAlly.canonicalId),
    secondAllyId: objectId(secondAlly.canonicalId),
    boonId: objectId(boonStandIn.canonicalId),
  };
}

function objectTimestamp(
  fixture: ReturnType<typeof setup>,
  state: ReturnType<typeof setup>["state"],
  objectId: ReturnType<typeof setup>["championId"],
) {
  return grandArchiveObjectTimestamp(state.objects[objectId]!, {
    program: fixture.program,
    state,
    controllerId: fixture.p1,
    sourceId: objectId,
    abilityBearerId: objectId,
    bindings: {},
  });
}

describe("Grand Archive continuous-effect timestamps", () => {
  it("keeps the champion object's original timestamp while timestamping a new lineage card", () => {
    const fixture = setup();
    const leveled = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "champion-leveled-up",
        championId: fixture.championId,
        cardId: fixture.levelId,
      },
    ]).state;

    expect(objectTimestamp(fixture, leveled, fixture.championId)).toBe(0);
    expect(objectTimestamp(fixture, leveled, fixture.levelId)).toBe(leveled.stateVersion);
  });

  it("timestamps a bestowed card when it returns to the Pantheon", () => {
    const fixture = setup();
    const bestowed = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.boonId,
        from: "main-deck",
        to: "effects-stack",
      },
      {
        type: "object-moved",
        objectId: fixture.boonId,
        from: "effects-stack",
        to: "pantheon",
      },
    ]);
    expect(bestowed.result.events.at(-1)).toMatchObject({
      type: "object-moved",
      objectId: fixture.boonId,
      to: "pantheon",
    });
    expect(objectTimestamp(fixture, bestowed.state, fixture.boonId)).toBe(
      bestowed.state.stateVersion,
    );
  });

  it("orders simultaneous field entries by their committed sequence", () => {
    const fixture = setup();
    const entered = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.firstAllyId,
        from: "main-deck",
        to: "field",
      },
      {
        type: "object-moved",
        objectId: fixture.secondAllyId,
        from: "main-deck",
        to: "field",
      },
    ]).state;

    expect(objectTimestamp(fixture, entered, fixture.firstAllyId)).toBeLessThan(
      objectTimestamp(fixture, entered, fixture.secondAllyId),
    );
  });

  it("timestamps a mastery when that player gains it", () => {
    const fixture = setup();
    const gained = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "mastery-changed", playerId: fixture.p1, mastery: "Shifting Currents" },
    ]).state;

    expect(grandArchiveMasteryTimestamp(gained, fixture.p1)).toBe(gained.stateVersion);
  });

  it("evaluates a zone duration with the continuous instance's captured bindings", () => {
    const fixture = setup();
    const inGraveyard = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.firstAllyId,
        from: fixture.state.objects[fixture.firstAllyId]!.zone,
        to: "graveyard",
      },
    ]).state;
    const state = {
      ...inGraveyard,
      continuousEffects: [
        {
          id: "bound-zone-duration",
          controllerId: fixture.p1,
          effect: {
            kind: "continuous" as const,
            subjects: { kind: "bound" as const, binding: "subject" },
            affectedSet: "locked" as const,
            duration: {
              kind: "while-subjects-in-zone" as const,
              subjects: { kind: "bound" as const, binding: "subject" },
              zone: "graveyard" as const,
              scope: "all" as const,
            },
            layer: { layer: "D" as const, modifies: "ability" as const },
            change: { kind: "grant-keyword" as const, keyword: { name: "taunt" as const } },
          },
          affectedObjectIds: [fixture.firstAllyId],
          affectedObjectIncarnations: {
            [fixture.firstAllyId]: inGraveyard.objects[fixture.firstAllyId]!.incarnation,
          },
          bindings: { subject: [fixture.firstAllyId] },
          variables: {},
          durationAnchors: {},
          createdAtVersion: inGraveyard.stateVersion,
          createdTurnNumber: inGraveyard.turn.number,
          createdPhase: inGraveyard.turn.phase,
        },
      ],
    };

    expect(
      collectExpiredGrandArchiveContinuousEffects({
        program: fixture.program,
        state,
        controllerId: state.turn.playerId,
        bindings: {},
      }),
    ).toEqual([]);
  });
});
