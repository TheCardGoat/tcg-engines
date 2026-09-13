import { describe, expect, it } from "vitest";
import type { FabVisiblePlayerLog } from "@tcg/flesh-and-blood-engine/simulator";

import {
  projectFabPlayerNarrativeEntries,
  projectFabPlayerNarrativeHistory,
  projectFabPlayerNarrativeMatchStart,
} from "./player-narrative-projection";

describe("FAB player narrative projection", () => {
  it("renders engine-authored messages directly for the viewer", () => {
    const log: FabVisiblePlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "command-7",
      moveType: "pass",
      actorId: "player-2",
      timestamp: 1_700_000_000_000,
      turnNumber: 2,
      turnPlayerId: "player-1",
      phase: "action",
      entries: [
        {
          entryId: "command-7:entry-0",
          message: {
            key: "flesh-and-blood.attack",
            values: { actorId: "player-1", cardName: "Snatch", targetName: "player-2" },
            category: "combat",
            metrics: { kind: "attack", attack: 4 },
          },
        },
        {
          entryId: "command-7:entry-1",
          message: {
            key: "flesh-and-blood.defend",
            values: { actorId: "player-2", cardName: "Nimblism" },
            category: "combat",
            metrics: { kind: "defense", defense: 3 },
          },
        },
        {
          entryId: "command-7:entry-2",
          message: {
            key: "flesh-and-blood.combat.hit",
            values: { cardName: "Snatch", targetName: "player-2", damage: 4 },
            category: "combat",
            cardRefs: [{ instanceId: "snatch-1", canonicalId: "wtr167", name: "Snatch" }],
            metrics: { kind: "combat-outcome", attack: 4, defense: 0, damage: 4 },
          },
        },
        {
          entryId: "command-7:entry-3",
          message: {
            key: "flesh-and-blood.draw",
            values: { playerId: "player-1" },
            category: "action",
          },
        },
      ],
    };

    const rows = projectFabPlayerNarrativeEntries([log], {
      viewerId: "player-2",
      seatIds: ["player-1", "player-2"],
    });

    expect(rows.map((row) => row.message)).toEqual([
      "Opponent attacked You with Snatch.",
      "You defended with Nimblism.",
      "Snatch hit You for 4.",
      "Opponent drew a card.",
    ]);
    expect(rows[2]?.entityIds).toEqual(["snatch-1"]);

    const history = projectFabPlayerNarrativeHistory([log], {
      viewerId: "player-2",
      seatIds: ["player-1", "player-2"],
    });
    expect(history[2]?.turnOwnerSeatId).toBe("player-1");
    expect(history[2]?.actorSeatId).toBe("player-1");
    expect(history.map((row) => row.metrics)).toEqual([
      [{ kind: "value", label: "Attack", value: 4 }],
      [{ kind: "value", label: "Defense", value: 3 }],
      [
        {
          kind: "comparison",
          leftLabel: "Attack",
          left: 4,
          rightLabel: "Defense",
          right: 0,
        },
      ],
      undefined,
    ]);
    expect(history.map((row) => row.title)).toEqual([
      "Opponent attacked You with Snatch",
      "You defended with Nimblism",
      "Snatch hit You for 4",
      "Opponent drew a card",
    ]);

    expect(
      projectFabPlayerNarrativeMatchStart("player-1", {
        viewerId: "player-2",
        seatIds: ["player-1", "player-2"],
      }).title,
    ).toBe("Match started · Opponent goes first");
  });

  it("shows the first-turn non-turn-player refill with that player's upcoming turn", () => {
    const log: FabVisiblePlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "end-turn-1",
      moveType: "end-turn",
      actorId: "player-1",
      timestamp: 1,
      turnNumber: 1,
      turnPlayerId: "player-1",
      phase: "action",
      entries: [
        {
          entryId: "end-turn-1:entry-0",
          message: {
            key: "flesh-and-blood.draw",
            values: { playerId: "player-2" },
            category: "action",
          },
        },
      ],
    };

    expect(
      projectFabPlayerNarrativeHistory([log], {
        viewerId: "player-1",
        seatIds: ["player-1", "player-2"],
      })[0],
    ).toMatchObject({
      turn: 2,
      turnOwnerSeatId: "player-2",
      actorSeatId: "player-2",
      title: "Opponent drew a card",
    });
  });

  it("combines pitches with the play they paid for in one player-history row", () => {
    const log: FabVisiblePlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "play-bare-fangs",
      moveType: "answer-decision",
      actorId: "player-2",
      timestamp: 2,
      turnNumber: 2,
      turnPlayerId: "player-2",
      phase: "action",
      entries: [
        {
          entryId: "play-bare-fangs:entry-0",
          message: {
            key: "flesh-and-blood.pitch",
            values: { playerId: "player-2", cardName: "Reckless Swing", resources: 3 },
            category: "action",
            cardRefs: [{ instanceId: "reckless", canonicalId: "wtr-205", name: "Reckless Swing" }],
          },
        },
        {
          entryId: "play-bare-fangs:entry-1",
          message: {
            key: "flesh-and-blood.play",
            values: { actorId: "player-2", cardName: "Bare Fangs" },
            category: "action",
            cardRefs: [{ instanceId: "fangs", canonicalId: "evr-018", name: "Bare Fangs" }],
          },
        },
        {
          entryId: "play-bare-fangs:entry-2",
          message: {
            key: "flesh-and-blood.cost-life",
            values: { playerId: "player-2", life: 2 },
            category: "rules",
          },
        },
      ],
    };

    const rows = projectFabPlayerNarrativeHistory([log], {
      viewerId: "player-1",
      seatIds: ["player-1", "player-2"],
    });

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      title: "Opponent played Bare Fangs",
      details: [
        {
          kind: "cards",
          label: "Cost",
          lead: "Pitched",
          cards: [{ entityId: "reckless", definitionId: "wtr-205", name: "Reckless Swing" }],
          amount: 3,
        },
        { kind: "text", label: "Cost", text: "Paid 2 life" },
      ],
      entityIds: ["fangs", "reckless"],
    });
  });

  it("folds Beat Chest and its discard into the played card instead of repeating the cost", () => {
    const log: FabVisiblePlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "play-bonebreaker-bellow",
      moveType: "begin-play",
      actorId: "player-1",
      timestamp: 3,
      turnNumber: 1,
      turnPlayerId: "player-1",
      phase: "action",
      entries: [
        {
          entryId: "play-bonebreaker-bellow:entry-0",
          message: {
            key: "flesh-and-blood.play",
            values: { actorId: "player-1", cardName: "Bonebreaker Bellow" },
            category: "action",
            cardRefs: [
              { instanceId: "bellow", canonicalId: "sup-010", name: "Bonebreaker Bellow" },
            ],
          },
        },
        {
          entryId: "play-bonebreaker-bellow:entry-1",
          message: {
            key: "flesh-and-blood.discard",
            values: { playerId: "player-1", cardName: "Alpha Rampage" },
            category: "action",
            cardRefs: [{ instanceId: "alpha", canonicalId: "wtr-031", name: "Alpha Rampage" }],
          },
        },
        {
          entryId: "play-bonebreaker-bellow:entry-2",
          message: {
            key: "flesh-and-blood.beat-chest",
            values: {
              actorId: "player-1",
              chestOwner: "player-1",
              cardNames: "Alpha Rampage",
            },
            category: "action",
          },
        },
      ],
    };

    expect(
      projectFabPlayerNarrativeHistory([log], {
        viewerId: "player-1",
        seatIds: ["player-1", "player-2"],
      }),
    ).toEqual([
      expect.objectContaining({
        title: "You played Bonebreaker Bellow",
        details: [{ kind: "text", label: "Beat Chest", text: "Discarded Alpha Rampage" }],
        entityIds: ["bellow", "alpha"],
      }),
    ]);
  });

  it("attributes a hidden arsenal banish to its triggering card without revealing identity", () => {
    const log: FabVisiblePlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "send-packing-trigger",
      moveType: "pass",
      actorId: "player-1",
      timestamp: 3,
      turnNumber: 2,
      turnPlayerId: "player-1",
      phase: "action",
      entries: [
        {
          entryId: "send-packing-trigger:entry-0",
          message: {
            key: "flesh-and-blood.banish.hidden.by-source",
            values: {
              playerId: "player-2",
              sourceName: "Send Packing",
              from: "arsenal",
            },
            category: "action",
            cardRefs: [
              { instanceId: "send-packing", canonicalId: "hvy-012", name: "Send Packing" },
            ],
          },
        },
      ],
    };

    const rows = projectFabPlayerNarrativeHistory([log], {
      viewerId: "player-1",
      seatIds: ["player-1", "player-2"],
    });

    expect(rows[0]).toMatchObject({
      actorSeatId: "player-2",
      title: "Send Packing banished a card from Opponent's arsenal face down",
      entityIds: ["send-packing"],
    });
    expect(rows[0]?.title).not.toContain("Nimblism");
  });

  it("omits diagnostic noise and a turn-start row already expressed by the turn heading", () => {
    const log: FabVisiblePlayerLog = {
      kind: "player-narrative",
      schemaVersion: 1,
      commandId: "turn-2-start",
      moveType: "pass",
      actorId: "player-2",
      timestamp: 4,
      turnNumber: 2,
      turnPlayerId: "player-2",
      phase: "start",
      entries: [
        {
          entryId: "turn-2-start:entry-0",
          message: {
            key: "flesh-and-blood.turn.started",
            values: { turnNumber: 2 },
            category: "system",
          },
        },
        {
          entryId: "turn-2-start:entry-1",
          message: {
            key: "flesh-and-blood.phase.start",
            values: { turnPlayerId: "player-2", phase: "start" },
            category: "system",
          },
        },
        {
          entryId: "turn-2-start:entry-2",
          message: {
            key: "flesh-and-blood.draw.cards",
            values: { playerId: "player-2", count: 2 },
            category: "action",
          },
        },
      ],
    };

    expect(
      projectFabPlayerNarrativeHistory([log], {
        viewerId: "player-1",
        seatIds: ["player-1", "player-2"],
      }).map((row) => row.title),
    ).toEqual(["Opponent drew 2 cards"]);
  });
});
