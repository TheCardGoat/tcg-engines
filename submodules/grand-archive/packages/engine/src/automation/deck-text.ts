import type { GrandArchiveDeckEntry } from "../procedures/game-flow/initialize.ts";
import type {
  GrandArchiveExecutableCard,
  GrandArchiveMatchProgram,
} from "../kernel/match-program.ts";

export interface ParsedGrandArchiveDeckTextLine {
  readonly count: number;
  readonly identifier: string;
}

export interface GrandArchiveTextDeckInput {
  readonly mainDeck: string;
  readonly materialDeck: string;
  /** Exact canonical id, slug, or unambiguous default-face printed name. */
  readonly startingChampion: string;
}

export interface ResolvedGrandArchiveTextDeck {
  readonly mainDeck: readonly GrandArchiveDeckEntry[];
  readonly materialDeck: readonly GrandArchiveDeckEntry[];
  readonly startingChampionDefinitionId: string;
}

function defaultFace(card: GrandArchiveExecutableCard) {
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

export function parseGrandArchiveDeckTextLine(line: string): ParsedGrandArchiveDeckTextLine | null {
  const trimmed = line.trim();
  if (trimmed.length === 0 || trimmed.startsWith("#")) return null;
  const match = /^(\d+)x\s+(.+)$/.exec(trimmed);
  if (!match) throw new Error(`Invalid Grand Archive deck line: ${trimmed}`);
  const count = Number(match[1]);
  const identifier = match[2]?.trim() ?? "";
  if (!Number.isSafeInteger(count) || count < 1 || identifier.length === 0) {
    throw new Error(`Invalid Grand Archive deck line: ${trimmed}`);
  }
  return { count, identifier };
}

/** Resolves one exact Index identity without silently selecting an ambiguous name. */
export function resolveGrandArchiveCardIdentifier(
  program: GrandArchiveMatchProgram,
  identifier: string,
): GrandArchiveExecutableCard {
  const byCanonicalId = program.cardsById[identifier];
  if (byCanonicalId) return byCanonicalId;
  const candidates = Object.values(program.cardsById).filter(
    (card) => card.slug === identifier || defaultFace(card).name === identifier,
  );
  if (candidates.length === 0) {
    throw new Error(`Grand Archive catalog has no card identified by “${identifier}”`);
  }
  if (candidates.length > 1) {
    throw new Error(
      `Grand Archive card identifier “${identifier}” is ambiguous; use one of: ${candidates
        .map((card) => card.canonicalId)
        .sort()
        .join(", ")}`,
    );
  }
  return candidates[0]!;
}

function resolveDeckSection(
  program: GrandArchiveMatchProgram,
  text: string,
): readonly GrandArchiveDeckEntry[] {
  const counts = new Map<string, number>();
  for (const line of text.split("\n")) {
    const parsed = parseGrandArchiveDeckTextLine(line);
    if (!parsed) continue;
    const card = resolveGrandArchiveCardIdentifier(program, parsed.identifier);
    counts.set(card.canonicalId, (counts.get(card.canonicalId) ?? 0) + parsed.count);
  }
  return [...counts]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([definitionId, count]) => ({ definitionId, count }));
}

/** Resolves text only; authoritative format legality remains in match initialization. */
export function resolveGrandArchiveTextDeck(
  program: GrandArchiveMatchProgram,
  input: GrandArchiveTextDeckInput,
): ResolvedGrandArchiveTextDeck {
  return {
    mainDeck: resolveDeckSection(program, input.mainDeck),
    materialDeck: resolveDeckSection(program, input.materialDeck),
    startingChampionDefinitionId: resolveGrandArchiveCardIdentifier(program, input.startingChampion)
      .canonicalId,
  };
}
