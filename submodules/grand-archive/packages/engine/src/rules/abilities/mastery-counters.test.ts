import {
  divineComedy,
  fracturedMemories,
  materializeTheSoul,
  phantasmagoria,
} from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCondition,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { evaluateGrandArchiveCondition } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { grandArchiveObjectActiveAbilities } from "./intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  options: { readonly lineageName?: string } = {},
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
        ...(options.lineageName ? { lineageName: options.lineageName } : {}),
        cost: { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["ASSASSIN"],
          subtypes: type === "CHAMPION" ? ["ASSASSIN", "HUMAN"] : ["HUMAN"],
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 30 } : { power: 1, life: 1 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("mastery-counter-champion", "CHAMPION", { lineageName: "Merlin" });
const ally = card("mastery-counter-ally", "ALLY");
const filler = card("mastery-counter-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    ally,
    filler,
    fracturedMemories,
    materializeTheSoul,
    phantasmagoria,
    divineComedy,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: ally.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 912,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const championId = state.zones[p1].field[0]!;
  const allyObject = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === ally.canonicalId,
  );
  if (!allyObject) throw new Error("Missing mastery counter ally");
  return { program, state, p1, championId, allyId: allyObject.id };
}

function execute(
  effect: GrandArchiveEffect,
  fixture: ReturnType<typeof setup>,
  state = fixture.state,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      sourceId: fixture.championId,
      abilityBearerId: fixture.championId,
      bindings: {},
    },
    (current, events) => {
      const result = kernel.transact(current, events);
      return { state: result.state, events: result.result.events };
    },
  ).state;
}

function sheenRestriction(): GrandArchiveCondition {
  if (materializeTheSoul.layout.kind !== "single-faced") {
    throw new Error("Materialize the Soul must be single-faced");
  }
  const ability = materializeTheSoul.layout.face.abilities[0];
  if (ability?.kind !== "static") throw new Error("Missing Sheen static ability");
  const restriction = ability?.restrictions?.[1];
  if (restriction?.kind !== "static") throw new Error("Missing Sheen restriction");
  return restriction.condition;
}

function phantasmagoriaHauntEffect(): GrandArchiveEffect {
  if (phantasmagoria.layout.kind !== "single-faced") {
    throw new Error("Phantasmagoria must be single-faced");
  }
  const ability = phantasmagoria.layout.face.abilities[1];
  if (ability?.kind !== "triggered" || !ability.effect) {
    throw new Error("Missing Phantasmagoria haunt trigger");
  }
  return ability.effect;
}

describe("Grand Archive mastery counters", () => {
  it("stores counters on the non-object mastery and unlocks catalog Sheen restrictions", () => {
    const fixture = setup();
    expect(
      evaluateGrandArchiveCondition(
        {
          kind: "mastery-has-counter",
          mastery: "Fractured Memories",
          counter: { named: "sheen" },
          minimum: 0,
        },
        {
          program: fixture.program,
          state: fixture.state,
          controllerId: fixture.p1,
          bindings: {},
        },
      ),
    ).toBe(false);
    const gained = execute(
      { kind: "gain-mastery", player: "controller", mastery: "Fractured Memories" },
      fixture,
    );
    const withSheen = execute(
      {
        kind: "add-counter",
        subject: { kind: "mastery", player: "controller", name: "Fractured Memories" },
        counter: { named: "sheen" },
        amount: 15,
      },
      fixture,
      gained,
    );

    expect(withSheen.players[fixture.p1]?.mastery).toEqual({
      name: "Fractured Memories",
      timestamp: 1,
      counters: { "named:sheen": 15 },
    });
    expect(
      projectGrandArchiveViewerState(fixture.program, withSheen, fixture.p1).players[0]?.mastery,
    ).toEqual({ name: "Fractured Memories", timestamp: 1, counters: { "named:sheen": 15 } });
    expect(
      evaluateGrandArchiveCondition(sheenRestriction(), {
        program: fixture.program,
        state: withSheen,
        controllerId: fixture.p1,
        sourceId: fixture.championId,
        abilityBearerId: fixture.championId,
        bindings: {},
      }),
    ).toBe(true);
  });

  it("moves counters between objects and masteries without making the mastery targetable", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const positioned = kernel.transact(fixture.state, [
      { type: "object-moved", objectId: fixture.allyId, from: "main-deck", to: "field" },
      { type: "counter-changed", objectId: fixture.allyId, counter: "named:sheen", delta: 4 },
    ]).state;
    const gained = execute(
      { kind: "gain-mastery", player: "controller", mastery: "Fractured Memories" },
      fixture,
      positioned,
    );
    const withBinding = executeGrandArchiveEffect(
      {
        kind: "move-counter",
        from: { kind: "bound", binding: "sheen-source" },
        to: { kind: "mastery", player: "controller", name: "Fractured Memories" },
        counter: { named: "sheen" },
        amount: 3,
      },
      {
        program: fixture.program,
        state: gained,
        controllerId: fixture.p1,
        sourceId: fixture.championId,
        abilityBearerId: fixture.championId,
        bindings: { "sheen-source": [fixture.allyId] },
      },
      (current, events) => {
        const result = kernel.transact(current, events);
        return { state: result.state, events: result.result.events };
      },
    ).state;

    expect(withBinding.objects[fixture.allyId]?.counters["named:sheen"]).toBe(1);
    expect(withBinding.players[fixture.p1]?.mastery?.counters["named:sheen"]).toBe(3);
    expect(Object.values(withBinding.objects)).toHaveLength(Object.values(gained.objects).length);
  });

  it("activates Fractured Memories' granted champion ability and clears counters on replacement", () => {
    const fixture = setup();
    const gained = execute(
      { kind: "gain-mastery", player: "controller", mastery: "Fractured Memories" },
      fixture,
    );
    const withSheen = execute(
      {
        kind: "add-counter",
        subject: { kind: "mastery", player: "controller", name: "Fractured Memories" },
        counter: { named: "sheen" },
        amount: 8,
      },
      fixture,
      gained,
    );

    expect(
      grandArchiveObjectActiveAbilities(
        fixture.program,
        withSheen,
        withSheen.objects[fixture.championId]!,
      ).some((ability) => ability.id === "UAJGQFbXjs-a10000"),
    ).toBe(true);

    const replaced = execute(
      { kind: "gain-mastery", player: "controller", mastery: "Divine Comedy" },
      fixture,
      withSheen,
    );
    expect(replaced.players[fixture.p1]?.mastery).toEqual({
      name: "Divine Comedy",
      timestamp: 3,
      counters: {},
    });
  });

  it("resolves a catalog mastery trigger's source as the mastery rather than an object", () => {
    const fixture = setup();
    const gained = execute(
      { kind: "gain-mastery", player: "controller", mastery: "Phantasmagoria" },
      fixture,
    );
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      phantasmagoriaHauntEffect(),
      {
        program: fixture.program,
        state: gained,
        controllerId: fixture.p1,
        bindings: {
          masterySourcePlayer: [fixture.p1],
          masterySourceName: "Phantasmagoria",
        },
      },
      (current, events) => {
        const transaction = kernel.transact(current, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    expect(result.state.players[fixture.p1]?.mastery).toEqual({
      name: "Phantasmagoria",
      timestamp: 1,
      counters: { "named:haunt": 1 },
    });
    expect(result.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "mastery-counter-changed",
          mastery: "Phantasmagoria",
          counter: "named:haunt",
          delta: 1,
        }),
      ]),
    );
  });
});
