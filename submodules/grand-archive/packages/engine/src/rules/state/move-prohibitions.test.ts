import { eternalMagistrate } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { prepareGrandArchiveRuleBoundEvent } from "../../kernel/event-admission.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  options: {
    readonly abilities?: readonly GrandArchiveAbilityDefinition[];
    readonly regalia?: boolean;
  } = {},
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
        cost: options.regalia ? { kind: "memory", amount: 0 } : { kind: "none" },
        typeLine: {
          supertypes: options.regalia ? ["REGALIA"] : [],
          types: [type],
          classes: ["CLERIC"],
          subtypes: [],
        },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : type === "ITEM" ? {} : {},
        rulesText: "",
        abilities: options.abilities ?? [],
      },
    },
  };
}

const materialItem = card("move-rule-material-item", "ITEM", { regalia: true });
const filler = card("move-rule-filler", "ACTION");
const champion = card("move-rule-champion", "CHAMPION", {
  abilities: [
    {
      id: "moveRuleChampion-a1",
      kind: "activated",
      activation: "ability",
      cost: { kind: "pay-reserve", amount: 0 },
      text: "Banish your material item.",
      effect: {
        kind: "move",
        subject: {
          kind: "each",
          collection: {
            zones: ["material-deck"],
            player: "controller",
            filter: { kind: "canonical-id", value: materialItem.canonicalId },
          },
        },
        from: "material-deck",
        destination: { zone: "banishment" },
      },
    },
  ],
});

function setup(firstPlayer: "p1" | "p2") {
  const program = createGrandArchiveMatchProgram([
    champion,
    materialItem,
    filler,
    eternalMagistrate,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: eternalMagistrate.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      { definitionId: materialItem.canonicalId, count: 1 },
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: firstPlayer,
      randomSeed: 913,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const magistrate = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === eternalMagistrate.canonicalId,
  );
  if (!magistrate) throw new Error("Missing Eternal Magistrate fixture card");
  const positioned = new GrandArchiveTransactionKernel().transact(initial, [
    { type: "object-moved", objectId: magistrate.id, from: magistrate.zone, to: "field" },
    {
      type: "object-activation-state-changed",
      objectId: magistrate.id,
      state: "imbued",
      value: true,
    },
  ]).state;
  const materialItemId = (playerId: typeof p1) =>
    positioned.zones[playerId]["material-deck"].find(
      (objectId) => positioned.objects[objectId]?.definitionId === materialItem.canonicalId,
    )!;
  return {
    program,
    positioned,
    p1,
    p2,
    magistrateId: magistrate.id,
    p1ChampionId: positioned.zones[p1].field[0]!,
    p2ChampionId: positioned.zones[p2].field[0]!,
    p1MaterialItemId: materialItemId(p1),
    p2MaterialItemId: materialItemId(p2),
  };
}

function resolveAbility(
  runtime: GrandArchiveMatchRuntime,
  sourceId: ReturnType<typeof setup>["p2ChampionId"],
  playerId: ReturnType<typeof setup>["p2"],
  opponentId: ReturnType<typeof setup>["p1"],
): void {
  const activation = runtime.execute(
    { move: "activate-ability", sourceId, abilityId: "moveRuleChampion-a1" },
    { playerId },
  );
  if (!activation.ok) throw new Error(activation.message);
  expect(runtime.execute({ move: "pass" }, { playerId }).ok).toBe(true);
  expect(runtime.execute({ move: "pass" }, { playerId: opponentId }).ok).toBe(true);
}

describe("Grand Archive move prohibitions", () => {
  it("prevents an imbued Eternal Magistrate opponent's material card from leaving", () => {
    const fixture = setup("p2");
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.positioned);
    resolveAbility(runtime, fixture.p2ChampionId, fixture.p2, fixture.p1);
    expect(runtime.state.objects[fixture.p2MaterialItemId]?.zone).toBe("material-deck");

    const inactive = new GrandArchiveTransactionKernel().transact(runtime.state, [
      {
        type: "object-activation-state-changed",
        objectId: fixture.magistrateId,
        state: "imbued",
        value: false,
      },
    ]).state;
    const unrestricted = new GrandArchiveMatchRuntime(fixture.program, inactive);
    resolveAbility(unrestricted, fixture.p2ChampionId, fixture.p2, fixture.p1);
    expect(unrestricted.state.objects[fixture.p2MaterialItemId]?.zone).toBe("banishment");
  });

  it("allows only the affected player's own materialize-phase departure", () => {
    const fixture = setup("p2");
    const materializePhase = new GrandArchiveTransactionKernel().transact(fixture.positioned, [
      { type: "opportunity-closed" },
      { type: "phase-changed", phase: "materialize" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, materializePhase);
    const materialized = runtime.execute(
      { move: "materialize", cardId: fixture.p2MaterialItemId },
      { playerId: fixture.p2 },
    );
    if (!materialized.ok) throw new Error(materialized.message);
    expect(runtime.state.objects[fixture.p2MaterialItemId]?.zone).toBe("effects-stack");

    const otherPlayersPhase = setup("p1");
    const p1Materialize = new GrandArchiveTransactionKernel().transact(
      otherPlayersPhase.positioned,
      [{ type: "opportunity-closed" }, { type: "phase-changed", phase: "materialize" }],
    ).state;
    expect(
      prepareGrandArchiveRuleBoundEvent(otherPlayersPhase.program, p1Materialize, {
        type: "object-moved",
        objectId: otherPlayersPhase.p2MaterialItemId,
        from: "material-deck",
        to: "banishment",
        actorId: otherPlayersPhase.p1,
      }),
    ).toBeUndefined();
  });
});
