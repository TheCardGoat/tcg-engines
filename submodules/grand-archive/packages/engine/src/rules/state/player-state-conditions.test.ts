import { charmOfAnticipation, harmoniousMantra, hexboundBlade } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCondition,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchiveObjectPower } from "../../procedures/combat/combat.ts";
import { evaluateGrandArchiveCondition } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

const champion: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "player-state-condition-champion",
  slug: "player-state-condition-champion",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "player-state-condition-champion:face:default",
      catalogId: "player-state-condition-champion",
      name: "Player State Champion",
      cost: { kind: "memory", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["ASSASSIN", "CLERIC", "MAGE"],
        subtypes: [],
      },
      elements: ["NORM", "UMBRA"],
      stats: { level: 0, life: 30 },
      rulesText: "",
      abilities: [],
    },
  },
};

const filler: GrandArchiveAnyCard<GrandArchiveAbilityDefinition> = {
  canonicalId: "player-state-condition-filler",
  slug: "player-state-condition-filler",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "player-state-condition-filler:face:default",
      catalogId: "player-state-condition-filler",
      name: "Player State Filler",
      cost: { kind: "reserve", amount: 0 },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: [],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText: "",
      abilities: [],
    },
  },
};

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    charmOfAnticipation,
    harmoniousMantra,
    hexboundBlade,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: harmoniousMantra.canonicalId, count: 1 },
            { definitionId: hexboundBlade.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: charmOfAnticipation.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 771,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (definitionId: string) => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing player-state card ${definitionId}`);
    return object;
  };
  return { program, state, p1, p2, find };
}

function harmoniousCondition(): GrandArchiveCondition {
  if (harmoniousMantra.layout.kind !== "single-faced") {
    throw new Error("Harmonious Mantra must be single-faced");
  }
  const ability = harmoniousMantra.layout.face.abilities[0];
  if (ability?.kind !== "card-resolution" || ability.effect.kind !== "conditional") {
    throw new Error("Missing Harmonious Mantra condition");
  }
  return ability.effect.condition;
}

describe("Grand Archive player-state conditions", () => {
  it("applies Hexbound Blade's power bonus exactly while its controller has Agility", () => {
    const fixture = setup();
    const blade = fixture.find(hexboundBlade.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const attackerId = fixture.state.zones[fixture.p1].field[0]!;
    const inIntent = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: blade.id,
        from: blade.zone,
        to: "intent",
        hostId: attackerId,
      },
    ]).state;

    expect(grandArchiveObjectPower(fixture.program, inIntent, inIntent.objects[blade.id]!)).toBe(2);

    const agile = kernel.transact(inIntent, [
      { type: "player-state-changed", playerId: fixture.p1, state: "agility", value: true },
    ]).state;
    expect(grandArchiveObjectPower(fixture.program, agile, agile.objects[blade.id]!)).toBe(6);
  });

  it("matches Shifting Currents directions independently of catalog text casing", () => {
    const fixture = setup();
    const source = fixture.find(harmoniousMantra.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const north = kernel.transact(fixture.state, [
      {
        type: "player-state-changed",
        playerId: fixture.p1,
        state: "shifting-currents",
        value: "north",
      },
    ]).state;
    const context = {
      program: fixture.program,
      state: north,
      controllerId: fixture.p1,
      sourceId: source.id,
      abilityBearerId: source.id,
      bindings: {},
    };

    expect(evaluateGrandArchiveCondition(harmoniousCondition(), context)).toBe(true);

    const east = kernel.transact(north, [
      {
        type: "player-state-changed",
        playerId: fixture.p1,
        state: "shifting-currents",
        value: "east",
      },
    ]).state;
    expect(evaluateGrandArchiveCondition(harmoniousCondition(), { ...context, state: east })).toBe(
      false,
    );
  });

  it("allows Charm of Anticipation's ability only while its controller has Crowd's Favor", () => {
    const fixture = setup();
    const charm = fixture.find(charmOfAnticipation.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const onField = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: charm.id, from: charm.zone, to: "field" },
    ]).state;

    const withoutStatus = new GrandArchiveMatchRuntime(fixture.program, onField).execute(
      {
        move: "activate-ability",
        sourceId: charm.id,
        abilityId: "vkL2RFh0yM-a1",
      },
      { playerId: fixture.p1 },
    );
    expect(withoutStatus.ok).toBe(false);

    const favored = kernel.transact(onField, [
      {
        type: "player-state-changed",
        playerId: fixture.p1,
        state: "crowds-favor",
        value: true,
      },
    ]).state;
    const withStatus = new GrandArchiveMatchRuntime(fixture.program, favored).execute(
      {
        move: "activate-ability",
        sourceId: charm.id,
        abilityId: "vkL2RFh0yM-a1",
      },
      { playerId: fixture.p1 },
    );
    if (!withStatus.ok) throw new Error(withStatus.message);
    expect(withStatus.ok).toBe(true);
    expect(withStatus.state.objects[charm.id]?.zone).toBe("banishment");
  });
});
