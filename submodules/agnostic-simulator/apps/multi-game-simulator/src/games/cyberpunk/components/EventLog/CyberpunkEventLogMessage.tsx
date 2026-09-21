import type { ReactNode } from "react";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { CardNameToken } from "../CardDisplay/CardNameToken";

export function scrollCyberpunkEventLogToLatest(container: ParentNode | null): void {
  const scroller = container?.querySelector<HTMLElement>('[role="log"]');
  if (scroller) {
    scroller.scrollTop = scroller.scrollHeight;
  }
}

export function renderCyberpunkEventLogMessage(entry: SimulatorEventLogEntry): ReactNode {
  if (!entry.cardRefs || entry.cardRefs.length === 0) {
    return entry.message;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  const refsByName = new Map<string, NonNullable<SimulatorEventLogEntry["cardRefs"]>>();
  for (const ref of entry.cardRefs) {
    const queue = refsByName.get(ref.name) ?? [];
    queue.push(ref);
    refsByName.set(ref.name, queue);
  }
  const names = [...refsByName.keys()].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`\\b(${names.map(escapeRegExp).join("|")})\\b`, "g");

  for (const match of entry.message.matchAll(pattern)) {
    const matchedName = match[0];
    const index = match.index ?? 0;
    if (index > cursor) {
      parts.push(entry.message.slice(cursor, index));
    }
    const ref = refsByName.get(matchedName)?.shift();
    parts.push(
      <CardNameToken
        key={`${entry.id}:${index}:${matchedName}`}
        cardId={ref?.id}
        fallbackName={matchedName}
      />,
    );
    cursor = index + matchedName.length;
  }

  if (parts.length === 0) {
    return entry.message;
  }
  if (cursor < entry.message.length) {
    parts.push(entry.message.slice(cursor));
  }
  return parts;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
