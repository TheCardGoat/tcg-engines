import {
  ashwoundShot,
  gaiasBlessing,
  imperialSeal,
  mirrorboundCovenant,
  prismaticSanctuary,
  voidsCloak,
} from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import {
  declareGrandArchiveTargets,
  proposeGrandArchiveCardActivation,
} from "../../procedures/activation/activation.ts";
import { executeGrandArchiveEffect } from "../../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../../procedures/game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { collectGrandArchiveStateBasedEvents } from "./state-based.ts";
import {
  deriveGrandArchiveContinuousPlayerProperty,
  grandArchivePlayerHasState,
} from "./player-continuous.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function card(
  id: string,
  type: "ACTION" | "CHAMPION",
  element: "FIRE" | "NORM" = "NORM",
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
        elements: [element],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("player-continuous-champion", "CHAMPION");
const fireAction = card("player-continuous-fire-action", "ACTION", "FIRE");
const filler = card("player-continuous-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    fireAction,
    filler,
    gaiasBlessing,
    imperialSeal,
    mirrorboundCovenant,
    prismaticSanctuary,
    voidsCloak,
    ashwoundShot,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: fireAction.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 6 },
      ...(id === "p1"
        ? [
            { definitionId: gaiasBlessing.canonicalId, count: 1 },
            { definitionId: mirrorboundCovenant.canonicalId, count: 1 },
            { definitionId: prismaticSanctuary.canonicalId, count: 1 },
            { definitionId: voidsCloak.canonicalId, count: 1 },
            { definitionId: ashwoundShot.canonicalId, count: 1 },
          ]
        : []),
    ],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: imperialSeal.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 1901,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  return { program, state, p1: grandArchivePlayerId("p1"), p2: grandArchivePlayerId("p2") };
}

function objectId(
  state: GrandArchiveMatchState,
  ownerId: ReturnType<typeof grandArchivePlayerId>,
  definitionId: string,
): GrandArchiveObjectId {
  const object = Object.values(state.objects).find(
    (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
  );
  if (!object) throw new Error(`Missing player continuous source ${definitionId}`);
  return object.id;
}

function settle(program: ReturnType<typeof setup>["program"], state: GrandArchiveMatchState) {
  const kernel = new GrandArchiveTransactionKernel();
  let current = state;
  for (let pass = 0; pass < 32; pass += 1) {
    const events = collectGrandArchiveStateBasedEvents(program, current);
    if (events.length === 0) return current;
    current = kernel.transact(current, events).state;
  }
  throw new Error("Player continuous state-based settlement did not converge");
}

function imperialSealEffect() {
  if (imperialSeal.layout.kind !== "single-faced") {
    throw new Error("Imperial Seal must be single-faced");
  }
  const ability = imperialSeal.layout.face.abilities[1];
  if (ability?.kind !== "activated" || !ability.effect) {
    throw new Error("Missing Imperial Seal activated effect");
  }
  return ability.effect;
}

describe("Grand Archive continuous player effects", () => {
  it("enables every basic element from Imperial Seal only until the turn ends", () => {
    const fixture = setup();
    const fireId = objectId(fixture.state, fixture.p1, fireAction.canonicalId);
    const sealId = objectId(fixture.state, fixture.p1, imperialSeal.canonicalId);
    const inHand = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fireId,
        from: fixture.state.objects[fireId]!.zone,
        to: "hand",
      },
    ]).state;
    expect(() =>
      proposeGrandArchiveCardActivation(fixture.program, inHand, fixture.p1, {
        move: "activate-card",
        cardId: fireId,
      }),
    ).toThrow("required element enabled");

    const kernel = new GrandArchiveTransactionKernel();
    const enabled = executeGrandArchiveEffect(
      imperialSealEffect(),
      {
        program: fixture.program,
        state: inHand,
        controllerId: fixture.p1,
        sourceId: sealId,
        abilityBearerId: sealId,
        bindings: {},
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(enabled.continuousEffects).toHaveLength(3);
    for (const element of ["FIRE", "WATER", "WIND"] as const) {
      expect(
        grandArchivePlayerHasState(fixture.program, enabled, fixture.p1, {
          named: "enabled-element",
          value: element,
        }),
      ).toBe(true);
      expect(
        grandArchivePlayerHasState(fixture.program, enabled, fixture.p2, {
          named: "enabled-element",
          value: element,
        }),
      ).toBe(false);
    }
    expect(
      proposeGrandArchiveCardActivation(fixture.program, enabled, fixture.p1, {
        move: "activate-card",
        cardId: fireId,
      }).events.some((event) => event.type === "stack-item-added"),
    ).toBe(true);

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(enabled))),
    );
    const nextTurn = kernel.transact(restored, [
      { type: "turn-started", playerId: fixture.p2, turnNumber: 2 },
    ]).state;
    const expired = settle(fixture.program, nextTurn);
    expect(expired.continuousEffects).toEqual([]);
    expect(
      grandArchivePlayerHasState(fixture.program, expired, fixture.p1, {
        named: "enabled-element",
        value: "FIRE",
      }),
    ).toBe(false);
    expect(() =>
      proposeGrandArchiveCardActivation(fixture.program, expired, fixture.p1, {
        move: "activate-card",
        cardId: fireId,
      }),
    ).toThrow("required element enabled");
  });

  it("enables elements for activation only while Prismatic Sanctuary is functional", () => {
    const fixture = setup();
    const fireId = objectId(fixture.state, fixture.p1, fireAction.canonicalId);
    const sanctuaryId = objectId(fixture.state, fixture.p1, prismaticSanctuary.canonicalId);
    const inHand = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: fireId,
        from: fixture.state.objects[fireId]!.zone,
        to: "hand",
      },
    ]).state;
    expect(() =>
      proposeGrandArchiveCardActivation(fixture.program, inHand, fixture.p1, {
        move: "activate-card",
        cardId: fireId,
      }),
    ).toThrow("required element enabled");

    const enabled = new GrandArchiveTransactionKernel().transact(inHand, [
      {
        type: "object-moved",
        objectId: sanctuaryId,
        from: inHand.objects[sanctuaryId]!.zone,
        to: "field",
      },
    ]).state;
    expect(
      proposeGrandArchiveCardActivation(fixture.program, enabled, fixture.p1, {
        move: "activate-card",
        cardId: fireId,
      }).events.some((event) => event.type === "stack-item-added"),
    ).toBe(true);
  });

  it("derives spellshroud and maximum influence from functional catalog sources", () => {
    const fixture = setup();
    const cloakId = objectId(fixture.state, fixture.p1, voidsCloak.canonicalId);
    const covenantId = objectId(fixture.state, fixture.p1, mirrorboundCovenant.canonicalId);
    const active = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: cloakId,
        from: fixture.state.objects[cloakId]!.zone,
        to: "field",
      },
      {
        type: "object-moved",
        objectId: covenantId,
        from: fixture.state.objects[covenantId]!.zone,
        to: "field",
      },
    ]).state;

    expect(
      grandArchivePlayerHasState(fixture.program, active, fixture.p1, {
        named: "spellshroud",
      }),
    ).toBe(true);
    expect(
      deriveGrandArchiveContinuousPlayerProperty(
        fixture.program,
        active,
        fixture.p1,
        "maximum-influence",
      ),
    ).toBe(7);
    expect(
      deriveGrandArchiveContinuousPlayerProperty(
        fixture.program,
        active,
        fixture.p2,
        "maximum-influence",
      ),
    ).toBe(7);
  });

  it("applies Layer A player-property setters before older Layer E adjustments", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const addTwo = executeGrandArchiveEffect(
      {
        kind: "continuous-player-property",
        players: "controller",
        property: "maximum-influence",
        operation: "add",
        amount: 2,
        duration: { kind: "permanent" },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        bindings: {},
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;
    const setSeven = executeGrandArchiveEffect(
      {
        kind: "continuous-player-property",
        players: "controller",
        property: "maximum-influence",
        operation: "set",
        amount: 7,
        duration: { kind: "permanent" },
      },
      {
        program: fixture.program,
        state: addTwo,
        controllerId: fixture.p1,
        bindings: {},
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    ).state;

    expect(
      deriveGrandArchiveContinuousPlayerProperty(
        fixture.program,
        setSeven,
        fixture.p1,
        "maximum-influence",
      ),
    ).toBe(9);
  });

  it("prevents a Spell from declaring a player with spellshroud as its target", () => {
    const fixture = setup();
    const cloakId = objectId(fixture.state, fixture.p1, voidsCloak.canonicalId);
    const shotId = objectId(fixture.state, fixture.p1, ashwoundShot.canonicalId);
    const protectedState = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: cloakId,
        from: fixture.state.objects[cloakId]!.zone,
        to: "field",
        newControllerId: fixture.p2,
      },
      {
        type: "object-moved",
        objectId: shotId,
        from: fixture.state.objects[shotId]!.zone,
        to: "effects-stack",
      },
    ]).state;
    if (ashwoundShot.layout.kind !== "single-faced") {
      throw new Error("Ashwound Shot must be single-faced");
    }
    const ability = ashwoundShot.layout.face.abilities[0];
    if (ability?.kind !== "card-resolution") throw new Error("Missing Ashwound target");
    const evaluation = {
      program: fixture.program,
      state: protectedState,
      controllerId: fixture.p1,
      sourceId: shotId,
      abilityBearerId: shotId,
      bindings: {},
      targeting: { kind: "card-activation" as const, sourceIsSpell: true },
    };
    expect(() =>
      declareGrandArchiveTargets(ability.targets, { "target-player": [fixture.p2] }, evaluation),
    ).toThrow("illegal object");
    expect(
      declareGrandArchiveTargets(ability.targets, { "target-player": [fixture.p1] }, evaluation)[0]
        ?.targetIds,
    ).toEqual([fixture.p1]);
  });

  it("reveals the controller's top main-deck card to opposing viewers", () => {
    const fixture = setup();
    const blessingId = objectId(fixture.state, fixture.p1, gaiasBlessing.canonicalId);
    const active = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: blessingId,
        from: fixture.state.objects[blessingId]!.zone,
        to: "field",
      },
    ]).state;
    const topCardId = active.zones[fixture.p1]["main-deck"][0]!;
    const opponentView = projectGrandArchiveViewerState(fixture.program, active, fixture.p2);
    const opponentMainDeck = opponentView.players.find((player) => player.id === fixture.p1)?.zones[
      "main-deck"
    ];
    expect(opponentMainDeck?.visibility).toBe("hidden");
    if (!opponentMainDeck || opponentMainDeck.visibility !== "hidden") {
      throw new Error("Expected the opposing main deck to remain hidden");
    }
    expect(opponentMainDeck.revealedObjects.map((object) => object.id)).toEqual([topCardId]);
  });

  it("makes the turn player discard from hand or memory down to maximum influence", () => {
    const fixture = setup();
    const covenantId = objectId(fixture.state, fixture.p1, mirrorboundCovenant.canonicalId);
    const available = fixture.state.zones[fixture.p1]["main-deck"].filter(
      (objectId) => objectId !== covenantId,
    );
    const handIds = available.slice(0, 5);
    const memoryIds = available.slice(5, 9);
    const positioned = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: covenantId,
        from: fixture.state.objects[covenantId]!.zone,
        to: "field",
      },
      ...handIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
      ...memoryIds.map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "memory" as const,
      })),
      { type: "phase-changed", phase: "end" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, positioned);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: fixture.p2 }).ok).toBe(true);
    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "discard-to-influence-limit") {
      throw new Error("Expected maximum influence cleanup decision");
    }
    expect(decision.maximum).toBe(7);
    expect(decision.amount).toBe(2);
    expect(
      runtime.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [handIds[0], memoryIds[0]],
        },
        { playerId: fixture.p1 },
      ).ok,
    ).toBe(true);
    expect(runtime.state.objects[handIds[0]!]?.zone).toBe("graveyard");
    expect(runtime.state.objects[memoryIds[0]!]?.zone).toBe("graveyard");
    expect(
      runtime.state.zones[fixture.p1].hand.length + runtime.state.zones[fixture.p1].memory.length,
    ).toBe(7);
    expect(runtime.state.turn.playerId).toBe(fixture.p2);
    expect(runtime.state.turn.cleanupPending).toBe(false);
  });
});
