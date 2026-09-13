import * as gundamCards from "@tcg/gundam-cards";
import { getGundamPrintingInfo } from "@tcg/gundam-cards";
import type { Card } from "@tcg/gundam-types";
import type { DeckDocument, DeckDocumentEntryV1 } from "@tcg/game-page-contract/deck-document";

import {
  decodeGundamDeckDocumentText,
  encodeGundamDeckDocumentText,
  type GundamDeckTextCodecResolver,
  type GundamDeckTextDecodeResult,
  type GundamDeckTextEncodeResult,
  type GundamDeckTextIdentityDiagnostic,
} from "./gundam-deck-text-codec.js";

export type {
  GundamDeckTextDecodeResult,
  GundamDeckTextDiagnostic,
  GundamDeckTextEncodeDiagnostic,
  GundamDeckTextEncodeResult,
} from "./gundam-deck-text-codec.js";

const cardsByCanonicalId: ReadonlyMap<string, Card> = (() => {
  const result = new Map<string, Card>();
  for (const value of Object.values(gundamCards)) {
    if (isCard(value) && !result.has(value.canonicalId)) {
      result.set(value.canonicalId, value);
    }
  }
  return result;
})();

const authoritativeResolver: GundamDeckTextCodecResolver = {
  displayNameFor(canonicalId) {
    const card = cardsByCanonicalId.get(canonicalId);
    return card?.displayName || card?.name;
  },
  diagnoseEntry(entry, line) {
    return diagnoseAuthoritativeIdentity(entry, line);
  },
};

/**
 * Human-readable Gundam deck list backed by authoritative card identity.
 */
export function encodeGundamDeckDocumentToText(document: DeckDocument): GundamDeckTextEncodeResult {
  return encodeGundamDeckDocumentText(document, authoritativeResolver);
}

/**
 * Decodes the shared text syntax and retains unresolved identities so callers
 * can offer recovery instead of losing user input.
 */
export function decodeGundamDeckDocumentFromText(text: string): GundamDeckTextDecodeResult {
  return decodeGundamDeckDocumentText(text, authoritativeResolver);
}

function diagnoseAuthoritativeIdentity(
  entry: Readonly<DeckDocumentEntryV1>,
  line: number,
): GundamDeckTextIdentityDiagnostic[] {
  const diagnostics: GundamDeckTextIdentityDiagnostic[] = [];
  if (!cardsByCanonicalId.has(entry.canonicalId)) {
    diagnostics.push({
      kind: "unresolved-card",
      line,
      canonicalId: entry.canonicalId,
      ...(entry.printingId ? { printingId: entry.printingId } : {}),
      message: `Unknown Gundam card ${entry.canonicalId}.`,
    });
  }
  if (!entry.printingId) return diagnostics;

  const printing = getGundamPrintingInfo(entry.printingId);
  if (!printing) {
    diagnostics.push({
      kind: "unresolved-printing",
      line,
      canonicalId: entry.canonicalId,
      printingId: entry.printingId,
      message: `Unknown Gundam printing ${entry.printingId}.`,
    });
  } else if (printing.canonicalId !== entry.canonicalId) {
    diagnostics.push({
      kind: "printing-mismatch",
      line,
      canonicalId: entry.canonicalId,
      printingId: entry.printingId,
      message: `Printing ${entry.printingId} belongs to ${printing.canonicalId}, not ${entry.canonicalId}.`,
    });
  }
  return diagnostics;
}

function isCard(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    "canonicalId" in value &&
    typeof (value as { canonicalId: unknown }).canonicalId === "string" &&
    "name" in value &&
    typeof (value as { name: unknown }).name === "string"
  );
}
