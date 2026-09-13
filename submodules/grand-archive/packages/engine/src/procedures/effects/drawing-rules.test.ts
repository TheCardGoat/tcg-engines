import { chimeOfEndlessDreams } from "@tcg/grand-archive-cards";
import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveEffect,
} from "@tcg/grand-archive-types";
import { describe, expect, it } from "vitest";
import { executeGrandArchiveEffect } from "./effect-executor.ts";
import type { GrandArchiveCommittedEvent } from "../../kernel/events.ts";
import { grandArchivePlayerId } from "../../game/identity.ts";
import {
  createGrandArchiveMatchInitialState,
  type GrandArchiveStandardPlayerSetup,
} from "../game-flow/initialize.ts";
import { GrandArchiveTransactionKernel } from "../../kernel/kernel.ts";
import { createGrandArchiveMatchProgram } from "../../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "../../game/model.ts";
import { observeGrandArchiveCommittedEvent } from "../../kernel/observed-events.ts";
import { GrandArchiveMatchRuntime } from "../game-flow/runtime.ts";
import { collectGrandArchiveStateBasedEvents } from "../../rules/state/state-based.ts";

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

const champion = card("drawing-rules-champion", "CHAMPION");
const filler = card("drawing-rules-filler", "ACTION");

function setup(withChime = false) {
  const program = createGrandArchiveMatchProgram([champion, filler, chimeOfEndlessDreams]);
  const player = (id: "p1" | "p2"): GrandArchiveStandardPlayerSetup => ({
    id,
    name: id,
    mainDeck: [
      { definitionId: filler.canonicalId, count: 8 },
      ...(id === "p1" && withChime
        ? [{ definitionId: chimeOfEndlessDreams.canonicalId, count: 1 }]
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
      randomSeed: 707,
    },
    { validateDeckConstruction: false, skipPregameForTests: true },
  );
  const p1 = grandArchivePlayerId("p1");
  const p2 = grandArchivePlayerId("p2");
  const chime = Object.values(initial.objects).find(
    (object) => object.ownerId === p1 && object.definitionId === chimeOfEndlessDreams.canonicalId,
  );
  const setupEvents = [
    { type: "player-first-turn-completed" as const, playerId: p1 },
    ...(chime
      ? [
          {
            type: "object-moved" as const,
            objectId: chime.id,
            from: chime.zone,
            to: "field" as const,
          },
        ]
      : []),
  ];
  const state = new GrandArchiveTransactionKernel().transact(initial, setupEvents).state;
  return { program, state, p1, p2 };
}

function withMainDeckSize(
  state: GrandArchiveMatchState,
  playerId: ReturnType<typeof grandArchivePlayerId>,
  size: number,
): GrandArchiveMatchState {
  const objectIds = state.zones[playerId]["main-deck"].slice(size);
  return new GrandArchiveTransactionKernel().transact(
    state,
    objectIds.map((objectId) => ({
      type: "object-moved" as const,
      objectId,
      from: "main-deck" as const,
      to: "graveyard" as const,
    })),
  ).state;
}

function execute(
  fixture: ReturnType<typeof setup>,
  state: GrandArchiveMatchState,
  effect: GrandArchiveEffect,
) {
  const kernel = new GrandArchiveTransactionKernel();
  return executeGrandArchiveEffect(
    effect,
    {
      program: fixture.program,
      state,
      controllerId: fixture.p1,
      bindings: {},
    },
    (effectState, events) => {
      const transaction = kernel.transact(effectState, events);
      return { state: transaction.state, events: transaction.result.events };
    },
  );
}

function atRecollection(state: GrandArchiveMatchState): GrandArchiveMatchState {
  return new GrandArchiveTransactionKernel().transact(state, [
    { type: "phase-changed", phase: "recollection" },
  ]).state;
}

function finishRecollection(runtime: GrandArchiveMatchRuntime) {
  const first = runtime.state.opportunity?.holderId;
  if (!first) throw new Error("Expected recollection Opportunity");
  expect(runtime.execute({ move: "pass" }, { playerId: first }).ok).toBe(true);
  const second = runtime.state.opportunity?.holderId;
  if (!second) throw new Error("Expected the next recollection Opportunity holder");
  const result = runtime.execute({ move: "pass" }, { playerId: second });
  if (!result.ok) throw new Error(result.message);
  return result;
}

describe("Grand Archive drawing rules", () => {
  it("commits draw N as discrete draws in one complete player action", () => {
    const fixture = setup();
    const expectedTop = fixture.state.zones[fixture.p1]["main-deck"].slice(0, 3);
    const result = execute(fixture, fixture.state, {
      kind: "draw",
      player: "controller",
      amount: 3,
    });
    const draws = result.events.filter(
      (event): event is Extract<GrandArchiveCommittedEvent, { readonly type: "object-moved" }> =>
        event.type === "object-moved" &&
        event.from === "main-deck" &&
        event.to === "hand" &&
        event.cause?.kind === "rule" &&
        event.cause.rule === "draw-effect",
    );

    expect(draws.map((event) => event.objectId)).toEqual(expectedTop);
    expect(new Set(draws.map((event) => event.eventId))).toHaveLength(3);
    expect(new Set(draws.map((event) => event.gameEventId))).toHaveLength(1);
    expect(
      draws
        .flatMap(observeGrandArchiveCommittedEvent)
        .filter((event) => event.name === "card-drawn"),
    ).toHaveLength(3);
  });

  it("reveals every successively exposed top card during one multi-draw action", () => {
    const fixture = setup();
    const expectedTop = fixture.state.zones[fixture.p1]["main-deck"].slice(0, 3);
    const revealedTop = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "player-state-changed",
        playerId: fixture.p1,
        state: "top-main-deck-revealed",
        value: true,
      },
    ]).state;
    const result = execute(fixture, revealedTop, {
      kind: "draw",
      player: "controller",
      amount: 3,
    });

    const relevant = result.events.filter(
      (event) =>
        event.type === "card-revealed" ||
        (event.type === "object-moved" &&
          event.cause?.kind === "rule" &&
          event.cause.rule === "draw-effect"),
    );
    expect(
      relevant.map((event) => [event.type, "objectId" in event ? event.objectId : undefined]),
    ).toEqual(
      expectedTop.flatMap((objectId) => [
        ["card-revealed", objectId],
        ["object-moved", objectId],
      ]),
    );
    expect(
      relevant.filter((event) => event.type === "card-revealed").map((event) => event.from),
    ).toEqual(["main-deck", "main-deck", "main-deck"]);
  });

  it("reveals the top card before the mandatory turn draw", () => {
    const fixture = setup();
    const topCardId = fixture.state.zones[fixture.p1]["main-deck"][0]!;
    const revealedTop = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "player-state-changed",
        playerId: fixture.p1,
        state: "top-main-deck-revealed",
        value: true,
      },
    ]).state;
    const runtime = new GrandArchiveMatchRuntime(fixture.program, atRecollection(revealedTop));
    const result = finishRecollection(runtime);

    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "card-revealed",
        objectId: topCardId,
        from: "main-deck",
        cause: { kind: "rule", rule: "revealed-top-card-drawn" },
      }),
    );
    expect(runtime.state.objects[topCardId]).toMatchObject({ zone: "hand", facing: "face-down" });
  });

  it("draws cards discretely and loses on the first empty-deck draw attempt", () => {
    const fixture = setup();
    const oneCard = withMainDeckSize(fixture.state, fixture.p1, 1);
    const handSize = oneCard.zones[fixture.p1].hand.length;
    const result = execute(fixture, oneCard, {
      kind: "draw",
      player: "controller",
      amount: 2,
    });

    expect(result.state.zones[fixture.p1]["main-deck"]).toHaveLength(0);
    expect(result.state.zones[fixture.p1].hand).toHaveLength(handSize + 1);
    expect(result.state.players[fixture.p1]).toMatchObject({ lost: true, conceded: false });
    expect(result.events.filter((event) => event.type === "object-moved")).toHaveLength(1);
    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "player-lost",
        playerId: fixture.p1,
        reason: "deck-out",
      }),
    );

    const endingEvents = collectGrandArchiveStateBasedEvents(fixture.program, result.state);
    expect(endingEvents).toEqual([
      expect.objectContaining({ type: "match-finished", winnerIds: [fixture.p2] }),
    ]);
  });

  it("applies decking-out to the mandatory turn draw", () => {
    const fixture = setup();
    const runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      atRecollection(withMainDeckSize(fixture.state, fixture.p1, 0)),
    );
    const result = finishRecollection(runtime);

    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "player-lost",
        playerId: fixture.p1,
        reason: "deck-out",
      }),
    );
    expect(runtime.state.status).toBe("finished");
    expect(runtime.state.winnerIds).toEqual([fixture.p2]);
  });

  it("honors Chime of Endless Dreams for effect and turn draw attempts", () => {
    const fixture = setup(true);
    const emptyDeck = withMainDeckSize(fixture.state, fixture.p1, 0);
    const effectResult = execute(fixture, emptyDeck, {
      kind: "draw",
      player: "controller",
      amount: 2,
    });
    expect(effectResult.state.players[fixture.p1]?.lost).toBe(false);
    expect(effectResult.events.some((event) => event.type === "player-lost")).toBe(false);

    const runtime = new GrandArchiveMatchRuntime(
      fixture.program,
      atRecollection(effectResult.state),
    );
    finishRecollection(runtime);
    expect(runtime.state.players[fixture.p1]?.lost).toBe(false);
    expect(runtime.state.status).toBe("playing");
    expect(runtime.state.turn.phase).toBe("main");
  });

  it("lets concession supersede a rule that prevents losing the game", () => {
    const fixture = setup(true);
    const runtime = new GrandArchiveMatchRuntime(fixture.program, fixture.state);
    const result = runtime.execute({ move: "concede" }, { playerId: fixture.p1 });
    if (!result.ok) throw new Error(result.message);

    expect(runtime.state.players[fixture.p1]).toMatchObject({ lost: true, conceded: true });
    expect(runtime.state).toMatchObject({ status: "finished", winnerIds: [fixture.p2] });
    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "player-lost",
        playerId: fixture.p1,
        reason: "concession",
        gameActionKind: "special-game-action",
      }),
    );
  });

  it("records explicit lose-game effects independently from decking-out protection", () => {
    const fixture = setup(true);
    const emptyDeck = withMainDeckSize(fixture.state, fixture.p1, 0);
    const result = execute(fixture, emptyDeck, {
      kind: "lose-game",
      player: "controller",
    });
    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "player-lost",
        playerId: fixture.p1,
        reason: "effect",
      }),
    );
    expect(result.state.players[fixture.p1]?.lost).toBe(true);
  });

  it("ends the game in a draw when an effect says the game is a draw", () => {
    const fixture = setup();
    const result = execute(fixture, fixture.state, { kind: "draw-game" });

    expect(result.events).toContainEqual(
      expect.objectContaining({
        type: "game-outcome-declared",
        outcome: { kind: "draw" },
      }),
    );
    const completed = new GrandArchiveTransactionKernel().transact(
      result.state,
      collectGrandArchiveStateBasedEvents(fixture.program, result.state),
    ).state;
    expect(completed).toMatchObject({ status: "finished", winnerIds: [] });
  });

  it("does not treat a non-draw deck-to-hand move as drawing a card", () => {
    const fixture = setup();
    const objectId = fixture.state.zones[fixture.p1]["main-deck"][0];
    if (!objectId) throw new Error("Expected a main-deck card");
    const transaction = new GrandArchiveTransactionKernel().transact(fixture.state, [
      {
        type: "object-moved",
        objectId,
        from: "main-deck",
        to: "hand",
        cause: { kind: "rule", rule: "search-effect" },
      },
    ]);
    expect(
      transaction.result.events
        .flatMap(observeGrandArchiveCommittedEvent)
        .map((event) => event.name),
    ).not.toContain("card-drawn");
  });
});
