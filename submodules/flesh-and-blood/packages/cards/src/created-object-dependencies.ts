import type { FleshAndBloodCard } from "@tcg/flesh-and-blood-types";
import { getFleshAndBloodCard } from "./catalog.ts";

function normalizedCreatedObjectSlug(value: string): string {
  return value
    .replace(/^token:/i, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/** Close authored dependencies transitively. Visiting canonical ids also terminates cycles. */
export function closeCreatedObjectDependencies(
  initial: ReadonlyMap<string, FleshAndBloodCard>,
  structuredCards: ReadonlyMap<string, FleshAndBloodCard>,
): ReadonlyMap<string, FleshAndBloodCard> {
  const cards = new Map(initial);
  const visited = new Set<string>();
  const pending = new Set<string>();
  for (const card of structuredCards.values()) {
    if (card.base.typeBox.types.includes("Token")) {
      pending.add(card.slug);
      if (card.layout.kind === "twin") {
        pending.add(normalizedCreatedObjectSlug(card.layout.front.name));
        pending.add(normalizedCreatedObjectSlug(card.layout.back.name));
      }
    }
  }
  const collect = (card: FleshAndBloodCard) => {
    if (visited.has(card.canonicalId)) return;
    visited.add(card.canonicalId);
    collectCreatedObjectSlugs(card, pending);
  };
  for (const card of initial.values()) collect(card);
  for (const slug of pending) {
    const card = resolveStructuredCreatedObject(slug, structuredCards);
    cards.set(`token:${slug}`, card);
    cards.set(card.canonicalId, card);
    collect(card);
  }
  return cards;
}

/** Collect authored create-object references without interpreting printed text. */
export function collectCreatedObjectSlugs(
  value: unknown,
  found = new Set<string>(),
): ReadonlySet<string> {
  if (Array.isArray(value)) {
    for (const item of value) collectCreatedObjectSlugs(item, found);
    return found;
  }
  if (value === null || typeof value !== "object") return found;

  const record = value as Readonly<Record<string, unknown>>;
  const token = record.token;
  if (typeof token === "string" && token.trim().length > 0) {
    found.add(normalizedCreatedObjectSlug(token));
  }
  if (record.type === "create-card" && typeof record.name === "string" && record.name.trim()) {
    found.add(normalizedCreatedObjectSlug(record.name));
  }
  if (record.type === "choose-and-create-token" && Array.isArray(record.options)) {
    for (const option of record.options) {
      if (typeof option === "string" && option.trim().length > 0) {
        found.add(normalizedCreatedObjectSlug(option));
      }
    }
  }
  for (const nested of Object.values(record)) collectCreatedObjectSlugs(nested, found);
  return found;
}

/** Resolve one authored created-object dependency or fail while closing the match program. */
export function resolveStructuredCreatedObject(
  slug: string,
  structuredCards: ReadonlyMap<string, FleshAndBloodCard>,
): FleshAndBloodCard {
  const exact = getFleshAndBloodCard(slug);
  if (exact) {
    const structured = structuredCards.get(exact.canonicalId);
    if (structured) return structured;
    throw new Error(
      `FAB created-object dependency "${slug}" resolves to catalog card ${exact.canonicalId}, but it has no authored structured definition.`,
    );
  }

  const candidates = [...structuredCards.values()].filter(
    (card) =>
      card.slug?.replace(/-(?:red|yellow|blue)$/i, "") === slug ||
      (card.layout.kind === "twin" &&
        [card.layout.front.name, card.layout.back.name].some(
          (name) => normalizedCreatedObjectSlug(name) === slug,
        )),
  );
  if (candidates.length === 1) return candidates[0]!;
  if (candidates.length === 0) {
    throw new Error(`FAB created-object dependency "${slug}" cannot be resolved.`);
  }
  const identities = candidates
    .map((card) => `${card.slug ?? "<no-slug>"} (${card.canonicalId})`)
    .sort((left, right) => left.localeCompare(right));
  throw new Error(
    `FAB created-object dependency "${slug}" is ambiguous: ${identities.join(", ")}.`,
  );
}
