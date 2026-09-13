import { describe, expect, it } from "vitest";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { rhinar } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { bravo } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { sigilOfSolaceRed } from "@tcg/flesh-and-blood-cards/cards/instants/sigil-of-solace";

import {
  FAB_ANALYTICS_SCHEMA_VERSION_V2,
  buildFabGameAnalyticsV2,
  parseFabGameAnalyticsV2,
  parseFabAnalyticsTransitionReceiptV2,
  parseFabPersistedGameAnalyticsV2,
  projectFabAnalyticsFactsV2,
  type FabAnalyticsCardRefV2,
  type FabAnalyticsFactV2,
  type FabAnalyticsTransitionReceiptV2,
} from "./analytics-v2.ts";
import { fabGameplayMetaLineKey, projectFabGameplayMeta } from "./analytics-meta.ts";

const base = {
  schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
  phase: "action" as const,
  combatNumber: null,
  chainLinkNumber: null,
  activePlayerId: "p1",
  turn: 1,
};

function card(instanceId: string, canonicalId = instanceId): FabAnalyticsCardRefV2 {
  return {
    canonicalId,
    instanceId,
    name: canonicalId,
    ownerId: "p1",
    controllerId: "p1",
  };
}

function receipt(
  stateVersion: number,
  facts: readonly FabAnalyticsFactV2[],
): FabAnalyticsTransitionReceiptV2 {
  return {
    schemaVersion: FAB_ANALYTICS_SCHEMA_VERSION_V2,
    commandId: `command-${stateVersion}`,
    stateVersion,
    timestamp: stateVersion,
    facts,
  };
}

describe("FAB authoritative transition analytics V2", () => {
  it("projects source zones and draw-to-intellect from real committed rules receipts", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [sigilOfSolaceRed],
        deck: [sigilOfSolaceRed, sigilOfSolaceRed, sigilOfSolaceRed, sigilOfSolaceRed],
      },
      { hero: bravo, hand: [], deck: [] },
    );

    game.as(rhinar).play(sigilOfSolaceRed);
    game.untilIdle();
    game.as(rhinar).endTurn();
    game.untilIdle();

    const facts = projectFabAnalyticsFactsV2(game.committedEvents());
    expect(facts).toContainEqual(
      expect.objectContaining({ kind: "card-played", from: "hand", role: "instant" }),
    );
    expect(facts).toContainEqual(
      expect.objectContaining({ kind: "card-drawn", reason: "draw-to-intellect" }),
    );
  });

  it("tracks one physical hand through pitch, play, arsenal, carry, and refill", () => {
    const pitched = card("instance-pitch", "canonical-pitch");
    const played = card("instance-play", "canonical-play");
    const arsenaled = card("instance-arsenal", "canonical-arsenal");
    const held = card("instance-held", "canonical-held");
    const drawn = card("instance-drawn", "canonical-drawn");
    const facts1: FabAnalyticsFactV2[] = [
      {
        ...base,
        eventId: "pitch",
        kind: "card-pitched",
        playerId: "p1",
        card: pitched,
        from: "hand",
        resourcesGenerated: 3,
        chiGenerated: 0,
      },
      {
        ...base,
        eventId: "play",
        kind: "card-played",
        playerId: "p1",
        card: played,
        from: "hand",
        role: "attack",
      },
    ];
    const facts2: FabAnalyticsFactV2[] = [
      {
        ...base,
        phase: "end",
        eventId: "arsenal",
        kind: "card-moved",
        playerId: "p1",
        card: arsenaled,
        from: "hand",
        to: "arsenal",
        reason: "rule",
      },
      {
        ...base,
        phase: "end",
        eventId: "draw",
        kind: "card-drawn",
        playerId: "p1",
        card: drawn,
        reason: "draw-to-intellect",
      },
      {
        ...base,
        phase: "end",
        eventId: "advance",
        kind: "turn-completed",
        playerId: "p1",
        nextPlayerId: "p2",
        nextTurn: 2,
      },
    ];

    const analytics = buildFabGameAnalyticsV2({
      gameId: "lifecycle",
      players: [
        {
          playerId: "p1",
          seat: 1,
          heroName: "Rhinar",
          heroCanonicalId: "hero-rhinar",
          initialLife: 40,
          openingHand: [pitched, played, arsenaled, held],
        },
        {
          playerId: "p2",
          seat: 2,
          heroName: "Bravo",
          heroCanonicalId: "hero-bravo",
          initialLife: 40,
          openingHand: [],
        },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 0,
      transitionReceipts: [receipt(1, facts1), receipt(2, facts2)],
    });

    expect(analytics.quality).toBe("authoritative");
    expect(analytics.coverage).toMatchObject({
      completeFromGameStart: true,
      openingHandsComplete: true,
      missingStateVersions: [],
      duplicateStateVersions: [],
    });
    expect(analytics.players.p1?.handCycles).toHaveLength(2);
    expect(analytics.players.p1?.handCycles[0]).toMatchObject({
      cycle: 1,
      openedBy: "opening-hand",
      closedAfterTurn: 1,
      endingCards: [held],
    });
    expect(analytics.players.p1?.handCycles[0]?.actions.map((action) => action.kind)).toEqual([
      "pitched",
      "played",
      "arsenaled",
    ]);
    expect(analytics.players.p1?.handCycles[1]).toMatchObject({
      carriedCards: [held],
      drawnCards: [drawn],
      endingCards: [held, drawn],
    });
    expect(analytics.turns[0]?.players.p1?.cardPlaysByOrigin).toEqual({
      hand: 1,
      arsenal: 0,
      banished: 0,
      deck: 0,
      graveyard: 0,
    });
    expect(parseFabGameAnalyticsV2(analytics)).toEqual(analytics);

    const meta = projectFabGameplayMeta(analytics);
    const firstHand = meta?.players.find((player) => player.playerId === "p1")?.lines[0];
    expect(firstHand && fabGameplayMetaLineKey(firstHand)).toBe(
      JSON.stringify({
        kind: "hand",
        startingCanonicalCardIds: [
          "canonical-arsenal",
          "canonical-held",
          "canonical-pitch",
          "canonical-play",
        ],
        carriedCanonicalCardIds: [],
        actions: [
          {
            kind: "pitched",
            canonicalCardId: "canonical-pitch",
            origin: "hand",
            destination: "pitch",
          },
          {
            kind: "played",
            canonicalCardId: "canonical-play",
            origin: "hand",
            destination: "stack",
          },
          {
            kind: "arsenaled",
            canonicalCardId: "canonical-arsenal",
            origin: "hand",
            destination: "arsenal",
          },
        ],
        endingCanonicalCardIds: ["canonical-held"],
      }),
    );
    expect(JSON.stringify(meta)).not.toContain("instance-");
  });

  it("fails coverage closed for a missing transition and validates enriched facts", () => {
    const parsed = parseFabAnalyticsTransitionReceiptV2(
      receipt(2, [
        {
          ...base,
          eventId: "play",
          kind: "card-played",
          playerId: "p1",
          card: card("played"),
          from: "arsenal",
          role: "action",
        },
      ]),
    );
    const analytics = buildFabGameAnalyticsV2({
      gameId: "incomplete",
      players: [
        {
          playerId: "p1",
          seat: 1,
          heroName: "Rhinar",
          heroCanonicalId: "hero-rhinar",
          initialLife: 40,
          openingHand: [],
        },
        {
          playerId: "p2",
          seat: 2,
          heroName: "Bravo",
          heroCanonicalId: "hero-bravo",
          initialLife: 40,
          openingHand: [],
        },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 0,
      transitionReceipts: [parsed],
    });

    expect(analytics.quality).toBe("incomplete");
    expect(analytics.coverage.missingStateVersions).toEqual([1]);
  });

  it("records effect draws without rewriting the hand's starting composition", () => {
    const effectDraw = card("instance-effect", "canonical-effect");
    const analytics = buildFabGameAnalyticsV2({
      gameId: "effect-draw",
      players: [
        {
          playerId: "p1",
          seat: 1,
          heroName: "Rhinar",
          heroCanonicalId: "hero-rhinar",
          initialLife: 40,
          openingHand: [],
        },
        {
          playerId: "p2",
          seat: 2,
          heroName: "Bravo",
          heroCanonicalId: "hero-bravo",
          initialLife: 40,
          openingHand: [],
        },
      ],
      initialTurnPlayerId: "p1",
      startedAt: 0,
      transitionReceipts: [
        receipt(1, [
          {
            ...base,
            eventId: "effect-draw",
            kind: "card-drawn",
            playerId: "p1",
            card: effectDraw,
            reason: "effect",
          },
        ]),
      ],
    });

    expect(analytics.players.p1?.handCycles[0]).toMatchObject({
      startingCards: [],
      drawnCards: [effectDraw],
      endingCards: [effectDraw],
    });
  });

  it("removes an opposing card from its owner's hand when another player moves it", () => {
    const moved = card("instance-opponent-moved", "canonical-opponent-moved");
    const held = card("instance-opponent-held", "canonical-opponent-held");
    const analytics = buildFabGameAnalyticsV2({
      gameId: "opponent-hand-move",
      players: [
        {
          playerId: "p1",
          seat: 1,
          heroName: "Rhinar",
          heroCanonicalId: "hero-rhinar",
          initialLife: 40,
          openingHand: [moved, held],
        },
        {
          playerId: "p2",
          seat: 2,
          heroName: "Bravo",
          heroCanonicalId: "hero-bravo",
          initialLife: 40,
          openingHand: [],
        },
      ],
      initialTurnPlayerId: "p2",
      startedAt: 0,
      transitionReceipts: [
        receipt(1, [
          {
            ...base,
            activePlayerId: "p2",
            eventId: "opponent-move",
            kind: "card-moved",
            playerId: "p2",
            card: moved,
            from: "hand",
            to: "deck",
            reason: "opponent-effect",
          },
        ]),
      ],
    });

    expect(analytics.players.p1?.handCycles[0]).toMatchObject({
      endingCards: [held],
      actions: [
        expect.objectContaining({
          kind: "moved-from-hand",
          card: moved,
          origin: "hand",
          destination: "deck",
        }),
      ],
    });
    expect(analytics.players.p2?.handCycles[0]?.actions).toEqual([]);
  });

  it("rejects the retired persisted V1 contract", () => {
    expect(() =>
      parseFabPersistedGameAnalyticsV2({
        version: 1,
        gameSlug: "flesh-and-blood",
      }),
    ).toThrow();
  });
});
