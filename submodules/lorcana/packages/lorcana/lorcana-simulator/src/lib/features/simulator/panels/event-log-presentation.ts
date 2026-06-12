import type { ChatMessage } from "@tcg/shared";
import type {
  LorcanaPlayerSide,
  MoveLogEntrySnapshot,
} from "@/features/simulator/model/contracts.js";
import { m } from "$lib/i18n/messages.js";
import {
  type CardReferenceResolver,
  type EventLogMarkerId,
  type EventLogPlayerTone,
  type EventLogSegment,
  formatEventLogBody,
} from "@/features/simulator/model/event-log-formatting.js";

export type { CardReferenceResolver, EventLogMarkerId, EventLogPlayerTone, EventLogSegment };

export type EventLogRow =
  | {
      kind: "turn-separator";
      id: string;
      turnNumber: number;
      marker: EventLogMarkerId;
      label: string;
    }
  | {
      kind: "event-row";
      id: string;
      turnNumber: number;
      timestamp: number;
      marker: EventLogMarkerId;
      actor: {
        label: string;
        tone: EventLogPlayerTone;
      };
      segments: EventLogSegment[];
      source: "typed" | "fallback";
      /**
       * Manual / Board-State-Correction moves break out of the surrounding
       * actor group so corrections are visually separated from in-engine
       * play. Without this, a player's manual damage tweak would silently
       * fold into their regular play stream and look like part of the move.
       */
      isManual: boolean;
    };

export function filterEntriesToLastTurns(
  entries: MoveLogEntrySnapshot[],
  turnCount = 4,
): MoveLogEntrySnapshot[] {
  if (entries.length === 0 || turnCount <= 0) {
    return [];
  }

  const recentTurns = new Set<number>();
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    recentTurns.add(entries[index].turnNumber);
    if (recentTurns.size >= turnCount) {
      break;
    }
  }

  return entries.filter((entry) => recentTurns.has(entry.turnNumber));
}

export type EventLogGroup =
  | {
      kind: "turn-separator";
      id: string;
      turnNumber: number;
      label: string;
    }
  | {
      kind: "event-group";
      id: string;
      actor: { label: string; tone: EventLogPlayerTone };
      isManual: boolean;
      rows: Extract<EventLogRow, { kind: "event-row" }>[];
    };

export function groupEventLogRows(rows: EventLogRow[]): EventLogGroup[] {
  const groups: EventLogGroup[] = [];
  let currentGroup: Extract<EventLogGroup, { kind: "event-group" }> | null = null;

  for (const row of rows) {
    if (row.kind === "turn-separator") {
      currentGroup = null;
      groups.push({
        kind: "turn-separator",
        id: row.id,
        turnNumber: row.turnNumber,
        label: row.label,
      });
      continue;
    }

    if (
      currentGroup &&
      currentGroup.actor.tone === row.actor.tone &&
      currentGroup.isManual === row.isManual
    ) {
      currentGroup.rows.push(row);
    } else {
      currentGroup = {
        kind: "event-group",
        id: row.id,
        actor: row.actor,
        isManual: row.isManual,
        rows: [row],
      };
      groups.push(currentGroup);
    }
  }

  return groups;
}

export function buildEventLogRows(
  entries: MoveLogEntrySnapshot[],
  viewerSide?: LorcanaPlayerSide | null,
  resolveCard?: CardReferenceResolver,
): EventLogRow[] {
  const visibleEntries = filterEntriesToLastTurns(entries).filter(shouldShowEventLogEntry);
  if (visibleEntries.length === 0) {
    return [];
  }

  const rows: EventLogRow[] = [];
  let currentTurn: number | null = null;

  for (const entry of visibleEntries) {
    if (entry.turnNumber !== currentTurn) {
      currentTurn = entry.turnNumber;
      rows.push({
        kind: "turn-separator",
        id: `turn-${entry.turnNumber}`,
        turnNumber: entry.turnNumber,
        marker: "turn",
        label: `Turn ${entry.turnNumber}`,
      });
    }

    rows.push(buildEventRow(entry, viewerSide, resolveCard));
  }

  return rows;
}

function shouldShowEventLogEntry(entry: MoveLogEntrySnapshot): boolean {
  return !(entry.moveId === "undo" && !entry.typedLogEntry);
}

function buildEventRow(
  entry: MoveLogEntrySnapshot,
  viewerSide?: LorcanaPlayerSide | null,
  resolveCard?: CardReferenceResolver,
): Extract<EventLogRow, { kind: "event-row" }> {
  const body = formatEventLogBody(entry, viewerSide, undefined, resolveCard);

  return {
    kind: "event-row",
    id: entry.id,
    turnNumber: entry.turnNumber,
    timestamp: entry.timestamp,
    marker: body.marker,
    actor: buildActor(entry.actorSide, viewerSide),
    segments: body.segments,
    source: body.source,
    isManual: entry.moveId.startsWith("manual"),
  };
}

export type ChatFeedItem = {
  kind: "chat-message";
  id: string;
  epochMs: number;
  senderSeat: 0 | 1 | 2;
  presetKey?: string;
  text?: string;
  systemEvent?: string;
};

export type ActivityFeedGroup = EventLogGroup | ChatFeedItem;

export function buildActivityFeed(
  entries: MoveLogEntrySnapshot[],
  chatMessages: readonly ChatMessage[],
  viewerSide?: LorcanaPlayerSide | null,
  resolveCard?: CardReferenceResolver,
): ActivityFeedGroup[] {
  const rows = buildEventLogRows(entries, viewerSide, resolveCard);
  const groups = groupEventLogRows(rows);

  // Oldest visible game event timestamp — used to filter out stale chat messages
  const oldestGameEpochMs =
    rows.find((r): r is Extract<EventLogRow, { kind: "event-row" }> => r.kind === "event-row")
      ?.timestamp ?? null;

  // Build id → epochMs for turn-separator rows (look ahead to next event-row)
  const separatorEpochMap = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (row.kind === "turn-separator") {
      const nextEvent = rows
        .slice(i + 1)
        .find((r): r is Extract<EventLogRow, { kind: "event-row" }> => r.kind === "event-row");
      separatorEpochMap.set(row.id, nextEvent?.timestamp ?? 0);
    }
  }

  type Sortable = { epochMs: number; isSeparator: boolean; group: ActivityFeedGroup };

  const sortable: Sortable[] = groups.map((group) => {
    if (group.kind === "turn-separator") {
      return {
        epochMs: separatorEpochMap.get(group.id) ?? 0,
        isSeparator: true,
        group,
      };
    }
    return {
      epochMs: group.rows[0].timestamp,
      isSeparator: false,
      group,
    };
  });

  const chatItems: ChatFeedItem[] = chatMessages
    .map((msg): ChatFeedItem => {
      const parsed = Date.parse(msg.createdAt);
      const epochMs = Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
      if (msg.kind === "preset") {
        return {
          kind: "chat-message",
          id: msg.id,
          epochMs,
          senderSeat: msg.senderSeat,
          presetKey: msg.presetKey,
        };
      }
      if (msg.kind === "system") {
        return {
          kind: "chat-message",
          id: msg.id,
          epochMs,
          senderSeat: msg.senderSeat,
          systemEvent: msg.systemEvent,
        };
      }
      return {
        kind: "chat-message",
        id: msg.id,
        epochMs,
        senderSeat: msg.senderSeat,
        text: msg.text,
      };
    })
    .filter((item) => oldestGameEpochMs === null || item.epochMs >= oldestGameEpochMs);

  for (const item of chatItems) {
    sortable.push({ epochMs: item.epochMs, isSeparator: false, group: item });
  }

  // Stable sort: by epoch ascending; separators sort before same-epoch non-separators
  sortable.sort((a, b) => {
    if (a.epochMs !== b.epochMs) {
      return a.epochMs - b.epochMs;
    }
    if (a.isSeparator && !b.isSeparator) {
      return -1;
    }
    if (!a.isSeparator && b.isSeparator) {
      return 1;
    }
    return 0;
  });

  return sortable.map((s) => s.group);
}

function buildActor(
  actorSide?: LorcanaPlayerSide | null,
  viewerSide?: LorcanaPlayerSide | null,
): { label: string; tone: EventLogPlayerTone } {
  if (!actorSide) {
    return { label: "System", tone: "system" };
  }

  if (viewerSide && actorSide === viewerSide) {
    return { label: m["sim.player.you"]({}), tone: "self" };
  }

  if (viewerSide && actorSide !== viewerSide) {
    return { label: m["sim.player.opponent"]({}), tone: "opponent" };
  }

  return actorSide === "playerOne"
    ? { label: m["sim.player.side.playerOne"]({}), tone: "playerOne" }
    : { label: m["sim.player.side.playerTwo"]({}), tone: "playerTwo" };
}
