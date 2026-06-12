import { useCallback, useMemo, useState } from "react";

import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { useStickToBottom } from "../hooks/useStickToBottom";

export interface EventLogPanelProps {
  entries: SimulatorEventLogEntry[];
  highlightedEntityIds?: string[];
  onHighlightEntity?: (entityIds: string[]) => void;
  onEntryClick?: (entry: SimulatorEventLogEntry) => void;
}

type TagFilter = "all" | "move" | "combat" | "ability" | "system";

const TAG_COLORS: Record<string, string> = {
  move: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  combat: "bg-red-500/20 text-red-300 border-red-500/30",
  ability: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  system: "bg-gray-500/20 text-gray-300 border-gray-500/30",
};

export function EventLogPanel({
  entries,
  highlightedEntityIds = [],
  onHighlightEntity,
  onEntryClick,
}: EventLogPanelProps) {
  const [activeFilter, setActiveFilter] = useState<TagFilter>("all");
  const [expandedTurns, setExpandedTurns] = useState<Set<number>>(new Set());

  const toggleTurn = useCallback((turn: number) => {
    setExpandedTurns((prev) => {
      const next = new Set(prev);
      if (next.has(turn)) next.delete(turn);
      else next.add(turn);
      return next;
    });
  }, []);

  const grouped = useMemo(() => {
    const groups = new Map<number, SimulatorEventLogEntry[]>();
    for (const entry of entries) {
      if (activeFilter !== "all" && !entry.tags.includes(activeFilter)) continue;
      const list = groups.get(entry.turn) ?? [];
      list.push(entry);
      groups.set(entry.turn, list);
    }
    return groups;
  }, [entries, activeFilter]);

  const sortedTurns = useMemo(() => Array.from(grouped.keys()).sort((a, b) => a - b), [grouped]);
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>(
    [entries.length, activeFilter, sortedTurns.length],
    { thresholdPx: 48 },
  );

  const filterChipClass = (isActive: boolean) =>
    cx(
      "inline-flex min-h-7 items-center rounded-full border px-2.5 py-1 text-[11px] font-extrabold leading-none transition-colors",
      isActive
        ? "border-[var(--game-accent)] bg-[var(--game-accent)]/20 text-[var(--game-accent)]"
        : "border-[var(--board-border)] bg-[var(--board-surface)] text-[var(--board-muted)] hover:text-[var(--board-text)]",
    );

  const turnHeaderClass =
    "sticky top-0 z-10 grid w-full grid-cols-[1fr_auto] items-center gap-2 border-b border-[var(--board-border)] bg-[var(--board-surface)] px-3 py-2 text-left";

  const entryClass = (_entry: SimulatorEventLogEntry, isHighlighted: boolean) =>
    cx(
      "event-log-entry grid w-full justify-items-start gap-1 px-3 py-2 text-left transition-colors [content-visibility:auto] [contain-intrinsic-size:0_48px]",
      isHighlighted && "bg-[var(--game-accent)]/10",
    );

  return (
    <section
      className="event-log-panel grid min-h-0 grid-rows-[auto_1fr] overflow-hidden rounded-lg border border-[var(--board-border)] bg-[var(--board-surface-soft)]"
      aria-label="Event log"
    >
      <div className="event-log-header grid gap-2 border-b border-[var(--board-border)] p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-normal text-[var(--board-text)]">
            Event Log
          </h3>
          <span className="text-[11px] font-bold text-[var(--board-muted)]">
            {entries.length} entries
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["all", "move", "combat", "ability", "system"] as TagFilter[]).map((tag) => (
            <button
              key={tag}
              className={filterChipClass(activeFilter === tag)}
              onClick={() => setActiveFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className="event-log-entries min-h-0 overflow-y-auto"
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {sortedTurns.length === 0 ? (
          <div className="grid place-items-center py-8">
            <p className="text-xs font-bold text-[var(--board-muted)]">
              No events match the current filter.
            </p>
          </div>
        ) : (
          sortedTurns.map((turn) => {
            const turnEntries = grouped.get(turn) ?? [];
            const isExpanded = expandedTurns.has(turn) || expandedTurns.size === 0;
            return (
              <div key={turn} className="event-log-turn-group grid w-full">
                <button
                  className={turnHeaderClass}
                  onClick={() => toggleTurn(turn)}
                  aria-expanded={isExpanded}
                >
                  <span className="text-[11px] font-black uppercase text-[var(--board-text)]">
                    Turn {turn}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--board-muted)]">
                    {turnEntries.length} events
                  </span>
                </button>
                {isExpanded &&
                  turnEntries.map((entry) => {
                    const isHighlighted =
                      entry.entityIds &&
                      entry.entityIds.some((id) => highlightedEntityIds.includes(id));
                    return (
                      <button
                        key={entry.id}
                        className={entryClass(entry, !!isHighlighted)}
                        onClick={() => {
                          if (entry.entityIds) onHighlightEntity?.(entry.entityIds);
                          onEntryClick?.(entry);
                        }}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className={cx(
                                "inline-flex min-h-5 items-center rounded-full border px-1.5 py-0.5 text-[10px] font-extrabold leading-none",
                                TAG_COLORS[tag] ?? TAG_COLORS.system,
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="text-[10px] font-bold text-[var(--board-muted)]">
                            {entry.phase}
                          </span>
                        </div>
                        <p className="text-left text-xs leading-snug text-[var(--board-text)]">
                          {entry.message}
                        </p>
                        {entry.seatId && (
                          <p className="text-left text-[10px] font-bold text-[var(--board-muted)]">
                            Player: {entry.seatId}
                          </p>
                        )}
                      </button>
                    );
                  })}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
