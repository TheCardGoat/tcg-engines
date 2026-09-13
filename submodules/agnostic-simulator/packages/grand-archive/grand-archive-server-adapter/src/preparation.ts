import { getGrandArchiveCard, grandArchiveCards } from "@tcg/grand-archive-cards";
import {
  assertGrandArchiveDeckConstruction,
  createGrandArchiveMatchProgram,
} from "@tcg/grand-archive-engine/runtime";
import type { GamePregameAdapter, PregameDeckInput } from "@tcg/shared/game-adapter";

export type GrandArchivePreparationEntry = { canonicalId: string; quantity: number };
export type GrandArchivePreparationSelection = {
  main: GrandArchivePreparationEntry[];
  material: GrandArchivePreparationEntry[];
  sideboard: GrandArchivePreparationEntry[];
  startingChampionId: string;
};
export type GrandArchivePreparationPool = {
  stage: "registered" | "sideboarding";
  registered: GrandArchivePreparationSelection;
  previous: GrandArchivePreparationSelection;
  printings: { canonicalId: string; printingId: string; quantity: number }[];
};
const sections = ["main", "material", "sideboard"] as const;
let program: ReturnType<typeof createGrandArchiveMatchProgram> | undefined;
const getProgram = () => (program ??= createGrandArchiveMatchProgram(grandArchiveCards));
const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === "object" && !Array.isArray(value));
function parseEntries(value: unknown): GrandArchivePreparationEntry[] {
  if (!Array.isArray(value)) throw new Error("Invalid preparation deck section");
  const seen = new Set<string>();
  return value.map((entry: unknown) => {
    if (
      !record(entry) ||
      typeof entry.canonicalId !== "string" ||
      typeof entry.quantity !== "number" ||
      !Number.isSafeInteger(entry.quantity) ||
      entry.quantity < 1 ||
      entry.quantity > 999 ||
      seen.has(entry.canonicalId)
    )
      throw new Error("Invalid preparation card quantity or duplicate identity");
    seen.add(entry.canonicalId);
    return { canonicalId: entry.canonicalId, quantity: entry.quantity };
  });
}
export function parseGrandArchivePreparationSelection(
  value: unknown,
): GrandArchivePreparationSelection {
  if (!record(value) || typeof value.startingChampionId !== "string")
    throw new Error("Invalid preparation selection");
  return {
    main: parseEntries(value.main),
    material: parseEntries(value.material),
    sideboard: parseEntries(value.sideboard),
    startingChampionId: value.startingChampionId,
  };
}
export function parseGrandArchivePreparationPool(value: unknown): GrandArchivePreparationPool {
  if (
    !record(value) ||
    (value.stage !== "registered" && value.stage !== "sideboarding") ||
    !Array.isArray(value.printings)
  )
    throw new Error("Invalid preparation pool");
  const printings = value.printings.map((item: unknown) => {
    if (
      !record(item) ||
      typeof item.canonicalId !== "string" ||
      typeof item.printingId !== "string" ||
      typeof item.quantity !== "number" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1
    )
      throw new Error("Invalid preparation printing");
    return { canonicalId: item.canonicalId, printingId: item.printingId, quantity: item.quantity };
  });
  const registered = parseGrandArchivePreparationSelection(value.registered);
  for (const entry of sections.flatMap((section) => registered[section])) {
    if (!getGrandArchiveCard(entry.canonicalId))
      throw new Error(`Unknown Grand Archive card: ${entry.canonicalId}`);
  }
  return {
    stage: value.stage,
    registered,
    previous: parseGrandArchivePreparationSelection(value.previous),
    printings,
  };
}
function aggregate(entries: readonly GrandArchivePreparationEntry[]) {
  const counts = new Map<string, number>();
  for (const entry of entries)
    counts.set(entry.canonicalId, (counts.get(entry.canonicalId) ?? 0) + entry.quantity);
  return [...counts]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([canonicalId, quantity]) => ({ canonicalId, quantity }));
}
function equalEntries(
  a: readonly GrandArchivePreparationEntry[],
  b: readonly GrandArchivePreparationEntry[],
) {
  return JSON.stringify(aggregate(a)) === JSON.stringify(aggregate(b));
}
export function grandArchivePreparationCards(pool: GrandArchivePreparationPool) {
  return aggregate(sections.flatMap((section) => pool.registered[section])).map((entry) => {
    const card = getGrandArchiveCard(entry.canonicalId);
    if (!card) throw new Error(`Unknown Grand Archive card: ${entry.canonicalId}`);
    const printing = pool.printings.find((item) => item.canonicalId === card.canonicalId);
    return {
      ...entry,
      name: card.name,
      imageUrl:
        card.printings.find((item) => item.id === printing?.printingId)?.imageUrl ??
        card.printings[0]?.imageUrl ??
        null,
      material: card.types.includes("CHAMPION") || card.types.includes("REGALIA"),
      spirit: card.types.includes("CHAMPION") && card.level === 0,
    };
  });
}
export function validateGrandArchivePreparation(
  pool: GrandArchivePreparationPool,
  selection: GrandArchivePreparationSelection,
) {
  const issues: { code: string; message: string }[] = [];
  if (
    !equalEntries(
      sections.flatMap((section) => pool.registered[section]),
      sections.flatMap((section) => selection[section]),
    )
  )
    issues.push({
      code: "registered-pool",
      message: "Keep every registered card in your main deck, material deck, or sideboard.",
    });
  if (
    pool.stage === "registered" &&
    sections.some((section) => !equalEntries(pool.registered[section], selection[section]))
  )
    issues.push({
      code: "game-one",
      message:
        "Game one must use your registered deck sections. Sideboarding is available between games.",
    });
  try {
    const champion = getGrandArchiveCard(selection.startingChampionId);
    if (
      !champion ||
      !champion.types.includes("CHAMPION") ||
      champion.level !== 0 ||
      !selection.material.some((entry) => entry.canonicalId === champion.canonicalId)
    )
      throw new Error("Choose a level-0 Spirit Champion from your material deck.");
    const entries = (section: (typeof sections)[number]) =>
      selection[section].map(({ canonicalId, quantity }) => ({
        definitionId: canonicalId,
        count: quantity,
      }));
    assertGrandArchiveDeckConstruction(getProgram(), "standard", {
      id: "preparation",
      name: "preparation",
      mainDeck: entries("main"),
      materialDeck: entries("material"),
      sideboard: entries("sideboard"),
      startingChampionDefinitionId: selection.startingChampionId,
    });
  } catch (error) {
    issues.push({
      code: "deck-construction",
      message: error instanceof Error ? error.message : "Invalid deck construction",
    });
  }
  return { valid: issues.length === 0, issues };
}
export function createGrandArchivePreparationPool(
  input: PregameDeckInput,
): GrandArchivePreparationPool {
  if (input.formatId !== "standard")
    throw new Error("Grand Archive preparation supports Standard matches.");
  const selection: GrandArchivePreparationSelection = {
    main: [],
    material: [],
    sideboard: [],
    startingChampionId: "",
  };
  const printings: GrandArchivePreparationPool["printings"] = [];
  const hasSections = [...input.mainDeck, ...input.inventory].some((entry) =>
    Boolean(entry.sectionId),
  );
  for (const [cards, fallback] of [
    [input.mainDeck, "main"],
    [input.inventory, "sideboard"],
  ] as const) {
    for (const entry of cards) {
      const card = getGrandArchiveCard(entry.canonicalId ?? entry.cardId);
      if (!card || !Number.isSafeInteger(entry.quantity) || entry.quantity < 1)
        throw new Error("Invalid registered Grand Archive card");
      const inferredSection =
        !hasSections &&
        fallback === "main" &&
        (card.types.includes("CHAMPION") || card.types.includes("REGALIA"))
          ? "material"
          : fallback;
      const section =
        entry.sectionId === "side" ? "sideboard" : (entry.sectionId ?? inferredSection);
      if (section !== "main" && section !== "material" && section !== "sideboard")
        throw new Error(`Invalid Grand Archive section: ${section}`);
      selection[section].push({ canonicalId: card.canonicalId, quantity: entry.quantity });
      const printingId =
        entry.printingId ??
        (card.printings.some((printing) => printing.id === entry.cardId)
          ? entry.cardId
          : card.printings[0]?.id);
      if (!printingId || !card.printings.some((printing) => printing.id === printingId))
        throw new Error("Invalid registered Grand Archive printing");
      printings.push({ canonicalId: card.canonicalId, printingId, quantity: entry.quantity });
    }
  }
  for (const section of sections) selection[section] = aggregate(selection[section]);
  selection.startingChampionId =
    selection.material.find((entry) => {
      const card = getGrandArchiveCard(entry.canonicalId);
      return card?.types.includes("CHAMPION") && card.level === 0;
    })?.canonicalId ?? "";
  const pool: GrandArchivePreparationPool = {
    stage: "registered",
    registered: selection,
    previous: selection,
    printings,
  };
  const validation = validateGrandArchivePreparation(pool, selection);
  if (!validation.valid) throw new Error(validation.issues.map((issue) => issue.message).join(" "));
  return pool;
}

export const grandArchivePregameAdapter: GamePregameAdapter = {
  kind: "grand-archive",
  deadlineMs: 180_000,
  defaultFormatId: "standard",
  turnOrderPolicy: "random-then-loser-choice",
  createPool: createGrandArchivePreparationPool,
  parsePool: parseGrandArchivePreparationPool,
  parseSelection: parseGrandArchivePreparationSelection,
  projectPoolForPlayer: (pool) => parseGrandArchivePreparationPool(pool),
  createDefaultSelection: (pool) => parseGrandArchivePreparationPool(pool).previous,
  nextGamePool: (pool, selection) => ({
    ...parseGrandArchivePreparationPool(pool),
    stage: "sideboarding",
    previous: parseGrandArchivePreparationSelection(selection),
  }),
  validateSelection: (pool, selection) =>
    validateGrandArchivePreparation(
      parseGrandArchivePreparationPool(pool),
      parseGrandArchivePreparationSelection(selection),
    ),
  reconcileSelection: (poolValue, selectionValue) => {
    const pool = parseGrandArchivePreparationPool(poolValue);
    const selection = parseGrandArchivePreparationSelection(selectionValue);
    const validation = validateGrandArchivePreparation(pool, selection);
    const fallback = pool.previous;
    return validation.valid
      ? { selection, validation }
      : { selection: fallback, validation: validateGrandArchivePreparation(pool, fallback) };
  },
  materializeDeck: (poolValue, selectionValue) => {
    const pool = parseGrandArchivePreparationPool(poolValue);
    const selection = parseGrandArchivePreparationSelection(selectionValue);
    const validation = validateGrandArchivePreparation(pool, selection);
    if (!validation.valid)
      throw new Error(validation.issues.map((issue) => issue.message).join(" "));
    const printings = pool.printings.map((entry) => ({ ...entry }));
    return sections.flatMap((sectionId) => {
      // The game-owned starting-champion section materializes an explicit declaration.
      const cards = [...selection[sectionId]].sort(
        (a, b) =>
          Number(b.canonicalId === selection.startingChampionId) -
          Number(a.canonicalId === selection.startingChampionId),
      );
      return cards.flatMap((entry) => {
        let remaining = entry.quantity;
        const result: { cardId: string; qty: number; sectionId: string; printingId: string }[] = [];
        for (const allocation of printings) {
          if (allocation.canonicalId !== entry.canonicalId) continue;
          const qty = Math.min(remaining, allocation.quantity);
          if (qty)
            result.push({
              cardId: entry.canonicalId,
              qty,
              sectionId:
                sectionId === "material" && entry.canonicalId === selection.startingChampionId
                  ? "starting-champion"
                  : sectionId,
              printingId: allocation.printingId,
            });
          remaining -= qty;
          allocation.quantity -= qty;
          if (!remaining) break;
        }
        if (remaining) throw new Error("Incomplete registered printing allocation");
        return result;
      });
    });
  },
};
