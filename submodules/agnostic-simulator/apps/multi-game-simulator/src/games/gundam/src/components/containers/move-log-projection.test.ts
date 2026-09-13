import { describe, expect, it } from "vite-plus/test";

import type { TurnTaggedLogEntry, TurnTaggedMoveLog } from "../../game/adapter.ts";
import {
  orderGundamEventLogEntries,
  projectGundamLegacyEventLogEntries,
  projectGundamMoveLogEntries,
} from "./move-log-projection.ts";

const VIEWER = "player_one";
const OPPONENT = "player_two";
const OPPONENT_DRAWN_CARD = "player_two_deck_ST01-001_01";

function tagged(log: TurnTaggedMoveLog["log"], turnNumber = 3): TurnTaggedMoveLog {
  return { log, turnNumber };
}

function taggedLegacy(
  entry: Partial<TurnTaggedLogEntry["entry"]>,
  turnNumber = 3,
): TurnTaggedLogEntry {
  return {
    turnNumber,
    entry: {
      id: 7,
      stateID: 1,
      timestamp: 1_700_000_000_000,
      type: "gundam.test",
      message: "",
      ...entry,
    },
  };
}

function privateCardIds(value: readonly string[], visibleTo: readonly string[]) {
  return {
    __private: true,
    value,
    visibleTo,
  };
}

describe("projectGundamMoveLogEntries", () => {
  it("uses Gundam terminology and names stat-modifier targets in player logs", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "resolveEffect",
          playerId: VIEWER as never,
          timestamp: 1_700_000_000_000,
          stateID: 42,
          sourceCardId: "source-1" as never,
          outcomes: {
            cardsExhausted: ["rested-1" as never],
            cardsMoved: [
              {
                cardId: "moved-1" as never,
                from: "trash",
                to: "removalArea",
              },
            ],
            statModifiers: [
              {
                cardId: "target-1" as never,
                stat: "ap",
                amount: -2,
                duration: "thisTurn",
              },
            ],
          },
        }),
      ],
      VIEWER,
      "main",
      (id) => {
        const names = new Map([
          ["source-1", "Mark Guilder"],
          ["rested-1", "Guncannon"],
          ["target-1", "Gouf"],
          ["moved-1", "Graze Duel Type"],
        ]);
        const name = names.get(id);
        return name ? ({ name } as never) : null;
      },
    );

    expect(entries.map((entry) => entry.message)).toContain("Guncannon was rested.");
    expect(entries.map((entry) => entry.message)).toContain("Gouf gets AP -2 during this turn.");
    expect(entries.map((entry) => entry.message)).toContain(
      "Graze Duel Type moved from trash to removal area.",
    );
  });

  it("projects Gundam move logs into the agnostic simulator event-log contract", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "attack",
          playerId: VIEWER as never,
          timestamp: 1_700_000_000_000,
          stateID: 42,
          turnNumber: 3,
          attackerId: "attacker-1" as never,
          targetId: "target-1" as never,
          outcomes: {
            damageDealt: [
              {
                sourceCardId: "attacker-1" as never,
                targetId: "target-1" as never,
                amount: 2,
              },
            ],
          },
        }),
      ],
      VIEWER,
      "battle",
      (id) => {
        const names = new Map([
          ["attacker-1", "RX-78-2 Gundam"],
          ["target-1", "Zaku II"],
        ]);
        const name = names.get(id);
        return name ? ({ name } as never) : null;
      },
    );

    expect(entries).toEqual([
      {
        id: "gundam-move-log-42",
        turn: 4,
        phase: "battle",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Attacked Zaku II with RX-78-2 Gundam.",
        tags: ["combat"],
        entityIds: ["attacker-1", "target-1"],
        section: {
          id: "gundam-combat-4-1",
          label: "RX-78-2 Gundam → Zaku II",
          tone: "fight",
        },
      },
      {
        id: "gundam-move-log-42-outcome-0",
        turn: 4,
        phase: "battle",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Zaku II took 2 damage.",
        tags: ["combat"],
        entityIds: ["attacker-1", "target-1"],
        section: {
          id: "gundam-combat-4-1",
          label: "RX-78-2 Gundam → Zaku II",
          tone: "fight",
        },
      },
      {
        id: "gundam-move-log-42-combat-complete",
        turn: 4,
        phase: "battle",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Combat resolved.",
        tags: ["combat"],
        entityIds: ["attacker-1", "target-1"],
        section: {
          id: "gundam-combat-4-1",
          label: "RX-78-2 Gundam → Zaku II",
          tone: "fight",
        },
      },
    ]);
  });

  it("marks non-viewer logs as opponent events and system-turn logs as system-tagged", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged(
          {
            type: "turnStart",
            playerId: OPPONENT as never,
            activePlayerId: OPPONENT as never,
            timestamp: 0,
            turnNumber: 5,
          },
          5,
        ),
      ],
      VIEWER,
      "start",
    );

    expect(entries[0]).toMatchObject({
      turn: 6,
      phase: "start",
      seatId: "opponent",
      message: "Opponent started the turn.",
      tags: ["system"],
    });
  });

  it("places a transition draw in the new turn after its turn-start landmark", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged(
          {
            type: "pass",
            playerId: VIEWER as never,
            timestamp: 1,
            context: "action-step",
            outcomes: {
              cardsDrawn: {
                playerId: OPPONENT as never,
                count: 1,
                cardIds: privateCardIds([OPPONENT_DRAWN_CARD], [OPPONENT]) as never,
              },
            },
          },
          3,
        ),
        tagged(
          {
            type: "turnStart",
            playerId: OPPONENT as never,
            activePlayerId: OPPONENT as never,
            timestamp: 1,
            turnNumber: 4,
          },
          4,
        ),
      ],
      VIEWER,
      "main",
    );

    expect(entries.map((entry) => [entry.turn, entry.phase, entry.message])).toEqual([
      [4, "end", "You passed priority."],
      [5, "start", "Opponent started the turn."],
      [5, "draw", "Drew 1 card(s)."],
    ]);
  });

  it("keeps an effect-driven draw in its historical phase", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "resolveEffect",
          playerId: VIEWER as never,
          timestamp: 1,
          sourceCardId: "draw-command" as never,
          outcomes: {
            cardsDrawn: {
              playerId: VIEWER as never,
              count: 1,
              cardIds: privateCardIds(["drawn-card"], [VIEWER]) as never,
            },
          },
        }),
      ],
      VIEWER,
      "main",
    );

    expect(entries.find((entry) => entry.message.startsWith("Drew "))).toMatchObject({
      phase: "main",
      turn: 4,
    });
  });

  it("keeps combined lifecycle and draw entries in player-readable order", () => {
    const entries = orderGundamEventLogEntries([
      {
        id: "draw",
        turn: 5,
        phase: "draw",
        timestamp: "2023-11-14T22:13:19.000Z",
        message: "Drew 1 card(s).",
        tags: ["move"],
      },
      {
        id: "start",
        turn: 5,
        phase: "start",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You started the turn.",
        tags: ["system"],
      },
      {
        id: "draw-phase",
        turn: 5,
        phase: "draw",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Entered draw.",
        tags: ["system"],
      },
    ]);

    expect(entries.map((entry) => entry.message)).toEqual([
      "You started the turn.",
      "Entered draw.",
      "Drew 1 card(s).",
    ]);
  });

  it("buckets action-step passes under the end phase and labels automatic passes", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: VIEWER as never,
          timestamp: 1,
          context: "action-step",
          automatic: true,
        }),
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 2,
          context: "action-step",
        }),
      ],
      VIEWER,
      // Even when the ambient/post-command phase is the next turn's main
      // phase, action-step passes belong to the end phase.
      "main",
    );

    expect(entries.map((entry) => [entry.message, entry.phase, entry.turn, entry.seatId])).toEqual([
      ["You passed priority automatically (no actions available).", "end", 4, "player"],
      ["Opponent passed priority.", "end", 4, "opponent"],
    ]);
  });

  it("projects Repair recovery as a card-linked end-phase ability entry", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged(
          {
            type: "pass",
            playerId: VIEWER as never,
            timestamp: 1,
            context: "action-step",
            automatic: true,
            outcomes: {
              hpRecovered: [{ cardId: "super-gundam" as never, amount: 2 }],
            },
          },
          0,
        ),
      ],
      VIEWER,
      "main",
      (id) => (id === "super-gundam" ? ({ name: "Super Gundam" } as never) : null),
    );

    expect(entries).toEqual([
      expect.objectContaining({
        turn: 1,
        phase: "end",
        seatId: "player",
        message: "You passed priority automatically (no actions available).",
      }),
      expect.objectContaining({
        turn: 1,
        phase: "end",
        seatId: "player",
        message: "Super Gundam recovered 2 HP.",
        tags: ["ability"],
        entityIds: ["super-gundam"],
      }),
    ]);
  });

  it("puts first-turn priority passes in Turn 1 instead of setup Messages", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged(
          {
            type: "pass",
            playerId: OPPONENT as never,
            timestamp: 1,
            context: "action-step",
          },
          0,
        ),
        tagged(
          {
            type: "pass",
            playerId: VIEWER as never,
            timestamp: 2,
            context: "action-step",
            automatic: true,
          },
          0,
        ),
      ],
      VIEWER,
      "end",
    );

    expect(entries.map((entry) => entry.turn)).toEqual([1, 1]);
  });

  it("keeps automatic Block and battle Action passes visible as individual reasons", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          context: "block",
          automatic: true,
        }),
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 2,
          context: "battle",
          automatic: true,
        }),
        tagged({
          type: "pass",
          playerId: VIEWER as never,
          timestamp: 3,
          context: "battle",
        }),
      ],
      VIEWER,
      "battle",
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Opponent did not block automatically (no legal Blocker available).",
      "Opponent passed the action window automatically (no actions available).",
      "You passed the action window.",
    ]);
  });

  it("redacts opponent draw card names and skips deck-to-hand move outcomes", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          context: "turn",
          outcomes: {
            cardsMoved: [
              {
                cardId: OPPONENT_DRAWN_CARD as never,
                from: "deck",
                to: "hand",
              },
            ],
            cardsDrawn: {
              playerId: OPPONENT as never,
              count: 1,
              cardIds: privateCardIds([OPPONENT_DRAWN_CARD], [OPPONENT]) as never,
            },
          },
        }),
      ],
      VIEWER,
      "draw",
      (id) => (id === OPPONENT_DRAWN_CARD ? ({ name: "Secret Opponent Card" } as never) : null),
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Opponent entered the End Phase.",
      "Drew 1 card(s).",
    ]);
    // The tagged engine turn is zero-based and becomes a one-based UI turn.
    expect(entries.map((entry) => entry.turn)).toEqual([4, 5]);
    expect(JSON.stringify(entries)).not.toContain("Secret Opponent Card");
    expect(JSON.stringify(entries)).not.toContain(OPPONENT_DRAWN_CARD);
  });

  it("keeps drawn card names for the owner viewer", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          context: "turn",
          outcomes: {
            cardsMoved: [
              {
                cardId: OPPONENT_DRAWN_CARD as never,
                from: "deck",
                to: "hand",
              },
            ],
            cardsDrawn: {
              playerId: OPPONENT as never,
              count: 1,
              cardIds: privateCardIds([OPPONENT_DRAWN_CARD], [OPPONENT]) as never,
            },
          },
        }),
      ],
      OPPONENT,
      "draw",
      (id) => (id === OPPONENT_DRAWN_CARD ? ({ name: "Secret Opponent Card" } as never) : null),
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "You entered the End Phase.",
      "Drew 1: Secret Opponent Card.",
    ]);
    expect(entries.map((entry) => entry.turn)).toEqual([4, 5]);
    expect(entries[1]?.cardRefs).toEqual([
      { id: OPPONENT_DRAWN_CARD, name: "Secret Opponent Card" },
    ]);
  });

  it("keeps drawn card names when private move-log fields are intentionally revealed", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          context: "turn",
          outcomes: {
            cardsDrawn: {
              playerId: OPPONENT as never,
              count: 1,
              cardIds: privateCardIds([OPPONENT_DRAWN_CARD], [OPPONENT]) as never,
            },
          },
        }),
      ],
      VIEWER,
      "draw",
      (id) => (id === OPPONENT_DRAWN_CARD ? ({ name: "Secret Opponent Card" } as never) : null),
      { revealPrivateFields: true },
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Opponent entered the End Phase.",
      "Drew 1: Secret Opponent Card.",
    ]);
    expect(entries.map((entry) => entry.turn)).toEqual([4, 5]);
    expect(entries[1]?.cardRefs).toEqual([
      { id: OPPONENT_DRAWN_CARD, name: "Secret Opponent Card" },
    ]);
  });

  it("groups a complete combat narrative and uses historical battle phases", () => {
    const resolveCard = (id: string) =>
      id === "attacker-1" ? ({ name: "Guncannon" } as never) : null;
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "attack",
          playerId: VIEWER as never,
          timestamp: 1,
          stateID: 1,
          commandID: "attack-1",
          attackerId: "attacker-1" as never,
          targetId: "direct",
        }),
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 2,
          stateID: 2,
          commandID: "block-pass",
          context: "block",
        }),
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 3,
          stateID: 3,
          commandID: "battle-pass-opponent",
          context: "battle",
        }),
        tagged({
          type: "pass",
          playerId: VIEWER as never,
          timestamp: 4,
          stateID: 4,
          commandID: "battle-pass-player",
          context: "battle",
          outcomes: {
            damageDealt: [
              {
                sourceCardId: "attacker-1" as never,
                targetId: "base-1" as never,
                amount: 2,
              },
            ],
          },
        }),
      ],
      VIEWER,
      "main-phase",
      resolveCard,
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Attacked direct with Guncannon.",
      "Opponent did not block.",
      "Both players passed the action window.",
      "base-1 took 2 damage.",
      "Combat resolved.",
    ]);
    expect(entries.every((entry) => entry.phase === "battle")).toBe(true);
    expect(entries.every((entry) => entry.section?.label === "Guncannon → Rival")).toBe(true);
    expect(entries.every((entry) => entry.section?.tone === "fight")).toBe(true);
  });

  it("groups command resolution, humanizes payment, and suppresses sentinel plumbing", () => {
    const resolveCard = (id: string) => {
      if (id === "command-1") return { name: "Kai's Resolve" } as never;
      if (id === "unit-2") return { name: "Enemy Unit" } as never;
      return null;
    };
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "playCommand",
          playerId: VIEWER as never,
          timestamp: 1,
          commandID: "play-command",
          cardId: "command-1" as never,
          cost: 1,
          outcomes: {
            resourcesSpent: { regularCount: 1, exRemovedCount: 0 },
            effectsQueued: [
              {
                effectId: "effect-1",
                sourceCardId: "command-1" as never,
                controllerId: VIEWER as never,
                kind: "command",
              },
            ],
          },
        }),
        tagged({
          type: "resolveEffect",
          playerId: VIEWER as never,
          timestamp: 2,
          commandID: "resolve-command",
          sourceCardId: "command-1" as never,
          effectId: "effect-1",
          outcomes: {
            order: [
              { kind: "statModifiers", index: 0 },
              { kind: "effectsResolved", index: 0 },
            ],
            statModifiers: [
              {
                cardId: "unit-2" as never,
                stat: "ap",
                amount: -3,
                duration: "thisBattle",
              },
            ],
            effectsResolved: [{ effectId: "effect-1", sourceCardId: "command-1" as never }],
          },
        }),
        tagged({
          type: "deployUnit",
          playerId: VIEWER as never,
          timestamp: 3,
          commandID: "deploy-unit",
          cardId: "unit-1" as never,
          cost: 0,
          outcomes: {
            effectsQueued: [
              {
                effectId: "sentinel",
                sourceCardId: "__sentinel__" as never,
                controllerId: VIEWER as never,
                kind: "sentinel",
              },
            ],
            effectsResolved: [{ effectId: "sentinel", sourceCardId: "__sentinel__" as never }],
          },
        }),
      ],
      VIEWER,
      "main-phase",
      resolveCard,
    );

    expect(entries.map((entry) => entry.message)).toEqual([
      "Played Kai's Resolve.",
      "Paid 1 resource.",
      "Started resolving Kai's Resolve.",
      "Enemy Unit gets AP -3 during this battle.",
      "Finished resolving Kai's Resolve.",
      "Deployed unit-1.",
    ]);
    expect(entries.slice(0, 5).every((entry) => entry.section?.label === "Kai's Resolve")).toBe(
      true,
    );
    expect(entries.slice(0, 5).every((entry) => entry.section?.tone === "effect")).toBe(true);
    expect(JSON.stringify(entries)).not.toContain("__sentinel__");
  });

  it("attributes a Shield reveal to the Shield owner instead of the command actor", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          commandID: "opponent-damage-pass",
          context: "battle",
          outcomes: {
            shieldsRemoved: [
              {
                cardId: "luna-base" as never,
                playerId: VIEWER as never,
                sourceCardId: "guncannon" as never,
              },
            ],
          },
        }),
      ],
      VIEWER,
      "battle-phase",
      (id) => (id === "luna-base" ? ({ name: "Luna Mana & Carry Base" } as never) : null),
    );

    expect(entries.map((entry) => [entry.seatId, entry.message])).toEqual([
      ["opponent", "Opponent passed the action window."],
      ["player", "Revealed Luna Mana & Carry Base from Shields."],
    ]);
  });

  it("keeps same-card Burst and triggered-effect lifecycles distinct and complete", () => {
    const resolveCard = (id: string) =>
      id === "luna-base" ? ({ name: "Luna Mana & Carry Base" } as never) : null;
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "pass",
          playerId: OPPONENT as never,
          timestamp: 1,
          commandID: "shield-damage",
          context: "battle",
          outcomes: {
            shieldsRemoved: [
              {
                cardId: "luna-base" as never,
                playerId: VIEWER as never,
                sourceCardId: "guncannon" as never,
              },
            ],
            effectsQueued: [
              {
                effectId: "luna-burst",
                sourceCardId: "luna-base" as never,
                controllerId: VIEWER as never,
                kind: "burst",
                timing: "burst",
              },
            ],
          },
        }),
        tagged({
          type: "resolveEffect",
          playerId: VIEWER as never,
          timestamp: 2,
          commandID: "resolve-luna-burst",
          sourceCardId: "luna-base" as never,
          effectId: "luna-burst",
          outcomes: {
            effectsQueued: [
              {
                effectId: "luna-deploy",
                sourceCardId: "luna-base" as never,
                controllerId: VIEWER as never,
                kind: "triggered",
                timing: "deploy",
              },
            ],
            effectsResolved: [
              { effectId: "luna-burst", sourceCardId: "luna-base" as never },
              { effectId: "luna-deploy", sourceCardId: "luna-base" as never },
            ],
          },
        }),
      ],
      VIEWER,
      "battle-phase",
      resolveCard,
    );

    expect(entries.map((entry) => [entry.seatId, entry.message])).toEqual([
      ["opponent", "Opponent passed the action window."],
      ["player", "Revealed Luna Mana & Carry Base from Shields."],
      ["player", "Started resolving Luna Mana & Carry Base · Burst."],
      ["player", "Started resolving Luna Mana & Carry Base · Deploy."],
      ["player", "Finished resolving Luna Mana & Carry Base · Deploy."],
      ["player", "Finished resolving Luna Mana & Carry Base · Burst."],
    ]);
    expect(entries.map((entry) => entry.section?.label)).toEqual([
      "Luna Mana & Carry Base effects",
      "Luna Mana & Carry Base effects",
      "Luna Mana & Carry Base effects",
      "Luna Mana & Carry Base effects",
      "Luna Mana & Carry Base effects",
      "Luna Mana & Carry Base effects",
    ]);
  });

  it("uses command history instead of the live phase for historical actions", () => {
    const entries = projectGundamMoveLogEntries(
      [
        tagged({
          type: "deployUnit",
          playerId: VIEWER as never,
          timestamp: 1,
          stateID: 8,
          commandID: "deploy-1",
          cardId: "unit-1" as never,
          cost: 1,
        }),
      ],
      VIEWER,
      "end-phase",
      undefined,
      {
        moveHistory: [
          {
            moveId: "deployUnit",
            commandID: "deploy-1",
            args: {},
            playerId: VIEWER,
            actorRole: "player",
            timestamp: 1,
            stateID: 8,
            turnNumber: 3,
            gameSegment: "game",
            phase: "main-phase",
          } as never,
        ],
      },
    );

    expect(entries[0]?.phase).toBe("main");
  });
});

describe("projectGundamLegacyEventLogEntries", () => {
  it("preserves private deck reveal and tutor details in the shared event log", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          id: 10,
          type: "gundam.effect.deckRevealed",
          data: {
            values: {
              playerId: VIEWER,
              cardIds: ["card-a", "card-b"],
            },
          },
        }),
        taggedLegacy({
          id: 11,
          type: "gundam.effect.cardTutored",
          data: {
            values: {
              playerId: VIEWER,
              cardId: "card-b",
            },
          },
        }),
      ],
      VIEWER,
      "main",
      (id) => {
        const names = new Map([
          ["card-a", "Top Deck A"],
          ["card-b", "Tutored Card"],
        ]);
        const name = names.get(id);
        return name ? ({ name } as never) : null;
      },
    );

    expect(entries).toEqual([
      {
        id: "gundam-legacy-log-10",
        turn: 4,
        phase: "main",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You revealed 2: Top Deck A, Tutored Card from deck.",
        tags: ["ability"],
        entityIds: ["card-a", "card-b"],
      },
      {
        id: "gundam-legacy-log-11",
        turn: 4,
        phase: "main",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You searched for Tutored Card.",
        tags: ["ability"],
        entityIds: ["card-b"],
      },
    ]);
  });

  it("does not duplicate legacy effects already covered by move outcomes", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          type: "gundam.effect.cardsDrawn",
          data: {
            values: {
              playerId: VIEWER,
              count: 1,
            },
          },
        }),
      ],
      VIEWER,
      "draw",
    );

    expect(entries).toEqual([]);
  });

  it("preserves setup and mulligan legacy entries in the shared event log", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          id: 20,
          type: "gundam.setup.firstPlayerChosen",
          message: "player_one chose player_two to go first.",
          data: {
            values: {
              chooser: VIEWER,
              chosen: OPPONENT,
            },
          },
        }),
        taggedLegacy({
          id: 21,
          type: "gundam.setup.mulligan",
          message: "player_two redrew 5 cards.",
          data: {
            values: {
              playerId: OPPONENT,
              count: 5,
            },
          },
        }),
        taggedLegacy({
          id: 22,
          type: "gundam.setup.done",
          message: "Setup complete.",
          data: { values: {} },
        }),
      ],
      VIEWER,
      "setup",
    );

    expect(entries).toEqual([
      {
        id: "gundam-legacy-log-20",
        turn: 0,
        phase: "setup",
        seatId: "player",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "You chose Opponent to go first.",
        tags: ["system"],
        entityIds: undefined,
      },
      {
        id: "gundam-legacy-log-21",
        turn: 0,
        phase: "setup",
        seatId: "opponent",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Opponent redrew 5 cards.",
        tags: ["system"],
        entityIds: undefined,
      },
      {
        id: "gundam-legacy-log-22",
        turn: 0,
        phase: "setup",
        timestamp: "2023-11-14T22:13:20.000Z",
        message: "Setup complete.",
        tags: ["system"],
        entityIds: undefined,
      },
    ]);
  });

  it("projects turn and phase lifecycle landmarks with native Gundam labels", () => {
    const entries = projectGundamLegacyEventLogEntries(
      [
        taggedLegacy({
          id: 30,
          type: "gundam.turn.started",
          data: { values: { playerId: VIEWER, turnNumber: 3 } },
        }),
        taggedLegacy({
          id: 31,
          type: "gundam.phase.entered",
          data: { values: { phase: "draw-phase" } },
        }),
        taggedLegacy({
          id: 32,
          type: "gundam.phase.entered",
          data: { values: { phase: "battle-phase", step: "attack-step" } },
        }),
        taggedLegacy({
          id: 33,
          type: "gundam.turn.ended",
          data: { values: { playerId: VIEWER } },
        }),
      ],
      VIEWER,
      "main-phase",
    );

    expect(entries.map((entry) => [entry.phase, entry.message])).toEqual([
      ["start", "You started the turn."],
      ["draw", "Entered draw."],
      ["end", "You ended the turn."],
    ]);
    expect(entries.map((entry) => entry.turn)).toEqual([4, 4, 3]);
  });
});
