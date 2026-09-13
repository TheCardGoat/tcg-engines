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
import { collectGrandArchiveStateBasedEvents } from "../../rules/state/state-based.ts";

function champion(
  canonicalId: string,
  name: string,
  level: number,
  lineageName: string | undefined,
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
        name,
        ...(lineageName ? { lineageName } : {}),
        cost: { kind: "memory", amount: 0 },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: ["WARRIOR"],
          subtypes: ["WARRIOR", "HUMAN"],
        },
        elements: ["NORM"],
        stats: { level, life: 20 },
        rulesText: "",
        abilities,
      },
    },
  };
}

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "playing-cards-filler",
  slug: "playing-cards-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "playing-cards-filler:face:default",
      catalogId: "playing-cards-filler",
      name: "Playing Cards Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

describe("playing-card lifecycle legality", () => {
  it("rechecks an explicit champion Lineage restriction before resolution", () => {
    const flawlessSpirit = champion("flawless-spirit", "Flawless Spirit of Mordred", 0, undefined);
    const replacementSpirit = champion(
      "replacement-spirit",
      "Ordinary Spirit of Mordred",
      0,
      "Mordred",
    );
    const restrictedLevelOne = champion(
      "restricted-mordred",
      "Mordred, Burnished Avenger",
      1,
      "Mordred",
      [
        {
          id: "restricted-mordred-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Flawless Spirit of Mordred Lineage",
          keyword: { name: "lineage", lineageName: "Flawless Spirit of Mordred" },
        },
      ],
    );
    const program = createGrandArchiveMatchProgram([
      flawlessSpirit,
      replacementSpirit,
      restrictedLevelOne,
      filler,
    ]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 10 }],
      materialDeck: [
        { definitionId: flawlessSpirit.canonicalId, count: 1 },
        { definitionId: replacementSpirit.canonicalId, count: 1 },
        { definitionId: restrictedLevelOne.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: flawlessSpirit.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 909,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const currentChampionId = initial.zones[p1].field[0]!;
    const replacementSpiritId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === replacementSpirit.canonicalId,
    )!.id;
    const restrictedLevelOneId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === restrictedLevelOne.canonicalId,
    )!.id;
    const prepared = {
      ...initial,
      players: {
        ...initial.players,
        [p1]: { ...initial.players[p1]!, hasTakenFirstTurn: true },
      },
      turn: {
        ...initial.turn,
        phase: "materialize" as const,
        materializeKind: "regular" as const,
        materializeChoicePending: true,
      },
      opportunity: null,
    };
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const materialized = runtime.execute(
      { move: "materialize", cardId: restrictedLevelOneId },
      { playerId: p1 },
    );
    if (!materialized.ok) throw new Error(materialized.message);

    const changedLineage = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-moved",
        objectId: currentChampionId,
        from: "field",
        to: "banishment",
      },
      {
        type: "object-moved",
        objectId: replacementSpiritId,
        from: "material-deck",
        to: "field",
        newControllerId: p1,
      },
    ]).state;

    expect(collectGrandArchiveStateBasedEvents(program, changedLineage)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "stack-item-fizzled",
          item: expect.objectContaining({
            kind: "materialization",
            cardId: restrictedLevelOneId,
          }),
          reason: "champion-materialization-illegal",
        }),
      ]),
    );
  });
});
