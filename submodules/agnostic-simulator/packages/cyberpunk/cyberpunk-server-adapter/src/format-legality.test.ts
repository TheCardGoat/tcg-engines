import { describe, expect, it } from "vite-plus/test";
import { cards, getMergedCyberpunkCards } from "@tcg/cyberpunk-cards";
import type { CardDefinition } from "@tcg/cyberpunk-types";
import type { DeckCard } from "@tcg/shared/game-adapter";
import { cyberpunkServerAdapter } from "./adapter";

const CONSTRUCTED_FORMAT_IDS = ["constructed"] as const;

describe("cyberpunkServerAdapter.validateDeckForFormat constructed legality", () => {
  const legal = buildLegalConstructedDeck();

  it("accepts a constructed deck with three legends, 40 main cards, and a 7-card sideboard", () => {
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, legal.deck);
      expect(result.formatId).toBe(formatId);
      expect(result.label).toBe("Constructed");
      expect(result.valid).toBe(true);
      expect(result.rules.filter((rule) => !rule.passed)).toEqual([]);
      expect(result.rules).toContainEqual(
        expect.objectContaining({
          kind: "card-pool",
          passed: true,
          message: `All cards are part of the Cyberpunk ${result.label} pool`,
        }),
      );
    }
  });

  it("accepts a six-card sideboard and rejects one over seven", () => {
    const [first, ...rest] = legal.side;
    expect(first).toBeDefined();
    const sixSide =
      first!.quantity > 1 ? [{ ...first!, quantity: first!.quantity - 1 }, ...rest] : rest;
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const six = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        ...legal.legends,
        ...legal.main,
        ...sixSide,
      ]);
      expect(six.valid).toBe(true);

      const eight = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        ...legal.legends,
        ...legal.main,
        { ...first!, quantity: first!.quantity + 1 },
        ...rest,
      ]);
      expect(eight.valid).toBe(false);
      expect(eight.rules).toContainEqual(
        expect.objectContaining({ kind: "sideboard-max", passed: false }),
      );
    }
  });

  it("rejects a legend in the sideboard", () => {
    const extraLegend = legal.unusedLegends[0];
    expect(extraLegend).toBeDefined();
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        ...legal.deck,
        { cardId: extraLegend!.canonicalId, quantity: 1, sectionId: "side" },
      ]);
      expect(result.valid).toBe(false);
      expect(result.rules).toContainEqual(
        expect.objectContaining({
          kind: "sideboard-legend",
          passed: false,
          details: expect.objectContaining({ cardId: extraLegend!.canonicalId }),
        }),
      );
    }
  });

  it("rejects two legends that share a name when the subtitle differs", () => {
    const street = requireCard((card) => card.canonicalId === "v-streetkid");
    const corpo = requireCard((card) => card.canonicalId === "v-corporate-exile");
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        { cardId: street.canonicalId, quantity: 1, sectionId: "legend" },
        { cardId: corpo.canonicalId, quantity: 1, sectionId: "legend" },
        legal.legends[2]!,
        ...legal.main,
        ...tag(legal.side, "side"),
      ]);
      expect(result.valid).toBe(false);
      expect(result.rules).toContainEqual(
        expect.objectContaining({ kind: "legend-name-unique", passed: false }),
      );
    }
  });

  it("rejects a fourth copy split across an Alpha Kit printing and the retail printing", () => {
    const retail = requireCard((card) => card.canonicalId === "corpo-security");
    const alpha = cards.find((card) => card.set.code === "alpha" && card.name === retail.name);
    expect(alpha).toBeDefined();
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        ...legal.legends,
        ...legal.main.filter((entry) => entry.cardId !== retail.canonicalId),
        { cardId: retail.canonicalId, quantity: 2, sectionId: "main" },
        ...tag(
          legal.side.filter((entry) => entry.cardId !== retail.canonicalId),
          "side",
        ),
        { cardId: alpha!.id, quantity: 2, sectionId: "side" },
      ]);
      expect(result.valid).toBe(false);
      expect(result.rules).toContainEqual(
        expect.objectContaining({ kind: "copy-limit", passed: false }),
      );
      expect(result.rules).toContainEqual(
        expect.objectContaining({
          kind: "constructed-legality",
          passed: false,
          details: expect.objectContaining({ cardId: alpha!.id }),
        }),
      );
    }
  });

  it("rejects an over-RAM sideboard card", () => {
    const heavy = legal.overRam[0];
    expect(heavy).toBeDefined();
    const [first, ...rest] = legal.side;
    expect(first).toBeDefined();
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        ...legal.legends,
        ...legal.main,
        { cardId: heavy!.canonicalId, quantity: first!.quantity, sectionId: "side" },
        ...tag(rest, "side"),
      ]);
      expect(result.valid).toBe(false);
      expect(result.rules).toContainEqual(
        expect.objectContaining({
          kind: "ram-limit",
          passed: false,
          details: expect.objectContaining({ cardId: heavy!.canonicalId }),
        }),
      );
    }
  });

  it("rejects an Alpha Kit reprint registered on the retail canonical id", () => {
    const retail = requireCard((card) => card.canonicalId === "corpo-security");
    const alpha = cards.find(
      (card) => card.set.code === "alpha" && card.canonicalId === retail.canonicalId,
    );
    const printingId = alpha?.printings[0]?.id;
    expect(printingId).toBeTruthy();
    const [first, ...rest] = legal.main;
    expect(first).toBeDefined();

    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        ...legal.legends,
        {
          cardId: retail.canonicalId,
          printingId,
          quantity: first!.quantity,
          sectionId: "main",
        },
        ...rest,
        ...tag(legal.side, "side"),
      ]);

      expect(result.valid).toBe(false);
      expect(result.rules).toContainEqual(
        expect.objectContaining({
          kind: "constructed-legality",
          passed: false,
          details: expect.objectContaining({ cardId: retail.canonicalId }),
        }),
      );
    }
  });

  it("rejects the catalogued textless Rebecca printing", () => {
    const rebecca = requireCard(
      (card) => card.name === "Rebecca" && card.subname === "Having a Moment",
    );
    for (const formatId of CONSTRUCTED_FORMAT_IDS) {
      const result = cyberpunkServerAdapter.validateDeckForFormat(formatId, [
        { cardId: rebecca.canonicalId, quantity: 1, sectionId: "legend" },
        ...legal.legends.slice(1),
        ...legal.main,
        ...tag(legal.side, "side"),
      ]);
      expect(result.valid).toBe(false);
      expect(result.rules).toContainEqual(
        expect.objectContaining({
          kind: "constructed-legality",
          passed: false,
          details: expect.objectContaining({ cardId: rebecca.canonicalId }),
        }),
      );
    }
  });
});

function requireCard(predicate: (card: CardDefinition) => boolean): CardDefinition {
  const card = getMergedCyberpunkCards().find(predicate);
  if (!card) throw new Error("Cyberpunk catalog card is missing");
  return card;
}

function tag(entries: DeckCard[], sectionId: string): DeckCard[] {
  return entries.map((entry) => ({ ...entry, sectionId }));
}

function identityKey(card: CardDefinition): string {
  return `${card.name.trim().toLowerCase()}\0${(card.subname ?? "").trim().toLowerCase()}`;
}

function takeCopies(
  pool: CardDefinition[],
  count: number,
  used: Map<string, number> = new Map(),
): DeckCard[] {
  const entries: DeckCard[] = [];
  let total = 0;
  for (const card of pool) {
    if (total >= count) break;
    const key = identityKey(card);
    const room = 3 - (used.get(key) ?? 0);
    if (room <= 0) continue;
    const quantity = Math.min(room, count - total);
    entries.push({ cardId: card.canonicalId, quantity });
    used.set(key, (used.get(key) ?? 0) + quantity);
    total += quantity;
  }
  if (total !== count) throw new Error(`Needed ${count} cards, found ${total}`);
  return entries;
}

function buildLegalConstructedDeck(): {
  deck: DeckCard[];
  legends: DeckCard[];
  main: DeckCard[];
  side: DeckCard[];
  sidePool: CardDefinition[];
  unusedLegends: CardDefinition[];
  overRam: CardDefinition[];
} {
  const pool = getMergedCyberpunkCards().filter((card) => card.set.code !== "alpha");
  const legends: CardDefinition[] = [];
  const seenNames = new Set<string>();
  for (const card of pool.filter((candidate) => candidate.type === "legend")) {
    const name = card.name.trim().toLowerCase();
    if (seenNames.has(name)) continue;
    if (name === "rebecca" && card.subname?.trim().toLowerCase() === "having a moment") continue;
    if (!card.rulesText?.trim() && card.subname?.trim().toLowerCase() === "having a moment")
      continue;
    seenNames.add(name);
    legends.push(card);
    if (legends.length === 3) break;
  }
  if (legends.length !== 3) throw new Error("Could not choose three constructed-legal legends");

  const budget = new Map<string, number>();
  for (const legend of legends) {
    budget.set(legend.color, (budget.get(legend.color) ?? 0) + (legend.ram ?? 0));
  }
  const playable = pool.filter(
    (card) =>
      card.type !== "legend" &&
      card.canonicalId !== "corpo-security" &&
      (card.ram ?? 0) <= (budget.get(card.color) ?? 0),
  );
  const overRam = pool.filter(
    (card) => card.type !== "legend" && (card.ram ?? 0) > (budget.get(card.color) ?? 0),
  );
  const used = new Map<string, number>();
  const main = takeCopies(playable, 40, used);
  const sidePool = playable.filter((card) => (used.get(identityKey(card)) ?? 0) < 3);
  const side = takeCopies(sidePool, 7, used);
  const legendEntries = legends.map((card): DeckCard => ({
    cardId: card.canonicalId,
    quantity: 1,
    sectionId: "legend",
  }));
  const mainEntries = tag(main, "main");
  const sideEntries = tag(side, "side");
  return {
    deck: [...legendEntries, ...mainEntries, ...sideEntries],
    legends: legendEntries,
    main: mainEntries,
    side: sideEntries,
    sidePool,
    unusedLegends: pool.filter(
      (card) =>
        card.type === "legend" &&
        !legends.some((chosen) => chosen.canonicalId === card.canonicalId),
    ),
    overRam,
  };
}
