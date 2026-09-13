import { malignantAthame, orbOfSealing } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "./identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "./model.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../snapshot/snapshot.ts";

function card(id: string, type: "CHAMPION" | "ACTION"): GrandArchiveAnyCard {
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
        typeLine: { supertypes: [], types: [type], classes: ["ASSASSIN"], subtypes: [] },
        elements: ["NORM"],
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("zone-operation-champion", "CHAMPION");
const filler = card("zone-operation-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler, malignantAthame, orbOfSealing]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
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
        randomSeed: 331,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    ),
    p1: grandArchivePlayerId("p1"),
    p2: grandArchivePlayerId("p2"),
  };
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
  bindings: Readonly<Record<string, readonly GrandArchiveObjectId[]>>,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    {
      ...effect,
    },
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      bindings,
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function malignantAthameSwap(): Extract<GrandArchiveEffect, { readonly kind: "swap-zones" }> {
  const face =
    malignantAthame.layout.kind === "single-faced"
      ? malignantAthame.layout.face
      : malignantAthame.layout.defaultFace;
  const ability = face.abilities.find((candidate) => candidate.id === "0dr40tfllk-a1");
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "optional") {
    throw new Error("Malignant Athame's optional trigger is unavailable");
  }
  const sequence = ability.effect.effect;
  if (sequence.kind !== "sequence" || sequence.effects[0]?.kind !== "swap-zones") {
    throw new Error("Malignant Athame's zone swap is unavailable");
  }
  return sequence.effects[0];
}

function orbFacingEffect(): Extract<GrandArchiveEffect, { readonly kind: "set-card-facing" }> {
  const face =
    orbOfSealing.layout.kind === "single-faced"
      ? orbOfSealing.layout.face
      : orbOfSealing.layout.defaultFace;
  const ability = face.abilities.find((candidate) => candidate.id === "mekutzp19y-a2");
  if (ability?.kind !== "triggered" || ability.effect?.kind !== "sequence") {
    throw new Error("Orb of Sealing's leave trigger is unavailable");
  }
  const facing = ability.effect.effects[1];
  if (facing?.kind !== "set-card-facing") {
    throw new Error("Orb of Sealing's facing effect is unavailable");
  }
  return facing;
}

describe("Grand Archive zone and facing effects", () => {
  it("repositions within one zone without creating a new object incarnation", () => {
    const fixture = setup();
    const cardId = fixture.state.zones[fixture.p1]["main-deck"].at(-1)!;
    const before = fixture.state.objects[cardId]!;

    const moved = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: cardId,
        from: "main-deck",
        to: "main-deck",
        placement: "top",
        effectSpecified: true,
        entryFacing: "face-up",
        entryStates: ["rested"],
        initialCounters: { buff: 9 },
      },
    ]);

    expect(moved.state.zones[fixture.p1]["main-deck"][0]).toBe(cardId);
    expect(moved.state.objects[cardId]).toEqual(before);
  });

  it("protects Main Deck and Effects Stack order from direct repositioning", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const deckCardId = fixture.state.zones[fixture.p1]["main-deck"].at(-1)!;

    expect(() =>
      kernel.transact(fixture.state, [
        {
          type: "object-moved",
          objectId: deckCardId,
          from: "main-deck",
          to: "main-deck",
          placement: "top",
          cause: { kind: "command", move: "reorder-zone" },
        },
      ]),
    ).toThrow("The Main Deck order can only be changed by a rule or effect");

    const onStack = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: deckCardId,
        from: "main-deck",
        to: "effects-stack",
      },
    ]).state;
    expect(() =>
      kernel.transact(onStack, [
        {
          type: "object-moved",
          objectId: deckCardId,
          from: "effects-stack",
          to: "effects-stack",
          placement: "bottom",
          effectSpecified: true,
        },
      ]),
    ).toThrow("The Effects Stack order cannot be changed");
  });

  it("requires every object-specific zone card to name a distinct field host", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const [cardId, nonFieldHostId] = fixture.state.zones[fixture.p1]["main-deck"];
    if (!cardId || !nonFieldHostId) throw new Error("Missing hosted-zone fixture cards");

    for (const zone of ["loaded", "inner-lineage", "intent"] as const) {
      expect(() =>
        kernel.transact(fixture.state, [
          { type: "object-moved", objectId: cardId, from: "main-deck", to: zone },
        ]),
      ).toThrow(`Card entering ${zone} requires another object as host`);
      expect(() =>
        kernel.transact(fixture.state, [
          {
            type: "object-moved",
            objectId: cardId,
            from: "main-deck",
            to: zone,
            hostId: nonFieldHostId,
          },
        ]),
      ).toThrow(`Card entering ${zone} requires a field host`);
      expect(() =>
        kernel.transact(fixture.state, [
          {
            type: "object-moved",
            objectId: cardId,
            from: "main-deck",
            to: zone,
            hostId: cardId,
          },
        ]),
      ).toThrow(`Card entering ${zone} requires another object as host`);
    }
  });

  it("routes cards to their owner's Graveyard, Banishment, Hand, and Memory", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const cardId = fixture.state.zones[fixture.p2]["main-deck"][0]!;

    const controlled = kernel.transact(fixture.state, [
      {
        type: "object-moved",
        objectId: cardId,
        from: "main-deck",
        to: "field",
        newControllerId: fixture.p1,
      },
    ]).state;
    expect(controlled.objects[cardId]).toMatchObject({
      ownerId: fixture.p2,
      controllerId: fixture.p1,
    });

    const inGraveyard = kernel.transact(controlled, [
      { type: "object-moved", objectId: cardId, from: "field", to: "graveyard" },
    ]).state;
    expect(inGraveyard.zones[fixture.p2].graveyard).toContain(cardId);
    expect(inGraveyard.zones[fixture.p1].graveyard).not.toContain(cardId);

    const inBanishment = kernel.transact(inGraveyard, [
      {
        type: "object-moved",
        objectId: cardId,
        from: "graveyard",
        to: "field",
        newControllerId: fixture.p1,
      },
      { type: "object-moved", objectId: cardId, from: "field", to: "banishment" },
    ]).state;
    expect(inBanishment.zones[fixture.p2].banishment).toContain(cardId);
    expect(inBanishment.zones[fixture.p1].banishment).not.toContain(cardId);

    const inHand = kernel.transact(inBanishment, [
      {
        type: "object-moved",
        objectId: cardId,
        from: "banishment",
        to: "field",
        newControllerId: fixture.p1,
      },
      { type: "object-moved", objectId: cardId, from: "field", to: "hand" },
    ]).state;
    expect(inHand.zones[fixture.p2].hand).toContain(cardId);
    expect(inHand.zones[fixture.p1].hand).not.toContain(cardId);

    const inMemory = kernel.transact(inHand, [
      {
        type: "object-moved",
        objectId: cardId,
        from: "hand",
        to: "field",
        newControllerId: fixture.p1,
      },
      { type: "object-moved", objectId: cardId, from: "field", to: "memory" },
    ]).state;
    expect(inMemory.zones[fixture.p2].memory).toContain(cardId);
    expect(inMemory.zones[fixture.p1].memory).not.toContain(cardId);
    expect(inMemory.objects[cardId]).toMatchObject({
      ownerId: fixture.p2,
      controllerId: fixture.p2,
      facing: "face-down",
    });

    expect(() =>
      kernel.transact(inMemory, [
        {
          type: "object-moved",
          objectId: cardId,
          from: "memory",
          to: "hand",
          newControllerId: fixture.p1,
        },
      ]),
    ).toThrow("Card entering hand must return to its owner");
  });

  it("atomically swaps every card in Malignant Athame's chosen hand and memory", () => {
    const fixture = setup();
    const p2Cards = Object.values(fixture.state.objects).filter(
      (object) => object.ownerId === fixture.p2 && object.definitionId === filler.canonicalId,
    );
    const p2Champion = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p2 && object.definitionId === champion.canonicalId,
    );
    if (!p2Cards[0] || !p2Cards[1] || !p2Cards[2] || !p2Champion) {
      throw new Error("Missing zone-operation fixture objects");
    }
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId: p2Cards[0].id,
        from: "main-deck",
        to: "hand",
      },
      {
        type: "object-moved",
        objectId: p2Cards[1].id,
        from: "main-deck",
        to: "hand",
      },
      {
        type: "object-moved",
        objectId: p2Cards[2].id,
        from: "main-deck",
        to: "memory",
      },
    ]).state;
    const swapped = execute(fixture, prepared, malignantAthameSwap(), {
      eventRecipient: [p2Champion.id],
    });
    expect(swapped.state.zones[fixture.p2].hand).toEqual([p2Cards[2].id]);
    expect(new Set(swapped.state.zones[fixture.p2].memory)).toEqual(
      new Set([p2Cards[0].id, p2Cards[1].id]),
    );
    expect(
      swapped.events.map((event) => [
        event.type,
        "from" in event ? event.from : undefined,
        "to" in event ? event.to : undefined,
      ]),
    ).toEqual([
      ["object-moved", "hand", "memory"],
      ["object-moved", "hand", "memory"],
      ["object-moved", "memory", "hand"],
    ]);
    for (const cardObject of p2Cards.slice(0, 3)) {
      expect(swapped.state.objects[cardObject.id]).toMatchObject({
        ownerId: fixture.p2,
        controllerId: fixture.p2,
        facing: "face-down",
        incarnation: cardObject.incarnation + 2,
        objectVersion: cardObject.objectVersion + 2,
      });
    }
    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(swapped.state))),
    );
    expect(restored.zones[fixture.p2]).toMatchObject({
      hand: [p2Cards[2].id],
      memory: expect.arrayContaining([p2Cards[0].id, p2Cards[1].id]),
    });
  });

  it("turns Orb of Sealing's tracked cards face up without creating new objects", () => {
    const fixture = setup();
    const cardId = Object.values(fixture.state.objects).find(
      (object) => object.ownerId === fixture.p2 && object.definitionId === filler.canonicalId,
    )!.id;
    const prepared = new GrandArchiveTransactionKernel().transact(fixture.state, [
      { type: "object-moved", objectId: cardId, from: "main-deck", to: "banishment" },
      { type: "object-facing-changed", objectId: cardId, facing: "face-down" },
    ]).state;
    const incarnation = prepared.objects[cardId]!.incarnation;
    const objectVersion = prepared.objects[cardId]!.objectVersion;
    const faced = execute(fixture, prepared, orbFacingEffect(), {
      "unsealed-cards": [cardId],
    });
    expect(faced.events).toMatchObject([
      { type: "object-facing-changed", objectId: cardId, facing: "face-up" },
    ]);
    expect(faced.state.objects[cardId]).toMatchObject({
      zone: "banishment",
      facing: "face-up",
      incarnation,
      objectVersion: objectVersion + 1,
    });
    const alreadyFaceUp = execute(fixture, faced.state, orbFacingEffect(), {
      "unsealed-cards": [cardId],
    });
    expect(alreadyFaceUp.outcome).toBe("not-performed");
    expect(alreadyFaceUp.events).toEqual([]);
  });
});
