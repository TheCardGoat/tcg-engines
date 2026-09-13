import { describe, expect, it } from "vitest";
import type { FabMoveLog } from "@tcg/flesh-and-blood-engine/simulator";

import { projectFabPlayerHistoryRows } from "./player-history-projection";

const labels = (id: string) => (id === "p1" ? "You" : id === "p2" ? "Practice bot" : undefined);

describe("projectFabPlayerHistoryRows", () => {
  it("shows the concrete name gained by a card", () => {
    const logs: FabMoveLog[] = [
      {
        commandId: "name-gain",
        moveType: "answer-decision",
        playerId: "p1",
        timestamp: 1,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.gain-name",
            values: {
              cardName: "Become The Bottle",
              gainedName: "Crouching Tiger",
              sourceName: "Become The Bottle",
            },
            objectRefs: {
              cardName: { instanceId: "become-the-bottle", canonicalId: "pen-037-r" },
              sourceName: { instanceId: "become-the-bottle", canonicalId: "pen-037-r" },
            },
            defaultMessage:
              "Become The Bottle gained the name Crouching Tiger from Become The Bottle.",
          },
        ],
      },
    ];

    const rows = projectFabPlayerHistoryRows(logs, {
      viewerId: "p1",
      actorLabel: labels,
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]?.title).toBe(
      "Become The Bottle gained the name Crouching Tiger from Become The Bottle.",
    );
    expect(rows[0]?.cardRefs).toEqual([
      {
        name: "Become The Bottle",
        entityId: "become-the-bottle",
        definitionId: "pen-037-r",
      },
      {
        name: "Become The Bottle",
        entityId: "become-the-bottle",
        definitionId: "pen-037-r",
      },
    ]);
  });

  it("keeps one viewer-safe stream with costs and authoritative combat values", () => {
    const logs: FabMoveLog[] = [
      {
        commandId: "play-wrecker",
        moveType: "begin-play",
        playerId: "p1",
        timestamp: 1,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.play",
            values: { actorId: "p1", cardName: "Wrecker Romp" },
            objectRefs: { cardName: { instanceId: "wrecker", canonicalId: "wtr-209" } },
            defaultMessage: "p1 played Wrecker Romp.",
          },
          {
            key: "flesh-and-blood.pitch",
            values: { playerId: "p1", cardName: "Alpha Rampage", resources: 2 },
            objectRefs: { cardName: { instanceId: "alpha", canonicalId: "wtr-207" } },
            defaultMessage: "p1 pitched Alpha Rampage for 2.",
          },
          {
            key: "flesh-and-blood.pitch",
            values: { playerId: "p1", cardName: "Sink Below", resources: 1 },
            objectRefs: { cardName: { instanceId: "sink", canonicalId: "wtr-215" } },
            defaultMessage: "p1 pitched Sink Below for 1.",
          },
          {
            key: "flesh-and-blood.discard.random",
            values: { playerId: "p1", cardName: "Nimblism" },
            defaultMessage: "p1 discarded Nimblism at random.",
          },
        ],
      },
      {
        commandId: "attack",
        moveType: "pass",
        playerId: "p1",
        timestamp: 2,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.attack",
            values: { actorId: "p1", cardName: "Wrecker Romp", targetName: "p2" },
            combatRole: "attack",
            combatState: { kind: "attack", after: { attack: 7, defense: 0 } },
            defaultMessage: "p1 attacked p2 with Wrecker Romp.",
          },
        ],
      },
      {
        commandId: "damage",
        moveType: "pass",
        playerId: "p2",
        timestamp: 3,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.combat.hit",
            values: { cardName: "Wrecker Romp", targetName: "p2", damage: 4 },
            combatState: {
              kind: "outcome",
              final: { attack: 11, defense: 7 },
              damage: 4,
            },
            defaultMessage: "Wrecker Romp hit p2 for 4.",
          },
        ],
      },
    ];

    const rows = projectFabPlayerHistoryRows(logs, {
      viewerId: "p1",
      seatIds: ["p1", "p2"],
      firstTurnPlayerId: "p1",
      actorLabel: labels,
    });

    expect(rows.map((row) => row.title)).toEqual([
      "Match started · You go first",
      "Played Wrecker Romp",
      "Attack with Wrecker Romp",
      "Hit with Wrecker Romp for",
    ]);
    expect(rows[1]?.details).toEqual([
      {
        kind: "cards",
        label: "Cost",
        lead: "Pitched",
        cards: [
          { name: "Alpha Rampage", entityId: "alpha", definitionId: "wtr-207" },
          { name: "Sink Below", entityId: "sink", definitionId: "wtr-215" },
        ],
      },
      {
        kind: "cards",
        label: "Additional cost",
        lead: "Discarded",
        cards: [{ name: "Nimblism" }],
        trail: " at random",
      },
    ]);
    expect(rows[2]?.metrics).toEqual([{ kind: "value", label: "Attack", value: 7 }]);
    expect(rows[3]?.metrics).toEqual([
      {
        kind: "comparison",
        leftLabel: "Attack",
        left: 11,
        rightLabel: "Defense",
        right: 7,
      },
    ]);
  });

  it("omits diagnostic prompts, automation, and duplicate graveyard bookkeeping", () => {
    const log: FabMoveLog = {
      commandId: "details",
      moveType: "answer-decision",
      playerId: "p1",
      timestamp: 1,
      sequence: 0,
      turnNumber: 1,
      public: [
        {
          key: "flesh-and-blood.decision.awaiting",
          values: { actorId: "p1" },
          defaultMessage: "A decision awaits p1.",
        },
        {
          key: "flesh-and-blood.discard",
          values: { playerId: "p1", cardName: "Nimblism" },
          objectRefs: { cardName: { instanceId: "nimblism", canonicalId: "nimblism" } },
          defaultMessage: "p1 discarded Nimblism.",
        },
        {
          key: "flesh-and-blood.put-into-graveyard",
          values: { cardName: "Nimblism" },
          objectRefs: { cardName: { instanceId: "nimblism", canonicalId: "nimblism" } },
          defaultMessage: "Nimblism was put into the graveyard.",
        },
        {
          key: "flesh-and-blood.put-into-graveyard",
          values: { cardName: "Phantasmaclasm" },
          objectRefs: {
            cardName: { instanceId: "phantasmaclasm", canonicalId: "phantasmaclasm" },
          },
          defaultMessage: "Phantasmaclasm was put into the graveyard.",
        },
      ],
    };

    const rows = projectFabPlayerHistoryRows([log], {
      viewerId: "p1",
      actorLabel: labels,
    });
    expect(rows.map((row) => row.title)).toEqual(["Phantasmaclasm was put into the graveyard"]);
    expect(rows[0]?.details).toEqual([
      {
        kind: "cards",
        label: "Additional cost",
        lead: "Discarded",
        cards: [{ name: "Nimblism", entityId: "nimblism", definitionId: "nimblism" }],
      },
    ]);
  });

  it("keeps each sequential pitch receipt and effect-driven discard as activity", () => {
    const logs: FabMoveLog[] = [
      {
        commandId: "pitch-red",
        moveType: "answer-decision",
        playerId: "p1",
        timestamp: 1,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.pitch",
            values: { playerId: "p1", cardName: "Sink Below", resources: 1 },
            defaultMessage: "p1 pitched Sink Below for 1.",
          },
        ],
      },
      {
        commandId: "pitch-blue",
        moveType: "answer-decision",
        playerId: "p1",
        timestamp: 2,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.pitch",
            values: { playerId: "p1", cardName: "Wrecker Romp", resources: 3 },
            defaultMessage: "p1 pitched Wrecker Romp for 3.",
          },
        ],
      },
      {
        commandId: "effect-discard",
        moveType: "answer-decision",
        playerId: "p1",
        timestamp: 3,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.discard",
            values: { playerId: "p1", cardName: "Alpha Rampage" },
            narrativeRole: "activity",
            defaultMessage: "p1 discarded Alpha Rampage.",
          },
        ],
      },
    ];

    expect(
      projectFabPlayerHistoryRows(logs, { viewerId: "p1", actorLabel: labels }).map(
        (row) => row.title,
      ),
    ).toEqual(["Pitched Sink Below", "Pitched Wrecker Romp", "Discarded Alpha Rampage"]);
  });

  it("waits for reaction resolution and appends one immutable row with its delta", () => {
    const play: FabMoveLog = {
      commandId: "pummel-play",
      moveType: "begin-play",
      playerId: "p1",
      timestamp: 1,
      sequence: 0,
      turnNumber: 1,
      public: [
        {
          key: "flesh-and-blood.play",
          values: { actorId: "p1", cardName: "Pummel" },
          objectRefs: { cardName: { instanceId: "pummel", canonicalId: "wtr-206" } },
          combatRole: "attack-reaction",
          defaultMessage: "p1 played Pummel.",
        },
        {
          key: "flesh-and-blood.pitch",
          values: { playerId: "p1", cardName: "Sink Below", resources: 2 },
          defaultMessage: "p1 pitched Sink Below for 2.",
        },
      ],
    };
    const resolved: FabMoveLog = {
      ...play,
      commandId: "resolve-pummel",
      moveType: "pass",
      timestamp: 2,
      public: [
        {
          ...play.public[0]!,
          combatState: {
            kind: "reaction",
            role: "attack-reaction",
            before: { attack: 7, defense: 3 },
            after: { attack: 11, defense: 3 },
          },
        },
      ],
    };

    expect(projectFabPlayerHistoryRows([play], { viewerId: "p1", actorLabel: labels })).toEqual([]);
    const rows = projectFabPlayerHistoryRows([play, resolved], {
      viewerId: "p1",
      actorLabel: labels,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: "Played Pummel",
      details: [{ kind: "cards", label: "Cost", lead: "Pitched" }],
      metrics: [{ kind: "change", label: "Attack", before: 7, after: 11 }],
    });
  });

  it("shows only unresolved trailing manual priority passes", () => {
    const pass = (commandId: string, playerId: string, timestamp: number): FabMoveLog => ({
      commandId,
      moveType: "pass",
      playerId,
      timestamp,
      sequence: 0,
      turnNumber: 1,
      public: [
        {
          key: "flesh-and-blood.command.pass",
          values: { actorId: playerId },
          defaultMessage: `${playerId} passed priority.`,
        },
      ],
    });
    const action: FabMoveLog = {
      commandId: "draw",
      moveType: "answer-decision",
      playerId: "p1",
      timestamp: 3,
      sequence: 0,
      turnNumber: 1,
      public: [
        {
          key: "flesh-and-blood.draw.cards",
          values: { playerId: "p1", count: 1 },
          defaultMessage: "p1 drew 1 card.",
        },
      ],
    };

    expect(
      projectFabPlayerHistoryRows([pass("a", "p1", 1), pass("b", "p2", 2)], {
        viewerId: "p1",
        actorLabel: labels,
      }).map((row) => row.title),
    ).toEqual(["Passed priority", "Passed priority"]);
    expect(
      projectFabPlayerHistoryRows([pass("a", "p1", 1), pass("b", "p2", 2), action], {
        viewerId: "p1",
        actorLabel: labels,
      }).map((row) => row.title),
    ).toEqual(["Drew 1 cards"]);
  });

  it("composes a viewer's private draw identity into one previewable row", () => {
    const rows = projectFabPlayerHistoryRows(
      [
        {
          commandId: "draw-private",
          moveType: "answer-decision",
          playerId: "p1",
          timestamp: 4,
          sequence: 0,
          turnNumber: 1,
          public: [
            {
              key: "flesh-and-blood.draw",
              values: { playerId: "p1" },
              defaultMessage: "p1 drew a card.",
            },
          ],
          privateByPlayerId: {
            p1: [
              {
                key: "flesh-and-blood.draw.private",
                values: { playerId: "p1", cardNames: "Nimblism" },
                objectRefs: {
                  cardNames: { instanceId: "nimblism-1", canonicalId: "nimblism" },
                },
                defaultMessage: "p1 drew: Nimblism.",
              },
            ],
          },
        },
      ],
      { viewerId: "p1", actorLabel: labels },
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: "Drew: Nimblism",
      cardRefs: [{ name: "Nimblism", entityId: "nimblism-1", definitionId: "nimblism" }],
    });
  });

  it("keeps resolving effects with their causal player and hides source lifecycle noise", () => {
    const sigilRef = { cardName: { instanceId: "sigil", canonicalId: "sigil-of-solace" } };
    const opened = {
      kind: "stack-layer-opened" as const,
      stackWindowId: "sigil-layer",
      layerId: "sigil-layer",
      controllerId: "p2",
      sourceInstanceId: "sigil",
      respondsToLayerId: null,
      stackOrdinal: 1,
    };
    const resolving = {
      kind: "stack-layer-event" as const,
      layerId: "sigil-layer",
      controllerId: "p2",
      sourceInstanceId: "sigil",
    };
    const logs: FabMoveLog[] = [
      {
        commandId: "play-sigil",
        moveType: "begin-play",
        playerId: "p2",
        timestamp: 1,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.play",
            values: { actorId: "p2", cardName: "Sigil of Solace" },
            objectRefs: sigilRef,
            activityRef: opened,
            defaultMessage: "p2 played Sigil of Solace.",
          },
        ],
      },
      {
        commandId: "viewer-passes-to-resolve",
        moveType: "pass",
        playerId: "p1",
        timestamp: 2,
        sequence: 0,
        turnNumber: 1,
        public: [
          {
            key: "flesh-and-blood.gain-life",
            values: { playerId: "p2", amount: 3 },
            activityRef: resolving,
            defaultMessage: "p2 gained 3 life.",
          },
          {
            key: "flesh-and-blood.move-zone",
            values: {
              playerId: "p2",
              cardName: "Sigil of Solace",
              from: "stack",
              to: "graveyard",
            },
            objectRefs: sigilRef,
            activityRef: resolving,
            defaultMessage: "p2 moved Sigil of Solace from stack to graveyard.",
          },
          {
            key: "flesh-and-blood.put-into-graveyard",
            values: { cardName: "Sigil of Solace" },
            objectRefs: sigilRef,
            activityRef: resolving,
            defaultMessage: "Sigil of Solace was put into the graveyard.",
          },
        ],
      },
    ];

    const rows = projectFabPlayerHistoryRows(logs, {
      viewerId: "p1",
      seatIds: ["p1", "p2"],
      actorLabel: labels,
    });

    expect(rows.map(({ actorSeatId, title }) => ({ actorSeatId, title }))).toEqual([
      { actorSeatId: "p2", title: "Played Sigil of Solace" },
      { actorSeatId: "p2", title: "Gained 3 life" },
    ]);

    const viewerAffectedLogs: FabMoveLog[] = [
      logs[0]!,
      {
        ...logs[1]!,
        public: logs[1]!.public.map((message) =>
          message.key === "flesh-and-blood.gain-life"
            ? { ...message, values: { playerId: "p1", amount: 3 } }
            : message,
        ),
      },
    ];
    const viewerAffectedRows = projectFabPlayerHistoryRows(viewerAffectedLogs, {
      viewerId: "p1",
      seatIds: ["p1", "p2"],
      actorLabel: labels,
    });
    expect(viewerAffectedRows[1]).toMatchObject({
      actorSeatId: "p2",
      title: "You gained 3 life",
    });
  });
});
