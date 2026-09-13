import { GrandArchiveTestEngine } from "../../testing/test-engine.ts";
import { baubleOfScarcity, fightForTheCrown } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { grandArchivePlayerId, type GrandArchiveObjectId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveDecision } from "../../game/model.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import {
  restoreGrandArchiveMatchSnapshot,
  serializeGrandArchiveMatchSnapshot,
} from "../../snapshot/snapshot.ts";
import { projectGrandArchiveViewerState } from "../../projection/view.ts";

function catalogEffect(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityIndex: number,
): GrandArchiveEffect {
  if (card.layout.kind !== "single-faced")
    throw new Error("Catalog test card must be single-faced");
  const ability = card.layout.face.abilities[abilityIndex];
  if (!ability || !("effect" in ability) || !ability.effect) {
    throw new Error("Catalog test card must have an executable effect");
  }
  return ability.effect;
}

function card(
  canonicalId: string,
  type: "ACTION" | "ALLY" | "CHAMPION",
  abilities: readonly GrandArchiveAbilityDefinition[] = [],
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
        typeLine: { supertypes: [], types: [type], classes: ["WARRIOR"], subtypes: [] },
        elements: ["NORM"],
        ...(type === "ACTION" ? { speed: "fast" as const } : {}),
        stats:
          type === "CHAMPION"
            ? { level: 0, life: 20 }
            : type === "ALLY"
              ? { power: 1, life: 3 }
              : {},
        rulesText: "",
        abilities,
      },
    },
  };
}

const champion = card("simultaneous-selection-champion", "CHAMPION", [
  {
    id: "simultaneousSelectionChampion-a1",
    kind: "activated",
    activation: "ability",
    text: "Each player discards a card.",
    cost: { kind: "pay-reserve", amount: 0 },
    effect: catalogEffect(baubleOfScarcity, 0),
  },
]);
const ally = card("simultaneous-selection-ally", "ALLY");
const filler = card("simultaneous-selection-filler", "ACTION");
const fight = card("simultaneous-selection-fight", "ACTION", [
  {
    id: "simultaneousSelectionFight-a1",
    kind: "card-resolution",
    text: "Each player sacrifices an ally.",
    effect: catalogEffect(fightForTheCrown, 0),
  },
]);

function setup(): {
  readonly program: ReturnType<typeof createGrandArchiveMatchProgram>;
  readonly runtime: GrandArchiveMatchRuntime;
  readonly p1: ReturnType<typeof grandArchivePlayerId>;
  readonly p2: ReturnType<typeof grandArchivePlayerId>;
  readonly championIds: Readonly<Record<"p1" | "p2", GrandArchiveObjectId>>;
  readonly allyIds: Readonly<Record<"p1" | "p2", GrandArchiveObjectId>>;
  readonly fillerIds: Readonly<Record<"p1" | "p2", GrandArchiveObjectId>>;
  readonly fightId: GrandArchiveObjectId;
} {
  const program = createGrandArchiveMatchProgram([champion, ally, filler, fight]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: ally.canonicalId, count: 1 },
      { definitionId: filler.canonicalId, count: 2 },
      ...(id === "p2" ? [{ definitionId: fight.canonicalId, count: 1 }] : []),
    ],
    materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
    startingChampionDefinitionId: champion.canonicalId,
  });
  const initial = createGrandArchiveMatchInitialState(
    program,
    {
      mode: "standard",
      players: [player("p1"), player("p2")],
      firstPlayerId: "p2",
      randomSeed: 912,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const find = (playerId: typeof p1, definitionId: string): GrandArchiveObjectId => {
    const object = Object.values(initial.objects).find(
      (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
    );
    if (!object) throw new Error(`Missing ${definitionId} for ${playerId}`);
    return object.id;
  };
  const findAll = (playerId: typeof p1, definitionId: string): readonly GrandArchiveObjectId[] =>
    Object.values(initial.objects)
      .filter(
        (candidate) => candidate.ownerId === playerId && candidate.definitionId === definitionId,
      )
      .map((object) => object.id);
  const allyIds = { p1: find(p1, ally.canonicalId), p2: find(p2, ally.canonicalId) };
  const allFillerIds = {
    p1: findAll(p1, filler.canonicalId),
    p2: findAll(p2, filler.canonicalId),
  };
  const fillerIds = { p1: allFillerIds.p1[0]!, p2: allFillerIds.p2[0]! };
  const fightId = find(p2, fight.canonicalId);
  const kernel = new GrandArchiveTransactionKernel();
  const prepared = kernel.transact(initial, [
    ...Object.values(allyIds).map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "field" as const,
    })),
    ...Object.values(allFillerIds)
      .flatMap((objectIds) => objectIds)
      .map((objectId) => ({
        type: "object-moved" as const,
        objectId,
        from: "main-deck" as const,
        to: "hand" as const,
      })),
    {
      type: "object-moved",
      objectId: fightId,
      from: "main-deck",
      to: "hand",
    },
  ]).state;
  return {
    program,
    runtime: new GrandArchiveMatchRuntime(program, prepared),
    p1,
    p2,
    championIds: { p1: prepared.zones[p1].field[0]!, p2: prepared.zones[p2].field[0]! },
    allyIds,
    fillerIds,
    fightId,
  };
}

function passUntilDecision(runtime: GrandArchiveMatchRuntime): Exclude<GrandArchiveDecision, null> {
  for (let pass = 0; pass < 12 && !runtime.state.decision; pass += 1) {
    const holderId = runtime.state.opportunity?.holderId;
    if (!holderId) throw new Error("Simultaneous selection requires Opportunity");
    const result = runtime.execute({ move: "pass" }, { playerId: holderId });
    if (!result.ok) throw new Error(result.message);
  }
  const decision = runtime.state.decision;
  if (!decision) throw new Error("Expected a simultaneous selection decision");
  return decision;
}

function answer(
  runtime: GrandArchiveMatchRuntime,
  decision: Exclude<GrandArchiveDecision, null>,
  objectId: GrandArchiveObjectId,
): void {
  const result = runtime.execute(
    {
      move: "answer-decision",
      decisionId: decision.id,
      stateVersion: decision.stateVersion,
      answer: [objectId],
    },
    { playerId: decision.playerId },
  );
  if (!result.ok) throw new Error(result.message);
}

describe("Grand Archive simultaneous selections", () => {
  it("collects Fight for the Crown choices from the turn player first, then applies them together", () => {
    const fixture = setup();
    expect(
      fixture.runtime.execute(
        { move: "activate-card", cardId: fixture.fightId, reservePayment: [] },
        { playerId: fixture.p2 },
      ).ok,
    ).toBe(true);
    const first = passUntilDecision(fixture.runtime);
    expect(first).toMatchObject({ kind: "resolve-effect-choice", playerId: fixture.p2 });
    answer(fixture.runtime, first, fixture.allyIds.p2);

    const second = fixture.runtime.state.decision;
    expect(second).toMatchObject({ kind: "resolve-effect-choice", playerId: fixture.p1 });
    expect(fixture.runtime.state.objects[fixture.allyIds.p2]?.zone).toBe("field");
    expect(fixture.runtime.state.objects[fixture.allyIds.p1]?.zone).toBe("field");
    if (!second || second.kind !== "resolve-effect-choice") {
      throw new Error("Expected the non-turn player's selection");
    }
    expect(second.publicSelections).toEqual([
      { playerId: fixture.p2, targetIds: [fixture.allyIds.p2] },
    ]);
    expect(
      projectGrandArchiveViewerState(fixture.program, fixture.runtime.state, fixture.p1).decision,
    ).toMatchObject({
      publicSelections: [{ playerId: fixture.p2, targetIds: [fixture.allyIds.p2] }],
    });

    const restored = new GrandArchiveMatchRuntime(
      fixture.program,
      restoreGrandArchiveMatchSnapshot(
        fixture.program,
        JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(fixture.runtime.state))),
      ),
    );
    const restoredDecision = restored.state.decision;
    if (!restoredDecision) throw new Error("Expected the restored selection decision");
    answer(restored, restoredDecision, fixture.allyIds.p1);
    expect(restored.state.objects[fixture.allyIds.p2]?.zone).toBe("graveyard");
    expect(restored.state.objects[fixture.allyIds.p1]?.zone).toBe("graveyard");
  });

  it("withholds a forced Bauble discard until the remaining private choice is submitted", () => {
    const fixture = setup();
    expect(
      fixture.runtime.execute(
        {
          move: "activate-ability",
          sourceId: fixture.championIds.p2,
          abilityId: "simultaneousSelectionChampion-a1",
        },
        { playerId: fixture.p2 },
      ).ok,
    ).toBe(true);
    const first = passUntilDecision(fixture.runtime);
    expect(first.playerId).toBe(fixture.p2);
    expect(fixture.runtime.state.objects[fixture.fillerIds.p2]?.zone).toBe("hand");
    expect(fixture.runtime.state.objects[fixture.fillerIds.p1]?.zone).toBe("hand");
    answer(fixture.runtime, first, fixture.fillerIds.p2);
    const second = fixture.runtime.state.decision;
    if (!second || second.kind !== "resolve-effect-choice") {
      throw new Error("Expected the other player's hidden discard choice");
    }
    expect(second.playerId).toBe(fixture.p1);
    expect(second.publicSelections).toBeUndefined();

    const snapshot = serializeGrandArchiveMatchSnapshot(fixture.runtime.state);
    if (!snapshot.decision || !snapshot.resolution?.pendingChoice?.simultaneous) {
      throw new Error("Expected a persisted simultaneous private choice");
    }
    const forgedPublicSelection = [{ playerId: fixture.p2, targetIds: [fixture.fillerIds.p2] }];
    const malformed = {
      ...snapshot,
      decision: { ...snapshot.decision, publicSelections: forgedPublicSelection },
      resolution: {
        ...snapshot.resolution,
        pendingChoice: {
          ...snapshot.resolution.pendingChoice,
          simultaneous: {
            ...snapshot.resolution.pendingChoice.simultaneous,
            publicSelections: forgedPublicSelection,
          },
        },
      },
    };
    expect(() => restoreGrandArchiveMatchSnapshot(fixture.program, malformed)).toThrow(
      "decision-graph",
    );

    answer(fixture.runtime, second, fixture.fillerIds.p1);
    expect(fixture.runtime.state.decision).toBeNull();
    expect(fixture.runtime.state.objects[fixture.fillerIds.p2]?.zone).toBe("graveyard");
    expect(fixture.runtime.state.objects[fixture.fillerIds.p1]?.zone).toBe("graveyard");
  });
});

it.each(["top", "bottom"] as const)(
  "preserves a suspended %s placement order before the following draw",
  (placement) => {
    const starter = card("ordered-placement-champion", "CHAMPION");
    const filler = card("ordered-placement-filler", "ACTION");
    const action = card("ordered-placement-action", "ACTION", [
      {
        id: "orderedPlacementAction-a1",
        kind: "card-resolution",
        text: "Order memory in the deck, then draw.",
        effect: {
          kind: "sequence",
          effects: [
            {
              kind: "move",
              subject: { kind: "each", collection: { zones: ["memory"], player: "controller" } },
              destination: {
                zone: "main-deck",
                placement: { kind: placement, orderChosenBy: "controller" },
              },
            },
            { kind: "draw", player: "controller", amount: 1 },
          ],
        },
      },
    ]);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: { hand: [action], memory: [filler, filler, filler], "main-deck": [filler, filler] },
      },
      playerTwo: { champion: starter, zones: { memory: [filler] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const memory = p.zone("memory").map((object) => object.objectId);
    const deck = p.zone("main-deck").map((object) => object.objectId);
    p.activate(action);
    p.pass();
    q.pass();
    const decision = game.state.decision;
    if (decision?.kind !== "resolve-effect-choice") throw new Error("Expected an order decision");
    expect(decision.selection.ordered).toBe(true);
    expect(p.zone("hand")).toHaveLength(0);
    const resumed = GrandArchiveTestEngine.fromRuntime(
      new GrandArchiveMatchRuntime(
        game.program,
        restoreGrandArchiveMatchSnapshot(
          game.program,
          JSON.parse(JSON.stringify(serializeGrandArchiveMatchSnapshot(game.state))),
        ),
      ),
    );
    const answer = (ids: readonly string[]) =>
      resumed.player("player-one").execute({
        move: "answer-decision",
        decisionId: decision.id,
        stateVersion: decision.stateVersion,
        answer: ids,
      });
    expect(() => answer(memory.slice(1))).toThrow();
    expect(() => answer([q.zone("memory")[0]!.objectId, ...memory.slice(1)])).toThrow();
    expect(() => answer([memory[0]!, memory[0]!, memory[2]!])).toThrow();
    const order = [memory[2]!, memory[0]!, memory[1]!];
    answer(order);
    const arranged = placement === "top" ? [...order, ...deck] : [...deck, ...order];
    expect(
      resumed
        .player("player-one")
        .zone("hand")
        .map((object) => object.objectId),
    ).toEqual(arranged.slice(0, 1));
    expect(
      resumed
        .player("player-one")
        .zone("main-deck")
        .map((object) => object.objectId),
    ).toEqual(arranged.slice(1));
    expect(resumed.player("player-one").zone("memory")).toHaveLength(0);
    expect(resumed.player("player-two").zone("memory")).toEqual(q.zone("memory"));
    expect(resumed.state.decision).toBeNull();
  },
);
