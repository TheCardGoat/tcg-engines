import { cosmicBolt, polarisTwinklingCauldron } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "../procedures/effects/effect-executor.ts";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../kernel/kernel.ts";
import { projectGrandArchiveViewerLog } from "../log/projection.ts";
import { createGrandArchiveMatchProgram } from "../kernel/match-program.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../snapshot/snapshot.ts";
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

const champion = card("generation-visibility-champion", "CHAMPION");
const filler = card("generation-visibility-filler", "ACTION");

function polarisResolution(): Extract<GrandArchiveEffect, { readonly kind: "sequence" }> {
  if (polarisTwinklingCauldron.layout.kind !== "single-faced") {
    throw new Error("Polaris, Twinkling Cauldron must be single-faced");
  }
  const ability = polarisTwinklingCauldron.layout.face.abilities.find(
    (candidate) =>
      candidate.kind === "activated" &&
      candidate.effect?.kind === "sequence" &&
      candidate.effect.effects.some(
        (effect) => effect.kind === "generate" && effect.card === "Cosmic Bolt",
      ),
  );
  if (ability?.kind !== "activated" || ability.effect?.kind !== "sequence") {
    throw new Error("Polaris must have its catalog Cosmic Bolt generation sequence");
  }
  return ability.effect;
}

function setup() {
  const program = createGrandArchiveMatchProgram([
    champion,
    filler,
    polarisTwinklingCauldron,
    cosmicBolt,
  ]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
    materialDeck: [
      { definitionId: champion.canonicalId, count: 1 },
      ...(id === "p1" ? [{ definitionId: polarisTwinklingCauldron.canonicalId, count: 1 }] : []),
    ],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
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
  const p2 = grandArchivePlayerId("p2");
  const polaris = Object.values(initial.objects).find(
    (object) =>
      object.ownerId === p1 && object.definitionId === polarisTwinklingCauldron.canonicalId,
  );
  if (!polaris) throw new Error("Missing Polaris fixture card");
  const field = new GrandArchiveTransactionKernel().transact(initial, [
    {
      type: "object-moved",
      objectId: polaris.id,
      from: "material-deck",
      to: "field",
    },
  ]).state;
  return { program, state: field, p1, p2, polarisId: polaris.id };
}

describe("Grand Archive generated-card visibility", () => {
  it("reveals Polaris's specified Cosmic Bolts once before hiding and shuffling them", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      polarisResolution(),
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.polarisId,
        abilityBearerId: fixture.polarisId,
        variables: { Y: 2 },
        bindings: {},
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );

    const generated = Object.values(result.state.objects).filter(
      (object) => object.definitionId === cosmicBolt.canonicalId,
    );
    expect(generated).toHaveLength(2);
    expect(generated.map((object) => [object.zone, object.facing])).toEqual([
      ["main-deck", "face-down"],
      ["main-deck", "face-down"],
    ]);

    const reveals = result.events.filter((event) => event.type === "card-revealed");
    expect(reveals).toHaveLength(2);
    expect(reveals.map((event) => event.revealedBeforePrivateEntry)).toEqual([true, true]);
    expect(reveals.every((event) => event.from === undefined)).toBe(true);

    for (const viewerId of [fixture.p1, fixture.p2]) {
      const view = projectGrandArchiveViewerState(fixture.program, result.state, viewerId);
      const deck = view.players.find((player) => player.id === fixture.p1)!.zones["main-deck"];
      expect(deck.visibility).toBe("hidden");
      if (deck.visibility !== "hidden") throw new Error("Main Deck must be private");
      expect(deck.revealedObjects).toEqual([]);
      expect(JSON.stringify(deck)).not.toContain(cosmicBolt.canonicalId);

      const revealLog = projectGrandArchiveViewerLog(
        fixture.program,
        result.state,
        viewerId,
        reveals,
      );
      expect(revealLog.map((message) => message.key)).toEqual([
        "grand-archive.card.revealed",
        "grand-archive.card.revealed",
      ]);
      expect(revealLog.every((message) => JSON.stringify(message).includes("Cosmic Bolt"))).toBe(
        true,
      );
    }

    const restored = restoreGrandArchiveMatchSnapshot(
      fixture.program,
      JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(result.state))),
    );
    expect(
      Object.values(restored.objects)
        .filter((object) => object.definitionId === cosmicBolt.canonicalId)
        .map((object) => object.facing),
    ).toEqual(["face-down", "face-down"]);
  });

  it("keeps a generated Memory card private after the mandatory public reveal", () => {
    const fixture = setup();
    const kernel = new GrandArchiveTransactionKernel();
    const result = executeGrandArchiveEffect(
      {
        kind: "generate",
        card: cosmicBolt.canonicalId,
        player: "controller",
        destination: { zone: "memory" },
      },
      {
        program: fixture.program,
        state: fixture.state,
        controllerId: fixture.p1,
        sourceId: fixture.polarisId,
        abilityBearerId: fixture.polarisId,
        bindings: {},
      },
      (state, events) => {
        const transaction = kernel.transact(state, events);
        return { state: transaction.state, events: transaction.result.events };
      },
    );
    const generated = Object.values(result.state.objects).find(
      (object) => object.definitionId === cosmicBolt.canonicalId,
    );
    if (!generated) throw new Error("Missing generated Cosmic Bolt");
    expect(generated).toMatchObject({ zone: "memory", facing: "face-down" });
    expect(result.events.map((event) => event.type)).toEqual(["object-created", "card-revealed"]);

    const ownerMemory = projectGrandArchiveViewerState(
      fixture.program,
      result.state,
      fixture.p1,
    ).players.find((player) => player.id === fixture.p1)!.zones.memory;
    if (ownerMemory.visibility !== "visible") throw new Error("Owner must be able to see Memory");
    expect(ownerMemory.objects.map((object) => object.id)).toEqual([generated.id]);

    const opponentMemory = projectGrandArchiveViewerState(
      fixture.program,
      result.state,
      fixture.p2,
    ).players.find((player) => player.id === fixture.p1)!.zones.memory;
    if (opponentMemory.visibility !== "hidden") {
      throw new Error("Opponent must not be able to see Memory");
    }
    expect(opponentMemory.revealedObjects).toEqual([]);
    expect(JSON.stringify(opponentMemory)).not.toContain(cosmicBolt.canonicalId);
  });
});
