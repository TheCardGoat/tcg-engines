import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { sigilOfSolaceRed } from "@tcg/flesh-and-blood-cards/cards/instants/sigil-of-solace";

import {
  FAB_ANALYTICS_SCHEMA_VERSION,
  buildFabGameAnalytics,
  parseFabGameAnalytics,
  projectFabAnalyticsFacts,
  type FabAnalyticsFactBatchV1,
  type FabAnalyticsFactV1,
} from "./analytics.ts";

const base = {
  schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION,
  phase: "action" as const,
  combatNumber: 1,
  chainLinkNumber: 1,
  activePlayerId: "p1",
  turn: 1,
};

const attack = {
  canonicalId: "attack-red",
  instanceId: "attack-1",
  name: "Test Attack",
  ownerId: "p1",
  controllerId: "p1",
};

const block = {
  canonicalId: "block-blue",
  instanceId: "block-1",
  name: "Test Block",
  ownerId: "p2",
  controllerId: "p2",
};

function batch(facts: readonly FabAnalyticsFactV1[]): FabAnalyticsFactBatchV1 {
  return {
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION,
    commandId: "command-1",
    stateVersion: 1,
    timestamp: 1_100,
    facts,
  };
}

describe("FAB authoritative analytics aggregate", () => {
  it("projects real end-turn receipts onto the completed turn and keeps the conceding turn open", () => {
    // Projection contract: exercise the engine's actual transition receipt,
    // whose top-level turn number has already advanced.
    const game = FabTestEngine.start(
      { hero: rhinar, hand: [sigilOfSolaceRed], life: 12, deck: [] },
      { hero: bravo, hand: [], life: 20, deck: [] },
    );
    game.as(rhinar).play(sigilOfSolaceRed);
    game.untilIdle();
    game.as(rhinar).endTurn();
    game.untilIdle();
    game.as(bravo).concede();
    const analytics = buildFabGameAnalytics({
      gameId: "turn-projection",
      players: [
        { playerId: "player-1", heroName: "Rhinar", initialLife: 12 },
        { playerId: "player-2", heroName: "Bravo", initialLife: 20 },
      ],
      initialTurnPlayerId: "player-1",
      startedAt: 0,
      factBatches: [batch(projectFabAnalyticsFacts(game.committedEvents()))],
    });
    expect(
      analytics.turns.map(({ turn, activePlayerId, completed, lifeAfter }) => ({
        turn,
        activePlayerId,
        completed,
        lifeAfter,
      })),
    ).toEqual([
      {
        turn: 1,
        activePlayerId: "player-1",
        completed: true,
        lifeAfter: { "player-1": 15, "player-2": 20 },
      },
      {
        turn: 2,
        activePlayerId: "player-2",
        completed: false,
        lifeAfter: { "player-1": 15, "player-2": 20 },
      },
    ]);
    expect(analytics.players["player-2"]?.finalLife).toBe(20);
  });
  it("closes the previous turn, carries life through empty turns, and counts life costs once", () => {
    // Aggregation contract, including the post-transition metadata retained by
    // existing games. Cost, gain, loss and damage each update life exactly once.
    const analytics = buildFabGameAnalytics({
      gameId: "life-history",
      players: [
        { playerId: "p1", heroName: "Rhinar", initialLife: 12 },
        { playerId: "p2", heroName: "Bravo", initialLife: 4 },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 0,
      factBatches: [
        batch([
          {
            ...base,
            eventId: "cost",
            kind: "assets-spent",
            playerId: "p1",
            resources: 2,
            chi: 0,
            life: 1,
            actionPoints: 1,
          },
          {
            ...base,
            eventId: "gain",
            kind: "life-changed",
            playerId: "p1",
            direction: "gained",
            amount: 3,
          },
          {
            ...base,
            eventId: "turn-2",
            kind: "turn-completed",
            turn: 2,
            playerId: "p1",
            nextPlayerId: "p2",
            nextTurn: 2,
          },
          {
            ...base,
            eventId: "turn-3",
            kind: "turn-completed",
            turn: 3,
            activePlayerId: "p2",
            playerId: "p2",
            nextPlayerId: "p1",
            nextTurn: 3,
          },
          {
            ...base,
            eventId: "loss",
            kind: "life-changed",
            turn: 3,
            playerId: "p1",
            direction: "lost",
            amount: 2,
          },
          {
            ...base,
            eventId: "damage",
            kind: "damage-dealt",
            turn: 3,
            sourcePlayerId: "p1",
            source: null,
            targetPlayerId: "p2",
            amount: 6,
            damageType: "physical",
          },
          {
            ...base,
            eventId: "lethal",
            kind: "game-lost",
            turn: 3,
            playerId: "p2",
            reason: "life",
          },
        ]),
      ],
    });
    expect(
      analytics.turns.map(({ turn, activePlayerId, completed, lifeAfter }) => ({
        turn,
        activePlayerId,
        completed,
        lifeAfter,
      })),
    ).toEqual([
      { turn: 1, activePlayerId: "p1", completed: true, lifeAfter: { p1: 14, p2: 4 } },
      { turn: 2, activePlayerId: "p2", completed: true, lifeAfter: { p1: 14, p2: 4 } },
      { turn: 3, activePlayerId: "p1", completed: false, lifeAfter: { p1: 12, p2: 0 } },
    ]);
    expect(analytics.players.p1).toMatchObject({
      initialLife: 12,
      finalLife: 12,
      resourcesSpent: 2,
      totalDamageDealt: 6,
    });
    expect(analytics.players.p2).toMatchObject({ initialLife: 4, finalLife: 0 });
  });
  it("keeps threatened damage, final defense, prevention, dealt damage, and hit separate", () => {
    const analytics = buildFabGameAnalytics({
      gameId: "game-1",
      players: [
        { playerId: "p1", heroName: "Attacker", initialLife: 20 },
        { playerId: "p2", heroName: "Defender", initialLife: 20 },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 1_000,
      completedAt: 3_100,
      factBatches: [
        batch([
          {
            ...base,
            eventId: "event-1",
            kind: "card-played",
            playerId: "p1",
            card: attack,
            role: "attack",
          },
          {
            ...base,
            eventId: "event-2",
            kind: "card-defended",
            playerId: "p2",
            card: block,
            attack,
          },
          {
            ...base,
            eventId: "event-3",
            kind: "combat-resolved",
            attackingPlayerId: "p1",
            defendingPlayerId: "p2",
            attack,
            attackPower: 7,
            totalDefense: 3,
            unpreventedDamageBeforePrevention: 4,
            defenders: [{ card: block, defense: 3 }],
          },
          {
            ...base,
            eventId: "event-4",
            kind: "damage-prevented",
            preventingPlayerId: "p2",
            sourcePlayerId: "p1",
            amount: 1,
            damageType: "physical",
          },
          {
            ...base,
            eventId: "event-5",
            kind: "damage-dealt",
            sourcePlayerId: "p1",
            source: attack,
            targetPlayerId: "p2",
            amount: 3,
            damageType: "physical",
          },
          {
            ...base,
            eventId: "event-6",
            kind: "attack-hit",
            playerId: "p1",
            attack,
            targetPlayerId: "p2",
            damage: 3,
          },
          {
            ...base,
            eventId: "event-7",
            kind: "game-lost",
            playerId: "p2",
            reason: "lethal-damage",
          },
        ]),
      ],
    });

    expect(analytics.players.p1).toMatchObject({
      attackPowerThreatened: 7,
      attackDamageDealt: 3,
      totalDamageDealt: 3,
      attacks: 1,
      hits: 1,
    });
    expect(analytics.players.p2).toMatchObject({
      defenseCommitted: 3,
      effectiveDefense: 3,
      overblock: 0,
      damagePrevented: 1,
      finalLife: 17,
    });
    expect(analytics.players.p2?.cards).toContainEqual(
      expect.objectContaining({ canonicalId: "block-blue", defended: 1, finalDefense: 3 }),
    );
    expect(analytics).toMatchObject({ winnerId: "p1", loserId: "p2", durationSeconds: 2 });
  });

  it("recomputes deterministically when an undo removes the last fact batch", () => {
    const first = batch([
      {
        ...base,
        eventId: "event-1",
        kind: "card-played",
        playerId: "p1",
        card: attack,
        role: "attack",
      },
    ]);
    const reverted = batch([
      {
        ...base,
        eventId: "event-2",
        kind: "damage-dealt",
        sourcePlayerId: "p1",
        source: attack,
        targetPlayerId: "p2",
        amount: 4,
        damageType: "physical",
      },
    ]);
    const aggregate = (factBatches: readonly FabAnalyticsFactBatchV1[]) =>
      buildFabGameAnalytics({
        gameId: "undo-game",
        players: [
          { playerId: "p1", heroName: "A", initialLife: 20 },
          { playerId: "p2", heroName: "B", initialLife: 20 },
        ],
        initialTurnPlayerId: "p1",
        startedAt: 0,
        factBatches,
      });

    expect(aggregate([first, reverted]).players.p2?.finalLife).toBe(16);
    expect(aggregate([first]).players.p2?.finalLife).toBe(20);
  });

  it("attributes an advance-turn fact to the turn that ended", () => {
    const turnTwoPlay = {
      ...base,
      eventId: "event-turn-two-play",
      turn: 2,
      activePlayerId: "p2",
      kind: "card-played" as const,
      playerId: "p2",
      card: { ...attack, ownerId: "p2", controllerId: "p2" },
      role: "attack" as const,
    };
    const analytics = buildFabGameAnalytics({
      gameId: "turn-ownership",
      players: [
        { playerId: "p1", heroName: "First", initialLife: 20 },
        { playerId: "p2", heroName: "Second", initialLife: 20 },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 0,
      factBatches: [
        batch([
          {
            ...base,
            eventId: "event-turn-one-complete",
            turn: 2,
            kind: "turn-completed",
            playerId: "p1",
            nextPlayerId: "p2",
            nextTurn: 2,
          },
        ]),
        { ...batch([turnTwoPlay]), commandId: "command-2", stateVersion: 2 },
      ],
    });

    expect(analytics.turns).toMatchObject([
      { turn: 1, activePlayerId: "p1", completed: true },
      { turn: 2, activePlayerId: "p2", completed: false },
    ]);
    expect(analytics.turns[1]?.players.p2?.cardsPlayed).toBe(1);
  });

  it("validates the complete aggregate before it crosses the API boundary", () => {
    const aggregate = buildFabGameAnalytics({
      gameId: "validated-game",
      players: [
        { playerId: "p1", heroName: "A", initialLife: 20 },
        { playerId: "p2", heroName: "B", initialLife: 20 },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 0,
      factBatches: [batch([])],
    });

    expect(parseFabGameAnalytics(aggregate)).toEqual(aggregate);
    expect(() =>
      parseFabGameAnalytics({
        ...aggregate,
        players: { p1: { playerId: "p1" } },
      }),
    ).toThrow();
  });
});
