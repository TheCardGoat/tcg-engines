import {
  reboundingGust,
  resonatingFugue,
  sleetyRetreat,
  umbralTithe,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
  GrandArchiveElement,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import type { GrandArchiveCommand } from "../../commands/commands.ts";
import type { GrandArchiveProposedEvent } from "../../kernel/events.ts";
import { grandArchivePlayerId, type GrandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { listGrandArchiveLegalCommands } from "../../commands/legal-commands.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";

type CatalogCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

function supportCard(
  id: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly classes?: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly subtypes?: readonly string[];
    readonly elements?: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
  } = {},
): CatalogCard {
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
        cost: { kind: "none" },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: options.classes ?? ["CLERIC"],
          subtypes: options.subtypes ?? [],
        },
        elements: options.elements ?? ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 30 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

function setup(
  action: CatalogCard,
  options: {
    readonly championClasses: readonly [GrandArchiveClass, ...GrandArchiveClass[]];
    readonly championElements: readonly [GrandArchiveElement, ...GrandArchiveElement[]];
    readonly extras?: readonly { readonly card: CatalogCard; readonly count: number }[];
  },
) {
  const champion = supportCard(`${action.canonicalId}-champion`, "CHAMPION", {
    classes: options.championClasses,
    elements: options.championElements,
  });
  const filler = supportCard(`${action.canonicalId}-filler`, "ACTION");
  const extras = options.extras ?? [];
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    action,
    ...extras.map((entry) => entry.card),
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(id === "p1" ? [{ definitionId: action.canonicalId, count: 1 }] : []),
      ...(id === "p1"
        ? extras.map((entry) => ({ definitionId: entry.card.canonicalId, count: entry.count }))
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
      randomSeed: 731,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const objects = (
    state: GrandArchiveMatchState,
    ownerId: GrandArchivePlayerId,
    definitionId: string,
  ) =>
    Object.values(state.objects).filter(
      (object) => object.ownerId === ownerId && object.definitionId === definitionId,
    );
  const actionObject = objects(initial, p1, action.canonicalId)[0]!;
  const paymentObjects = objects(initial, p1, filler.canonicalId).slice(0, 5);
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: actionObject.id,
      from: actionObject.zone,
      to: "hand",
    },
    ...paymentObjects.map(
      (object): GrandArchiveProposedEvent => ({
        type: "object-moved",
        objectId: object.id,
        from: object.zone,
        to: "hand",
      }),
    ),
  ]).state;
  return {
    program,
    state: prepared,
    p1,
    p2,
    actionId: actionObject.id,
    paymentIds: paymentObjects.map((object) => object.id),
    p1ChampionId: prepared.zones[p1].field[0]!,
    p2ChampionId: prepared.zones[p2].field[0]!,
    objects,
  };
}

function activate(
  runtime: GrandArchiveMatchRuntime,
  playerId: GrandArchivePlayerId,
  cardId: ReturnType<typeof setup>["actionId"],
  paymentIds: readonly ReturnType<typeof setup>["paymentIds"][number][],
  targets?: NonNullable<
    Extract<GrandArchiveCommand, { readonly move: "activate-card" }>["targets"]
  >,
) {
  const command: Extract<GrandArchiveCommand, { readonly move: "activate-card" }> = {
    move: "activate-card",
    cardId,
    ...(targets ? { targets } : {}),
    ...(paymentIds.length > 0
      ? {
          reservePayment: paymentIds.map((paymentId) => ({
            kind: "card" as const,
            cardId: paymentId,
          })),
        }
      : {}),
  };
  return runtime.execute(command, { playerId });
}

describe("Grand Archive card-resolution activation rules", () => {
  it("applies Rebounding Gust's discount after its attacking target is declared", () => {
    const ally = supportCard("rebounding-gust-target", "ALLY", {
      classes: ["CLERIC"],
      elements: ["WIND"],
    });
    const fixture = setup(reboundingGust, {
      championClasses: ["CLERIC"],
      championElements: ["WIND"],
      extras: [{ card: ally, count: 1 }],
    });
    const allyObject = fixture.objects(fixture.state, fixture.p1, ally.canonicalId)[0]!;
    const attacking = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyObject.id, from: allyObject.zone, to: "field" },
      {
        type: "object-state-changed",
        objectId: allyObject.id,
        state: "attacking",
        value: true,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, attacking);

    expect(
      listGrandArchiveLegalCommands(fixture.program, attacking, fixture.p1).some(
        (candidate) =>
          candidate.command.move === "activate-card" &&
          candidate.command.cardId === fixture.actionId &&
          candidate.command.targets?.["target-1"]?.[0] === allyObject.id &&
          candidate.command.reservePayment?.length === 1,
      ),
    ).toBe(true);
    expect(
      activate(runtime, fixture.p1, fixture.actionId, fixture.paymentIds.slice(0, 1), {
        "target-1": [allyObject.id],
      }).ok,
    ).toBe(true);

    const notAttacking = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: allyObject.id, from: allyObject.zone, to: "field" },
    ]).state;
    const ordinaryRuntime = new GrandArchiveMatchRuntime(fixture.program, notAttacking);
    expect(
      activate(ordinaryRuntime, fixture.p1, fixture.actionId, fixture.paymentIds.slice(0, 1), {
        "target-1": [allyObject.id],
      }).ok,
    ).toBe(false);
    expect(
      activate(ordinaryRuntime, fixture.p1, fixture.actionId, fixture.paymentIds.slice(0, 3), {
        "target-1": [allyObject.id],
      }).ok,
    ).toBe(true);
  });

  it("applies Resonating Fugue's discount only while its Class Bonus paragraph is active", () => {
    const animal = supportCard("resonating-fugue-target", "ALLY", {
      classes: ["TAMER"],
      subtypes: ["ANIMAL"],
      elements: ["WATER"],
    });
    const active = setup(resonatingFugue, {
      championClasses: ["TAMER"],
      championElements: ["WATER"],
      extras: [{ card: animal, count: 1 }],
    });
    const animalObject = active.objects(active.state, active.p1, animal.canonicalId)[0]!;
    const activeState = new GrandArchiveTransactionKernel().transact(active.state, [
      { type: "object-moved", objectId: animalObject.id, from: animalObject.zone, to: "field" },
    ]).state;
    const activeRuntime = new GrandArchiveMatchRuntime(active.program, activeState);
    expect(
      activate(activeRuntime, active.p1, active.actionId, active.paymentIds.slice(0, 2), {
        "target-1": [animalObject.id],
      }).ok,
    ).toBe(true);

    const inactive = setup(resonatingFugue, {
      championClasses: ["MAGE"],
      championElements: ["WATER"],
    });
    const inactiveRuntime = new GrandArchiveMatchRuntime(inactive.program, inactive.state);
    expect(
      activate(inactiveRuntime, inactive.p1, inactive.actionId, inactive.paymentIds.slice(0, 2)).ok,
    ).toBe(false);
    expect(
      activate(inactiveRuntime, inactive.p1, inactive.actionId, inactive.paymentIds.slice(0, 4)).ok,
    ).toBe(true);
  });

  it("applies Sleety Retreat's Deluge discount from four Water cards in graveyard", () => {
    const waterCard = supportCard("sleety-retreat-water", "ACTION", {
      classes: ["RANGER"],
      elements: ["WATER"],
    });
    const fixture = setup(sleetyRetreat, {
      championClasses: ["RANGER"],
      championElements: ["WATER"],
      extras: [{ card: waterCard, count: 4 }],
    });
    const waterObjects = fixture.objects(fixture.state, fixture.p1, waterCard.canonicalId);
    const threeWaterState = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      waterObjects.slice(0, 3).map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "graveyard",
        }),
      ),
    ).state;
    const belowThreshold = new GrandArchiveMatchRuntime(fixture.program, threeWaterState);
    expect(
      activate(belowThreshold, fixture.p1, fixture.actionId, [], {
        "target-ranger-unit": [fixture.p1ChampionId],
      }).ok,
    ).toBe(false);
    expect(
      activate(belowThreshold, fixture.p1, fixture.actionId, fixture.paymentIds.slice(0, 2), {
        "target-ranger-unit": [fixture.p1ChampionId],
      }).ok,
    ).toBe(true);

    const delugeState = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      waterObjects.map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "graveyard",
        }),
      ),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, delugeState);

    expect(
      activate(runtime, fixture.p1, fixture.actionId, [], {
        "target-ranger-unit": [fixture.p1ChampionId],
      }).ok,
    ).toBe(true);
  });

  it("applies Umbral Tithe's aggregate lineage discount across champions", () => {
    const curse = supportCard("umbral-tithe-curse", "ACTION", {
      classes: ["CLERIC"],
      subtypes: ["CURSE"],
      elements: ["UMBRA"],
    });
    const fixture = setup(umbralTithe, {
      championClasses: ["CLERIC"],
      championElements: ["UMBRA"],
      extras: [{ card: curse, count: 2 }],
    });
    const curseObjects = fixture.objects(fixture.state, fixture.p1, curse.canonicalId);
    const lineageState = new GrandArchiveTransactionKernel().transact(
      fixture.state,
      curseObjects.map(
        (object): GrandArchiveProposedEvent => ({
          type: "object-moved",
          objectId: object.id,
          from: object.zone,
          to: "inner-lineage",
          hostId: fixture.p1ChampionId,
        }),
      ),
    ).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, lineageState);

    expect(activate(runtime, fixture.p1, fixture.actionId, fixture.paymentIds.slice(0, 3)).ok).toBe(
      true,
    );
  });
});
