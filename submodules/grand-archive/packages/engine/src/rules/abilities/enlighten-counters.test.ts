import { manaLimiter } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY } from "./game-abilities.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { grandArchiveObjectActiveAbilities } from "./intrinsic-keywords.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
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
        name: id,
        cost: { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("enlighten-counter-champion", "CHAMPION", [
  {
    id: "enlightenCounterChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Reserve 0: Draw a card.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: { kind: "draw", player: "controller", amount: 1 },
  },
]);
const filler = card("enlighten-counter-filler", "ACTION");

function player(id: "p1" | "p2"): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: manaLimiter.canonicalId, count: id === "p1" ? 1 : 0 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, manaLimiter]);
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 6601,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const championId = state.zones[p1].field[0]!;
  const limiterId = Object.values(state.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === manaLimiter.canonicalId,
  )?.id;
  if (!limiterId) throw new Error("Enlighten fixture is missing Mana Limiter");
  return { program, state, p1, championId, limiterId };
}

function resolveStack(runtime: GrandArchiveMatchRuntime): void {
  for (let pass = 0; pass < 8 && runtime.state.stack.length > 0; pass += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Expected Opportunity while Enlighten is resolving");
    const transition = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!transition.ok) throw new Error(transition.message);
  }
  expect(runtime.state.stack).toEqual([]);
}

describe("Grand Archive Enlighten counters", () => {
  it("confer one activated ability that survives removal of the object's abilities", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const countered = kernel.transact(fixture.state, [
      {
        type: "counter-changed",
        objectId: fixture.championId,
        counter: "enlighten",
        delta: 1,
      },
    ]).state;
    const silenced = executeGrandArchiveEffect(
      {
        kind: "continuous",
        subjects: { kind: "bound", binding: "champion" },
        affectedSet: "locked",
        duration: { kind: "permanent" },
        layer: { layer: "D", modifies: "ability" },
        change: { kind: "remove-abilities" },
      },
      {
        program: fixture.program,
        state: countered,
        controllerId: fixture.p1,
        sourceId: fixture.championId,
        abilityBearerId: fixture.championId,
        bindings: { champion: [fixture.championId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(
      grandArchiveObjectActiveAbilities(
        fixture.program,
        silenced,
        silenced.objects[fixture.championId]!,
      ),
    ).toEqual([GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY]);

    const runtime = new GrandArchiveMatchRuntime(fixture.program, silenced);
    const before = runtime.state;
    const activation = runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.championId,
        abilityId: GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY.id,
      },
      { playerId: fixture.p1 },
    );
    expect(activation).toMatchObject({ ok: false, message: "Not enough counters to pay cost" });
    expect(runtime.state).toBe(before);
  });

  it("pays exactly three counters, obeys Mana Limiter, then draws on resolution", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const restricted = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.limiterId,
        from: "main-deck",
        to: "field",
      },
      {
        type: "counter-changed",
        objectId: fixture.championId,
        counter: "enlighten",
        delta: 3,
      },
    ]).state;
    const restrictedRuntime = new GrandArchiveMatchRuntime(fixture.program, restricted);
    const forbidden = restrictedRuntime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.championId,
        abilityId: GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY.id,
      },
      { playerId: fixture.p1 },
    );
    expect(forbidden).toMatchObject({
      ok: false,
      message: "Counter removal is forbidden as a cost payment method",
    });
    expect(restrictedRuntime.state.objects[fixture.championId]?.counters.enlighten).toBe(3);
    expect(restrictedRuntime.state.stack).toEqual([]);

    const unrestricted = kernel.transact(restricted, [
      {
        type: "object-moved",
        objectId: fixture.limiterId,
        from: "field",
        to: "banishment",
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, unrestricted);
    const handBeforeResolution = runtime.state.zones[fixture.p1].hand.length;
    const activation = runtime.execute(
      {
        move: "activate-ability",
        sourceId: fixture.championId,
        abilityId: GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY.id,
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.state.objects[fixture.championId]?.counters.enlighten).toBe(0);
    expect(runtime.state.stack).toHaveLength(1);

    resolveStack(runtime);
    expect(runtime.state.zones[fixture.p1].hand).toHaveLength(handBeforeResolution + 1);
    expect(
      grandArchiveObjectActiveAbilities(
        fixture.program,
        runtime.state,
        runtime.state.objects[fixture.championId]!,
      ).some((ability) => ability.id === GRAND_ARCHIVE_ENLIGHTEN_COUNTER_ACTIVATED_ABILITY.id),
    ).toBe(false);
  });
});
