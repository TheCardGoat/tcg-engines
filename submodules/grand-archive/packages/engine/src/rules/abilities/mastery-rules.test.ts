import { divineComedy, phantasmagoria, servilePossessions } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { deriveGrandArchiveAttackPower } from "../state/continuous.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { deriveGrandArchivePlayerProperty } from "../../procedures/effects/evaluation.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { grandArchiveObjectActiveAbilities } from "./intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  subtypes: readonly string[] = [],
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
        name: canonicalId,
        ...(type === "CHAMPION" ? { lineageName: "Ciel" } : {}),
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: {
          supertypes: [],
          types: [type],
          classes: ["GUARDIAN"],
          subtypes,
        },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : { power: 1, life: 1 },
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("mastery-rules-champion", "CHAMPION", ["GUARDIAN", "HUMAN"]);
const filler = card("mastery-rules-filler", "ACTION");
const floatingMemory: GrandArchiveAbilityDefinition = {
  id: "masteryRules-a1",
  kind: "static",
  staticKind: "intrinsic",
  text: "Floating Memory",
  keyword: { name: "floating-memory" },
};
const ordinaryGraveyardCard = card(
  "mastery-rules-ordinary-graveyard-card",
  "ALLY",
  ["HUMAN"],
  [floatingMemory],
);
const specterGraveyardCard = card(
  "mastery-rules-specter-graveyard-card",
  "ALLY",
  ["SPECTER"],
  [{ ...floatingMemory, id: "masteryRulesSpecter-a1" }],
);

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly state: GrandArchiveMatchState;
} {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    ordinaryGraveyardCard,
    specterGraveyardCard,
    phantasmagoria,
    servilePossessions,
    divineComedy,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 12 },
      ...(id === "p1"
        ? [
            { definitionId: ordinaryGraveyardCard.canonicalId, count: 1 },
            { definitionId: specterGraveyardCard.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  return {
    program,
    state: createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 772,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    ),
  };
}

function servilePossessionsEffect(): GrandArchiveEffect {
  if (servilePossessions.layout.kind !== "single-faced") {
    throw new Error("Servile Possessions must be single-faced");
  }
  const ability = servilePossessions.layout.face.abilities[0];
  if (ability?.kind !== "triggered" || !ability.effect) {
    throw new Error("Servile Possessions must have its catalog trigger");
  }
  return ability.effect;
}

function execute(
  effect: GrandArchiveEffect,
  program: ReturnType<typeof createGrandArchiveMatchProgram>,
  state: GrandArchiveMatchState,
  variables: Readonly<Partial<Record<"X" | "Y" | "Z", number>>> = {},
): GrandArchiveMatchState {
  const p1 = grandArchivePlayerId("p1");
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    { program, state, controllerId: p1, bindings: {}, variables },
    (current, events) => {
      const transaction = kernel.transact(current, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  ).state;
}

function combatWithOmens(count: number): ReturnType<typeof setup> & {
  readonly attackerId: import("../../game/identity.ts").GrandArchiveObjectId;
  readonly unusedOmenIds: readonly import("../../game/identity.ts").GrandArchiveObjectId[];
} {
  const fixture = setup();
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const attackerId = fixture.state.zones[p1].field[0]!;
  const defenderId = fixture.state.zones[p2].field[0]!;
  const candidates = fixture.state.zones[p1]["main-deck"].filter(
    (objectId) => fixture.state.objects[objectId]?.definitionId === filler.canonicalId,
  );
  const omenIds = candidates.slice(0, count);
  const unusedOmenIds = candidates.slice(count, 5);
  const kernel = new GrandArchiveTransactionKernel();
  const state = kernel.transact(fixture.state, [
    { type: "mastery-changed", playerId: p1, mastery: "Servile Possessions" },
    ...omenIds.flatMap((objectId) => [
      {
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "banishment" as const,
      },
      { type: "counter-changed" as const, objectId, counter: "omen" as const, delta: 1 },
    ]),
    { type: "object-state-changed", objectId: attackerId, state: "attacking", value: true },
    { type: "object-state-changed", objectId: defenderId, state: "defending", value: true },
    {
      type: "combat-started",
      combat: {
        attackerId,
        attackingPlayerId: p1,
        defendingPlayerIds: [p2],
        targetIds: [defenderId],
        retaliatorIds: [],
        retaliationOrderConfirmed: false,
        weaponIds: [],
        intentIds: [],
        step: "declaration",
      },
    },
  ]).state;
  return { ...fixture, state, attackerId, unusedOmenIds };
}

function attackPower(
  program: ReturnType<typeof createGrandArchiveMatchProgram>,
  state: GrandArchiveMatchState,
  attackerId: import("../../game/identity.ts").GrandArchiveObjectId,
): number {
  const p1 = grandArchivePlayerId("p1");
  return deriveGrandArchiveAttackPower(state.objects[attackerId]!, 0, {
    program,
    state,
    controllerId: p1,
    bindings: {},
  });
}

describe("Grand Archive mastery rules", () => {
  it("rejects mastery representation cards from physical decks", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, servilePossessions]);
    const player = (id: string): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [{ definitionId: filler.canonicalId, count: 60 }],
      materialDeck: [
        { definitionId: champion.canonicalId, count: 1 },
        { definitionId: servilePossessions.canonicalId, count: 1 },
      ],
      startingChampionDefinitionId: champion.canonicalId,
    });

    expect(() =>
      createGrandArchiveMatchInitialState(program, {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 771,
      }),
    ).toThrow("is not a physical card and cannot start in a deck");
  });

  it("makes Phantasmagoria remove graveyard abilities only from non-Specter cards", () => {
    const fixture = setup();
    const p1 = grandArchivePlayerId("p1");
    const ordinary = Object.values(fixture.state.objects).find(
      (object) =>
        object.ownerId === p1 && object.definitionId === ordinaryGraveyardCard.canonicalId,
    )!;
    const specter = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === specterGraveyardCard.canonicalId,
    )!;
    const active = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: ordinary.id, from: ordinary.zone, to: "graveyard" },
      { type: "object-moved", objectId: specter.id, from: specter.zone, to: "graveyard" },
      { type: "mastery-changed", playerId: p1, mastery: "Phantasmagoria" },
    ]).state;

    expect(
      grandArchiveObjectActiveAbilities(fixture.program, active, active.objects[ordinary.id]!),
    ).toHaveLength(0);
    expect(
      grandArchiveObjectActiveAbilities(fixture.program, active, active.objects[specter.id]!).map(
        (ability) => ability.id,
      ),
    ).toContain("masteryRulesSpecter-a1");
  });

  it.each([
    { omens: 2, bonus: 1 },
    { omens: 4, bonus: 2 },
    { omens: 5, bonus: 3 },
  ])("locks Servile Possessions' mutually exclusive $omens-omen mode", ({ omens, bonus }) => {
    const fixture = combatWithOmens(omens);
    const p1 = grandArchivePlayerId("p1");
    const memoryBefore = fixture.state.zones[p1].memory.length;
    const resolved = execute(servilePossessionsEffect(), fixture.program, fixture.state, {
      X: omens,
    });

    expect(attackPower(fixture.program, resolved, fixture.attackerId)).toBe(bonus);
    expect(resolved.zones[p1].memory.length).toBe(memoryBefore + (omens >= 5 ? 1 : 0));

    if (omens !== 2) return;
    const kernel = new GrandArchiveTransactionKernel();
    const withFiveOmens = kernel.transact(
      resolved,
      fixture.unusedOmenIds.flatMap((objectId) => [
        {
          type: "object-moved" as const,
          objectId,
          from: "main-deck" as const,
          to: "banishment" as const,
        },
        { type: "counter-changed" as const, objectId, counter: "omen" as const, delta: 1 },
      ]),
    ).state;
    const replaced = kernel.transact(withFiveOmens, [
      { type: "mastery-changed", playerId: p1, mastery: "Divine Comedy" },
    ]).state;

    expect(
      deriveGrandArchivePlayerProperty(p1, "omens", {
        program: fixture.program,
        state: replaced,
        controllerId: p1,
        bindings: {},
      }),
    ).toBe(5);
    expect(attackPower(fixture.program, replaced, fixture.attackerId)).toBe(1);
  });
});
