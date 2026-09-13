import {
  blightsRing,
  cooktechApron,
  dianaDeadlyDuelist,
  diaoChanEnchantress,
  hexboundBlade,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { deriveGrandArchiveNumericProperty } from "../state/continuous.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { grandArchiveObjectActiveKeywords } from "../abilities/intrinsic-keywords.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import {
  chooseGrandArchiveReplacement,
  collectGrandArchiveReplacementCandidates,
} from "./replacements.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../abilities/triggers.ts";

function card(
  id: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  element: "NORM" | "UMBRA" = "NORM",
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
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: [element],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 2, life: 4 }
              : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("execution-source-champion", "CHAMPION");
const ally = card("execution-source-ally", "ALLY");
const umbraAlly = card("execution-source-umbra-ally", "ALLY", "UMBRA");
const filler = card("execution-source-filler", "ACTION");

function setup(
  included: readonly GrandArchiveAnyCard<GrandArchiveAbilityDefinition>[],
  firstPlayerId: "p1" | "p2" = "p1",
) {
  const program = createGrandArchiveMatchProgram([champion, ally, filler, ...included]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1" ? [{ definitionId: ally.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1"
        ? included.map((definition) => ({ definitionId: definition.canonicalId, count: 1 }))
        : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId,
      randomSeed: 791,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const championId = state.zones[p1].field[0]!;
  const objectId = (definitionId: string) => {
    const object = Object.values(state.objects).find(
      (candidate) => candidate.ownerId === p1 && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing execution-source fixture ${definitionId}`);
    return object.id;
  };
  return { program, state, p1, p2, championId, objectId };
}

describe("Grand Archive hosted ability execution sources", () => {
  it("applies Cooktech Apron's printed static effect to its linked ally", () => {
    const fixture = setup([cooktechApron]);
    const allyId = fixture.objectId(ally.canonicalId);
    const apronId = fixture.objectId(cooktechApron.canonicalId);
    const state = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: allyId,
        from: fixture.state.objects[allyId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: apronId,
        from: fixture.state.objects[apronId]!.zone,
        to: "field",
        hostId: allyId,
      },
    ]).state;

    expect(
      deriveGrandArchiveNumericProperty(state.objects[allyId]!, "life", {
        program: fixture.program,
        state,
        controllerId: fixture.p1,
        sourceId: allyId,
        abilityBearerId: allyId,
        bindings: {},
      }),
    ).toBe(6);
  });

  it("instances Blight's Ring inherited trigger from and onto its champion", () => {
    const fixture = setup([blightsRing]);
    const ringId = fixture.objectId(blightsRing.canonicalId);
    const kernel = new GrandArchiveTransactionKernel();
    const lineage = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: ringId,
        from: fixture.state.objects[ringId]!.zone,
        to: "inner-lineage",
        hostId: fixture.championId,
      },
    ]).state;
    const phase = kernel.transact(lineage, [
      { type: "phase-changed", phase: "recollection", actorId: fixture.p1 },
    ]);
    const triggerEvents = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      phase.state,
      phase.result.events,
    );
    const pending = triggerEvents.find(
      (event) =>
        event.type === "pending-trigger-added" && event.trigger.ability.id === "u8LjHnH6iC-a2",
    );
    if (!pending || pending.type !== "pending-trigger-added") {
      throw new Error("Expected Blight's Ring inherited trigger");
    }
    expect(pending.trigger.sourceId).toBe(fixture.championId);
    const effect = pending.trigger.ability.effect;
    if (!effect) throw new Error("Blight's Ring trigger must have an effect");
    const resolved = executeGrandArchiveEffect(
      effect,
      {
        program: fixture.program,
        state: phase.state,
        controllerId: pending.trigger.controllerId,
        sourceId: pending.trigger.sourceId,
        abilityBearerId: pending.trigger.sourceId,
        abilityId: pending.trigger.ability.id,
        bindings: pending.trigger.bindings,
        variables: pending.trigger.variables,
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(resolved.state.objects[fixture.championId]?.damage).toBe(1);
    expect(resolved.state.objects[ringId]?.damage).toBe(0);
  });

  it("applies Hexbound Blade's inherited replacement to its champion", () => {
    const fixture = setup([hexboundBlade, umbraAlly]);
    const bladeId = fixture.objectId(hexboundBlade.canonicalId);
    const umbraSourceId = fixture.objectId(umbraAlly.canonicalId);
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: bladeId,
        from: fixture.state.objects[bladeId]!.zone,
        to: "inner-lineage",
        hostId: fixture.championId,
      },
      {
        type: "object-moved",
        objectId: umbraSourceId,
        from: fixture.state.objects[umbraSourceId]!.zone,
        to: "field",
      },
    ]).state;
    const kernel = new GrandArchiveTransactionKernel({
      collectReplacements: (state, event) =>
        collectGrandArchiveReplacementCandidates(fixture.program, state, event),
      chooseReplacement: chooseGrandArchiveReplacement,
    });
    const damaged = kernel.transact(prepared, [
      {
        type: "damage-marked",
        objectId: fixture.championId,
        amount: 2,
        sourceId: umbraSourceId,
      },
    ]).state;
    expect(damaged.objects[fixture.championId]?.damage).toBe(3);
  });

  it("grants Diana's inherited Ranged keyword to the champion object", () => {
    const fixture = setup([dianaDeadlyDuelist]);
    const dianaId = fixture.objectId(dianaDeadlyDuelist.canonicalId);
    const state = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: dianaId,
        from: fixture.state.objects[dianaId]!.zone,
        to: "inner-lineage",
        hostId: fixture.championId,
      },
    ]).state;
    const rangedValues = grandArchiveObjectActiveKeywords(
      fixture.program,
      state,
      state.objects[fixture.championId]!,
    ).flatMap((keyword) => (keyword.name === "ranged" ? [keyword.value] : []));
    expect(rangedValues).toContain(2);
  });

  it("pays Diao Chan's inherited activated-ability cost with the champion object", () => {
    const fixture = setup([diaoChanEnchantress], "p2");
    const diaoId = fixture.objectId(diaoChanEnchantress.canonicalId);
    const lineage = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: diaoId,
        from: fixture.state.objects[diaoId]!.zone,
        to: "inner-lineage",
        hostId: fixture.championId,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, lineage);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(fixture.p1);
    const activation = runtime.execute(
      {
        move: "activate-ability",
        sourceId: diaoId,
        abilityId: "00xbh8oc00-a2",
      },
      { playerId: fixture.p1 },
    );
    if (!activation.ok) {
      throw new Error(
        `${activation.message}${activation.diagnostic ? `: ${activation.diagnostic.cause}` : ""}`,
      );
    }
    expect(runtime.state.stack.at(-1)?.sourceId).toBe(fixture.championId);
    expect(runtime.state.objects[fixture.championId]?.states.has("rested")).toBe(true);
    expect(runtime.state.objects[diaoId]?.zone).toBe("inner-lineage");
  });
});
