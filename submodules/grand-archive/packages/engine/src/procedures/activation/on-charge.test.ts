import { bidingCinquedea, candlelightHourglass } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import { collectGrandArchiveOnChargeCounterEvents } from "../../rules/abilities/triggers.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
  classes: readonly [GrandArchiveClass, ...GrandArchiveClass[]] = ["ASSASSIN", "CLERIC"],
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
        name: id,
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes, subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("on-charge-champion", "CHAMPION");
const filler = card("on-charge-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    bidingCinquedea,
    candlelightHourglass,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1"
        ? [
            { definitionId: bidingCinquedea.canonicalId, count: 1 },
            { definitionId: candlelightHourglass.canonicalId, count: 1 },
          ]
        : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 421,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1") };
}

function objectId(state: GrandArchiveMatchState, definitionId: string): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing On Charge object ${definitionId}`);
  return object.id;
}

function enterMaterialize(
  state: GrandArchiveMatchState,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  turnNumber: number,
) {
  return new GrandArchiveTransactionKernel().transact(state, [
    ...(state.opportunity
      ? ([
          {
            type: "opportunity-closed",
            cause: { kind: "rule", rule: "on-charge-test-next-turn" },
          },
        ] as const)
      : []),
    { type: "turn-started", playerId, turnNumber },
    { type: "phase-changed", phase: "materialize" },
  ]).state;
}

describe("Grand Archive On Charge turn-based action", () => {
  it("charges an untriggered catalog ability each recollection, then stops permanently", () => {
    const fixture = setup();
    const weaponId = objectId(fixture.state, bidingCinquedea.canonicalId);
    const onField = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 1 },
      },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const first = new GrandArchiveMatchRuntime(fixture.program, onField);
    expect(first.execute({ move: "skip-materialization" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(first.state.objects[weaponId]?.counters["named:charge"]).toBe(1);
    expect(first.state.stack).toEqual([]);

    const second = new GrandArchiveMatchRuntime(
      fixture.program,
      enterMaterialize(first.state, fixture.p1, 2),
    );
    expect(second.execute({ move: "skip-materialization" }, { playerId: fixture.p1 }).ok).toBe(
      true,
    );
    expect(second.state.objects[weaponId]?.counters["named:charge"]).toBe(2);
    expect(
      second.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "uqICHZa3Wz-a1",
      ),
    ).toBe(true);

    expect(
      collectGrandArchiveOnChargeCounterEvents(fixture.program, second.state, fixture.p1),
    ).toEqual([]);
    const countersRemoved = new GrandArchiveTransactionKernel().transact(second.state, [
      { type: "counter-changed", objectId: weaponId, counter: "named:charge", delta: -2 },
    ]).state;
    expect(
      collectGrandArchiveOnChargeCounterEvents(fixture.program, countersRemoved, fixture.p1),
    ).toEqual([]);

    const reentered = new GrandArchiveTransactionKernel().transact(countersRemoved, [
      { type: "object-moved", objectId: weaponId, from: "field", to: "material-deck" },
      {
        type: "object-moved",
        objectId: weaponId,
        from: "material-deck",
        to: "field",
        initialCounters: { durability: 1 },
      },
    ]).state;
    expect(
      collectGrandArchiveOnChargeCounterEvents(fixture.program, reentered, fixture.p1),
    ).toHaveLength(1);
  });

  it("recognizes Candlelight Hourglass as an On Charge source", () => {
    const fixture = setup();
    const hourglassId = objectId(fixture.state, candlelightHourglass.canonicalId);
    const onField = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: hourglassId,
        from: "material-deck",
        to: "field",
      },
    ]).state;
    expect(collectGrandArchiveOnChargeCounterEvents(fixture.program, onField, fixture.p1)).toEqual([
      expect.objectContaining({
        type: "counter-changed",
        objectId: hourglassId,
        counter: "named:charge",
        delta: 1,
      }),
    ]);
  });
});
