import { twinstarTonic } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../effects/effect-executor.ts";
import { grandArchivePlayerId, grandArchiveStackItemId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../../game/model.ts";
import { collectGrandArchiveTriggeredAbilityEvents } from "../../rules/abilities/triggers.ts";

function card(
  canonicalId: string,
  type: "ACTION" | "CHAMPION",
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
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("starcalling-copy-trigger-champion", "CHAMPION");
const action = card("starcalling-copy-trigger-action", "ACTION");

function twinstarTriggerEffect(): Extract<
  GrandArchiveEffect,
  { readonly kind: "create-delayed-trigger" }
> {
  if (twinstarTonic.layout.kind !== "single-faced") {
    throw new Error("Twinstar Tonic must be single-faced");
  }
  const ability = twinstarTonic.layout.face.abilities.find(
    (candidate) => candidate.id === "yBDxSHkT1s-a2",
  );
  if (
    ability?.kind !== "activated" ||
    !ability.effect ||
    ability.effect.kind !== "create-delayed-trigger"
  ) {
    throw new Error("Twinstar Tonic must create its persistent Starcalling trigger");
  }
  return ability.effect;
}

function setup() {
  const program = createGrandArchiveMatchProgram([champion, action, twinstarTonic]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: action.canonicalId, count: 2 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: twinstarTonic.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 867,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const source = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === twinstarTonic.canonicalId,
  );
  const activatedCard = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === action.canonicalId,
  );
  if (!source || !activatedCard) throw new Error("Missing Starcalling copy-trigger fixture");
  const kernel = new GrandArchiveTransactionKernel();
  const onField = kernel.transact(initial, [
    { type: "object-moved", objectId: source.id, from: source.zone, to: "field" },
  ]).state;
  const created = executeGrandArchiveEffect(
    twinstarTriggerEffect(),
    {
      program,
      state: onField,
      controllerId: p1,
      sourceId: source.id,
      abilityBearerId: source.id,
      bindings: {},
    },
    (state, events) => {
      const transaction = kernel.transact(state, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
  const sourceInGraveyard = kernel.transact(created.state, [
    { type: "object-moved", objectId: source.id, from: "field", to: "graveyard" },
  ]).state;
  return { program, state: sourceInGraveyard, p1, sourceId: source.id, cardId: activatedCard.id };
}

function starcalledActivation(
  state: GrandArchiveMatchState,
  controllerId: ReturnType<typeof grandArchivePlayerId>,
  cardId: ReturnType<typeof setup>["cardId"],
  isCopy: boolean,
): GrandArchiveStackItem {
  return {
    id: grandArchiveStackItemId(`stack-${state.nextStackOrdinal}`),
    kind: "card-activation",
    controllerId,
    sourceId: cardId,
    cardId,
    originZone: "main-deck",
    paidCostKind: "reserve",
    elysianAuraActiveAtAnnouncement: false,
    announcedCardResolutionAbilities: [],
    selectedModeIds: [],
    targets: [],
    createdAtVersion: state.stateVersion,
    activationPhase: state.turn.phase,
    isCopy,
    negated: false,
    opportunityPolicy: "normal",
    activationStates: ["starcalled"],
    activationPayment: [],
    championLevelModifier: 0,
    variables: {},
    bindings: {},
  };
}

describe("Starcalling copy trigger admission", () => {
  it("lets Twinstar Tonic observe the Starcalling action but not recursively observe its copy", () => {
    const fixture = setup();
    expect(fixture.state.objects[fixture.sourceId]?.zone).toBe("graveyard");
    expect(fixture.state.delayedTriggers).toHaveLength(1);
    expect(fixture.state.delayedTriggers[0]?.remainingUses).toBeUndefined();

    const kernel = new GrandArchiveTransactionKernel();
    const original = kernel.transact(fixture.state, [
      {
        type: "stack-item-deferred",
        item: starcalledActivation(fixture.state, fixture.p1, fixture.cardId, false),
        actorId: fixture.p1,
      },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        original.state,
        original.result.events,
      ).map((event) => event.type),
    ).toEqual(["pending-trigger-added"]);

    const copied = kernel.transact(fixture.state, [
      {
        type: "stack-item-deferred",
        item: starcalledActivation(fixture.state, fixture.p1, fixture.cardId, true),
        actorId: fixture.p1,
      },
    ]);
    expect(
      collectGrandArchiveTriggeredAbilityEvents(
        fixture.program,
        copied.state,
        copied.result.events,
      ),
    ).toEqual([]);
  });
});
