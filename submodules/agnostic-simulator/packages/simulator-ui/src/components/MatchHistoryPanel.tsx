import type { ReactNode } from "react";
import { Text } from "@mantine/core";
import type { SimulatorCardReference, SimulatorMatchHistoryRow } from "@tcg/simulator-contract";

import { cx } from "../class-names";
import { useStickToBottom } from "../hooks/useStickToBottom";
import classes from "./MatchHistoryPanel.module.css";

export interface MatchHistoryRowGroup {
  readonly key: string;
  readonly label: ReactNode;
  readonly variant: "system" | "viewer" | "opponent";
}

export interface MatchHistoryPanelProps {
  rows: readonly SimulatorMatchHistoryRow[];
  turnOwnerLabel: (turn: number, rows: readonly SimulatorMatchHistoryRow[]) => string;
  renderTitle?: (row: SimulatorMatchHistoryRow) => ReactNode;
  renderCardReference?: (card: SimulatorCardReference, row: SimulatorMatchHistoryRow) => ReactNode;
  renderDetail?: (
    detail: NonNullable<SimulatorMatchHistoryRow["details"]>[number],
    row: SimulatorMatchHistoryRow,
  ) => ReactNode;
  /** A continuous reading surface without per-event bubbles. */
  appearance?: "grouped" | "journal";
  renderMetrics?: (
    metrics: NonNullable<SimulatorMatchHistoryRow["metrics"]>,
    row: SimulatorMatchHistoryRow,
  ) => ReactNode;
  metricsPlacement?: "trailing" | "inline";
  /** Viewing seat used to place player-authored rows on opposite sides. */
  viewerSeatId?: string;
  /** Optional consecutive-row grouping. Rows with the same adjacent key share one header. */
  rowGroup?: (row: SimulatorMatchHistoryRow) => MatchHistoryRowGroup;
  /** Optional row tint independent from consecutive-row headings. */
  rowVariant?: (row: SimulatorMatchHistoryRow) => MatchHistoryRowGroup["variant"];
  /** A chronological history can keep every line on one reading edge. */
  rowAlignment?: "by-player" | "left";
  embedded?: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function renderReferencedTitle(
  row: SimulatorMatchHistoryRow,
  renderCardReference?: MatchHistoryPanelProps["renderCardReference"],
): ReactNode {
  if (!renderCardReference || !row.cardRefs?.length) return row.title;
  const byName = new Map<string, SimulatorCardReference[]>();
  for (const card of row.cardRefs) byName.set(card.name, [...(byName.get(card.name) ?? []), card]);
  const names = [...byName.keys()].sort((left, right) => right.length - left.length);
  const matcher = new RegExp(`(${names.map(escapeRegExp).join("|")})`, "g");
  return row.title.split(matcher).map((segment, index) => {
    const card = byName.get(segment)?.shift();
    return card ? (
      <span key={`${row.id}-title-card-${index}`}>{renderCardReference(card, row)}</span>
    ) : (
      segment
    );
  });
}

function metricText(metric: NonNullable<SimulatorMatchHistoryRow["metrics"]>[number]): string {
  switch (metric.kind) {
    case "value":
      return `${metric.label} ${metric.value}`;
    case "change":
      return `${metric.label} ${metric.before} → ${metric.after}`;
    case "comparison":
      return `${metric.leftLabel} ${metric.left} vs ${metric.rightLabel} ${metric.right}`;
  }
}

function defaultMetrics(metrics: NonNullable<SimulatorMatchHistoryRow["metrics"]>) {
  return metrics.map((metric, index) => <span key={index}>{metricText(metric)}</span>);
}

export function MatchHistoryPanel({
  rows,
  turnOwnerLabel,
  renderTitle,
  renderCardReference,
  renderDetail,
  appearance = "grouped",
  renderMetrics,
  metricsPlacement = "trailing",
  viewerSeatId,
  rowGroup,
  rowVariant,
  rowAlignment = "by-player",
  embedded = false,
}: MatchHistoryPanelProps) {
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>([rows], { always: true });
  const grouped = new Map<number, SimulatorMatchHistoryRow[]>();
  for (const row of rows) {
    const turnRows = grouped.get(row.turn) ?? [];
    turnRows.push(row);
    grouped.set(row.turn, turnRows);
  }

  if (rows.length === 0) {
    return <p className={classes.empty}>Meaningful match actions will appear here.</p>;
  }

  return (
    <div
      className={cx(classes.panel, embedded && classes.embedded)}
      data-appearance={appearance}
      ref={scrollRef}
      onScroll={onScroll}
    >
      <div className={classes.content}>
        {[...grouped].map(([turn, turnRows]) => (
          <section
            key={turn}
            className={classes.turn}
            aria-labelledby={`match-history-turn-${turn}`}
          >
            <h3 id={`match-history-turn-${turn}`} className={classes.turnHeading}>
              <span>Turn {turn}</span>
              <strong>{turnOwnerLabel(turn, turnRows)}</strong>
            </h3>
            <ol className={classes.rows}>
              {turnRows.map((row, rowIndex) => {
                const eventGroup = rowGroup?.(row);
                const variant = eventGroup?.variant ?? rowVariant?.(row);
                const previousGroup =
                  rowIndex > 0 ? rowGroup?.(turnRows[rowIndex - 1]!) : undefined;
                const nextGroup =
                  rowIndex < turnRows.length - 1 ? rowGroup?.(turnRows[rowIndex + 1]!) : undefined;
                const startsGroup = Boolean(eventGroup && eventGroup.key !== previousGroup?.key);
                const endsGroup = Boolean(eventGroup && eventGroup.key !== nextGroup?.key);
                const alignment =
                  rowAlignment === "left"
                    ? "left"
                    : eventGroup ||
                        row.kind === "match-start" ||
                        row.kind === "turn-end" ||
                        row.kind === "outcome" ||
                        !viewerSeatId ||
                        !row.actorSeatId
                      ? "center"
                      : row.actorSeatId === viewerSeatId
                        ? "left"
                        : "right";
                const renderedMetrics = row.metrics?.length
                  ? (renderMetrics?.(row.metrics, row) ?? defaultMetrics(row.metrics))
                  : null;
                return (
                  <li
                    key={row.id}
                    className={classes.row}
                    data-kind={row.kind}
                    data-alignment={eventGroup ? "left" : alignment}
                    data-grouped={eventGroup ? "true" : undefined}
                    data-group-start={eventGroup ? String(startsGroup) : undefined}
                    data-group-end={eventGroup ? String(endsGroup) : undefined}
                    data-group-variant={variant}
                  >
                    {eventGroup && startsGroup ? (
                      <div className={classes.groupHeading}>
                        <Text span inherit>
                          {eventGroup.label}
                        </Text>
                      </div>
                    ) : null}
                    <div className={classes.rowContent}>
                      <span
                        className={cx(
                          classes.titleLine,
                          metricsPlacement === "inline" && classes.titleLineInline,
                        )}
                      >
                        <Text
                          span
                          size="sm"
                          lh={appearance === "journal" ? 1.45 : 1.3}
                          className={classes.title}
                        >
                          {renderTitle
                            ? renderTitle(row)
                            : renderReferencedTitle(row, renderCardReference)}
                        </Text>
                        {metricsPlacement === "inline" && renderedMetrics ? (
                          <span className={classes.metrics}>{renderedMetrics}</span>
                        ) : null}
                      </span>
                      {metricsPlacement === "trailing" && renderedMetrics ? (
                        <span className={classes.metrics}>{renderedMetrics}</span>
                      ) : null}
                      {row.details?.map((detail, index) => (
                        <span className={classes.detail} key={`${row.id}-detail-${index}`}>
                          {renderDetail ? (
                            renderDetail(detail, row)
                          ) : (
                            <>
                              {detail.label ? <b>{detail.label} · </b> : null}
                              {detail.kind === "cards" ? (
                                <>
                                  {detail.lead ? `${detail.lead} ` : null}
                                  {detail.cards.map((card, cardIndex) => (
                                    <span key={`${row.id}-detail-${index}-card-${cardIndex}`}>
                                      {cardIndex > 0
                                        ? cardIndex === detail.cards.length - 1
                                          ? " and "
                                          : ", "
                                        : null}
                                      {renderCardReference
                                        ? renderCardReference(card, row)
                                        : card.name}
                                    </span>
                                  ))}
                                  {detail.amount == null ? null : ` for ${detail.amount}`}
                                  {detail.trail ?? null}
                                </>
                              ) : (
                                detail.text
                              )}
                            </>
                          )}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
