import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  IconArrowRight,
  IconBolt,
  IconDotsVertical,
  IconMessageCircle,
  IconSettings,
  IconSwords,
} from "@tabler/icons-react";

import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";

import { cx } from "../class-names";
import { useStickToBottom } from "../hooks/useStickToBottom";
import type { ChatMessage } from "./ChatPanel";
import classes from "./EventLogPanel.module.css";

export interface EventLogPanelProps {
  entries: readonly SimulatorEventLogEntry[];
  highlightedEntityIds?: readonly string[];
  onHighlightEntity?: (entityIds: readonly string[]) => void;
  onEntryClick?: (entry: SimulatorEventLogEntry) => void;
  renderMessage?: (entry: SimulatorEventLogEntry) => ReactNode;
  chatMessages?: readonly ChatMessage[];
  copyText?: string;
  rawCopyText?: string;
  embedded?: boolean;
}

type TagFilter = "all" | "move" | "combat" | "ability" | "system" | "chat";

const TAG_ORDER: TagFilter[] = ["all", "move", "combat", "ability", "system", "chat"];

type EventLogChunk =
  | {
      type: "entries";
      key: string;
      entries: SimulatorEventLogEntry[];
    }
  | {
      type: "section";
      key: string;
      section: NonNullable<SimulatorEventLogEntry["section"]>;
      entries: SimulatorEventLogEntry[];
    }
  | {
      type: "chat";
      key: string;
      message: ChatMessage;
    };

type ActivityRow =
  | {
      type: "entry";
      key: string;
      turn: number;
      epochMs: number;
      entry: SimulatorEventLogEntry;
    }
  | {
      type: "chat";
      key: string;
      turn: number;
      epochMs: number;
      message: ChatMessage;
    };

type FilterCounts = Record<TagFilter, number>;

type PrimaryTag = Exclude<TagFilter, "all" | "chat">;

const TAG_LABELS: Record<TagFilter, string> = {
  all: "All",
  move: "Move",
  combat: "Combat",
  ability: "Ability",
  system: "System",
  chat: "Chat",
};

function speakerClass(seatId: string | undefined): string | undefined {
  if (!seatId) return classes.system;
  if (seatId === "player" || seatId === "p1") return classes.player;
  if (seatId === "opponent" || seatId === "p2") return classes.opponent;
  return classes.system;
}

function speakerLabel(seatId: string | undefined): string {
  if (!seatId) return "SYS";
  if (seatId === "player" || seatId === "p1") return "P1";
  if (seatId === "opponent" || seatId === "p2") return "P2";
  return seatId.slice(0, 3).toUpperCase();
}

function speakerAccessibleLabel(seatId: string | undefined): string {
  if (!seatId) return "System";
  if (seatId === "player" || seatId === "p1") return "You";
  if (seatId === "opponent" || seatId === "p2") return "Rival";
  return speakerLabel(seatId);
}

function primaryTag(entry: SimulatorEventLogEntry): PrimaryTag {
  if (entry.tags.includes("combat")) return "combat";
  if (entry.tags.includes("ability")) return "ability";
  if (entry.tags.includes("system")) return "system";
  return "move";
}

function tagClass(tag: PrimaryTag): string | undefined {
  switch (tag) {
    case "combat":
      return classes.tagCombat;
    case "ability":
      return classes.tagAbility;
    case "system":
      return classes.tagSystem;
    case "move":
      return classes.tagMove;
  }
}

function eventTagIcon(tag: PrimaryTag): typeof IconArrowRight {
  switch (tag) {
    case "combat":
      return IconSwords;
    case "ability":
      return IconBolt;
    case "system":
      return IconSettings;
    case "move":
      return IconArrowRight;
  }
}

function isRoutineEntry(entry: SimulatorEventLogEntry): boolean {
  if (entry.tags.includes("system")) return true;
  return (
    entry.message.startsWith("Phase changed ") ||
    entry.message.startsWith("Passed ") ||
    /^Gained .+ gig/.test(entry.message)
  );
}

function normalizePhase(phase: string): string {
  return phase.trim().replace(/[-_]+/g, " ");
}

function displayPhase(phase: string): string {
  const normalized = normalizePhase(phase);
  return normalized.length > 0 ? normalized : "Phase";
}

function phaseSummary(entries: readonly SimulatorEventLogEntry[]): string {
  const phases: string[] = [];
  for (const entry of entries) {
    const phase = displayPhase(entry.phase);
    if (!phases.includes(phase)) {
      phases.push(phase);
    }
  }
  if (phases.length === 0) return "No phase";
  if (phases.length <= 2) return phases.join(" / ");
  return `${phases.slice(0, 2).join(" / ")} +${phases.length - 2}`;
}

function entryCountLabel(count: number): string {
  return count === 1 ? "1 entry" : `${count} entries`;
}

function activitySummaryLabel(entryCount: number, chatCount: number): string {
  const entryLabel = entryCountLabel(entryCount);
  if (chatCount === 0) return entryLabel;
  const chatLabel = chatCount === 1 ? "1 message" : `${chatCount} messages`;
  return `${entryLabel}, ${chatLabel}`;
}

export function EventLogPanel({
  entries,
  highlightedEntityIds = [],
  onHighlightEntity,
  onEntryClick,
  renderMessage,
  chatMessages = [],
  copyText,
  rawCopyText,
  embedded = false,
}: EventLogPanelProps) {
  const [activeFilter, setActiveFilter] = useState<TagFilter>("all");
  const [expandedTurns, setExpandedTurns] = useState<Set<number>>(new Set());
  const [copyStatus, setCopyStatus] = useState<"readable" | "raw" | "failed" | null>(null);
  const [controlsOpen, setControlsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const controlsId = useId();
  const copyStatusTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (copyStatusTimeoutRef.current !== null) {
        window.clearTimeout(copyStatusTimeoutRef.current);
      }
    };
  }, []);

  const toggleTurn = useCallback((turn: number) => {
    setExpandedTurns((prev) => {
      const next = new Set(prev);
      if (next.has(turn)) next.delete(turn);
      else next.add(turn);
      return next;
    });
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<number, ActivityRow[]>();
    const eventRows: Array<Extract<ActivityRow, { type: "entry" }>> = entries.map(
      (entry, index) => ({
        type: "entry",
        key: `entry:${entry.id}`,
        turn: entry.turn,
        epochMs: parseTimestamp(entry.timestamp, index),
        entry,
      }),
    );

    for (const row of eventRows) {
      const entry = row.entry;
      if (activeFilter === "chat") {
        continue;
      }
      if (activeFilter !== "all" && !entry.tags.includes(activeFilter)) {
        continue;
      }
      const list = groups.get(row.turn) ?? [];
      list.push(row);
      groups.set(row.turn, list);
    }

    if (activeFilter === "all" || activeFilter === "chat") {
      const orderedEventRows = [...eventRows].sort(compareActivityRows);
      chatMessages.forEach((message, index) => {
        const epochMs = parseTimestamp(message.timestamp, Number.MAX_SAFE_INTEGER - index);
        const turn = turnForChatMessage(epochMs, orderedEventRows);
        const list = groups.get(turn) ?? [];
        list.push({
          type: "chat",
          key: `chat:${message.id}`,
          turn,
          epochMs,
          message,
        });
        groups.set(turn, list);
      });
    }

    for (const list of groups.values()) {
      list.sort(compareActivityRows);
    }

    return groups;
  }, [activeFilter, chatMessages, entries]);

  const sortedTurns = useMemo(() => Array.from(grouped.keys()).sort((a, b) => a - b), [grouped]);
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>(
    [entries.length, chatMessages.length, activeFilter, sortedTurns.length],
    { thresholdPx: 48 },
  );

  const showCopyActions = copyText !== undefined || rawCopyText !== undefined;
  const readableCopyText = copyText ?? formatEventLogForClipboard(entries);
  const activitySummary = activitySummaryLabel(entries.length, chatMessages.length);

  const copyEventLog = useCallback(async (kind: "readable" | "raw", text: string) => {
    const ok = await copyTextToClipboard(text);
    setCopyStatus(ok ? kind : "failed");
    if (copyStatusTimeoutRef.current !== null) {
      window.clearTimeout(copyStatusTimeoutRef.current);
    }
    copyStatusTimeoutRef.current = window.setTimeout(() => {
      setCopyStatus(null);
      copyStatusTimeoutRef.current = null;
    }, 2500);
  }, []);

  const filterCounts = useMemo<FilterCounts>(() => {
    const counts: FilterCounts = {
      all: entries.length + chatMessages.length,
      move: 0,
      combat: 0,
      ability: 0,
      system: 0,
      chat: chatMessages.length,
    };
    for (const entry of entries) {
      for (const tag of entry.tags) {
        counts[tag] += 1;
      }
    }
    return counts;
  }, [chatMessages.length, entries]);

  const renderEntry = (
    entry: SimulatorEventLogEntry,
    index: number,
    entriesInGroup: readonly SimulatorEventLogEntry[],
  ) => {
    const prev = entriesInGroup[index - 1];
    const groupedWithPrev =
      prev !== undefined && speakerClass(prev.seatId) === speakerClass(entry.seatId);
    const isHighlighted =
      entry.entityIds && entry.entityIds.some((id) => highlightedEntityIds.includes(id));
    const tag = primaryTag(entry);
    const TagIcon = eventTagIcon(tag);
    const metaLabel = `${speakerAccessibleLabel(entry.seatId)}, ${tag}`;
    return (
      <button
        key={entry.id}
        type="button"
        className={cx(
          classes.entry,
          speakerClass(entry.seatId),
          groupedWithPrev && classes.entryGrouped,
          isHighlighted && classes.entryHighlighted,
        )}
        data-primary-tag={tag}
        data-routine={isRoutineEntry(entry) ? "true" : undefined}
        onClick={() => {
          if (entry.entityIds) onHighlightEntity?.(entry.entityIds);
          onEntryClick?.(entry);
        }}
      >
        <span
          className={cx(classes.entryMeta, tagClass(tag))}
          aria-label={metaLabel}
          title={metaLabel}
        >
          <TagIcon size={13} stroke={2.2} aria-hidden="true" />
        </span>
        <p className={classes.message}>{renderMessage ? renderMessage(entry) : entry.message}</p>
      </button>
    );
  };

  const renderChatMessage = (message: ChatMessage) => {
    const isSystem = message.senderSide === "system";
    const label = isSystem ? "System" : message.senderLabel;
    return (
      <div
        key={`chat:${message.id}`}
        className={cx(
          classes.chatBubble,
          message.senderSide === "player" && classes.chatBubblePlayer,
          message.senderSide === "opponent" && classes.chatBubbleOpponent,
          isSystem && classes.chatBubbleSystem,
        )}
        data-testid="event-log-chat-message"
        data-sender={message.senderSide}
      >
        <span className={classes.chatIcon} aria-hidden="true">
          <IconMessageCircle size={13} stroke={2.2} />
        </span>
        <span className={classes.chatContent}>
          <span className={classes.chatMeta}>
            <span>{label}</span>
            <time>{formatChatTime(message.timestamp)}</time>
          </span>
          <span className={classes.chatText}>{message.text}</span>
        </span>
      </div>
    );
  };

  const renderChunks = (chunks: readonly EventLogChunk[]) => {
    let previousPhase: string | null = null;
    const rendered: ReactNode[] = [];
    for (const chunk of chunks) {
      if (chunk.type === "chat") {
        rendered.push(renderChatMessage(chunk.message));
        continue;
      }
      const firstEntry = chunk.entries[0];
      if (!firstEntry) continue;
      const phase = displayPhase(firstEntry.phase);
      if (phase !== previousPhase) {
        rendered.push(
          <div key={`phase:${chunk.key}:${phase}`} className={classes.phaseHeader}>
            <span>{phase}</span>
          </div>,
        );
        previousPhase = phase;
      }
      if (chunk.type === "entries") {
        rendered.push(
          <div key={chunk.key} className={classes.entryList}>
            {chunk.entries.map((entry, index) => renderEntry(entry, index, chunk.entries))}
          </div>,
        );
        continue;
      }
      rendered.push(
        <div
          key={chunk.key}
          className={classes.sectionGroup}
          data-section-tone={chunk.section.tone}
        >
          <div className={classes.sectionHeader}>
            <span className={classes.sectionLabel}>{chunk.section.label}</span>
            <span className={classes.sectionCount}>{entryCountLabel(chunk.entries.length)}</span>
          </div>
          <div className={classes.sectionEntries}>
            {chunk.entries.map((entry, index) => renderEntry(entry, index, chunk.entries))}
          </div>
        </div>,
      );
    }
    return rendered;
  };

  return (
    <section
      className={`${classes.panel} ${embedded ? classes.panelEmbedded : ""}`}
      aria-label="Event log"
      data-testid="event-log"
      data-count={entries.length}
    >
      <div className={classes.header}>
        <h3 className={classes.title}>Event log</h3>
        <div className={classes.headerActions}>
          <button
            type="button"
            className={classes.controlsButton}
            aria-label="Event log options"
            aria-expanded={controlsOpen}
            aria-controls={controlsId}
            title="Event log options"
            onClick={() => setControlsOpen((open) => !open)}
          >
            <IconDotsVertical size={15} stroke={2.4} aria-hidden="true" />
          </button>
        </div>
      </div>
      {controlsOpen ? (
        <div
          id={controlsId}
          className={classes.controlsPopover}
          role="dialog"
          aria-label="Event log options"
        >
          <div className={classes.controlsSection}>
            <span className={classes.controlsLabel}>Activity</span>
            <span className={classes.controlsSummary}>{activitySummary}</span>
          </div>

          <div className={classes.controlsSection}>
            <span className={classes.controlsLabel}>Filter</span>
            <div className={classes.filters}>
              {TAG_ORDER.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={cx(classes.filter, activeFilter === tag && classes.filterActive)}
                  onClick={() => setActiveFilter(tag)}
                  aria-pressed={activeFilter === tag}
                >
                  <span>{TAG_LABELS[tag]}</span>
                  <span className={classes.filterCount}>{filterCounts[tag]}</span>
                </button>
              ))}
            </div>
          </div>

          {showCopyActions ? (
            <div className={classes.controlsSection}>
              <span className={classes.controlsLabel}>Copy</span>
              <div className={classes.copyActions}>
                {copyText !== undefined ? (
                  <button
                    type="button"
                    className={classes.copyButton}
                    onClick={() => void copyEventLog("readable", readableCopyText)}
                    disabled={!mounted || entries.length === 0}
                    aria-label="Copy readable event log"
                    title="Copy readable event log"
                  >
                    Readable
                  </button>
                ) : null}
                {rawCopyText !== undefined ? (
                  <button
                    type="button"
                    className={classes.copyButton}
                    onClick={() => void copyEventLog("raw", rawCopyText)}
                    disabled={!mounted || rawCopyText.length === 0}
                    aria-label="Copy raw event log"
                    title="Copy raw event log"
                  >
                    Raw
                  </button>
                ) : null}
              </div>
              {copyStatus ? (
                <div
                  className={cx(
                    classes.copyStatus,
                    copyStatus === "failed" && classes.copyStatusError,
                  )}
                  role="status"
                >
                  {copyStatus === "failed"
                    ? "Clipboard unavailable."
                    : copyStatus === "raw"
                      ? "Raw log copied."
                      : "Readable log copied."}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        className={classes.scroll}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {sortedTurns.length === 0 ? (
          <div className={classes.empty}>
            {emptyEventLogMessage(activeFilter, entries.length, chatMessages.length)}
          </div>
        ) : (
          sortedTurns.map((turn) => {
            const turnRows = grouped.get(turn) ?? [];
            const isExpanded = expandedTurns.has(turn) || expandedTurns.size === 0;
            const chunks = buildEventLogChunks(turnRows);
            return (
              <div key={turn} className={classes.turnGroup}>
                <button
                  type="button"
                  className={classes.turnHeader}
                  onClick={() => toggleTurn(turn)}
                  aria-expanded={isExpanded}
                >
                  <span className={classes.turnTitle}>
                    {turn === 0 ? "Messages" : `Turn ${turn}`}
                  </span>
                  <span className={classes.turnMeta}>{phaseSummaryForRows(turnRows)}</span>
                  <span className={classes.turnCount}>{activityCountLabel(turnRows)}</span>
                </button>
                {isExpanded && renderChunks(chunks)}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function buildEventLogChunks(rows: readonly ActivityRow[]): EventLogChunk[] {
  const chunks: EventLogChunk[] = [];
  for (const row of rows) {
    if (row.type === "chat") {
      chunks.push({ type: "chat", key: row.key, message: row.message });
      continue;
    }
    const entry = row.entry;
    const entryPhase = displayPhase(entry.phase);
    if (!entry.section) {
      const previous = chunks[chunks.length - 1];
      if (previous?.type === "entries" && chunkPhase(previous) === entryPhase) {
        previous.entries.push(entry);
        continue;
      }
      chunks.push({ type: "entries", key: `entries:${entry.id}`, entries: [entry] });
      continue;
    }
    const previous = chunks[chunks.length - 1];
    if (
      previous?.type === "section" &&
      previous.section.id === entry.section.id &&
      previous.section.label === entry.section.label &&
      chunkPhase(previous) === entryPhase
    ) {
      previous.entries.push(entry);
      continue;
    }
    chunks.push({
      type: "section",
      key: `${entry.section.id}:${entry.id}`,
      section: entry.section,
      entries: [entry],
    });
  }
  return chunks;
}

function chunkPhase(chunk: EventLogChunk): string | null {
  if (chunk.type === "chat") return null;
  const firstEntry = chunk.entries[0];
  return firstEntry ? displayPhase(firstEntry.phase) : null;
}

function parseTimestamp(value: string, fallback: number): number {
  const epochMs = Date.parse(value);
  return Number.isFinite(epochMs) ? epochMs : fallback;
}

function compareActivityRows(a: ActivityRow, b: ActivityRow): number {
  if (a.epochMs !== b.epochMs) return a.epochMs - b.epochMs;
  if (a.type !== b.type) return a.type === "entry" ? -1 : 1;
  return a.key.localeCompare(b.key);
}

function turnForChatMessage(
  epochMs: number,
  orderedEventRows: readonly Extract<ActivityRow, { type: "entry" }>[],
): number {
  if (orderedEventRows.length === 0) return 0;
  let candidate = orderedEventRows[0]?.turn ?? 0;
  for (const row of orderedEventRows) {
    if (row.epochMs > epochMs) break;
    candidate = row.turn;
  }
  return candidate;
}

function phaseSummaryForRows(rows: readonly ActivityRow[]): string {
  const entries = rows
    .filter((row): row is Extract<ActivityRow, { type: "entry" }> => row.type === "entry")
    .map((row) => row.entry);
  const chatCount = rows.length - entries.length;
  if (entries.length === 0) return chatCount === 1 ? "1 message" : `${chatCount} messages`;
  const entrySummary = phaseSummary(entries);
  if (chatCount === 0) return entrySummary;
  return `${entrySummary} + ${chatCount === 1 ? "1 message" : `${chatCount} messages`}`;
}

function activityCountLabel(rows: readonly ActivityRow[]): string {
  const entryCount = rows.filter((row) => row.type === "entry").length;
  const chatCount = rows.length - entryCount;
  if (entryCount === 0) return chatCount === 1 ? "1 message" : `${chatCount} messages`;
  if (chatCount === 0) return entryCountLabel(entryCount);
  return `${entryCountLabel(entryCount)}, ${chatCount === 1 ? "1 message" : `${chatCount} messages`}`;
}

function emptyEventLogMessage(
  activeFilter: TagFilter,
  entryCount: number,
  chatCount: number,
): string {
  if (activeFilter === "chat") {
    return chatCount === 0 ? "No chat messages yet." : "No chat messages match the current filter.";
  }
  return entryCount === 0 ? "No events yet." : "No events match the current filter.";
}

function formatChatTime(timestamp: string): string {
  const epochMs = Date.parse(timestamp);
  if (!Number.isFinite(epochMs)) return "";
  return new Date(epochMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatEventLogForClipboard(entries: readonly SimulatorEventLogEntry[]): string {
  if (entries.length === 0) {
    return "No event log entries.";
  }
  return [
    "# Event log",
    entries.map(formatEventLogEntryForClipboard).join("\n"),
    "",
    "# Projected entries",
    safeStringify(entries),
  ].join("\n");
}

function formatEventLogEntryForClipboard(entry: SimulatorEventLogEntry): string {
  const timestamp = entry.timestamp ? ` ${entry.timestamp}` : "";
  const speaker = speakerLabel(entry.seatId);
  const tags = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
  return `Turn ${entry.turn}${timestamp} ${speaker} ${entry.phase}${tags}: ${entry.message}`;
}
