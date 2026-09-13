import { lesserBoonOfKnox } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, grandArchiveStackItemId } from "../game/identity.ts";
import type { GrandArchiveMatchState, GrandArchiveStackItem } from "../game/model.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import { projectGrandArchiveViewerState } from "./view.ts";

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

const champion = card("view-permission-champion", "CHAMPION");
const privateCard = card("view-permission-private-card", "ACTION");
const filler = card("view-permission-filler", "ACTION");

function knoxLookEffects(): readonly [GrandArchiveEffect, GrandArchiveEffect] {
  if (lesserBoonOfKnox.layout.kind !== "single-faced") {
    throw new Error("Lesser Boon of Knox must be single-faced");
  }
  const ability = lesserBoonOfKnox.layout.face.abilities[0];
  if (
    ability?.kind !== "card-resolution" ||
    ability.effect?.kind !== "for-each-player" ||
    ability.effect.effect.kind !== "sequence"
  ) {
    throw new Error("Missing Lesser Boon of Knox resolution");
  }
  const opponentLook = ability.effect.effect.effects[1];
  const controllerLook = ability.effect.effect.effects[2];
  if (
    opponentLook?.kind !== "rule-modification" ||
    opponentLook.action !== "look-at" ||
    controllerLook?.kind !== "rule-modification" ||
    controllerLook.action !== "look-at"
  ) {
    throw new Error("Missing Lesser Boon of Knox look permissions");
  }
  return [opponentLook, controllerLook];
}

function setup() {
  const program = createGrandArchiveMatchProgram([champion, privateCard, filler, lesserBoonOfKnox]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: privateCard.canonicalId, count: 1 },
            { definitionId: lesserBoonOfKnox.canonicalId, count: 1 },
          ]
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
      randomSeed: 1104,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const hidden = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === privateCard.canonicalId,
  );
  const knox = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === lesserBoonOfKnox.canonicalId,
  );
  if (!hidden || !knox) throw new Error("Missing Knox projection fixture cards");
  const privateBanishment = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: hidden.id,
      from: hidden.zone,
      to: "banishment",
      entryFacing: "face-down",
    },
  ]).state;
  return { program, initial, privateBanishment, p1, p2, hiddenId: hidden.id, knoxId: knox.id };
}

function banishmentFor(
  fixture: ReturnType<typeof setup>,
  state: ReturnType<typeof setup>["privateBanishment"],
  viewerId: ReturnType<typeof grandArchivePlayerId>,
) {
  return projectGrandArchiveViewerState(fixture.program, state, viewerId).players.find(
    (player) => player.id === fixture.p1,
  )!.zones.banishment;
}

describe("Grand Archive viewer permissions", () => {
  it("does not expose private or face-down stack source presentation", () => {
    const fixture = setup();
    const stackItem: GrandArchiveStackItem = {
      id: grandArchiveStackItemId("private-source"),
      kind: "card-activation",
      controllerId: fixture.p1,
      sourceId: fixture.hiddenId,
      cardId: fixture.hiddenId,
      originZone: "banishment",
      paidCostKind: "none",
      elysianAuraActiveAtAnnouncement: false,
      announcedCardResolutionAbilities: [],
      selectedModeIds: [],
      targets: [],
      createdAtVersion: fixture.privateBanishment.stateVersion,
      activationPhase: "main",
      isCopy: false,
      negated: false,
      opportunityPolicy: "normal",
      activationStates: [],
      activationPayment: [],
      championLevelModifier: 0,
      variables: {},
      bindings: {},
    };
    const state: GrandArchiveMatchState = {
      ...fixture.privateBanishment,
      stack: [stackItem],
    };

    expect(
      projectGrandArchiveViewerState(fixture.program, state, fixture.p2).stack[0],
    ).not.toHaveProperty("presentation");
  });

  it("reveals a characteristic-selected face-down card only after the game ends", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const selected = executeGrandArchiveEffect(
      {
        kind: "move",
        subject: { kind: "bound", binding: "selected-card" },
        destination: { zone: "banishment" },
        facing: "face-down",
      },
      {
        program: fixture.program,
        state: fixture.initial,
        controllerId: fixture.p1,
        bindings: { "selected-card": [fixture.hiddenId] },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    expect(selected.state.objects[fixture.hiddenId]).toMatchObject({
      facing: "face-down",
      revealAtEndOfGame: true,
    });
    const duringGame = banishmentFor(fixture, selected.state, fixture.p2);
    if (duringGame.visibility !== "visible") throw new Error("Banishment must be public");
    expect(duringGame.objects).toEqual([]);
    expect(duringGame.hiddenCount).toBe(1);

    const finished = kernel.transact(selected.state, [
      { type: "match-finished", winnerIds: [fixture.p1] },
    ]).state;
    const afterGame = banishmentFor(fixture, finished, fixture.p2);
    if (afterGame.visibility !== "visible") throw new Error("Banishment must be public");
    expect(afterGame.objects.map((object) => object.id)).toEqual([fixture.hiddenId]);
    expect(afterGame.hiddenCount).toBe(0);
  });

  it("does not let a player inspect or enumerate their own Main Deck", () => {
    const fixture = setup();
    const ownMainDeck = projectGrandArchiveViewerState(
      fixture.program,
      fixture.privateBanishment,
      fixture.p1,
    ).players.find((player) => player.id === fixture.p1)!.zones["main-deck"];

    expect(ownMainDeck).toMatchObject({
      visibility: "hidden",
      revealedObjects: [],
    });
    if (ownMainDeck.visibility !== "hidden") throw new Error("Main Deck must be hidden");
    expect(ownMainDeck.count).toBeGreaterThan(0);
    expect(JSON.stringify(ownMainDeck)).not.toContain(privateCard.canonicalId);
  });

  it("keeps face-down public-zone cards private except for players with Knox permission", () => {
    const fixture = setup();
    for (const viewerId of [fixture.p1, fixture.p2]) {
      const banishment = banishmentFor(fixture, fixture.privateBanishment, viewerId);
      if (banishment.visibility !== "visible") throw new Error("Banishment must be public");
      expect(banishment.objects).toEqual([]);
      expect(banishment.hiddenCount).toBe(1);
    }

    const kernel = new GrandArchiveTransactionKernel();
    const [opponentLook, controllerLook] = knoxLookEffects();
    const opponentPermission = executeGrandArchiveEffect(
      opponentLook,
      {
        program: fixture.program,
        state: fixture.privateBanishment,
        controllerId: fixture.p1,
        sourceId: fixture.knoxId,
        abilityBearerId: fixture.knoxId,
        bindings: {
          "knox-card": [fixture.hiddenId],
          "knox-opponent": [fixture.p2],
        },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    const opponentView = banishmentFor(fixture, opponentPermission.state, fixture.p2);
    if (opponentView.visibility !== "visible") throw new Error("Banishment must be public");
    expect(opponentView.objects.map((object) => object.id)).toEqual([fixture.hiddenId]);
    expect(opponentView.hiddenCount).toBe(0);
    const controllerBeforePermission = banishmentFor(fixture, opponentPermission.state, fixture.p1);
    if (controllerBeforePermission.visibility !== "visible") {
      throw new Error("Banishment must be public");
    }
    expect(controllerBeforePermission.objects).toEqual([]);
    expect(controllerBeforePermission.hiddenCount).toBe(1);

    const controllerPermission = executeGrandArchiveEffect(
      controllerLook,
      {
        program: fixture.program,
        state: opponentPermission.state,
        controllerId: fixture.p1,
        sourceId: fixture.knoxId,
        abilityBearerId: fixture.knoxId,
        bindings: {
          "knox-card": [fixture.hiddenId],
          "knox-opponent": [fixture.p2],
        },
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const controllerView = banishmentFor(fixture, controllerPermission.state, fixture.p1);
    if (controllerView.visibility !== "visible") throw new Error("Banishment must be public");
    expect(controllerView.objects.map((object) => object.id)).toEqual([fixture.hiddenId]);
    expect(controllerView.hiddenCount).toBe(0);

    const faceUp = kernel.transact(fixture.privateBanishment, [
      { type: "object-facing-changed", objectId: fixture.hiddenId, facing: "face-up" },
    ]).state;
    const publicCard = banishmentFor(fixture, faceUp, fixture.p2);
    if (publicCard.visibility !== "visible") throw new Error("Banishment must be public");
    expect(publicCard.objects.map((object) => object.id)).toEqual([fixture.hiddenId]);
    expect(publicCard.hiddenCount).toBe(0);
  });

  it("retains a public card's identity when it becomes face-down in banishment", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const onField = kernel.transact(fixture.privateBanishment, [
      {
        type: "object-facing-changed",
        objectId: fixture.hiddenId,
        facing: "face-up",
      },
      {
        type: "object-moved",
        objectId: fixture.hiddenId,
        from: "banishment",
        to: "field",
      },
    ]).state;
    const privatelyBanished = kernel.transact(onField, [
      {
        type: "object-moved",
        objectId: fixture.hiddenId,
        from: "field",
        to: "banishment",
        entryFacing: "face-down",
      },
    ]).state;

    for (const viewerId of [fixture.p1, fixture.p2]) {
      const banishment = banishmentFor(fixture, privatelyBanished, viewerId);
      if (banishment.visibility !== "visible") throw new Error("Banishment must be public");
      expect(banishment.objects.map((object) => object.id)).toEqual([fixture.hiddenId]);
      expect(banishment.hiddenCount).toBe(0);
    }
  });
});
