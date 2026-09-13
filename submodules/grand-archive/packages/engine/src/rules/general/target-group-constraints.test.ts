import { rollingChorus, squallsnare } from "@tcg/grand-archive-cards";
import type { GrandArchiveAnyCard, GrandArchiveTargetDeclaration } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { declareGrandArchiveTargets } from "../../procedures/activation/activation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";

function card(id: string, type: "ACTION" | "ALLY" | "CHAMPION", reserveCost = 0) {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: id,
        cost:
          type === "CHAMPION"
            ? ({ kind: "memory", amount: 0 } as const)
            : ({ kind: "reserve", amount: reserveCost } as const),
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 1 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  } satisfies GrandArchiveAnyCard;
}

const champion = card("target-group-champion", "CHAMPION");
const allyTwoA = card("target-group-ally-two-a", "ALLY", 2);
const allyTwoB = card("target-group-ally-two-b", "ALLY", 2);
const allyThree = card("target-group-ally-three", "ALLY", 3);
const filler = card("target-group-filler", "ACTION");

function printedTarget(
  definition: typeof squallsnare | typeof rollingChorus,
): GrandArchiveTargetDeclaration {
  if (definition.layout.kind !== "single-faced") throw new Error("Expected a single-faced card");
  const ability = definition.layout.face.abilities.find(
    (candidate) => candidate.kind === "card-resolution",
  );
  const target = ability?.targets?.[0];
  if (!target) throw new Error(`${definition.slug} has no printed target declaration`);
  return target;
}

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    allyTwoA,
    allyTwoB,
    allyThree,
    filler,
    rollingChorus,
    squallsnare,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 2 },
      ...(id === "p1"
        ? [
            { definitionId: allyTwoA.canonicalId, count: 1 },
            { definitionId: allyTwoB.canonicalId, count: 1 },
            { definitionId: allyThree.canonicalId, count: 1 },
          ]
        : []),
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
      randomSeed: 811,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const owned = (playerId: typeof p1, definitionId: string) =>
    Object.values(initial.objects).filter(
      (object) => object.ownerId === playerId && object.definitionId === definitionId,
    );
  const allies = [allyTwoA, allyTwoB, allyThree].map((definition) => {
    const object = owned(p1, definition.canonicalId)[0];
    if (!object) throw new Error(`Missing ${definition.slug}`);
    return object;
  });
  const p1Fillers = owned(p1, filler.canonicalId);
  const p2Filler = owned(p2, filler.canonicalId)[0];
  if (p1Fillers.length < 2 || !p2Filler) throw new Error("Missing graveyard fixture cards");
  const kernel = new GrandArchiveTransactionKernel();
  const state = kernel.transact(initial, [
    ...allies.map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: "main-deck" as const,
      to: "field" as const,
    })),
    ...[p1Fillers[0]!, p1Fillers[1]!, p2Filler].map((object) => ({
      type: "object-moved" as const,
      objectId: object.id,
      from: "main-deck" as const,
      to: "graveyard" as const,
    })),
  ]).state;
  const evaluation = {
    program,
    state,
    controllerId: p1,
    sourceId: state.zones[p1].field[0]!,
    bindings: {},
  };
  return {
    evaluation,
    allyIds: allies.map((object) => object.id),
    p1GraveyardIds: p1Fillers.map((object) => object.id),
    p2GraveyardId: p2Filler.id,
  } satisfies {
    evaluation: Parameters<typeof declareGrandArchiveTargets>[2];
    allyIds: readonly GrandArchiveObjectId[];
    p1GraveyardIds: readonly GrandArchiveObjectId[];
    p2GraveyardId: GrandArchiveObjectId;
  };
}

describe("Grand Archive target group constraints", () => {
  it("enforces Squallsnare's shared reserve cost", () => {
    const fixture = setup();
    const target = printedTarget(squallsnare);
    expect(
      declareGrandArchiveTargets(
        [target],
        { [target.id]: [fixture.allyIds[0]!, fixture.allyIds[1]!] },
        fixture.evaluation,
      )[0]?.targetIds,
    ).toEqual([fixture.allyIds[0], fixture.allyIds[1]]);
    expect(() =>
      declareGrandArchiveTargets(
        [target],
        { [target.id]: [fixture.allyIds[0]!, fixture.allyIds[2]!] },
        fixture.evaluation,
      ),
    ).toThrow(/share reserve-cost/);
  });

  it("enforces Rolling Chorus's single-graveyard requirement", () => {
    const fixture = setup();
    const target = printedTarget(rollingChorus);
    expect(
      declareGrandArchiveTargets(
        [target],
        { [target.id]: fixture.p1GraveyardIds },
        fixture.evaluation,
      )[0]?.targetIds,
    ).toEqual(fixture.p1GraveyardIds);
    expect(() =>
      declareGrandArchiveTargets(
        [target],
        { [target.id]: [fixture.p1GraveyardIds[0]!, fixture.p2GraveyardId] },
        fixture.evaluation,
      ),
    ).toThrow(/one zone owner/);
  });
});
