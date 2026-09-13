import type { ReactNode } from "react";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { CardLink } from "./CardLink.tsx";

interface CardLinkedTextProps {
  readonly message: string;
  readonly cardRefs?: SimulatorEventLogEntry["cardRefs"];
  readonly referenceKey: string;
}

/** Renders every card mention as the same hoverable link used by the match sidebar. */
export function CardLinkedText({
  message,
  cardRefs,
  referenceKey,
}: CardLinkedTextProps): ReactNode {
  if (!cardRefs || cardRefs.length === 0) return message;

  const refsByName = new Map<
    string,
    readonly NonNullable<SimulatorEventLogEntry["cardRefs"]>[number][]
  >();
  for (const ref of cardRefs) {
    refsByName.set(ref.name, [...(refsByName.get(ref.name) ?? []), ref]);
  }

  const pattern = createCardNamePattern(refsByName.keys());
  if (!pattern) return message;
  const occurrencesByName = new Map<string, number>();
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of message.matchAll(pattern)) {
    const name = match[0];
    const index = match.index ?? 0;
    if (index > cursor) parts.push(message.slice(cursor, index));

    const refs = refsByName.get(name) ?? [];
    const occurrence = occurrencesByName.get(name) ?? 0;
    occurrencesByName.set(name, occurrence + 1);
    const ref = refs[Math.min(occurrence, refs.length - 1)];
    parts.push(
      ref?.id ? (
        <CardLink
          key={`${referenceKey}:${index}:${ref.id}`}
          cardId={ref.id}
          name={name}
          hoverOnly
        />
      ) : (
        name
      ),
    );
    cursor = index + name.length;
  }

  if (parts.length === 0) return message;
  if (cursor < message.length) parts.push(message.slice(cursor));
  return parts;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Matches card names as complete tokens, not as a substring of another word. */
export function createCardNamePattern(cardNames: Iterable<string>): RegExp | null {
  const names = [...cardNames].sort((a, b) => b.length - a.length);
  if (names.length === 0) return null;
  return new RegExp(
    names.map((name) => `(?<![A-Za-z])${escapeRegExp(name)}(?![A-Za-z])`).join("|"),
    "g",
  );
}
