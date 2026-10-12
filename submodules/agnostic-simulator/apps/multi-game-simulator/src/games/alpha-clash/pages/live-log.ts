export interface LiveLogLine {
  readonly id: number;
  readonly key: string;
  readonly text: string;
}

export function logLinesFromEngineLogs(
  entries: readonly unknown[],
  startId: number,
): { lines: LiveLogLine[]; nextId: number } {
  const lines: LiveLogLine[] = [];
  let nextId = startId;
  for (const [index, entry] of entries.entries()) {
    if (!isRecord(entry)) continue;
    const log = "data" in entry ? entry.data : entry.log;
    if (!isRecord(log) || !Array.isArray(log.public)) continue;
    // The server has already selected viewer-visible messages. Never inspect
    // private appendices in the browser to reconstruct hidden card details.
    const text = log.public
      .map((message) => (isRecord(message) ? message.defaultMessage : undefined))
      .filter((message): message is string => typeof message === "string" && message.length > 0)
      .join(" ");
    if (text)
      lines.push({
        id: ++nextId,
        key: `${entry.stateVersion}:${log.timestamp}:${log.sequence ?? index}`,
        text,
      });
  }
  return { lines, nextId };
}

/** Move acknowledgements and room updates can contain the same log record. */
export function mergeLiveLogLines(
  current: readonly LiveLogLine[],
  incoming: readonly LiveLogLine[],
  limit: number,
): readonly LiveLogLine[] {
  const seen = new Set(current.map((line) => line.key));
  const unique = incoming.filter((line) => {
    if (seen.has(line.key)) return false;
    seen.add(line.key);
    return true;
  });
  return [...unique.reverse(), ...current].slice(0, limit);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
