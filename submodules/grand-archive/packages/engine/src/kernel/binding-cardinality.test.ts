import { redirectOrbit } from "@tcg/grand-archive-cards";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId } from "../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../procedures/game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "./kernel.ts";
import { createGrandArchiveMatchProgram } from "./match-program.ts";
import { GrandArchiveMatchRuntime } from "../procedures/game-flow/runtime.ts";

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
        cost: { kind: "none" },
        typeLine: { supertypes: [], types: [type], classes: ["MAGE"], subtypes: [] },
        elements: type === "CHAMPION" ? ["ASTRA"] : ["NORM"],
        ...(type === "ACTION" ? { speed: "slow" as const } : {}),
        stats: type === "CHAMPION" ? { level: 0, life: 20 } : {},
        rulesText: "",
        abilities: [],
      },
    },
  };
}

const champion = card("binding-cardinality-champion", "CHAMPION");
const filler = card("binding-cardinality-filler", "ACTION");

function player(id: string): GrandArchiveStandardPlayerSetup {
  return {
    id,
    name: id,
    mainDeck: [
      { definitionId: redirectOrbit.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 8 },
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  };
}

describe("Grand Archive committed binding cardinality", () => {
  it("draws exactly the number of cards Redirect Orbit moved from hand and memory", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, redirectOrbit]);
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 428,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const source = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === redirectOrbit.canonicalId,
    );
    const fillers = Object.values(initial.objects).filter(
      (object) => object.ownerId === p1 && object.definitionId === filler.canonicalId,
    );
    if (!source || fillers.length < 4) throw new Error("Missing Redirect Orbit fixture cards");
    const [firstPayment, secondPayment, handSelection, retainedHandCard] = fillers;
    if (!firstPayment || !secondPayment || !handSelection || !retainedHandCard) {
      throw new Error("Missing Redirect Orbit payment and selection cards");
    }
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: source.id, from: "main-deck", to: "hand" },
      ...fillers.slice(0, 4).map((object) => ({
        type: "object-moved" as const,
        objectId: object.id,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    const activation = runtime.execute(
      {
        move: "activate-card",
        cardId: source.id,
        reservePayment: [
          { kind: "card", cardId: firstPayment.id },
          { kind: "card", cardId: secondPayment.id },
        ],
      },
      { playerId: p1 },
    );
    if (!activation.ok) throw new Error(activation.message);
    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.execute({ move: "pass" }, { playerId: p2 }).ok).toBe(true);

    const decision = runtime.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Redirect Orbit's any-number choice");
    }
    const resolution = runtime.execute(
      {
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: [handSelection.id, firstPayment.id],
      },
      { playerId: p1 },
    );
    if (!resolution.ok) throw new Error(resolution.message);

    expect(runtime.state.decision).toBeNull();
    expect(runtime.state.stack).toHaveLength(0);
    expect(runtime.state.objects[source.id]?.zone).toBe("graveyard");
    expect(runtime.state.zones[p1].hand).toEqual([retainedHandCard.id]);
    expect(runtime.state.zones[p1].memory).toHaveLength(3);
    expect(runtime.state.zones[p1]["main-deck"]).toHaveLength(4);
  });
});
