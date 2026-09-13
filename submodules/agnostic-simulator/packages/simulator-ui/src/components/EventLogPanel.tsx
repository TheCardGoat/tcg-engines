import { useCallback, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  IconArrowRight,
  IconBolt,
  IconChevronDown,
  IconChevronRight,
  IconDotsVertical,
  IconMessageCircle,
  IconSettings,
  IconSwords,
  IconTarget,
} from "@tabler/icons-react";

import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { copyTextToClipboard } from "@tcg/simulator-runtime/debug";

import { cx } from "../class-names";
import { useStickToBottom } from "../hooks/useStickToBottom";
import type { ChatMessage } from "./ChatPanel";
import classes from "./EventLogPanel.module.css";

export interface EventLogPanelProps {
  entries: readonly SimulatorEventLogEntry[];
  highlightedEntityIds?: readonly string[];
  /** Viewer-safe entities that currently have a spatial representation on the board. */
  availableEntityIds?: readonly string[];
  onHighlightEntity?: (entityIds: readonly string[]) => void;
  renderMessage?: (entry: SimulatorEventLogEntry) => ReactNode;
  /** Allows a game to enrich semantic section labels without changing the log projection. */
  renderSectionLabel?: (section: NonNullable<SimulatorEventLogEntry["section"]>) => ReactNode;
  chatMessages?: readonly ChatMessage[];
  /** Enables the built-in player-readable log export. */
  readableCopy?: boolean;
  /** Overrides the built-in player-readable export when supplied. */
  copyText?: string;
  /** Optional diagnostic projection export; callers should expose this only in development. */
  rawCopyText?: string;
  embedded?: boolean;
  /** Parent activity tabs already name this panel, so the redundant title bar can be removed. */
  showHeader?: boolean;
  /** Optional host for the options control when a product shell owns the visible header. */
  controlsContainer?: Element | null;
  turnExpansion?: "all" | "latest";
  /**
   * Section groups: "all" (default) renders every section's rows; "latest"
   * collapses every section except the newest one per expanded turn into a
   * single clickable summary row showing the section's `summary` when present.
   */
  sectionExpansion?: "all" | "latest";
  /** "always" keeps live activity pinned to the newest row after every update. */
  autoScroll?: "when-near-bottom" | "always";
  /** Optional seat display names for speaker labels; defaults to generic P1/P2 chips. */
  seatLabels?: { player?: string; opponent?: string };
}

type SeatLabels = NonNullable<EventLogPanelProps["seatLabels"]>;

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
      children: EventLogChunk[];
    }
  | {
      type: "chat";
      key: string;
      message: ChatMessage;
    };

type SectionChunk = Extract<EventLogChunk, { type: "section" }>;

/** Collapsed-section interaction, active only when `sectionExpansion` is "latest". */
interface SectionToggleControl {
  isCollapsed(chunk: SectionChunk, depth: number): boolean;
  onToggle(chunk: SectionChunk): void;
}

type ActivityRow =
  | {
      type: "entry";
      key: string;
      turn: number;
      epochMs: number;
      sequence: number;
      entry: SimulatorEventLogEntry;
    }
  | {
      type: "chat";
      key: string;
      turn: number;
      epochMs: number;
      sequence: number;
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

function speakerLabel(seatId: string | undefined, seatLabels?: SeatLabels): string {
  if (!seatId) return "SYS";
  if (seatId === "player" || seatId === "p1") return seatLabels?.player ?? "P1";
  if (seatId === "opponent" || seatId === "p2") return seatLabels?.opponent ?? "P2";
  return seatId.slice(0, 3).toUpperCase();
}

function speakerAccessibleLabel(seatId: string | undefined, seatLabels?: SeatLabels): string {
  if (!seatId) return "System";
  if (seatId === "player" || seatId === "p1") return seatLabels?.player ?? "You";
  if (seatId === "opponent" || seatId === "p2") return seatLabels?.opponent ?? "Rival";
  return speakerLabel(seatId, seatLabels);
}

function SectionActorMarker({
  seatId,
  seatLabels,
}: {
  readonly seatId: string;
  readonly seatLabels?: SeatLabels;
}) {
  const shortLabel =
    seatId === "player" || seatId === "p1"
      ? "Y"
      : seatId === "opponent" || seatId === "p2"
        ? "O"
        : speakerLabel(seatId, seatLabels).slice(0, 1);
  const label = `Played by ${speakerAccessibleLabel(seatId, seatLabels)}`;
  return (
    <span
      className={cx(classes.sectionActor, speakerClass(seatId))}
      data-section-actor={seatId}
      aria-label={label}
      title={label}
    >
      {shortLabel}
    </span>
  );
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
  if (entry.importance === "routine") return true;
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

function phaseSummary(entries: readonly SimulatorEventLogEntry[]): string | null {
  const phases: string[] = [];
  for (const entry of entries) {
    const phase = normalizePhase(entry.phase);
    if (phase.length === 0) continue;
    if (!phases.includes(phase)) {
      phases.push(phase);
    }
  }
  if (phases.length === 0) return null;
  if (phases.length <= 2) return phases.join(" / ");
  return `${phases.slice(0, 2).join(" / ")} +${phases.length - 2}`;
}

function entryCountLabel(count: number): string {
  return count === 1 ? "1 entry" : `${count} entries`;
}

function SectionEntryCount({ count }: { readonly count: number }) {
  const label = entryCountLabel(count);
  return (
    <span
      className={classes.sectionCount}
      data-entry-count={count}
      aria-label={label}
      title={label}
    >
      {count}
    </span>
  );
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
  availableEntityIds,
  onHighlightEntity,
  renderMessage,
  renderSectionLabel,
  chatMessages = [],
  readableCopy = false,
  copyText,
  rawCopyText,
  embedded = false,
  showHeader = true,
  controlsContainer,
  turnExpansion = "all",
  sectionExpansion = "all",
  autoScroll = "when-near-bottom",
  seatLabels,
}: EventLogPanelProps) {
  const [activeFilter, setActiveFilter] = useState<TagFilter>("all");
  const [turnExpansionOverrides, setTurnExpansionOverrides] = useState<Map<number, boolean>>(
    new Map(),
  );
  const [sectionExpansionOverrides, setSectionExpansionOverrides] = useState<Map<string, boolean>>(
    new Map(),
  );
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

  const toggleTurn = useCallback((turn: number, currentlyExpanded: boolean) => {
    setTurnExpansionOverrides((prev) => {
      const next = new Map(prev);
      next.set(turn, !currentlyExpanded);
      return next;
    });
  }, []);

  const toggleSection = useCallback((sectionId: string, currentlyExpanded: boolean) => {
    setSectionExpansionOverrides((prev) => {
      const next = new Map(prev);
      next.set(sectionId, !currentlyExpanded);
      return next;
    });
  }, []);

  const grouped = useMemo(() => {
    const rowGroups = new Map<number, ActivityRow[]>();
    const eventRows: Array<Extract<ActivityRow, { type: "entry" }>> = entries.map(
      (entry, index) => ({
        type: "entry",
        key: `entry:${entry.id}`,
        turn: entry.turn,
        epochMs: parseTimestamp(entry.timestamp, index),
        sequence: index,
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
      const list = rowGroups.get(row.turn) ?? [];
      list.push(row);
      rowGroups.set(row.turn, list);
    }

    if (activeFilter === "all" || activeFilter === "chat") {
      const orderedEventRows = [...eventRows].sort(compareActivityRows);
      chatMessages.forEach((message, index) => {
        const epochMs = parseTimestamp(message.timestamp, Number.MAX_SAFE_INTEGER - index);
        const turn = turnForChatMessage(epochMs, orderedEventRows);
        const list = rowGroups.get(turn) ?? [];
        list.push({
          type: "chat",
          key: `chat:${message.id}`,
          turn,
          epochMs,
          sequence: entries.length + index,
          message,
        });
        rowGroups.set(turn, list);
      });
    }

    // Chunk per turn once per memo run instead of on every render; the turn
    // headers still read the sorted rows for phase summaries and counts.
    const groups = new Map<number, { rows: ActivityRow[]; chunks: EventLogChunk[] }>();
    for (const [turn, rows] of rowGroups) {
      rows.sort(compareActivityRows);
      groups.set(turn, { rows, chunks: buildEventLogChunks(rows) });
    }
    return groups;
  }, [activeFilter, chatMessages, entries]);

  const sortedTurns = useMemo(() => Array.from(grouped.keys()).sort((a, b) => a - b), [grouped]);
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>(
    [entries.length, chatMessages.length, activeFilter, sortedTurns.length],
    { thresholdPx: 48, always: autoScroll === "always" },
  );

  const showReadableCopy = readableCopy || copyText !== undefined;
  const showCopyActions = showReadableCopy || rawCopyText !== undefined;
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
    const entityIds = entry.entityIds ?? [];
    const locatableEntityIds =
      availableEntityIds === undefined
        ? entityIds
        : entityIds.filter((id) => availableEntityIds.includes(id));
    const isHighlighted = locatableEntityIds.some((id) => highlightedEntityIds.includes(id));
    const hasEntityReference = entityIds.length > 0;
    const canLocate = locatableEntityIds.length > 0 && onHighlightEntity !== undefined;
    const locateLabel = isHighlighted ? "Clear board highlight" : "Show card on board";
    const locateTooltipId = `${controlsId}-locate-${entry.id}`;
    const tag = primaryTag(entry);
    const TagIcon = eventTagIcon(tag);
    const metaLabel = `${speakerAccessibleLabel(entry.seatId, seatLabels)}, ${tag}`;
    return (
      <div
        key={entry.id}
        className={cx(
          classes.entry,
          speakerClass(entry.seatId),
          groupedWithPrev && classes.entryGrouped,
          isHighlighted && classes.entryHighlighted,
        )}
        data-primary-tag={tag}
        data-routine={isRoutineEntry(entry) ? "true" : undefined}
        data-interactive={canLocate ? "true" : undefined}
      >
        <span
          className={cx(classes.entryMeta, tagClass(tag))}
          aria-label={metaLabel}
          title={metaLabel}
        >
          <TagIcon size={13} stroke={2.2} aria-hidden="true" />
        </span>
        <p className={classes.message}>{renderMessage ? renderMessage(entry) : entry.message}</p>
        {canLocate ? (
          <span className={classes.entryActions}>
            <span className={classes.locateTooltip}>
              <button
                type="button"
                className={classes.locateButton}
                aria-pressed={isHighlighted}
                aria-label={locateLabel}
                aria-describedby={locateTooltipId}
                onClick={() => onHighlightEntity(isHighlighted ? [] : locatableEntityIds)}
              >
                <IconTarget size={14} stroke={2.2} aria-hidden="true" />
              </button>
              <span id={locateTooltipId} className={classes.locateTooltipContent} role="tooltip">
                {locateLabel}
              </span>
            </span>
          </span>
        ) : hasEntityReference && availableEntityIds !== undefined ? (
          <span className={classes.entryAvailability}>Not currently on board</span>
        ) : null}
      </div>
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

  function renderSectionChildren(
    chunks: readonly EventLogChunk[],
    sectionControl: SectionToggleControl | undefined,
    depth: number,
  ): ReactNode[] {
    return chunks.map((chunk) => {
      if (chunk.type === "chat") return renderChatMessage(chunk.message);
      if (chunk.type === "section") return renderSectionChunk(chunk, sectionControl, depth);
      return (
        <div key={chunk.key} className={classes.entryList}>
          {chunk.entries.map((entry, index) => renderEntry(entry, index, chunk.entries))}
        </div>
      );
    });
  }

  function renderSectionChunk(
    chunk: SectionChunk,
    sectionControl: SectionToggleControl | undefined,
    depth: number,
  ): ReactNode {
    // Collapsed sections drop their rows from the DOM entirely (bounding a
    // long match to one row per group) and surface the projection-stamped
    // summary as the row's text.
    if (sectionControl?.isCollapsed(chunk, depth)) {
      return (
        <div
          key={chunk.key}
          className={classes.sectionGroup}
          data-section-tone={chunk.section.tone}
          data-section-depth={depth}
          data-collapsed="true"
          role="group"
          aria-label={chunk.section.label}
        >
          <div
            className={classes.sectionHeaderButton}
            data-testid="event-log-section"
            data-expanded="false"
          >
            <span className={classes.sectionHeaderText}>
              <span className={classes.sectionEyebrow}>
                {chunk.section.actorSeatId ? (
                  <SectionActorMarker seatId={chunk.section.actorSeatId} seatLabels={seatLabels} />
                ) : null}
                <span className={classes.sectionLabel}>{chunk.section.label}</span>
              </span>
              <span className={classes.sectionSummary}>
                {renderSectionLabel
                  ? renderSectionLabel({
                      ...chunk.section,
                      label: chunk.section.summary ?? chunk.section.label,
                    })
                  : (chunk.section.summary ?? chunk.section.label)}
              </span>
            </span>
            <button
              type="button"
              className={classes.sectionToggleButton}
              aria-label={`Expand ${chunk.section.label}`}
              aria-expanded={false}
              onClick={() => sectionControl.onToggle(chunk)}
            >
              <SectionEntryCount count={chunk.entries.length} />
              <IconChevronRight size={13} stroke={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
      );
    }
    return (
      <div
        key={chunk.key}
        className={classes.sectionGroup}
        data-section-tone={chunk.section.tone}
        data-section-depth={depth}
        role="group"
        aria-label={chunk.section.label}
      >
        {sectionControl ? (
          <div
            className={classes.sectionHeaderButton}
            data-testid="event-log-section"
            data-expanded="true"
          >
            <span className={classes.sectionHeading}>
              {chunk.section.actorSeatId ? (
                <SectionActorMarker seatId={chunk.section.actorSeatId} seatLabels={seatLabels} />
              ) : null}
              <span className={classes.sectionLabel}>
                {renderSectionLabel ? renderSectionLabel(chunk.section) : chunk.section.label}
              </span>
              {chunk.section.meta ? (
                <span className={classes.sectionMeta}>{chunk.section.meta}</span>
              ) : null}
            </span>
            <button
              type="button"
              className={classes.sectionToggleButton}
              aria-label={`Collapse ${chunk.section.label}`}
              aria-expanded={true}
              onClick={() => sectionControl.onToggle(chunk)}
            >
              <SectionEntryCount count={chunk.entries.length} />
              <IconChevronDown size={13} stroke={2.2} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className={classes.sectionHeader}>
            <span className={classes.sectionHeading}>
              {chunk.section.actorSeatId ? (
                <SectionActorMarker seatId={chunk.section.actorSeatId} seatLabels={seatLabels} />
              ) : null}
              <span className={classes.sectionLabel}>
                {renderSectionLabel ? renderSectionLabel(chunk.section) : chunk.section.label}
              </span>
              <SectionEntryCount count={chunk.entries.length} />
              {chunk.section.meta ? (
                <span className={classes.sectionMeta}>{chunk.section.meta}</span>
              ) : null}
            </span>
          </div>
        )}
        <div className={classes.sectionEntries}>
          {renderSectionChildren(chunk.children, sectionControl, depth + 1)}
        </div>
      </div>
    );
  }

  const renderChunks = (
    chunks: readonly EventLogChunk[],
    sectionControl?: SectionToggleControl,
  ) => {
    let previousPhase: string | null = null;
    const rendered: ReactNode[] = [];
    for (const chunk of chunks) {
      if (chunk.type === "chat") {
        rendered.push(renderChatMessage(chunk.message));
        continue;
      }
      const firstEntry = chunk.entries[0];
      if (!firstEntry) continue;
      const phase = normalizePhase(firstEntry.phase);
      if (phase.length > 0 && phase !== previousPhase) {
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
      rendered.push(renderSectionChunk(chunk, sectionControl, 0));
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
      {showHeader ? (
        <div className={classes.header}>
          <h3 className={classes.title}>Event log</h3>
          {controlsContainer ? (
            createPortal(
              <EventLogControls
                controlsId={controlsId}
                controlsOpen={controlsOpen}
                onToggle={() => setControlsOpen((open) => !open)}
              />,
              controlsContainer,
            )
          ) : (
            <EventLogControls
              controlsId={controlsId}
              controlsOpen={controlsOpen}
              onToggle={() => setControlsOpen((open) => !open)}
            />
          )}
        </div>
      ) : controlsContainer ? (
        createPortal(
          <EventLogControls
            controlsId={controlsId}
            controlsOpen={controlsOpen}
            onToggle={() => setControlsOpen((open) => !open)}
          />,
          controlsContainer,
        )
      ) : (
        <div className={classes.header}>
          <EventLogControls
            controlsId={controlsId}
            controlsOpen={controlsOpen}
            onToggle={() => setControlsOpen((open) => !open)}
          />
        </div>
      )}
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
                  onClick={() => {
                    setActiveFilter(tag);
                    setControlsOpen(false);
                  }}
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
                {showReadableCopy ? (
                  <button
                    type="button"
                    className={classes.copyButton}
                    onClick={() =>
                      void copyEventLog(
                        "readable",
                        copyText ?? formatEventLogForClipboard(entries, seatLabels),
                      )
                    }
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
        aria-label="Event log"
        aria-live="polite"
        aria-atomic="false"
      >
        {sortedTurns.length === 0 ? (
          <div className={classes.empty}>
            {emptyEventLogMessage(activeFilter, entries.length, chatMessages.length)}
          </div>
        ) : (
          sortedTurns.map((turn) => {
            const turnData = grouped.get(turn) ?? { rows: [], chunks: [] };
            const latestTurn = sortedTurns[sortedTurns.length - 1];
            const defaultExpanded = turnExpansion === "all" || turn === latestTurn;
            const isExpanded = turnExpansionOverrides.get(turn) ?? defaultExpanded;
            const turnPhaseSummary = phaseSummaryForRows(turnData.rows);
            // The newest section of an expanded turn stays open; older
            // sections collapse behind their summaries (overridable).
            let lastSectionKey: string | null = null;
            for (const chunk of turnData.chunks) {
              if (chunk.type === "section") lastSectionKey = chunk.key;
            }
            const sectionControl: SectionToggleControl | undefined =
              sectionExpansion === "latest"
                ? {
                    isCollapsed: (chunk, depth) => {
                      const defaultExpanded =
                        !chunk.section.collapsedByDefault &&
                        (depth > 0 || chunk.key === lastSectionKey);
                      return !(sectionExpansionOverrides.get(chunk.section.id) ?? defaultExpanded);
                    },
                    onToggle: (chunk) =>
                      toggleSection(
                        chunk.section.id,
                        sectionExpansionOverrides.get(chunk.section.id) ??
                          (!chunk.section.collapsedByDefault &&
                            (chunk.section.parent !== undefined || chunk.key === lastSectionKey)),
                      ),
                  }
                : undefined;
            return (
              <div key={turn} className={classes.turnGroup}>
                <button
                  type="button"
                  className={classes.turnHeader}
                  onClick={() => toggleTurn(turn, isExpanded)}
                  aria-expanded={isExpanded}
                >
                  <span className={classes.turnTitle}>
                    {turn === 0 ? "Messages" : `Turn ${turn}`}
                  </span>
                  {turnPhaseSummary ? (
                    <span className={classes.turnMeta}>{turnPhaseSummary}</span>
                  ) : null}
                  <span className={classes.turnCount}>{activityCountLabel(turnData.rows)}</span>
                </button>
                {isExpanded && renderChunks(turnData.chunks, sectionControl)}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function EventLogControls({
  controlsId,
  controlsOpen,
  onToggle,
}: {
  controlsId: string;
  controlsOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={classes.headerActions}>
      <button
        type="button"
        className={classes.controlsButton}
        aria-label="Event log options"
        aria-expanded={controlsOpen}
        aria-controls={controlsId}
        title="Event log options"
        onClick={onToggle}
      >
        <IconDotsVertical size={15} stroke={2.4} aria-hidden="true" />
      </button>
    </div>
  );
}

function buildEventLogChunks(rows: readonly ActivityRow[]): EventLogChunk[] {
  const chunks: EventLogChunk[] = [];

  const sectionPath = (
    section: NonNullable<SimulatorEventLogEntry["section"]>,
  ): NonNullable<SimulatorEventLogEntry["section"]>[] => {
    const reversed = [section];
    const seen = new Set([section.id]);
    let parent = section.parent;
    while (parent && !seen.has(parent.id)) {
      reversed.push(parent);
      seen.add(parent.id);
      parent = parent.parent;
    }
    return reversed.reverse();
  };

  const appendEntryChunk = (target: EventLogChunk[], entry: SimulatorEventLogEntry): void => {
    const previous = target[target.length - 1];
    if (previous?.type === "entries" && chunkPhase(previous) === normalizePhase(entry.phase)) {
      previous.entries.push(entry);
      return;
    }
    target.push({ type: "entries", key: `entries:${entry.id}`, entries: [entry] });
  };

  const appendSectionEntry = (
    parent: SectionChunk,
    path: readonly NonNullable<SimulatorEventLogEntry["section"]>[],
    entry: SimulatorEventLogEntry,
  ): void => {
    parent.entries.push(entry);
    const childSection = path[0];
    if (!childSection) {
      appendEntryChunk(parent.children, entry);
      return;
    }
    const existing = parent.children.find(
      (candidate): candidate is SectionChunk =>
        candidate.type === "section" && candidate.section.id === childSection.id,
    );
    const child =
      existing ??
      ({
        type: "section" as const,
        key: `${childSection.id}:${entry.id}`,
        section: childSection,
        entries: [],
        children: [],
      } satisfies SectionChunk);
    if (!existing) parent.children.push(child);
    appendSectionEntry(child, path.slice(1), entry);
  };

  for (const row of rows) {
    if (row.type === "chat") {
      chunks.push({ type: "chat", key: row.key, message: row.message });
      continue;
    }
    const entry = row.entry;
    const entryPhase = normalizePhase(entry.phase);
    if (!entry.section) {
      appendEntryChunk(chunks, entry);
      continue;
    }
    const path = sectionPath(entry.section);
    const rootSection = path[0] ?? entry.section;
    const previous = chunks[chunks.length - 1];
    if (
      previous?.type === "section" &&
      previous.section.id === rootSection.id &&
      previous.section.label === rootSection.label &&
      chunkPhase(previous) === entryPhase
    ) {
      appendSectionEntry(previous, path.slice(1), entry);
      continue;
    }
    const root: SectionChunk = {
      type: "section",
      key: `${rootSection.id}:${entry.id}`,
      section: rootSection,
      entries: [],
      children: [],
    };
    appendSectionEntry(root, path.slice(1), entry);
    chunks.push(root);
  }
  return chunks;
}

function chunkPhase(chunk: EventLogChunk): string | null {
  if (chunk.type === "chat") return null;
  const firstEntry = chunk.entries[0];
  return firstEntry ? normalizePhase(firstEntry.phase) : null;
}

function parseTimestamp(value: string, fallback: number): number {
  const epochMs = Date.parse(value);
  return Number.isFinite(epochMs) ? epochMs : fallback;
}

function compareActivityRows(a: ActivityRow, b: ActivityRow): number {
  if (a.epochMs !== b.epochMs) return a.epochMs - b.epochMs;
  if (a.sequence !== b.sequence) return a.sequence - b.sequence;
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

function phaseSummaryForRows(rows: readonly ActivityRow[]): string | null {
  const entries = rows
    .filter((row): row is Extract<ActivityRow, { type: "entry" }> => row.type === "entry")
    .map((row) => row.entry);
  return phaseSummary(entries);
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

function formatEventLogForClipboard(
  entries: readonly SimulatorEventLogEntry[],
  seatLabels?: SeatLabels,
): string {
  if (entries.length === 0) {
    return "No event log entries.";
  }
  return [
    "# Event log",
    entries.map((entry) => formatEventLogEntryForClipboard(entry, seatLabels)).join("\n"),
  ].join("\n");
}

function formatEventLogEntryForClipboard(
  entry: SimulatorEventLogEntry,
  seatLabels?: SeatLabels,
): string {
  const timestamp = entry.timestamp ? ` ${entry.timestamp}` : "";
  const speaker = speakerLabel(entry.seatId, seatLabels);
  const tags = entry.tags.length > 0 ? ` [${entry.tags.join(", ")}]` : "";
  return `Turn ${entry.turn}${timestamp} ${speaker} ${entry.phase}${tags}: ${entry.message}`;
}
