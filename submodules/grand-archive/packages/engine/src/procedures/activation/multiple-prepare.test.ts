import { devisedConspiracy } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import type { GrandArchivePrepareAbilityIndexes } from "../../commands/commands.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
): GrandArchiveAnyCard<GrandArchiveAbilityDefinition> {
  return {
    canonicalId: id,
    slug: id,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: `${id}:face:default`,
        catalogId: id,
        name: type === "CHAMPION" ? "Tristan" : id,
        ...(type === "CHAMPION" ? { lineageName: "Tristan" } : {}),
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["ASSASSIN"],
          subtypes: [],
        },
        elements: type === "CHAMPION" ? ["UMBRA"] : ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("multiple-prepare-champion", "CHAMPION");
const filler = card("multiple-prepare-filler", "ACTION");
const prepareGrant = card("multiple-prepare-grant", "ITEM", [
  {
    id: "multiplePrepareGrant-a1",
    kind: "static",
    staticKind: "effects",
    text: "Devised Conspiracy has Prepare 1.",
    effects: [
      {
        kind: "continuous",
        subjects: {
          kind: "each",
          collection: {
            zones: ["hand", "effects-stack"],
            player: "controller",
            filter: { kind: "canonical-id", value: devisedConspiracy.canonicalId },
          },
        },
        affectedSet: "dynamic",
        duration: { kind: "while-source-in-functional-zone" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "grant-keyword", keyword: { name: "prepare", value: 1 } },
      },
    ],
  },
]);

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    prepareGrant,
    devisedConspiracy,
  ]);
  const player = (id: string): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: devisedConspiracy.canonicalId, count: 1 },
      { definitionId: prepareGrant.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 4 },
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
      randomSeed: 2411,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const owned = (definitionId: string) =>
    Object.values(initial.objects).filter(
      (object) => object.ownerId === p1 && object.definitionId === definitionId,
    );
  const championId = initial.zones[p1].field[0]!;
  const cardId = owned(devisedConspiracy.canonicalId)[0]!.id;
  const grantId = owned(prepareGrant.canonicalId)[0]!.id;
  const paymentId = owned(filler.canonicalId)[0]!.id;
  const state = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: cardId, from: initial.objects[cardId]!.zone, to: "hand" },
    { type: "object-moved", objectId: grantId, from: initial.objects[grantId]!.zone, to: "field" },
    {
      type: "object-moved",
      objectId: paymentId,
      from: initial.objects[paymentId]!.zone,
      to: "hand",
    },
    { type: "counter-changed", objectId: championId, counter: "preparation", delta: 3 },
  ]).state;
  return { program, state, p1, championId, cardId, paymentId };
}

function activate(indexes: GrandArchivePrepareAbilityIndexes) {
  const fixture = setup();
  const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
  const result = runtime.execute(
    {
      move: "activate-card",
      cardId: fixture.cardId,
      reservePayment: [{ kind: "card", cardId: fixture.paymentId }],
      prepareAbilityIndexes: indexes,
    },
    { playerId: fixture.p1 },
  );
  return { ...fixture, runtime, result };
}

describe("Grand Archive multiple Prepare abilities", () => {
  it("enumerates and pays any ordered subset of active Prepare additional costs", () => {
    const fixture = setup();
    const choices = listGrandArchiveLegalCommands(
      fixture.program,
      fixture.state,
      fixture.p1,
    ).flatMap((candidate) =>
      candidate.command.move === "activate-card" &&
      candidate.command.cardId === fixture.cardId &&
      candidate.command.prepareAbilityIndexes
        ? [candidate.command.prepareAbilityIndexes.join(",")]
        : [],
    );
    expect(choices).toEqual(expect.arrayContaining(["0", "1", "0,1", "1,0"]));

    for (const [indexes, remaining] of [
      [[0], 1],
      [[1], 2],
      [[0, 1], 0],
      [[1, 0], 0],
    ] as const satisfies readonly (readonly [GrandArchivePrepareAbilityIndexes, number])[]) {
      const activated = activate(indexes);
      expect(activated.result).toMatchObject({ ok: true });
      expect(activated.runtime.state.objects[activated.championId]?.counters.preparation).toBe(
        remaining,
      );
      expect(activated.runtime.state.stack.at(-1)?.activationStates).toContain("prepared");
      expect(
        activated.runtime.state.objects[activated.cardId]?.activationStates.has("prepared"),
      ).toBe(true);
    }
  });

  it("rejects duplicate, inactive, and jointly unaffordable Prepare declarations atomically", () => {
    for (const indexes of [[0, 0], [2]] as const) {
      const fixture = setup();
      const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
      const result = runtime.execute(
        {
          move: "activate-card",
          cardId: fixture.cardId,
          reservePayment: [{ kind: "card", cardId: fixture.paymentId }],
          prepareAbilityIndexes: indexes,
        },
        { playerId: fixture.p1 },
      );
      expect(result.ok).toBe(false);
      expect(runtime.state.objects[fixture.cardId]?.zone).toBe("hand");
      expect(runtime.state.objects[fixture.paymentId]?.zone).toBe("hand");
      expect(runtime.state.objects[fixture.championId]?.counters.preparation).toBe(3);
    }

    const fixture = setup();
    const short = {
      ...fixture.state,
      objects: {
        ...fixture.state.objects,
        [fixture.championId]: {
          ...fixture.state.objects[fixture.championId]!,
          counters: {
            ...fixture.state.objects[fixture.championId]!.counters,
            preparation: 2,
          },
        },
      },
    };
    const runtime = new GrandArchiveMatchRuntime(fixture.program, short);
    expect(
      runtime.execute(
        {
          move: "activate-card",
          cardId: fixture.cardId,
          reservePayment: [{ kind: "card", cardId: fixture.paymentId }],
          prepareAbilityIndexes: [0, 1],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(false);
    expect(runtime.state.objects[fixture.cardId]?.zone).toBe("hand");
    expect(runtime.state.objects[fixture.championId]?.counters.preparation).toBe(2);
  });
});
