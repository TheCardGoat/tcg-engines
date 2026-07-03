import type { Condition } from "@tcg/op-types";

export function parseReplacementEvent(text: string): "ko" | "removed" | "rested" {
  const lower = text.toLowerCase();
  if (lower.startsWith("k.o")) return "ko";
  if (lower.startsWith("removed")) return "removed";
  return "rested";
}

export function parseReplacementSource(
  text?: string,
): "opponentEffect" | "opponentCharacterEffect" | "battle" | "effect" | undefined {
  if (!text) return undefined;
  const lower = text.trim().toLowerCase();
  if (/by\s+your\s+opponent's\s+character's\s+effect/.test(lower)) return "opponentCharacterEffect";
  if (/by\s+your\s+opponent's\s+effect/.test(lower)) return "opponentEffect";
  if (/in\s+battle/.test(lower)) return "battle";
  if (/by\s+an?\s+effect/.test(lower)) return "effect";
  return undefined;
}

export function parseReplacementCondition(text: string): Condition | null {
  const t = text.trim();
  let m: RegExpExecArray | null;

  // Compound replacement (ko or removed): this Character would be K.O.'d or would be removed
  m =
    /^this\s+Character\s+would\s+be\s+K\.O\.\u2019?'?d\s+or\s+would\s+be\s+removed\s+from\s+the\s+field(?:\s+(.+))?$/i.exec(
      t,
    );
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "replacement", event: "ko", targetSelf: true },
        {
          condition: "replacement",
          event: "removed",
          targetSelf: true,
          ...(source && { source }),
        },
      ],
    };
  }

  // Compound replacement (removed or ko): this Character would be removed ... or K.O.'d
  m =
    /^this\s+Character\s+would\s+be\s+removed\s+from\s+the\s+field(?:\s+by\s+your\s+opponent's\s+effect)?\s+or\s+K\.O\.\u2019?'?d$/i.exec(
      t,
    );
  if (m) {
    return {
      condition: "compound",
      operator: "or",
      conditions: [
        { condition: "replacement", event: "removed", targetSelf: true, source: "opponentEffect" },
        { condition: "replacement", event: "ko", targetSelf: true },
      ],
    };
  }

  // Replacement self ko: this Character would be K.O.'d [by ...]
  m = /^this\s+Character\s+would\s+be\s+K\.O\.\u2019?'?d(?:\s+(.+))?$/i.exec(t);
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "replacement",
      event: "ko",
      targetSelf: true,
      ...(source && { source }),
    };
  }

  // Replacement self removed: this Character would be removed from the field [by ...]
  m = /^this\s+Character\s+would\s+be\s+removed\s+from\s+the\s+field(?:\s+(.+))?$/i.exec(t);
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "replacement",
      event: "removed",
      targetSelf: true,
      ...(source && { source }),
    };
  }

  // Replacement self rested: this Character would be rested [by ...]
  m = /^this\s+Character\s+would\s+be\s+rested(?:\s+(.+))?$/i.exec(t);
  if (m) {
    const source = parseReplacementSource(m[1]);
    return {
      condition: "replacement",
      event: "rested",
      targetSelf: true,
      ...(source && { source }),
    };
  }

  // Replacement self leave: this Character would leave the field
  m = /^this\s+Character\s+would\s+leave\s+the\s+field$/i.exec(t);
  if (m) return { condition: "replacement", event: "leave", targetSelf: true };

  return null;
}

/**
 * Non-self replacement conditions like "your rested Character would be K.O.'d".
 * Separated from parseSingleCondition because the greedy `.+` regex can
 * incorrectly match compound condition texts.
 */
export function parseNonSelfReplacementCondition(text: string): Condition | null {
  const t = text.trim();
  let m: RegExpExecArray | null;

  // your ... would be K.O.'d/removed/rested [by ...]
  m =
    /^your\s+.+\s+would\s+be\s+(K\.O\.\u2019?'?d|removed\s+from\s+the\s+field|rested)(?:\s+(.+))?$/i.exec(
      t,
    );
  if (m) {
    const event = parseReplacementEvent(m[1]!);
    const source = parseReplacementSource(m[2]);
    return {
      condition: "replacement",
      event,
      targetSelf: false,
      ...(source && { source }),
    };
  }

  // any of your Characters would be K.O.'d/removed [by ...]
  m =
    /^any\s+of\s+your\s+Characters?\s+would\s+be\s+(K\.O\.\u2019?'?d|removed\s+from\s+the\s+field|rested)(?:\s+(.+))?$/i.exec(
      t,
    );
  if (m) {
    const event = parseReplacementEvent(m[1]!);
    const source = parseReplacementSource(m[2]);
    return {
      condition: "replacement",
      event,
      targetSelf: false,
      ...(source && { source }),
    };
  }

  return null;
}
