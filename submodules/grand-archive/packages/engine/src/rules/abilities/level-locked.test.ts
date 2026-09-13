import {
  crystalOfEmpowerment,
  lesserBoonOfOdysseus,
  pantheonBarrier,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "../state/continuous.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchivePantheonPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  canonicalId: string,
  type: GrandArchivePlayableCardType,
  options: { readonly level?: number; readonly lineageName?: string } = {},
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
        ...(options.lineageName ? { lineageName: options.lineageName } : {}),
        cost:
          type === "CHAMPION" ? { kind: "memory", amount: options.level ?? 0 } : { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: {
          ...(options.level === undefined ? {} : { level: options.level }),
          ...(type === "CHAMPION" ? { life: 20 } : {}),
          ...(type === "PHANTASIA" ? { durability: 6 } : {}),
        },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const baseChampion = card("level-locked-base-champion", "CHAMPION", {
  level: 0,
  lineageName: "Lock Tester",
});
const levelOneChampion = card("level-locked-level-one-champion", "CHAMPION", {
  level: 1,
  lineageName: "Lock Tester",
});
const levelTwoChampion = card("level-locked-level-two-champion", "CHAMPION", {
  level: 2,
  lineageName: "Lock Tester",
});
const filler = card("level-locked-filler", "ACTION");
const greaterBoon = card("level-locked-greater-boon", "GREATER BOON");
const barrier = pantheonBarrier;
const p1 = grandArchivePlayerId("p1");

if (lesserBoonOfOdysseus.layout.kind !== "single-faced") {
  throw new Error("Lesser Boon of Odysseus must be single-faced");
}
const doubleLockedBoon: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  ...lesserBoonOfOdysseus,
  canonicalId: "level-locked-double-restriction",
  slug: "level-locked-double-restriction",
  layout: {
    kind: "single-faced",
    face: {
      ...lesserBoonOfOdysseus.layout.face,
      id: "level-locked-double-restriction:face:default",
      catalogId: "level-locked-double-restriction",
      name: "Double Locked Boon",
      abilities: [
        ...lesserBoonOfOdysseus.layout.face.abilities,
        {
          id: "levelLockedDouble-a2",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 2",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: { kind: "source" },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: { kind: "champion", player: "controller" },
                    property: "level",
                    basis: "base",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: { kind: "while-source-in-functional-zone" },
            },
          ],
        },
      ],
    },
  },
};

function player(
  id: "p1" | "p2" | "p3",
  lesserBoonDefinitionId = lesserBoonOfOdysseus.canonicalId,
): GrandArchivePantheonPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 10 }],
    materialDeck: [
      { definitionId: baseChampion.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: levelOneChampion.canonicalId, count: 1 },
            { definitionId: levelTwoChampion.canonicalId, count: 1 },
            { definitionId: crystalOfEmpowerment.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: baseChampion.canonicalId,
    pantheon: {
      lesserBoonDefinitionId,
      greaterBoonDefinitionId: greaterBoon.canonicalId,
      barrierDefinitionId: barrier.canonicalId,
    },
  };
}

function findOwned(runtime: GrandArchiveMatchRuntime, definitionId: string): GrandArchiveObjectId {
  const object = Object.values(runtime.state.objects).find(
    (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing Level Locked fixture object ${definitionId}`);
  return object.id;
}

function passCurrent(runtime: GrandArchiveMatchRuntime): void {
  const holderId = runtime.state.opportunity?.holderId;
  if (!holderId) throw new Error("Expected an Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: holderId });
  if (!result.ok) throw new Error(result.message);
}

describe("Grand Archive Level Locked", () => {
  it("uses printed champion level and ignores a temporary current-level increase", () => {
    const program = createGrandArchiveMatchProgram([
      baseChampion,
      levelOneChampion,
      levelTwoChampion,
      filler,
      greaterBoon,
      barrier,
      crystalOfEmpowerment,
      lesserBoonOfOdysseus,
      doubleLockedBoon,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "pantheon",
        players: [player("p1"), player("p2"), player("p3")],
        firstPlayerId: "p1",
        randomSeed: 2_511,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const crystalId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === crystalOfEmpowerment.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      {
        type: "object-moved",
        objectId: crystalId,
        from: "material-deck",
        to: "field",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);
    const boonId = findOwned(runtime, lesserBoonOfOdysseus.canonicalId);
    const championId = runtime.state.zones[p1].field.find(
      (objectId) => runtime.state.objects[objectId]?.definitionId === baseChampion.canonicalId,
    )!;
    const levelOneId = findOwned(runtime, levelOneChampion.canonicalId);

    const initiallyLocked = runtime.execute(
      { move: "bestow-boon", cardId: boonId },
      { playerId: p1 },
    );
    expect(initiallyLocked).toMatchObject({ ok: false, code: "illegal-command" });

    const activated = runtime.execute(
      {
        move: "activate-ability",
        sourceId: crystalId,
        abilityId: "dmfoA7jOjy-a1",
      },
      { playerId: p1 },
    );
    if (!activated.ok) throw new Error(activated.message);
    passCurrent(runtime);
    passCurrent(runtime);
    passCurrent(runtime);

    expect(
      deriveGrandArchiveNumericProperty(runtime.state.objects[championId]!, "level", {
        program,
        state: runtime.state,
        controllerId: p1,
        sourceId: championId,
        abilityBearerId: championId,
        bindings: {},
      }),
    ).toBe(2);
    const stillLocked = runtime.execute({ move: "bestow-boon", cardId: boonId }, { playerId: p1 });
    expect(stillLocked).toMatchObject({ ok: false, code: "illegal-command" });

    const leveled = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "champion-leveled-up",
        championId,
        cardId: levelOneId,
        actorId: p1,
      },
    ]).state;
    const baseLevelRuntime = new GrandArchiveMatchRuntime(program, leveled);
    expect(
      deriveGrandArchiveNumericProperty(baseLevelRuntime.state.objects[championId]!, "level", {
        program,
        state: baseLevelRuntime.state,
        controllerId: p1,
        sourceId: championId,
        abilityBearerId: championId,
        bindings: {},
      }),
    ).toBe(3);

    const bestowed = baseLevelRuntime.execute(
      { move: "bestow-boon", cardId: boonId },
      { playerId: p1 },
    );
    if (!bestowed.ok) throw new Error(bestowed.message);
    expect(baseLevelRuntime.state.objects[boonId]).toMatchObject({
      zone: "pantheon",
      facing: "face-up",
    });
  });

  it("requires the highest threshold when a card has multiple Level Locked abilities", () => {
    const program = createGrandArchiveMatchProgram([
      baseChampion,
      levelOneChampion,
      levelTwoChampion,
      filler,
      greaterBoon,
      barrier,
      crystalOfEmpowerment,
      lesserBoonOfOdysseus,
      doubleLockedBoon,
    ]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "pantheon",
        players: [player("p1", doubleLockedBoon.canonicalId), player("p2"), player("p3")],
        firstPlayerId: "p1",
        randomSeed: 2_512,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const championId = initial.zones[p1].field.find(
      (objectId) => initial.objects[objectId]?.definitionId === baseChampion.canonicalId,
    )!;
    const boonId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === doubleLockedBoon.canonicalId,
    )!.id;
    const levelOneId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === levelOneChampion.canonicalId,
    )!.id;
    const levelTwoId = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === levelTwoChampion.canonicalId,
    )!.id;
    const kernel = new GrandArchiveTransactionKernel();
    const levelOne = kernel.transact(initial, [
      { type: "champion-leveled-up", championId, cardId: levelOneId, actorId: p1 },
    ]).state;
    const levelOneRuntime = new GrandArchiveMatchRuntime(program, levelOne);

    expect(
      levelOneRuntime.execute({ move: "bestow-boon", cardId: boonId }, { playerId: p1 }),
    ).toMatchObject({ ok: false, code: "illegal-command" });

    const levelTwo = kernel.transact(levelOneRuntime.state, [
      { type: "champion-leveled-up", championId, cardId: levelTwoId, actorId: p1 },
    ]).state;
    const levelTwoRuntime = new GrandArchiveMatchRuntime(program, levelTwo);
    const bestowed = levelTwoRuntime.execute(
      { move: "bestow-boon", cardId: boonId },
      { playerId: p1 },
    );
    if (!bestowed.ok) throw new Error(bestowed.message);
    expect(levelTwoRuntime.state.objects[boonId]).toMatchObject({
      zone: "pantheon",
      facing: "face-up",
    });
  });
});
