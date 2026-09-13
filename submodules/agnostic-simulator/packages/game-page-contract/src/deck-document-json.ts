import {
  parseDeckDocument,
  type DeckDocument,
  type DeckDocumentDecodeResult,
  type DeckDocumentEncodeResult,
  type DeckDocumentJsonValue,
} from "./deck-document.js";

/** Serialize a validated deck document as canonical, compact JSON text. */
export function encodeDeckDocumentToCanonicalJson(
  document: DeckDocument,
): DeckDocumentEncodeResult {
  const parsed = parseDeckDocument(document);
  if (!parsed.ok) return parsed;

  const canonical =
    parsed.document.schemaVersion === 1
      ? {
          schemaVersion: parsed.document.schemaVersion,
          game: parsed.document.game,
          formatId: parsed.document.formatId,
          ...(parsed.document.name !== undefined ? { name: parsed.document.name } : {}),
          sections: parsed.document.sections.map((section) => ({
            id: section.id,
            ...(section.roles !== undefined ? { roles: section.roles } : {}),
            entries: section.entries.map((entry) => ({
              canonicalId: entry.canonicalId,
              ...(entry.printingId !== undefined ? { printingId: entry.printingId } : {}),
              quantity: entry.quantity,
            })),
          })),
        }
      : {
          schemaVersion: parsed.document.schemaVersion,
          game: parsed.document.game,
          formatId: parsed.document.formatId,
          ...(parsed.document.name !== undefined ? { name: parsed.document.name } : {}),
          sections: Object.fromEntries(
            Object.entries(parsed.document.sections)
              .sort(([left], [right]) => left.localeCompare(right))
              .map(([sectionId, entries]) => [sectionId, entries]),
          ),
          ...(parsed.document.declarations !== undefined
            ? { declarations: canonicalizeJsonValue(parsed.document.declarations) }
            : {}),
          ...(parsed.document.appearance !== undefined
            ? { appearance: canonicalizeJsonValue(parsed.document.appearance) }
            : {}),
        };

  return { ok: true, value: JSON.stringify(canonical) };
}

/** Decode user-supplied JSON text through the shared versioned validator. */
export function decodeDeckDocumentFromJson(text: string): DeckDocumentDecodeResult {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return {
      ok: false,
      diagnostics: [{ kind: "malformed", message: "Deck document is not valid JSON." }],
    };
  }
  return parseDeckDocument(value);
}

function canonicalizeJsonValue(value: DeckDocumentJsonValue): DeckDocumentJsonValue {
  if (Array.isArray(value)) return value.map(canonicalizeJsonValue);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, item]) => [key, canonicalizeJsonValue(item)]),
  );
}
