/**
 * CR Chapter 4 — Game Structure.
 * 4.3 action phase, 4.4 end phase, 4.5 ending a game.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../fixtures.ts";
import { yorickWeaverOfTales } from "../../../../../cards/src/cards/heroes/yorick-weaver-of-tales.ts";

const intellectThreeHero = {
  canonicalId: "test:intellect-three-hero",
  name: "Intellect Three Hero",
  types: ["Hero"],
  health: 20,
  intelligence: 3,
} as const;

const intellectFiveHero = {
  canonicalId: "test:intellect-five-hero",
  name: "Intellect Five Hero",
  types: ["Hero"],
  health: 20,
  intelligence: 5,
} as const;

function drawWatcherHero(canonicalId: string, abilityId: string) {
  return {
    canonicalId,
    name: canonicalId,
    types: ["Hero"],
    health: 20,
    intelligence: 4,
    abilities: [
      {
        kind: "static",
        staticKind: "triggered",
        id: abilityId,
        text: "Whenever you draw a card, gain 1 life.",
        trigger: {
          kind: "event",
          event: {
            name: "draw",
            actor: {
              kind: "player",
              player: "ability-controller",
            },
            observes: {
              kind: "none",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: { type: "gain-life", amount: 1, target: { selector: "controller" } },
        },
      },
    ],
  } as const;
}

describe("CR 4 — Game Structure", () => {
  it("4.3.2: action phase grants the turn player 1 action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 4 },
      { hero: dash, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.phase()).toBe("action");
    expect(game.as(bravo).actionPoints()).toBe(1);
  });

  it("4.4.3c: pitched cards return to bottom of deck on end-turn", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed, snatchRed],
        pitch: [nimblismBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    // Single pitch card needs no ordering decision.
    Bravo.endTurn();
    expect(Bravo.zone("pitch")).toEqual([]);
    expect(Bravo.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
  });

  it("4.4.3c: multi-card pitch uses a persisted private ordering decision", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        pitch: [nimblismBlue, snatchRed],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const blueId = game.findCardInZone(Bravo.id, "pitch", nimblismBlue);
    const snatchId = game.findCardInZone(Bravo.id, "pitch", snatchRed);
    Bravo.endTurn();
    const decision = game.getState().decision;
    expect(decision).toMatchObject({ kind: "ordering", actorId: Bravo.id });
    if (!decision || decision.kind !== "ordering")
      throw new Error("Expected pitch-order decision.");
    Bravo.exec({
      move: "answer-decision",
      payload: {
        decisionId: decision.decisionId,
        stateVersion: decision.stateVersion,
        answer: { kind: "ordering", orderedIds: [snatchId, blueId] },
      },
    });
    expect(Bravo.zone("pitch")).toEqual([]);
    expect(Bravo.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expect(Bravo.zone("deck")[1]).toBe(nimblismBlue.canonicalId);
  });

  it("4.4.3e/f: end-turn clears resources and draws turn player to intellect", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, snatchRed],
      },
      { hero: dash, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.handCount()).toBe(1);
    Bravo.endTurn();
    expect(game.turn()).toBe(2);
    expect(game.as(dash).isActive()).toBe(true);
    expect(game.as(dash).actionPoints()).toBe(1);
    expect(Bravo.actionPoints()).toBe(0);
    expect(Bravo.handCount()).toBe(4);
  });

  it("4.4.3f: both players refill after turn 1, but later only the turn player refills", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [nimblismBlue],
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
        ],
      },
      {
        hero: dash,
        hand: [snatchRed],
        deck: [
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
          nimblismBlue,
        ],
      },
      {
        firstPlayer: dash,
        autoPassPriority: false,
        autoPitch: false,
        pitchStack: "manual",
      },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // Bravo is on the draw and spends their only card defending during Dash's
    // first turn. This is the player-facing sequence that exposed the bug.
    Dash.attackWith(snatchRed);
    Bravo.blockWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    Dash.endTurn();

    expect(game.turn()).toBe(2);
    expect(Bravo.isActive()).toBe(true);
    expect(Dash.handCount()).toBe(4);
    expect(Bravo.handCount()).toBe(4);

    // The non-turn-player exception applies only to turn 1. On turn 2, Dash
    // can defend but does not refill when Bravo ends the turn.
    Bravo.attackWith(snatchRed);
    Dash.blockWith(nimblismBlue);
    game.helpers.resolveRestOfCombat();
    Bravo.endTurn();

    expect(game.turn()).toBe(3);
    expect(Dash.isActive()).toBe(true);
    expect(Bravo.handCount()).toBe(4);
    expect(Dash.handCount()).toBe(3);
  });

  it("4.4.3f: a player already at or above intellect does not draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        deck: [nimblismBlue, nimblismBlue],
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        deck: [snatchRed, snatchRed],
      },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const bravoDeckBefore = Bravo.zone("deck");
    const dashDeckBefore = Dash.zone("deck");

    Bravo.endTurn();

    expect(Bravo.handCount()).toBe(5);
    expect(Dash.handCount()).toBe(5);
    expect(Bravo.zone("deck")).toEqual(bravoDeckBefore);
    expect(Dash.zone("deck")).toEqual(dashDeckBefore);
  });

  it("4.4.3f: each seat uses its own intellect and draws only cards available", () => {
    const game = FabTestEngine.start(
      { hero: intellectThreeHero, hand: [], deck: [snatchRed, snatchRed] },
      { hero: intellectFiveHero, hand: [nimblismBlue], deck: [snatchRed, snatchRed] },
    );
    const Three = game.as(intellectThreeHero);
    const Five = game.as(intellectFiveHero);

    Three.endTurn();

    expect(Three.handCount()).toBe(2);
    expect(Five.handCount()).toBe(3);
    expect(Three.zone("deck")).toEqual([]);
    expect(Five.zone("deck")).toEqual([]);
    expect(game.hasGameEnded()).toBe(false);
  });

  it("4.4.3f: shared-library seats reserve distinct top cards in turn-player-first order", () => {
    const game = FabTestEngine.start(
      {
        hero: yorickWeaverOfTales,
        hand: [],
        deck: [snatchRed, nimblismBlue, snatchRed, nimblismBlue],
      },
      {
        hero: dash,
        hand: [],
        deck: [nimblismBlue, snatchRed, nimblismBlue, snatchRed],
      },
      { seed: "cr-4.4.3f-shared-library" },
    );
    const Yorick = game.as(yorickWeaverOfTales);
    const Opponent = game.as(dash);
    const sharedDeckTopFirst = game
      .getState()
      .containers.zonesByPlayerId[Yorick.id]!.deck.slice()
      .reverse();

    Yorick.endTurn();

    const state = game.getState();
    const yorickHand = state.containers.zonesByPlayerId[Yorick.id]!.hand;
    const opponentHand = state.containers.zonesByPlayerId[Opponent.id]!.hand;
    expect(yorickHand).toEqual(sharedDeckTopFirst.slice(0, 4));
    expect(opponentHand).toEqual(sharedDeckTopFirst.slice(4, 8));
    expect(new Set([...yorickHand, ...opponentHand])).toHaveLength(8);
    expect(Yorick.zone("deck")).toEqual([]);
    expect(Opponent.zone("deck")).toEqual([]);
  });

  it("4.4.3 / 4.4.3f: both players' draw events update history and trigger before turn advance", () => {
    const firstHero = drawWatcherHero("test:first-draw-watcher", "first-draw-watcher-a1");
    const secondHero = drawWatcherHero("test:second-draw-watcher", "second-draw-watcher-a1");
    const game = FabTestEngine.start(
      { hero: firstHero, life: 10, hand: [snatchRed, snatchRed, snatchRed], deck: 2 },
      { hero: secondHero, life: 10, hand: [nimblismBlue, nimblismBlue, nimblismBlue], deck: 2 },
      { autoPassPriority: false },
    );
    const First = game.as(firstHero);
    const Second = game.as(secondHero);

    First.endTurn();

    expect(game.turn()).toBe(1);
    expect(game.getState().players[First.id]!.history.turn.cardsDrawn).toBe(1);
    expect(game.getState().players[Second.id]!.history.turn.cardsDrawn).toBe(1);
    expect(game.getState().rulesProcess).not.toBeNull();

    First.chooseOptions(First.id);
    game.helpers.untilIdle({ ordering: "listed" });
    expect(First.life()).toBe(11);
    expect(Second.life()).toBe(11);
    expect(game.turn()).toBe(2);
  });

  it("4.4.3e: resource points are lost at end of turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, resourcePoints: 3, deck: 8 },
      { hero: dash, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).resourcePoints()).toBe(3);
    game.as(bravo).endTurn();
    expect(game.as(bravo).resourcePoints()).toBe(0);
  });

  it("4.5.3a: reducing hero life to 0 loses the game", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 2, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getGameEndResult().winnerId).toBe(game.as(bravo).id);
  });

  it("4.5.3c: concede loses the game for that player", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 2 },
      { hero: dash, deck: 2 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).concede();
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getGameEndResult().winnerId).toBe(game.as(dash).id);
  });

  it("4.3: non-turn player cannot end the turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, deck: 2 },
      { hero: dash, deck: 2 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(dash).expectFailure({ move: "end-turn" }).errorCode).toBe("not_active_player");
  });
});
