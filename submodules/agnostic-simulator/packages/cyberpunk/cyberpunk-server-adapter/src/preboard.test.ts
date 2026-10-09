import { describe, expect, it } from "vitest";
import { cards, structuredCards } from "@tcg/cyberpunk-cards";
import type { MatchState } from "@tcg/cyberpunk-engine";
import type { DeckCard, PregameDeckInput } from "@tcg/shared/game-adapter";
import { cyberpunkServerAdapter } from "./adapter";
import {
  defaultCyberpunkPreboardSelection,
  nextCyberpunkPreboardPool,
  parseCyberpunkPreboardPool,
  parseCyberpunkPreboardSelection,
  readCyberpunkPregameSideboard,
  validateCyberpunkPreboard,
} from "./preboard";

const pregame = cyberpunkServerAdapter.pregame;
if (!pregame?.projectPublicSeat || !pregame.projectSelectionForPlayer) {
  throw new Error("Cyberpunk competitive pre-board is not registered");
}

interface CatalogCard {
  id: string;
  name: string;
  type: string;
  color: string;
  ram: number | null;
}

function constructedLegal(card: {
  name: string;
  rulesText?: string | null;
  set?: { code?: string | null } | null;
}): boolean {
  const setCode = card.set?.code?.trim().toLowerCase();
  if (setCode === "alpha") return false;
  if (card.name.trim().toLowerCase() === "jackie & v") return false;
  const textless = !card.rulesText || card.rulesText.trim().length === 0;
  if (!textless) return true;
  const name = card.name.trim().toLowerCase();
  return name !== "lucyna kushinada" && name !== "david martinez" && name !== "rebecca";
}

function cardRow(card: CatalogCard, quantity: number, sectionId: string): DeckCard {
  return { cardId: card.id, quantity, sectionId };
}

function competitiveDeck(mainCount: number): {
  input: PregameDeckInput;
  legends: CatalogCard[];
  main: CatalogCard[];
  sideboard: CatalogCard[];
} {
  const legends: CatalogCard[] = [];
  const legendNames = new Set<string>();
  for (const card of structuredCards) {
    if (card.type !== "legend" || legendNames.has(card.name) || !constructedLegal(card)) continue;
    legends.push(card);
    legendNames.add(card.name);
    if (legends.length === 3) break;
  }
  if (legends.length !== 3) throw new Error("Need three Legends to register a competitive deck");
  const budget = new Map<string, number>();
  for (const legend of legends) {
    budget.set(legend.color, (budget.get(legend.color) ?? 0) + (legend.ram ?? 0));
  }
  const playable = structuredCards.filter((card) => {
    if (card.type === "legend" || legendNames.has(card.name) || !constructedLegal(card))
      return false;
    return (card.ram ?? 0) <= (budget.get(card.color) ?? 0);
  });
  const slots = mainCount + 7;
  const chosen: CatalogCard[] = [];
  for (const card of playable) {
    const copies = Math.min(3, slots - chosen.length);
    if (copies < 1) break;
    for (let copy = 0; copy < copies; copy += 1) chosen.push(card);
  }
  if (chosen.length < slots) {
    throw new Error(`Catalog cannot fill a ${mainCount}+7 competitive deck`);
  }
  const mainCards = chosen.slice(0, mainCount);
  const sideboardCards = chosen.slice(mainCount, slots);
  const grouped = (cards: CatalogCard[], sectionId: string) => {
    const quantities = new Map<string, { card: CatalogCard; quantity: number }>();
    for (const card of cards) {
      const existing = quantities.get(card.id);
      if (existing) existing.quantity += 1;
      else quantities.set(card.id, { card, quantity: 1 });
    }
    return [...quantities.values()].map(({ card, quantity }) => cardRow(card, quantity, sectionId));
  };
  return {
    legends,
    main: mainCards,
    sideboard: sideboardCards,
    input: {
      formatId: "constructed",
      mainDeck: [
        ...grouped(legends, "legend"),
        ...grouped(mainCards, "main"),
        ...grouped(sideboardCards, "sideboard"),
      ],
      inventory: [],
    },
  };
}

function counts(
  entries: readonly { cardId: string; qty?: number; quantity?: number }[],
): Map<string, number> {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    totals.set(entry.cardId, (totals.get(entry.cardId) ?? 0) + (entry.qty ?? entry.quantity ?? 0));
  }
  return totals;
}

function total(entries: readonly { quantity: number }[]): number {
  return entries.reduce((sum, entry) => sum + entry.quantity, 0);
}

function combineQuantities(
  left: readonly { cardId: string; quantity: number }[],
  right: readonly { cardId: string; quantity: number }[],
): { cardId: string; quantity: number }[] {
  return [...counts([...left, ...right])].map(([cardId, quantity]) => ({ cardId, quantity }));
}

function sideboardOfSize(input: PregameDeckInput, count: number): PregameDeckInput {
  const sideIds: string[] = [];
  for (const entry of input.mainDeck) {
    if (entry.sectionId !== "sideboard" && entry.sectionId !== "side") continue;
    for (let copy = 0; copy < entry.quantity; copy += 1) sideIds.push(entry.cardId);
  }
  const kept = sideIds.slice(0, count);
  const quantities = new Map<string, number>();
  for (const cardId of kept) quantities.set(cardId, (quantities.get(cardId) ?? 0) + 1);
  return {
    ...input,
    mainDeck: [
      ...input.mainDeck.filter(
        (entry) => entry.sectionId !== "sideboard" && entry.sectionId !== "side",
      ),
      ...[...quantities].map(([cardId, quantity]) => ({
        cardId,
        quantity,
        sectionId: "sideboard",
      })),
    ],
  };
}

function moveOne(
  from: readonly { cardId: string; quantity: number }[],
  to: readonly { cardId: string; quantity: number }[],
  cardId: string,
): { from: { cardId: string; quantity: number }[]; to: { cardId: string; quantity: number }[] } {
  const nextFrom = from.flatMap((entry) => {
    if (entry.cardId !== cardId) return [entry];
    return entry.quantity > 1 ? [{ ...entry, quantity: entry.quantity - 1 }] : [];
  });
  const nextTo = to.some((entry) => entry.cardId === cardId)
    ? to.map((entry) =>
        entry.cardId === cardId ? { ...entry, quantity: entry.quantity + 1 } : entry,
      )
    : [...to, { cardId, quantity: 1 }];
  return { from: nextFrom, to: nextTo };
}

describe("Cyberpunk competitive pre-board", () => {
  const registered = competitiveDeck(44);
  const pool = pregame.parsePool(pregame.createPool(registered.input));
  const registeredSelection = pregame.parseSelection(pregame.createDefaultSelection(pool));

  it("rejects a Legend explicitly registered in main", () => {
    expect(() =>
      pregame.createPool({
        ...registered.input,
        mainDeck: registered.input.mainDeck.map((entry) =>
          entry.sectionId === "legend" ? { ...entry, sectionId: "main" } : entry,
        ),
      }),
    ).toThrow();
  });

  it("rejects an Alpha printing registered under a retail canonical id", () => {
    const alpha = cards.find(
      (card) => card.set.code === "alpha" && card.canonicalId === "corpo-security",
    );
    const printingId = alpha?.printings[0]?.id;
    expect(printingId).toBeTruthy();
    expect(() =>
      pregame.createPool({
        ...registered.input,
        mainDeck: registered.input.mainDeck.map((entry, index) =>
          index === 3 ? { ...entry, cardId: "corpo-security", printingId } : entry,
        ),
      }),
    ).toThrow(/Alpha/i);
  });

  it("materializes the selected printing when copies of one card cross boards", () => {
    const base = parseCyberpunkPreboardPool(pool);
    const main = base.main[0]!;
    const side = base.sideboard[0]!;
    const mixed = {
      ...base,
      main: [
        { ...main, quantity: 1, printingId: "printing-a" },
        { ...main, quantity: main.quantity - 1, printingId: "printing-b" },
        ...base.main.slice(1),
      ],
      sideboard: [
        { ...side, quantity: 1, printingId: "printing-c" },
        ...base.sideboard.slice(1),
        ...(side.quantity > 1 ? [{ ...side, quantity: side.quantity - 1 }] : []),
      ],
    };
    const selected = parseCyberpunkPreboardSelection(
      pregame.createDefaultSelection(pregame.parsePool(mixed)),
    );
    const swap = {
      ...selected,
      main: [
        ...selected.main.filter((entry) => entry.printingId !== "printing-a"),
        { cardId: side.cardId, quantity: 1, printingId: "printing-c" },
      ],
      sideboard: [
        ...selected.sideboard.filter((entry) => entry.printingId !== "printing-c"),
        { cardId: main.cardId, quantity: 1, printingId: "printing-a" },
      ],
    };
    expect(pregame.validateSelection(mixed, swap).valid).toBe(true);
    const materialized = pregame.materializeDeck(mixed, swap);
    expect(materialized.filter((entry) => entry.cardId === main.cardId)).toEqual([
      expect.objectContaining({ printingId: "printing-b", qty: main.quantity - 1 }),
    ]);
    expect(materialized).toContainEqual(
      expect.objectContaining({ cardId: side.cardId, printingId: "printing-c", qty: 1 }),
    );
  });

  it("shows the rival only the three Legends", () => {
    const rival = pregame.projectPublicSeat!(pool) as {
      legends: { cardId: string }[];
      main?: unknown;
      sideboard?: unknown;
    };
    expect(rival.legends.map((entry) => entry.cardId).sort()).toEqual(
      registered.legends.map((entry) => entry.id).sort(),
    );
    expect(rival.main).toBeUndefined();
    expect(rival.sideboard).toBeUndefined();
    const revealed = JSON.stringify(rival);
    for (const card of [...registered.main, ...registered.sideboard]) {
      expect(revealed).not.toContain(card.id);
    }
  });

  it("accepts a main-deck and sideboard swap inside the registered pool", () => {
    const current = registeredSelection as {
      legends: { cardId: string; quantity: number }[];
      main: { cardId: string; quantity: number }[];
      sideboard: { cardId: string; quantity: number }[];
    };
    const sidedOut = current.main[0]!;
    const sidedIn = current.sideboard[0]!;
    const removed = moveOne(current.main, current.sideboard, sidedOut.cardId);
    const added = moveOne(removed.to, removed.from, sidedIn.cardId);
    const selection = pregame.parseSelection({
      legends: current.legends,
      main: added.to,
      sideboard: added.from,
    });
    expect(pregame.validateSelection(pool, selection).valid).toBe(true);
    expect(JSON.stringify(pool)).toBe(JSON.stringify(pregame.parsePool(pool)));

    const deck = pregame.materializeDeck(pool, selection);
    const dealt = counts(deck);
    const expected = counts([
      ...current.legends,
      ...added.to.map((entry) => ({ cardId: entry.cardId, quantity: entry.quantity })),
    ]);
    expect(dealt).toEqual(expected);
    expect(dealt.has(sidedIn.cardId)).toBe(true);
    expect(deck.some((entry) => entry.sectionId === "sideboard")).toBe(false);
    const stayedInSideboard = new Set(added.from.map((entry) => entry.cardId));
    for (const cardId of stayedInSideboard) {
      if (cardId === sidedIn.cardId) continue;
      const mainCopies = added.to.find((entry) => entry.cardId === cardId)?.quantity ?? 0;
      expect(dealt.get(cardId) ?? 0).toBe(mainCopies);
    }
  });

  it("rejects a Legend move, a main deck over 50, a sideboard over 7, and a card outside the pool", () => {
    const current = registeredSelection as {
      legends: { cardId: string; quantity: number }[];
      main: { cardId: string; quantity: number }[];
      sideboard: { cardId: string; quantity: number }[];
    };
    const legendId = current.legends[0]!.cardId;
    const legendMove = pregame.parseSelection({
      legends: current.legends.slice(1),
      main: current.main,
      sideboard: [...current.sideboard, { cardId: legendId, quantity: 1 }],
    });
    expect(pregame.validateSelection(pool, legendMove).issues.map((issue) => issue.code)).toContain(
      "legend-lock",
    );

    const intoMain = combineQuantities(current.main, current.sideboard);
    const oversizedMain = pregame.parseSelection({
      legends: current.legends,
      main: intoMain,
      sideboard: [],
    });
    expect(total(intoMain)).toBe(51);
    expect(
      pregame.validateSelection(pool, oversizedMain).issues.map((issue) => issue.code),
    ).toContain("main-deck-max");

    const overflow = moveOne(current.main, current.sideboard, current.main[0]!.cardId);
    const oversizedSide = pregame.parseSelection({
      legends: current.legends,
      main: overflow.from,
      sideboard: overflow.to,
    });
    expect(
      pregame.validateSelection(pool, oversizedSide).issues.map((issue) => issue.code),
    ).toContain("sideboard-max");

    const outsider = structuredCards.find(
      (card) =>
        card.type !== "legend" &&
        !registered.main.some((chosen) => chosen.id === card.id) &&
        !registered.sideboard.some((chosen) => chosen.id === card.id) &&
        !registered.legends.some((chosen) => chosen.id === card.id),
    );
    if (!outsider) throw new Error("Need a card outside the registered pool");
    const foreign = pregame.parseSelection({
      legends: current.legends,
      main: current.main,
      sideboard: current.sideboard.map((entry, index) =>
        index === 0 ? { cardId: outsider.id, quantity: entry.quantity } : entry,
      ),
    });
    expect(pregame.validateSelection(pool, foreign).issues.map((issue) => issue.code)).toContain(
      "registered-pool",
    );
  });

  it("locks the sideboard after confirm and deals only the pre-boarded main deck", async () => {
    const selection = pregame.parseSelection(registeredSelection);
    expect(pregame.validateSelection(pool, selection).valid).toBe(true);
    const openSideboard = readCyberpunkPregameSideboard({
      locked: false,
      sideboard: (selection as { sideboard: { cardId: string; quantity: number }[] }).sideboard,
    });
    expect(openSideboard.map((entry) => entry.cardId).sort()).toEqual(
      [...new Set(registered.sideboard.map((card) => card.id))].sort(),
    );

    const deck = pregame.materializeDeck(pool, selection);
    const dealt = counts(deck);
    const mainIds = new Set(registered.main.map((card) => card.id));
    expect(dealt).toEqual(
      counts([
        ...registered.legends.map((card) => ({ cardId: card.id, quantity: 1 })),
        ...registered.main.map((card) => ({ cardId: card.id, quantity: 1 })),
      ]),
    );
    const sideboardOnly = registered.sideboard.find((card) => !mainIds.has(card.id));
    if (!sideboardOnly) throw new Error("Need a sideboard card that is not also in the main deck");
    expect(dealt.has(sideboardOnly.id)).toBe(false);

    const lockedSelection = pregame.projectSelectionForPlayer!(selection, { locked: true }) as {
      sideboard?: unknown;
      sideboardLocked?: boolean;
    };
    const lockedPool = pregame.projectPoolForPlayer(pool, { locked: true }) as {
      sideboard?: unknown;
      sideboardLocked?: boolean;
    };
    expect(lockedSelection.sideboard).toBeUndefined();
    expect(lockedPool.sideboard).toBeUndefined();
    expect(lockedSelection.sideboardLocked).toBe(true);
    expect(lockedPool.sideboardLocked).toBe(true);
    expect(() =>
      readCyberpunkPregameSideboard({
        locked: true,
        sideboardLocked: true,
      }),
    ).toThrow(/sideboard is locked/);
    const lockedEdit = pregame.validateSelection(pool, selection, { locked: true });
    expect(lockedEdit.valid).toBe(false);
    expect(lockedEdit.issues.map((issue) => issue.code)).toContain("sideboard-locked");

    const sideboardCard = sideboardOnly;
    const cardsMaps = cyberpunkServerAdapter.buildCardInstances([
      { owner: "p1", deck },
      { owner: "p2", deck },
    ]);
    cardsMaps.owners.p1!.push("p1-sideboard");
    cardsMaps.cardInstances["p1-sideboard"] = sideboardCard.id;
    cardsMaps.instanceSections = {
      ...cardsMaps.instanceSections,
      "p1-sideboard": "sideboard",
    };
    const engine = await cyberpunkServerAdapter.createServerEngine!({
      gameSlug: "cyberpunk",
      seed: "competitive-preboard",
      player1Id: "p1",
      player2Id: "p2",
      cardsMaps,
    });
    const state = engine.getState() as MatchState;
    const dealtIds = Object.values(state.G.cardIndex).map((card) => card.definitionId);
    expect(dealtIds).not.toContain(sideboardCard.id);
    const inGame = Object.values(state.G.players).reduce(
      (sum, player) => sum + player.zones.deck.length + player.zones.hand.length,
      0,
    );
    expect(inGame).toBe(registered.main.length * 2);
  });

  it("uses queue policy even when a competitive registration has an incomplete sideboard", () => {
    const quick = competitiveDeck(44);
    const quickInput: PregameDeckInput = {
      formatId: "constructed",
      mainDeck: quick.input.mainDeck.filter((entry) => entry.sectionId !== "sideboard"),
      inventory: [],
    };
    expect(
      pregame.appliesTo?.({
        format: "best_of_1",
        matchType: "casual",
        decks: [quickInput, quickInput],
      }),
    ).toBe(false);
    expect(
      pregame.appliesTo?.({
        format: "best_of_1",
        matchType: "practice_vs_bot",
        decks: [quickInput, quickInput],
      }),
    ).toBe(false);
    expect(
      pregame.appliesTo?.({
        format: "best_of_1",
        matchType: "ranked",
        decks: [registered.input, quickInput],
      }),
    ).toBe(true);
    expect(() => pregame.createPool(quickInput)).toThrow(/exactly 7/);
    expect(
      pregame.appliesTo?.({ format: "best_of_3", decks: [registered.input, registered.input] }),
    ).toBe(true);
    expect(
      pregame.appliesTo?.({ format: "best_of_1", decks: [registered.input, registered.input] }),
    ).toBe(true);
    const six = sideboardOfSize(registered.input, 6);
    expect(pregame.appliesTo?.({ format: "best_of_1", decks: [six, six] })).toBe(true);
    expect(() => pregame.createPool(six)).toThrow(/exactly 7/);
    expect(pregame.appliesTo?.({ format: "best_of_1", decks: [registered.input, six] })).toBe(true);
    const tagged = registered.input.mainDeck.filter(
      (entry) => entry.sectionId === "sideboard" || entry.sectionId === "side",
    );
    const duplicated = { ...registered.input, inventory: tagged };
    expect(pregame.appliesTo?.({ format: "best_of_1", decks: [duplicated, duplicated] })).toBe(
      true,
    );
    expect(() => pregame.createPool(duplicated)).not.toThrow();
    const instances = cyberpunkServerAdapter.buildCardInstances([
      {
        owner: "p1",
        deck: [
          { cardId: "main-card", qty: 1, sectionId: "main" },
          { cardId: "side-card", qty: 1, sectionId: "side" },
        ],
      },
    ]);
    expect(instances.owners.p1).toEqual(["p1-main-card-0"]);
    expect(pregame.deadlineMs).toBe(180_000);
    expect(pregame.turnOrderPolicy).toBe("random-then-loser-choice");
    expect(cyberpunkServerAdapter.seriesFirstPlayerPolicy).toBe("loser-chooses");

    const alpha = cyberpunkServerAdapter.validateDeckForFormat("constructed", quickInput.mainDeck);
    expect(alpha.rules.filter((rule) => rule.kind === "sideboard-count" && !rule.passed)).toEqual(
      [],
    );
    const sixAlpha = cyberpunkServerAdapter.validateDeckForFormat("constructed", six.mainDeck);
    expect(
      sixAlpha.rules.filter((rule) => rule.kind === "sideboard-count" && !rule.passed),
    ).toEqual([]);
  });

  it("keeps Game 1 registered and carries each between-game selection forward", () => {
    const pool = parseCyberpunkPreboardPool(
      pregame.createPool(registered.input, { matchFormat: "best_of_3" }),
    );
    const initial = defaultCyberpunkPreboardSelection(pool);
    expect(pool.stage).toBe("game-one");
    const sidedOut = moveOne(initial.main, initial.sideboard, initial.main[0]!.cardId);
    const sidedIn = moveOne(sidedOut.to, sidedOut.from, initial.sideboard[0]!.cardId);
    const modified = { ...initial, main: sidedIn.to, sideboard: sidedIn.from };
    expect(validateCyberpunkPreboard(pool, modified).issues.map((issue) => issue.code)).toContain(
      "game-one-deck",
    );
    const gameTwo = nextCyberpunkPreboardPool(pool, initial);
    expect(gameTwo.stage).toBe("between-games");
    expect(validateCyberpunkPreboard(gameTwo, modified).valid).toBe(true);
    const gameThree = nextCyberpunkPreboardPool(gameTwo, modified);
    expect(defaultCyberpunkPreboardSelection(gameThree)).toEqual(modified);
  });

  it("rejects changing the registered main and sideboard counts between games", () => {
    const pool = parseCyberpunkPreboardPool(pregame.createPool(registered.input));
    const initial = defaultCyberpunkPreboardSelection(pool);
    const next = nextCyberpunkPreboardPool(pool, initial);
    const moved = moveOne(initial.sideboard, initial.main, initial.sideboard[0]!.cardId);
    const result = validateCyberpunkPreboard(next, {
      ...initial,
      main: moved.to,
      sideboard: moved.from,
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((entry) => entry.code)).toEqual(
      expect.arrayContaining(["main-count", "sideboard-count"]),
    );
    expect(validateCyberpunkPreboard(next, initial).valid).toBe(true);
  });

  it("registers exactly seven sideboard cards and counts copies across both boards", () => {
    const short = competitiveDeck(44);
    short.input.mainDeck = short.input.mainDeck.filter((entry) => entry.sectionId !== "sideboard");
    expect(() => pregame.createPool(short.input)).toThrow(/exactly 7/);

    const overloaded = competitiveDeck(43);
    const repeated = overloaded.main[0]!;
    overloaded.input.mainDeck = [
      ...overloaded.input.mainDeck.filter((entry) => entry.cardId !== repeated.id),
      { cardId: repeated.id, quantity: 3, sectionId: "main" },
      { cardId: repeated.id, quantity: 1, sectionId: "sideboard" },
    ];
    expect(() => pregame.createPool(overloaded.input)).toThrow(/too many copies/);
  });
});
