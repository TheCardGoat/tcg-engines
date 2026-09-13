import {
  aquatechShield,
  pawnPiece,
  queensGambit,
  snowWhiteWeissQueen,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "./identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "link-shield-reference-champion",
  slug: "link-shield-reference-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "link-shield-reference-champion:face:default",
      catalogId: "link-shield-reference-champion",
      name: "Link Shield Reference Champion",
      lineageName: "Alice",
      cost: { kind: "none" },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC"],
      },
      elements: ["NORM"],
      stats: { level: 0, life: 30 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "link-shield-reference-filler",
  slug: "link-shield-reference-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "link-shield-reference-filler:face:default",
      catalogId: "link-shield-reference-filler",
      name: "Link Shield Reference Filler",
      cost: { kind: "none" },
      typeLine: { supertypes: [], types: ["ACTION"], classes: ["CLERIC"], subtypes: [] },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

const referenceAction: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "link-shield-reference-action",
  slug: "link-shield-reference-action",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "link-shield-reference-action:face:default",
      catalogId: "link-shield-reference-action",
      name: "Link Shield Reference Action",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Sacrifice target ally. Mark your champion equal to its power.",
      abilities: [
        {
          id: "linkShieldReferenceAction-a1",
          kind: "card-resolution",
          text: "Sacrifice target ally. Mark your champion equal to its power.",
          targets: [
            {
              id: "target-ally",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: { kind: "exactly", amount: 1 },
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: { kind: "type", oneOf: ["ALLY"] },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              { kind: "sacrifice", subject: { kind: "bound", binding: "target-ally" } },
              {
                kind: "add-counter",
                subject: { kind: "champion", player: "controller" },
                counter: { named: "referenced-power" },
                amount: {
                  kind: "property",
                  subject: { kind: "bound", binding: "target-ally" },
                  property: "power",
                  basis: "last-known",
                  missing: "zero",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

function setup(withShield: boolean) {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    aquatechShield,
    pawnPiece,
    queensGambit,
    snowWhiteWeissQueen,
  ]);
  const player = (id: string, includeCards: boolean): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      ...(includeCards
        ? [
            { definitionId: queensGambit.canonicalId, count: 1 },
            { definitionId: snowWhiteWeissQueen.canonicalId, count: 1 },
            { definitionId: aquatechShield.canonicalId, count: 1 },
          ]
        : []),
      { definitionId: filler.canonicalId, count: includeCards ? 5 : 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: withShield ? 281 : 282,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (definitionId: string) =>
    Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === definitionId,
    )!.id;
  const gambitId = find(queensGambit.canonicalId);
  const queenId = find(snowWhiteWeissQueen.canonicalId);
  const shieldId = find(aquatechShield.canonicalId);
  const paymentIds = Object.values(initial.objects)
    .filter((object) => object.ownerId === p1 && object.definitionId === filler.canonicalId)
    .slice(0, 2)
    .map((object) => object.id);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: gambitId, from: "main-deck", to: "hand" },
    ...paymentIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "hand" as const,
    })),
    { type: "object-moved", objectId: queenId, from: "main-deck", to: "field" },
    ...(withShield
      ? [
          {
            type: "object-moved" as const,
            objectId: shieldId,
            from: "main-deck" as const,
            to: "field" as const,
            hostId: queenId,
          },
        ]
      : []),
  ]).state;
  const runtime = new GrandArchiveMatchRuntime(program, positioned);
  expect(
    runtime.execute(
      {
        move: "activate-card",
        cardId: gambitId,
        reservePayment: paymentIds.map((cardId) => ({ kind: "card", cardId })),
        costSelections: [[queenId]],
      },
      { playerId: p1 },
    ).ok,
  ).toBe(true);
  return { runtime, p1, p2, gambitId, queenId, shieldId };
}

function resolveCardAndOnEnter(
  runtime: GrandArchiveMatchRuntime,
  p1: ReturnType<typeof grandArchivePlayerId>,
  p2: ReturnType<typeof grandArchivePlayerId>,
) {
  for (let window = 0; window < 2; window += 1) {
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
  }
}

function setupEffectReference(withShield: boolean) {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    aquatechShield,
    referenceAction,
    snowWhiteWeissQueen,
  ]);
  const player = (id: string, includeCards: boolean): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      ...(includeCards
        ? [
            { definitionId: referenceAction.canonicalId, count: 1 },
            { definitionId: snowWhiteWeissQueen.canonicalId, count: 1 },
            { definitionId: aquatechShield.canonicalId, count: 1 },
          ]
        : []),
      { definitionId: filler.canonicalId, count: includeCards ? 3 : 6 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1", true), player("p2", false)],
      firstPlayerId: "p1",
      randomSeed: withShield ? 283 : 284,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (definitionId: string) =>
    Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === definitionId,
    )!.id;
  const actionId = find(referenceAction.canonicalId);
  const queenId = find(snowWhiteWeissQueen.canonicalId);
  const shieldId = find(aquatechShield.canonicalId);
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: actionId, from: "main-deck", to: "hand" },
    { type: "object-moved", objectId: queenId, from: "main-deck", to: "field" },
    ...(withShield
      ? [
          {
            type: "object-moved" as const,
            objectId: shieldId,
            from: "main-deck" as const,
            to: "field" as const,
            hostId: queenId,
          },
        ]
      : []),
  ]).state;
  const runtime = new GrandArchiveMatchRuntime(program, positioned);
  expect(
    runtime.execute(
      { move: "activate-card", cardId: actionId, targets: { "target-ally": [queenId] } },
      { playerId: p1 },
    ).ok,
  ).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);
  return { runtime, p1, queenId, shieldId };
}

describe("Link Shield reference substitution", () => {
  it("uses the Link Shield instead of the protected ally for later catalog-card references", () => {
    const { runtime, p1, p2, gambitId, queenId, shieldId } = setup(true);
    expect(runtime.state.objects[queenId]?.zone).toBe("field");
    expect(runtime.state.objects[shieldId]?.zone).toBe("graveyard");
    expect(runtime.state.stack.at(-1)?.bindings["sacrificed-object"]).toEqual([shieldId]);
    expect(
      runtime.state.stack.at(-1)?.activationPayment.map((record) => record.objectId),
    ).toContain(shieldId);

    resolveCardAndOnEnter(runtime, p1, p2);

    expect(runtime.state.objects[gambitId]?.activationBindings["sacrificed-object"]).toEqual([
      shieldId,
    ]);
    expect(
      Object.values(runtime.state.objects).filter(
        (object) => object.isToken && object.definitionId === pawnPiece.canonicalId,
      ),
    ).toHaveLength(0);
  });

  it("retains the original sacrificed Queen reference when no Link Shield substitutes", () => {
    const { runtime, p1, p2, queenId } = setup(false);
    expect(runtime.state.objects[queenId]?.zone).toBe("graveyard");
    expect(runtime.state.stack.at(-1)?.bindings["sacrificed-object"]).toEqual([queenId]);

    resolveCardAndOnEnter(runtime, p1, p2);

    expect(
      Object.values(runtime.state.objects).filter(
        (object) => object.isToken && object.definitionId === pawnPiece.canonicalId,
      ),
    ).toHaveLength(3);
  });

  it("redirects effect-time references and treats a missing corresponding shield stat as zero", () => {
    const protectedResult = setupEffectReference(true);
    const protectedChampionId = protectedResult.runtime.state.zones[protectedResult.p1].field.find(
      (objectId) => objectId !== protectedResult.queenId,
    )!;
    expect(protectedResult.runtime.state.objects[protectedResult.queenId]?.zone).toBe("field");
    expect(protectedResult.runtime.state.objects[protectedResult.shieldId]?.zone).toBe("graveyard");
    expect(
      protectedResult.runtime.state.objects[protectedChampionId]?.counters[
        "named:referenced-power"
      ],
    ).toBeUndefined();

    const ordinaryResult = setupEffectReference(false);
    const ordinaryChampionId = ordinaryResult.runtime.state.zones[ordinaryResult.p1].field[0]!;
    expect(ordinaryResult.runtime.state.objects[ordinaryResult.queenId]?.zone).toBe("graveyard");
    expect(
      ordinaryResult.runtime.state.objects[ordinaryChampionId]?.counters["named:referenced-power"],
    ).toBe(1);
  });
});
