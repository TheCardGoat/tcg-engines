import type {
  RiftboundCardDefinition,
  RiftboundCatalog,
  RiftboundDeckBoards,
  RiftboundDeckDocument,
  RiftboundDeckEntry,
} from "@tcg/riftbound-types";

export type RiftboundDeckCatalog = Pick<RiftboundCatalog, "cards">;

export const RIFTBOUND_DECK_STRUCTURE = {
  legend: 1,
  mainDeck: 40,
  battlefields: 3,
  runes: 12,
  sideboardAllowedCounts: [0, 8],
  ordinaryCopyMaximum: 3,
} as const;

export type RiftboundDeckBoardName = keyof RiftboundDeckBoards;
export type RiftboundDeckIssueCode =
  | "LEGEND_COUNT"
  | "MAIN_DECK_COUNT"
  | "BATTLEFIELD_COUNT"
  | "RUNE_COUNT"
  | "SIDEBOARD_COUNT"
  | "COPY_LIMIT"
  | "UNKNOWN_CARD"
  | "BOARD_TYPE_MISMATCH"
  | "CHOSEN_CHAMPION_REQUIRED"
  | "CHOSEN_CHAMPION_UNKNOWN"
  | "CHOSEN_CHAMPION_TYPE"
  | "CHOSEN_CHAMPION_MISSING"
  | "CHOSEN_CHAMPION_TAG";

export interface RiftboundDeckStructureIssue {
  code: RiftboundDeckIssueCode;
  board?: RiftboundDeckBoardName;
  canonicalId?: string;
  message: string;
}

export interface RiftboundParsedDeck {
  document: RiftboundDeckDocument;
  warnings: readonly string[];
}

export class RiftboundDeckParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RiftboundDeckParseError";
  }
}

const BOARD_ORDER: readonly RiftboundDeckBoardName[] = [
  "legend",
  "mainDeck",
  "battlefields",
  "runes",
  "sideboard",
  "bench",
];

const BOARD_LABELS: Record<RiftboundDeckBoardName, string> = {
  legend: "Legend",
  mainDeck: "Main Deck",
  battlefields: "Battlefields",
  runes: "Runes",
  sideboard: "Sideboard",
  bench: "Bench",
};

function entriesForBoard(boards: RiftboundDeckBoards, board: RiftboundDeckBoardName) {
  if (board === "legend") return boards.legend ? [boards.legend] : [];
  return boards[board];
}

function count(entries: readonly RiftboundDeckEntry[]): number {
  return entries.reduce((total, entry) => total + entry.quantity, 0);
}

function cardKind(card: RiftboundCardDefinition): "legend" | "battlefields" | "runes" | "mainDeck" {
  const type = card.cardType.trim().toLocaleLowerCase();
  if (type.includes("legend")) return "legend";
  if (type.includes("battlefield")) return "battlefields";
  if (type.includes("rune")) return "runes";
  return "mainDeck";
}

function catalogMaps(catalog: RiftboundDeckCatalog) {
  const canonical = new Map(catalog.cards.map((card) => [card.canonicalId, card] as const));
  const printing = new Map(
    catalog.cards.flatMap((card) => card.printings.map((item) => [item.id, card] as const)),
  );
  const setCollector = new Map(
    catalog.cards.flatMap((card) =>
      card.printings.map(
        (item) => [`${item.setCode}:${item.collectorNumber}`.toLocaleLowerCase(), card] as const,
      ),
    ),
  );
  const names = new Map<string, RiftboundCardDefinition[]>();
  for (const card of catalog.cards) {
    const key = card.name.trim().toLocaleLowerCase();
    names.set(key, [...(names.get(key) ?? []), card]);
  }
  return { canonical, printing, setCollector, names };
}

export function emptyRiftboundDeckBoards(): RiftboundDeckBoards {
  return { legend: null, mainDeck: [], battlefields: [], runes: [], sideboard: [], bench: [] };
}

export function partitionRiftboundDeckEntries(
  input: {
    mainboard: readonly RiftboundDeckEntry[];
    sideboard?: readonly RiftboundDeckEntry[];
    maybeboard?: readonly RiftboundDeckEntry[];
  },
  catalog: RiftboundDeckCatalog,
): RiftboundDeckBoards {
  const maps = catalogMaps(catalog);
  const grouped = emptyRiftboundDeckBoards();
  const mainDeck: RiftboundDeckEntry[] = [];
  const battlefields: RiftboundDeckEntry[] = [];
  const runes: RiftboundDeckEntry[] = [];
  let legend: RiftboundDeckEntry | null = null;
  for (const entry of input.mainboard) {
    const card = maps.canonical.get(entry.canonicalId) ?? maps.printing.get(entry.printingId);
    if (!card) {
      mainDeck.push(entry);
      continue;
    }
    switch (cardKind(card)) {
      case "legend":
        legend = legend ?? entry;
        break;
      case "battlefields":
        battlefields.push(entry);
        break;
      case "runes":
        runes.push(entry);
        break;
      case "mainDeck":
        mainDeck.push(entry);
        break;
    }
  }
  return {
    ...grouped,
    legend,
    mainDeck,
    battlefields,
    runes,
    sideboard: [...(input.sideboard ?? [])],
    bench: [...(input.maybeboard ?? [])],
  };
}

export function flattenRiftboundDeckBoards(boards: RiftboundDeckBoards): {
  mainboard: RiftboundDeckEntry[];
  sideboard: RiftboundDeckEntry[];
  maybeboard: RiftboundDeckEntry[];
} {
  return {
    mainboard: [
      ...(boards.legend ? [boards.legend] : []),
      ...boards.mainDeck,
      ...boards.battlefields,
      ...boards.runes,
    ],
    sideboard: [...boards.sideboard],
    maybeboard: [...boards.bench],
  };
}

/** Canonical playable-list identity: ignores printing choices and the non-playable bench. */
export function riftboundDeckListIdentityEntries(boards: RiftboundDeckBoards) {
  const flattened = flattenRiftboundDeckBoards(boards);
  const totals = new Map<string, number>();
  for (const entry of [...flattened.mainboard, ...flattened.sideboard]) {
    totals.set(entry.canonicalId, (totals.get(entry.canonicalId) ?? 0) + entry.quantity);
  }
  return [...totals.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([canonicalId, quantity]) => ({ cardId: canonicalId, canonicalId, quantity }));
}

export function inspectRiftboundDeckStructure(
  boards: RiftboundDeckBoards,
  catalog: RiftboundDeckCatalog,
): RiftboundDeckStructureIssue[] {
  const issues: RiftboundDeckStructureIssue[] = [];
  const maps = catalogMaps(catalog);
  const exact = (
    board: RiftboundDeckBoardName,
    actual: number,
    expected: number,
    code: RiftboundDeckIssueCode,
  ) => {
    if (actual !== expected)
      issues.push({ code, board, message: `${BOARD_LABELS[board]}: ${actual}/${expected}` });
  };
  exact("legend", boards.legend?.quantity ?? 0, RIFTBOUND_DECK_STRUCTURE.legend, "LEGEND_COUNT");
  exact("mainDeck", count(boards.mainDeck), RIFTBOUND_DECK_STRUCTURE.mainDeck, "MAIN_DECK_COUNT");
  exact(
    "battlefields",
    count(boards.battlefields),
    RIFTBOUND_DECK_STRUCTURE.battlefields,
    "BATTLEFIELD_COUNT",
  );
  exact("runes", count(boards.runes), RIFTBOUND_DECK_STRUCTURE.runes, "RUNE_COUNT");
  const sideboardCount = count(boards.sideboard);
  if (!RIFTBOUND_DECK_STRUCTURE.sideboardAllowedCounts.includes(sideboardCount as 0 | 8)) {
    issues.push({
      code: "SIDEBOARD_COUNT",
      board: "sideboard",
      message: `Sideboard: ${sideboardCount}; expected 0 or 8`,
    });
  }
  const ordinaryTotals = new Map<string, number>();
  for (const board of BOARD_ORDER) {
    for (const entry of entriesForBoard(boards, board)) {
      const card = maps.canonical.get(entry.canonicalId) ?? maps.printing.get(entry.printingId);
      if (!card) {
        issues.push({
          code: "UNKNOWN_CARD",
          board,
          canonicalId: entry.canonicalId,
          message: `Unknown card: ${entry.canonicalId}`,
        });
        continue;
      }
      const expected =
        board === "sideboard" ? "mainDeck" : board === "bench" ? null : cardKind(card);
      if (expected && expected !== board) {
        issues.push({
          code: "BOARD_TYPE_MISMATCH",
          board,
          canonicalId: entry.canonicalId,
          message: `${card.name} does not belong in ${BOARD_LABELS[board]}`,
        });
      }
      if (cardKind(card) === "mainDeck" && board !== "bench") {
        ordinaryTotals.set(
          entry.canonicalId,
          (ordinaryTotals.get(entry.canonicalId) ?? 0) + entry.quantity,
        );
      }
    }
  }
  for (const [canonicalId, quantity] of ordinaryTotals) {
    if (quantity > RIFTBOUND_DECK_STRUCTURE.ordinaryCopyMaximum) {
      issues.push({
        code: "COPY_LIMIT",
        canonicalId,
        message: `${canonicalId}: ${quantity}/${RIFTBOUND_DECK_STRUCTURE.ordinaryCopyMaximum} copies`,
      });
    }
  }
  return issues;
}

export function inspectRiftboundDeckRegistration(
  boards: RiftboundDeckBoards,
  chosenChampionId: string | null | undefined,
  catalog: RiftboundDeckCatalog,
): RiftboundDeckStructureIssue[] {
  const issues = inspectRiftboundDeckStructure(boards, catalog);
  if (!chosenChampionId) {
    issues.push({
      code: "CHOSEN_CHAMPION_REQUIRED",
      board: "mainDeck",
      message: "Choose a Champion Unit from the registered Main Deck.",
    });
    return issues;
  }

  const maps = catalogMaps(catalog);
  const champion = maps.canonical.get(chosenChampionId);
  if (!champion) {
    issues.push({
      code: "CHOSEN_CHAMPION_UNKNOWN",
      board: "mainDeck",
      canonicalId: chosenChampionId,
      message: `Unknown Chosen Champion: ${chosenChampionId}`,
    });
    return issues;
  }
  if (champion.cardType.trim().toLocaleLowerCase() !== "champion unit") {
    issues.push({
      code: "CHOSEN_CHAMPION_TYPE",
      board: "mainDeck",
      canonicalId: chosenChampionId,
      message: `${champion.name} is not a Champion Unit.`,
    });
  }
  if (!boards.mainDeck.some((entry) => entry.canonicalId === chosenChampionId)) {
    issues.push({
      code: "CHOSEN_CHAMPION_MISSING",
      board: "mainDeck",
      canonicalId: chosenChampionId,
      message: `${champion.name} must be registered in the Main Deck.`,
    });
  }

  const legend = boards.legend ? maps.canonical.get(boards.legend.canonicalId) : undefined;
  const championTag = legend?.tags[0]?.trim();
  if (
    championTag &&
    !champion.tags.some(
      (tag) => tag.localeCompare(championTag, undefined, { sensitivity: "accent" }) === 0,
    )
  ) {
    issues.push({
      code: "CHOSEN_CHAMPION_TAG",
      board: "mainDeck",
      canonicalId: chosenChampionId,
      message: `${champion.name} does not match ${legend?.name ?? "the selected Legend"}.`,
    });
  }
  return issues;
}

export function listRiftboundChosenChampions(
  boards: RiftboundDeckBoards,
  catalog: RiftboundDeckCatalog,
): RiftboundCardDefinition[] {
  const maps = catalogMaps(catalog);
  const legend = boards.legend ? maps.canonical.get(boards.legend.canonicalId) : undefined;
  const championTag = legend?.tags[0]?.trim();
  const ids = new Set(boards.mainDeck.map((entry) => entry.canonicalId));
  return [...ids]
    .flatMap((canonicalId) => {
      const card = maps.canonical.get(canonicalId);
      return card ? [card] : [];
    })
    .filter((card) => card.cardType.trim().toLocaleLowerCase() === "champion unit")
    .filter(
      (card) =>
        !championTag ||
        card.tags.some(
          (tag) => tag.localeCompare(championTag, undefined, { sensitivity: "accent" }) === 0,
        ),
    )
    .sort((left, right) => left.name.localeCompare(right.name));
}

export function retainRiftboundChosenChampionId(
  chosenChampionId: string | null,
  boards: RiftboundDeckBoards,
  catalog: RiftboundDeckCatalog,
): string | null {
  if (!chosenChampionId) return null;
  return listRiftboundChosenChampions(boards, catalog).some(
    (candidate) => candidate.canonicalId === chosenChampionId,
  )
    ? chosenChampionId
    : null;
}

export function serializeRiftboundDeckJson(document: RiftboundDeckDocument): string {
  const canonical: RiftboundDeckDocument = {
    schemaVersion: 2,
    game: "riftbound",
    name: document.name,
    boards: document.boards,
    ...(document.declarations ? { declarations: document.declarations } : {}),
  };
  return `${JSON.stringify(canonical, null, 2)}\n`;
}

export function serializeRiftboundDeckText(document: RiftboundDeckDocument): string {
  const lines = ["# TCG Online Riftbound Deck v2", `# Name: ${document.name}`];
  if (document.declarations?.chosenChampionId) {
    lines.push(`# Chosen Champion: ${document.declarations.chosenChampionId}`);
  }
  for (const board of BOARD_ORDER) {
    lines.push("", `[${BOARD_LABELS[board]}]`);
    for (const entry of [...entriesForBoard(document.boards, board)].sort(
      (a, b) =>
        a.canonicalId.localeCompare(b.canonicalId) || a.printingId.localeCompare(b.printingId),
    )) {
      lines.push(`${entry.quantity} ${entry.canonicalId} [printing:${entry.printingId}]`);
    }
  }
  return `${lines.join("\n")}\n`;
}

function assertEntry(value: unknown, path: string): RiftboundDeckEntry {
  if (!value || typeof value !== "object")
    throw new RiftboundDeckParseError(`${path} must be an object`);
  const item = value as Record<string, unknown>;
  if (
    typeof item.canonicalId !== "string" ||
    typeof item.printingId !== "string" ||
    !Number.isInteger(item.quantity) ||
    (item.quantity as number) < 1
  ) {
    throw new RiftboundDeckParseError(`${path} has an invalid identity or quantity`);
  }
  return {
    canonicalId: item.canonicalId,
    printingId: item.printingId,
    quantity: item.quantity as number,
  };
}

export function parseRiftboundDeckJson(
  raw: string,
  catalog: RiftboundDeckCatalog,
): RiftboundParsedDeck {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new RiftboundDeckParseError("Deck JSON is malformed");
  }
  if (!value || typeof value !== "object")
    throw new RiftboundDeckParseError("Deck JSON must be an object");
  const item = value as Record<string, unknown>;
  if (
    item.schemaVersion !== 2 ||
    item.game !== "riftbound" ||
    typeof item.name !== "string" ||
    !item.boards
  ) {
    throw new RiftboundDeckParseError("Deck JSON header is invalid");
  }
  const boardValue = item.boards as Record<string, unknown>;
  let chosenChampionId: string | undefined;
  if (item.declarations !== undefined) {
    if (
      !item.declarations ||
      typeof item.declarations !== "object" ||
      Array.isArray(item.declarations)
    ) {
      throw new RiftboundDeckParseError("declarations must be an object");
    }
    const declarations = item.declarations as Record<string, unknown>;
    const unexpectedDeclaration = Object.keys(declarations).find(
      (key) => key !== "chosenChampionId",
    );
    if (unexpectedDeclaration) {
      throw new RiftboundDeckParseError(`declarations.${unexpectedDeclaration} is not supported`);
    }
    if (declarations.chosenChampionId !== undefined) {
      if (
        typeof declarations.chosenChampionId !== "string" ||
        declarations.chosenChampionId.length === 0
      ) {
        throw new RiftboundDeckParseError(
          "declarations.chosenChampionId must be a non-empty string",
        );
      }
      chosenChampionId = declarations.chosenChampionId;
    }
  }
  const array = (board: Exclude<RiftboundDeckBoardName, "legend">) => {
    if (!Array.isArray(boardValue[board]))
      throw new RiftboundDeckParseError(`boards.${board} must be an array`);
    return boardValue[board].map((entry, index) => assertEntry(entry, `boards.${board}.${index}`));
  };
  const legend =
    boardValue.legend === null ? null : assertEntry(boardValue.legend, "boards.legend");
  return {
    document: {
      schemaVersion: 2,
      game: "riftbound",
      name: item.name,
      ...(chosenChampionId === undefined ? {} : { declarations: { chosenChampionId } }),
      boards: {
        legend,
        mainDeck: array("mainDeck"),
        battlefields: array("battlefields"),
        runes: array("runes"),
        sideboard: array("sideboard"),
        bench: array("bench"),
      },
    },
    warnings: [],
  };
}

export function parseRiftboundDeckText(
  raw: string,
  catalog: RiftboundDeckCatalog,
): RiftboundParsedDeck {
  const maps = catalogMaps(catalog);
  const sections = new Map(
    Object.entries(BOARD_LABELS).map(([key, label]) => [
      label.toLocaleLowerCase(),
      key as RiftboundDeckBoardName,
    ]),
  );
  const collected = new Map<RiftboundDeckBoardName, RiftboundDeckEntry[]>(
    BOARD_ORDER.map((board) => [board, []]),
  );
  const warnings: string[] = [];
  let name = "Imported Riftbound Deck";
  let chosenChampionId: string | undefined;
  let board: RiftboundDeckBoardName | null = null;
  for (const [index, sourceLine] of raw.split(/\r?\n/).entries()) {
    const line = sourceLine.trim();
    if (!line) continue;
    if (line.startsWith("# Name:")) {
      name = line.slice(7).trim() || name;
      continue;
    }
    if (line.startsWith("# Chosen Champion:")) {
      chosenChampionId = line.slice("# Chosen Champion:".length).trim() || undefined;
      continue;
    }
    if (line.startsWith("#")) continue;
    const section = line.match(/^\[([^\]]+)\]$/);
    if (section) {
      board = sections.get(section[1]!.trim().toLocaleLowerCase()) ?? null;
      if (!board) throw new RiftboundDeckParseError(`Line ${index + 1}: unknown section`);
      continue;
    }
    if (!board)
      throw new RiftboundDeckParseError(`Line ${index + 1}: card appears before a section`);
    const match = line.match(/^(\d+)\s+(.+?)(?:\s+\[printing:([^\]]+)\])?$/);
    if (!match) throw new RiftboundDeckParseError(`Line ${index + 1}: invalid card entry`);
    const quantity = Number.parseInt(match[1]!, 10);
    if (!Number.isInteger(quantity) || quantity < 1)
      throw new RiftboundDeckParseError(`Line ${index + 1}: invalid quantity`);
    const identity = match[2]!.trim();
    const requestedPrinting = match[3]?.trim();
    let card =
      maps.canonical.get(identity) ??
      maps.printing.get(identity) ??
      maps.setCollector.get(identity.toLocaleLowerCase());
    if (!card) {
      const named = maps.names.get(identity.toLocaleLowerCase()) ?? [];
      if (named.length > 1)
        throw new RiftboundDeckParseError(`Line ${index + 1}: ambiguous card name ${identity}`);
      card = named[0];
      if (card)
        warnings.push(`Resolved ${identity} by unique name; export with IDs for stability.`);
    }
    if (!card) {
      warnings.push(`Line ${index + 1}: skipped unknown card ${identity}`);
      continue;
    }
    const printing = requestedPrinting
      ? card.printings.find((item) => item.id === requestedPrinting)
      : card.printings[0];
    if (!printing)
      throw new RiftboundDeckParseError(
        `Line ${index + 1}: printing does not belong to ${card.canonicalId}`,
      );
    collected
      .get(board)!
      .push({ canonicalId: card.canonicalId, printingId: printing.id, quantity });
  }
  const legends = collected.get("legend")!;
  if (legends.length > 1 || (legends[0]?.quantity ?? 0) > 1)
    throw new RiftboundDeckParseError("Legend section supports one card");
  const importedCount = BOARD_ORDER.reduce(
    (total, board) =>
      total + collected.get(board)!.reduce((boardTotal, entry) => boardTotal + entry.quantity, 0),
    0,
  );
  if (importedCount === 0) {
    throw new RiftboundDeckParseError(
      warnings.find((warning) => warning.includes("unknown card")) ??
        "No Riftbound cards could be imported",
    );
  }
  return {
    document: {
      schemaVersion: 2,
      game: "riftbound",
      name,
      ...(chosenChampionId ? { declarations: { chosenChampionId } } : {}),
      boards: {
        legend: legends[0] ?? null,
        mainDeck: collected.get("mainDeck")!,
        battlefields: collected.get("battlefields")!,
        runes: collected.get("runes")!,
        sideboard: collected.get("sideboard")!,
        bench: collected.get("bench")!,
      },
    },
    warnings,
  };
}
