import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";

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

const champion = card("discard-rules-champion", "CHAMPION");
const filler = card("discard-rules-filler", "ACTION");

function setup() {
  const program = createGrandArchiveMatchProgram([champion, filler]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [{ definitionId: filler.canonicalId, count: 6 }],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const state = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p1",
      randomSeed: 844,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const [memoryId, handId] = state.zones[p1]["main-deck"];
  if (!memoryId || !handId) throw new Error("Missing discard fixture cards");
  const positioned = new GrandArchiveTransactionKernel().transact(state, [
    { type: "object-moved", objectId: memoryId, from: "main-deck", to: "memory" },
    { type: "object-moved", objectId: handId, from: "main-deck", to: "hand" },
  ]).state;
  return { program, state: positioned, p1, memoryId, handId };
}

function execute(
  fixture: ReturnType<typeof setup>,
  effect: GrandArchiveEffect,
  binding: string,
  objectId: GrandArchiveObjectId,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state: fixture.state,
      controllerId: fixture.p1,
      bindings: { [binding]: [objectId] },
    },
    (state, events) => {
      const transaction = kernel.transact(state, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

describe("Grand Archive discard terminology", () => {
  it("classifies an explicit discard from a specified non-hand zone", () => {
    const fixture = setup();
    const result = execute(
      fixture,
      { kind: "discard-object", subject: { kind: "bound", binding: "discarded" } },
      "discarded",
      fixture.memoryId,
    );
    const move = result.events.find((event) => event.type === "object-moved");
    if (!move) throw new Error("Missing discard move");

    expect(move).toMatchObject({
      from: "memory",
      to: "graveyard",
      discarded: true,
    });
    expect(observeGrandArchiveCommittedEvent(move).map((event) => event.name)).toContain(
      "card-discarded",
    );
  });

  it("does not classify an ordinary hand-to-graveyard move as a discard", () => {
    const fixture = setup();
    const result = execute(
      fixture,
      {
        kind: "move",
        subject: { kind: "bound", binding: "moved" },
        from: "hand",
        destination: { zone: "graveyard" },
      },
      "moved",
      fixture.handId,
    );
    const move = result.events.find((event) => event.type === "object-moved");
    if (!move) throw new Error("Missing ordinary move");

    expect(move).not.toHaveProperty("discarded");
    expect(observeGrandArchiveCommittedEvent(move).map((event) => event.name)).not.toContain(
      "card-discarded",
    );
  });
});
