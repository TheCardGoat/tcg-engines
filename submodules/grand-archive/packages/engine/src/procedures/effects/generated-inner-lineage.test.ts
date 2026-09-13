import { creepingTorment, dianaDuskstalker } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import type { GrandArchiveExecutionBinding } from "./evaluation.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["CLERIC"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("generated-lineage-champion", "CHAMPION");
const filler = card("generated-lineage-filler", "ACTION");

function dianaGenerationEffect(): Extract<GrandArchiveEffect, { readonly kind: "generate" }> {
  if (dianaDuskstalker.layout.kind !== "single-faced") {
    throw new Error("Diana, Duskstalker must be single-faced");
  }
  const ability = dianaDuskstalker.layout.face.abilities.find(
    (candidate) => candidate.kind === "triggered" && candidate.effect?.kind === "generate",
  );
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "generate") {
    throw new Error("Diana must have her catalog Creeping Torment generation effect");
  }
  return ability.effect;
}

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    dianaDuskstalker,
    creepingTorment,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 7 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: dianaDuskstalker.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 448,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const diana = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === dianaDuskstalker.canonicalId,
  );
  const existingLineageCard = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
  );
  const hitChampionId = initial.zones[p2].field[0];
  if (!diana || !existingLineageCard || !hitChampionId) {
    throw new Error("Missing generated Inner Lineage fixture objects");
  }
  const prepared = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: diana.id,
      from: "material-deck",
      to: "field",
    },
    {
      type: "object-moved",
      objectId: existingLineageCard.id,
      from: "main-deck",
      to: "inner-lineage",
      hostId: hitChampionId,
      placement: "bottom",
    },
  ]).state;
  return {
    program,
    state: prepared,
    p1,
    p2,
    dianaId: diana.id,
    hitChampionId,
    existingLineageCardId: existingLineageCard.id,
  };
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  controllerId: ReturnType<typeof grandArchivePlayerId>,
  options: {
    readonly sourceId?: GrandArchiveObjectId;
    readonly abilityId?: string;
    readonly bindings?: Readonly<Record<string, GrandArchiveExecutionBinding>>;
  } = {},
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId,
      ...(options.sourceId
        ? { sourceId: options.sourceId, abilityBearerId: options.sourceId }
        : {}),
      ...(options.abilityId ? { abilityId: options.abilityId } : {}),
      bindings: options.bindings ?? {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Grand Archive generated object-specific cards", () => {
  it("generates Diana's Creeping Torment at the lineage bottom and executes it from the host", () => {
    const fixture = setup();
    const generated = execute(fixture, fixture.state, dianaGenerationEffect(), fixture.p1, {
      sourceId: fixture.dianaId,
      abilityId: "iq4d5vettc-a3",
      bindings: { eventRecipient: [fixture.hitChampionId] },
    });
    const torment = Object.values(generated.state.objects).find(
      (object) => object.definitionId === creepingTorment.canonicalId,
    );
    if (!torment) throw new Error("Diana did not generate Creeping Torment");
    expect(torment).toMatchObject({
      ownerId: fixture.p1,
      zone: "inner-lineage",
      hostId: fixture.hitChampionId,
      facing: "face-up",
    });
    expect(
      generated.state.zones[fixture.p1]["inner-lineage"].filter(
        (objectId) => generated.state.objects[objectId]?.hostId === fixture.hitChampionId,
      ),
    ).toEqual([fixture.existingLineageCardId, torment.id]);
    expect(generated.events.find((event) => event.type === "object-created")).toMatchObject({
      type: "object-created",
      placement: "bottom",
    });

    for (const viewerId of [fixture.p1, fixture.p2]) {
      const lineage = projectGrandArchiveViewerState(
        fixture.program,
        generated.state,
        viewerId,
      ).players.find((player) => player.id === fixture.p1)!.zones["inner-lineage"];
      if (lineage.visibility !== "visible") throw new Error("Inner Lineage must be public");
      expect(lineage.objects.map((object) => object.id)).toContain(torment.id);
    }

    const firstDraw = execute(
      fixture,
      generated.state,
      { kind: "draw", player: "controller", amount: 1 },
      fixture.p2,
    );
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        firstDraw.state,
        firstDraw.events,
      ).some(
        (event) =>
          event.type === "pending-trigger-added" && event.trigger.ability.id === "zrplywc08c-a2",
      ),
    ).toBe(false);

    const secondDraw = execute(
      fixture,
      firstDraw.state,
      { kind: "draw", player: "controller", amount: 1 },
      fixture.p2,
    );
    const pending = collectGrandArchiveTriggeredAbilityEvents(
      fixture.program,
      secondDraw.state,
      secondDraw.events,
    ).find(
      (event) =>
        event.type === "pending-trigger-added" && event.trigger.ability.id === "zrplywc08c-a2",
    );
    if (!pending || pending.type !== "pending-trigger-added") {
      throw new Error("Expected generated Creeping Torment's inherited trigger");
    }
    expect(pending.trigger).toMatchObject({
      controllerId: fixture.p2,
      sourceId: fixture.hitChampionId,
    });
    const triggerEffect = pending.trigger.ability.effect;
    if (!triggerEffect) throw new Error("Creeping Torment's inherited trigger needs an effect");
    const damaged = execute(
      fixture,
      secondDraw.state,
      triggerEffect,
      pending.trigger.controllerId,
      {
        sourceId: pending.trigger.sourceId,
        abilityId: pending.trigger.ability.id,
        bindings: pending.trigger.bindings,
      },
    );
    expect(damaged.state.objects[fixture.hitChampionId]?.damage).toBe(2);

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(generated.state))),
    );
    expect(restored.objects[torment.id]).toMatchObject({
      zone: "inner-lineage",
      hostId: fixture.hitChampionId,
    });
  });

  it("falls back to hand when the specified object-specific zone no longer exists", () => {
    const fixture = setup();
    const departed = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fixture.hitChampionId,
        from: "field",
        to: "banishment",
      },
    ]).state;
    const generated = execute(fixture, departed, dianaGenerationEffect(), fixture.p1, {
      sourceId: fixture.dianaId,
      abilityId: "iq4d5vettc-a3",
      bindings: { eventRecipient: [fixture.hitChampionId] },
    });
    const torment = Object.values(generated.state.objects).find(
      (object) => object.definitionId === creepingTorment.canonicalId,
    );
    if (!torment) throw new Error("Diana did not generate Creeping Torment");

    expect(generated.outcome).toBe("performed");
    expect(torment).toMatchObject({
      ownerId: fixture.p1,
      zone: "hand",
      facing: "face-down",
    });
    expect(torment.hostId).toBeUndefined();
    const creation = generated.events.find((event) => event.type === "object-created");
    expect(creation).toBeDefined();
    expect(creation).not.toHaveProperty("placement");
    expect(generated.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "card-revealed",
          objectId: torment.id,
          revealedBeforePrivateEntry: true,
        }),
      ]),
    );
  });
});
