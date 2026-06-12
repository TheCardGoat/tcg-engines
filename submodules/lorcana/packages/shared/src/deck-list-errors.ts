/**
 * Invalid deck list entry types and formatters for logging and user-facing error reporting.
 */

export type DeckListInvalidEntry = {
  kind: "not_found" | "malformed";
  text: string;
  lineNumber?: number;
};

const KIND_LABELS: Record<DeckListInvalidEntry["kind"], string> = {
  not_found: "NOT FOUND",
  malformed: "MALFORMED",
};

/**
 * Format invalid entries as a comment block for logs and user display.
 * Groups by kind (not_found, then malformed), each group: "# LABEL" then "## text" per entry.
 */
export function formatInvalidEntriesComment(invalidEntries: DeckListInvalidEntry[]): string {
  if (invalidEntries.length === 0) return "";

  const byKind: Record<DeckListInvalidEntry["kind"], DeckListInvalidEntry[]> = {
    not_found: [],
    malformed: [],
  };
  for (const e of invalidEntries) {
    byKind[e.kind].push(e);
  }

  const blocks: string[] = [];
  const order: DeckListInvalidEntry["kind"][] = ["not_found", "malformed"];
  for (const kind of order) {
    const entries = byKind[kind];
    if (entries.length === 0) continue;
    blocks.push(`# ${KIND_LABELS[kind]}`);
    for (const e of entries) {
      blocks.push(`## ${e.text}`);
    }
  }
  return blocks.join("\n");
}
