import type { ComponentProps, ReactNode } from "react";
import { MatchHistoryPanel } from "@tcg/simulator-ui";
import type { SimulatorMatchHistoryRow } from "@tcg/simulator-contract";

import { FabOfficialIcon } from "./FabIconography";
import type { FabOfficialIconId } from "./fabIcons";

type Props = Omit<
  ComponentProps<typeof MatchHistoryPanel>,
  "renderTitle" | "renderMetrics" | "renderDetail" | "appearance" | "metricsPlacement"
>;

function statIcon(label: string): FabOfficialIconId | undefined {
  switch (label.toLowerCase()) {
    case "attack":
    case "power":
      return "power";
    case "defense":
    case "defence":
      return "defense";
    case "resource":
    case "resources":
    case "resource point":
    case "resource points":
      return "resource";
    case "life":
      return "life";
    case "chi":
      return "chi";
    default:
      return undefined;
  }
}

function Stat({ label, value }: { label: string; value: string | number }) {
  const icon = statIcon(label);
  return (
    <span className="fab-history-metric" title={`${value} ${label}`}>
      {!icon ? <span>{label}</span> : null}
      <strong>{value}</strong>
      {icon ? <FabOfficialIcon id={icon} size={14} alt={label} /> : null}
    </span>
  );
}

/** Only quantified stat terms are substituted; card names and ordinary prose are untouched. */
export function renderFabHistoryText(text: string): ReactNode {
  const result: ReactNode[] = [];
  const matcher = /([+−-]?\d+)\s+(power|defen[cs]e|resources?(?: points?)?|life|chi)\b/gi;
  let offset = 0;
  for (const match of text.matchAll(matcher)) {
    result.push(text.slice(offset, match.index));
    result.push(<Stat key={match.index} label={match[2]!} value={match[1]!} />);
    offset = match.index + match[0].length;
  }
  result.push(text.slice(offset));
  return result;
}

function groupPitchedDetails(row: SimulatorMatchHistoryRow): SimulatorMatchHistoryRow {
  if (!row.details) return row;
  const details: NonNullable<SimulatorMatchHistoryRow["details"]>[number][] = [];
  for (const detail of row.details) {
    const previous = details.at(-1);
    if (
      detail.kind === "cards" &&
      detail.lead === "Pitched" &&
      !detail.trail &&
      previous?.kind === "cards" &&
      previous.lead === "Pitched" &&
      !previous.trail &&
      (!detail.label || detail.label === previous.label)
    ) {
      details[details.length - 1] = {
        ...previous,
        cards: [...previous.cards, ...detail.cards],
        amount: undefined,
      };
    } else {
      details.push(detail);
    }
  }
  return { ...row, details };
}

export function FabMatchHistoryPanel({ renderCardReference, rows, ...props }: Props) {
  const renderCard = (
    card: NonNullable<SimulatorMatchHistoryRow["cardRefs"]>[number],
    row: SimulatorMatchHistoryRow,
  ) => renderCardReference?.(card, row) ?? card.name;

  return (
    <MatchHistoryPanel
      {...props}
      rows={rows.map(groupPitchedDetails)}
      appearance="journal"
      metricsPlacement="inline"
      renderCardReference={renderCardReference}
      renderTitle={(row) => {
        const references = new Map<string, NonNullable<SimulatorMatchHistoryRow["cardRefs"]>>();
        for (const card of row.cardRefs ?? []) {
          references.set(card.name, [...(references.get(card.name) ?? []), card]);
        }
        const names = [...references.keys()].sort((a, b) => b.length - a.length);
        if (!names.length) return renderFabHistoryText(row.title);
        const matcher = new RegExp(
          `(${names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
          "g",
        );
        return row.title.split(matcher).map((segment, index) => {
          const reference = references.get(segment)?.shift();
          return (
            <span key={index}>
              {reference ? renderCard(reference, row) : renderFabHistoryText(segment)}
            </span>
          );
        });
      }}
      renderMetrics={(metrics) =>
        metrics.map((metric, index) => {
          switch (metric.kind) {
            case "comparison":
              return (
                <span className="fab-history-metric" key={index}>
                  <Stat label={metric.leftLabel} value={metric.left} />
                  <span className="fab-history-comparison">vs</span>
                  <Stat label={metric.rightLabel} value={metric.right} />
                </span>
              );
            case "change":
              return (
                <Stat
                  key={index}
                  label={metric.label}
                  value={`${metric.before} → ${metric.after}`}
                />
              );
            case "value":
              return <Stat key={index} label={metric.label} value={metric.value} />;
          }
        })
      }
      renderDetail={(detail, row) => (
        <>
          {detail.label ? <b>{detail.label} · </b> : null}
          {detail.kind === "text" ? (
            renderFabHistoryText(detail.text)
          ) : (
            <>
              {detail.lead ? `${detail.lead} ` : null}
              {detail.cards.map((card, index) => (
                <span key={index}>
                  {index > 0
                    ? detail.lead !== "Pitched" && index === detail.cards.length - 1
                      ? " and "
                      : ", "
                    : null}
                  {renderCard(card, row)}
                </span>
              ))}
              {detail.amount == null || detail.lead === "Pitched" ? null : (
                <>
                  {" for "}
                  {detail.amount}
                </>
              )}
              {detail.trail ? renderFabHistoryText(detail.trail) : null}
            </>
          )}
        </>
      )}
    />
  );
}
