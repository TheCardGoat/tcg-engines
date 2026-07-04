import { useCallback, useMemo, useState } from "react";

import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { useStickToBottom } from "../hooks/useStickToBottom";
import classes from "./EventLogPanel.module.css";

export interface EventLogPanelProps {
  entries: readonly SimulatorEventLogEntry[];
  highlightedEntityIds?: readonly string[];
  onHighlightEntity?: (entityIds: readonly string[]) => void;
  onEntryClick?: (entry: SimulatorEventLogEntry) => void;
  embedded?: boolean;
}

type TagFilter = "all" | "move" | "combat" | "ability" | "system";

const TAG_ORDER: TagFilter[] = ["all", "move", "combat", "ability", "system"];

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

function tagClass(tag: string): string | undefined {
  switch (tag) {
    case "move":
      return classes.tagMove;
    case "combat":
      return classes.tagCombat;
    case "ability":
      return classes.tagAbility;
    case "system":
      return classes.tagSystem;
    default:
      return undefined;
  }
}

export function EventLogPanel({
  entries,
  highlightedEntityIds = [],
  onHighlightEntity,
  onEntryClick,
  embedded = false,
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

  return (
    <section
      className={`${classes.panel} ${embedded ? classes.panelEmbedded : ""}`}
      aria-label="Event log"
      data-testid="event-log"
      data-count={entries.length}
    >
      <div className={classes.header}>
        <h3 className={classes.title}>Event log</h3>
        <span className={classes.count}>{entries.length} entries</span>
      </div>

      <div className={classes.filters}>
        {TAG_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={cx(classes.filter, activeFilter === tag && classes.filterActive)}
            onClick={() => setActiveFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

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
            {entries.length === 0 ? "No events yet." : "No events match the current filter."}
          </div>
        ) : (
          sortedTurns.map((turn) => {
            const turnEntries = grouped.get(turn) ?? [];
            const isExpanded = expandedTurns.has(turn) || expandedTurns.size === 0;
            return (
              <div key={turn} className={classes.turnGroup}>
                <button
                  type="button"
                  className={classes.turnHeader}
                  onClick={() => toggleTurn(turn)}
                  aria-expanded={isExpanded}
                >
                  <span className={classes.turnLine} />
                  <span>Turn {turn}</span>
                  <span className={classes.turnLine} />
                </button>
                {isExpanded &&
                  turnEntries.map((entry, index) => {
                    const prev = turnEntries[index - 1];
                    const groupedWithPrev =
                      prev !== undefined &&
                      speakerClass(prev.seatId) === speakerClass(entry.seatId);
                    const isHighlighted =
                      entry.entityIds &&
                      entry.entityIds.some((id) => highlightedEntityIds.includes(id));
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
                        onClick={() => {
                          if (entry.entityIds) onHighlightEntity?.(entry.entityIds);
                          onEntryClick?.(entry);
                        }}
                      >
                        <span className={classes.speaker}>{speakerLabel(entry.seatId)}</span>
                        <div className={classes.meta}>
                          {entry.tags.map((tag) => (
                            <span key={tag} className={cx(classes.tag, tagClass(tag))}>
                              {tag}
                            </span>
                          ))}
                          <span className={classes.phase}>{entry.phase}</span>
                        </div>
                        <p className={classes.message}>{entry.message}</p>
                        {entry.seatId && <p className={classes.seat}>Player: {entry.seatId}</p>}
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
