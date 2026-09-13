import { feuAwakening } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchivePlayableCardType,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";

function card(
  id: string,
  type: GrandArchivePlayableCardType,
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
  championName = "Ciel",
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
        name: type === "CHAMPION" ? championName : id,
        ...(type === "CHAMPION" ? { lineageName: championName } : {}),
        cost: type === "CHAMPION" ? { kind: "memory", amount: 0 } : { kind: "reserve", amount: 0 },
        typeLine: { supertypes: [], types: [type], classes: ["GUARDIAN"], subtypes: [] },
        elements: ["FIRE"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 2 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("interdiction-ciel-champion", "CHAMPION");
const ordinaryChampion = card("interdiction-ordinary-champion", "CHAMPION", [], "Lorraine");
const filler = card("interdiction-filler", "ACTION");
const copyAndNegateWatcher = card("interdiction-copy-watcher", "ALLY", [
  {
    id: "interdictionCopyWatcher-a1",
    kind: "triggered",
    text: "Whenever an opponent activates a card, copy and negate that activation.",
    trigger: { kind: "event", event: { name: "card-activated", actor: "opponent" } },
    effect: {
      kind: "sequence",
      effects: [
        {
          kind: "copy",
          subject: { kind: "event-subject" },
          copy: "card-activation",
        },
        { kind: "negate", subject: { kind: "event-subject" } },
      ],
    },
  },
]);

describe("Grand Archive Interdiction", () => {
  it("resolves catalog Feu Awakening choices without Opportunity and restores it to the turn player", () => {
    const program = createGrandArchiveMatchProgram([champion, filler, feuAwakening]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 5 },
        ...(id === "p2" ? [{ definitionId: feuAwakening.canonicalId, count: 1 }] : []),
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
        randomSeed: 983,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const find = (ownerId: typeof p1, definitionId: string): GrandArchiveObjectId => {
      const object = Object.values(initial.objects).find(
        (candidate) => candidate.ownerId === ownerId && candidate.definitionId === definitionId,
      );
      if (!object) throw new Error(`Missing Interdiction fixture object ${definitionId}`);
      return object.id;
    };
    const feuId = find(p2, feuAwakening.canonicalId);
    const p1ActionId = find(p1, filler.canonicalId);
    const p2FillerIds = Object.values(initial.objects)
      .filter((object) => object.ownerId === p2 && object.definitionId === filler.canonicalId)
      .map((object) => object.id);
    const [handId, memoryId, graveyardId] = p2FillerIds;
    if (!handId || !memoryId || !graveyardId) {
      throw new Error("Missing Interdiction discard and banish candidates");
    }
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: feuId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: p1ActionId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: handId, from: "main-deck", to: "hand" },
      { type: "object-moved", objectId: memoryId, from: "main-deck", to: "memory" },
      { type: "object-moved", objectId: graveyardId, from: "main-deck", to: "graveyard" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    expect(runtime.state.opportunity?.holderId).toBe(p2);
    const activation = runtime.execute({ move: "activate-card", cardId: feuId }, { playerId: p2 });
    expect(activation.ok).toBe(true);
    expect(runtime.state.opportunity).toBeNull();
    expect(runtime.state.stack).toHaveLength(1);
    expect(runtime.state.stack[0]).toMatchObject({
      sourceId: feuId,
      opportunityPolicy: "interdiction",
    });
    expect(runtime.state.objects[handId]?.zone).toBe("graveyard");
    expect(runtime.state.objects[memoryId]?.zone).toBe("graveyard");
    expect(
      runtime.execute({ move: "activate-card", cardId: p1ActionId }, { playerId: p1 }).ok,
    ).toBe(false);

    const restored = new GrandArchiveMatchRuntime(
      program,
      restoreGrandArchiveMatchSnapshot(program, serializeGrandArchiveMatchSnapshot(runtime.state)),
    );
    const decision = restored.state.decision;
    if (!decision || decision.kind !== "resolve-effect-choice") {
      throw new Error("Expected Feu Awakening's graveyard choice");
    }
    expect(decision).toMatchObject({ playerId: p2, stackItemId: restored.state.stack[0]?.id });
    expect(
      restored.execute(
        {
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: [handId, memoryId],
        },
        { playerId: p2 },
      ).ok,
    ).toBe(true);

    expect(restored.state.stack).toEqual([]);
    expect(restored.state.objects[feuId]?.zone).toBe("graveyard");
    for (const objectId of [handId, memoryId]) {
      expect(restored.state.objects[objectId]?.zone).toBe("banishment");
      expect(restored.state.objects[objectId]?.counters.omen).toBe(1);
    }
    expect(restored.state.objects[graveyardId]?.zone).toBe("graveyard");
    expect(restored.state.opportunity?.holderId).toBe(p1);
  });

  it("fizzles a copied Interdiction activation when negation removes its original source card", () => {
    const program = createGrandArchiveMatchProgram([
      champion,
      ordinaryChampion,
      filler,
      feuAwakening,
      copyAndNegateWatcher,
    ]);
    const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
      id,
      name: id,
      mainDeck: [
        { definitionId: filler.canonicalId, count: 5 },
        ...(id === "p1"
          ? [{ definitionId: copyAndNegateWatcher.canonicalId, count: 1 }]
          : [{ definitionId: feuAwakening.canonicalId, count: 1 }]),
      ],
      materialDeck: [
        {
          definitionId: id === "p1" ? ordinaryChampion.canonicalId : champion.canonicalId,
          count: 1,
        },
      ],
      startingChampionDefinitionId:
        id === "p1" ? ordinaryChampion.canonicalId : champion.canonicalId,
    });
    const initial = createGrandArchiveMatchInitialState(
      program,
      {
        mode: "standard",
        players: [player("p1"), player("p2")],
        firstPlayerId: "p1",
        randomSeed: 991,
      },
      { validateDeckConstruction: false, skipPregameForTests: true },
    );
    const p1 = grandArchivePlayerId("p1");
    const p2 = grandArchivePlayerId("p2");
    const watcher = Object.values(initial.objects).find(
      (object) => object.ownerId === p1 && object.definitionId === copyAndNegateWatcher.canonicalId,
    );
    const feu = Object.values(initial.objects).find(
      (object) => object.ownerId === p2 && object.definitionId === feuAwakening.canonicalId,
    );
    if (!watcher || !feu) throw new Error("Missing copied Interdiction fixture objects");
    const prepared = new GrandArchiveTransactionKernel().transact(initial, [
      { type: "object-moved", objectId: watcher.id, from: "main-deck", to: "field" },
      { type: "object-moved", objectId: feu.id, from: "main-deck", to: "hand" },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(program, prepared);

    expect(runtime.execute({ move: "pass" }, { playerId: p1 }).ok).toBe(true);
    const result = runtime.execute({ move: "activate-card", cardId: feu.id }, { playerId: p2 });
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.message);
    const copiedItemCreatedIndex = result.events.findIndex(
      (event) =>
        event.type === "stack-item-deferred" &&
        event.item.kind === "card-activation" &&
        event.item.isCopy,
    );
    if (copiedItemCreatedIndex < 0) {
      throw new Error(
        JSON.stringify({
          events: result.events.map((event) => event.type),
          stack: runtime.state.stack.map((item) => ({ kind: item.kind, isCopy: item.isCopy })),
          pendingTriggers: runtime.state.pendingTriggers.length,
        }),
      );
    }
    const copiedItemCreated = result.events[copiedItemCreatedIndex];
    if (
      !copiedItemCreated ||
      copiedItemCreated.type !== "stack-item-deferred" ||
      copiedItemCreated.item.kind !== "card-activation"
    ) {
      throw new Error("Expected a copied Feu Awakening activation");
    }
    expect(copiedItemCreated.item.opportunityPolicy).toBe("interdiction");
    const copiedItemFizzledIndex = result.events.findIndex(
      (event, index) =>
        index > copiedItemCreatedIndex &&
        event.type === "stack-item-fizzled" &&
        event.item.id === copiedItemCreated.item.id,
    );
    expect(copiedItemFizzledIndex).toBeGreaterThan(copiedItemCreatedIndex);
    expect(
      result.events
        .slice(copiedItemCreatedIndex + 1, copiedItemFizzledIndex)
        .some((event) => event.type === "opportunity-opened"),
    ).toBe(false);
    expect(runtime.state.stack).toEqual([]);
    expect(runtime.state.opportunity?.holderId).toBe(p1);
  });
});
