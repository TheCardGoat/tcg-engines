/**
 * Welcome to Night City retail packs on the shared PackSimulator contract.
 *
 * Each pack is 7 commons, 3 uncommons, and 2 rare-or-better cards, and never
 * repeats a card. Commons deal with at least one card of every color and at
 * most two cards of one color; uncommons deal at most one card per color.
 *
 * The published pull rates (r/cyberpunktcg official FAQ) put Epic Rares in
 * about 1 of 4 packs and Secret Rares in about 1 of 24, with Rare as the base
 * fill of both rare-or-better slots. One upgrade is rolled per pack — Secret
 * first, otherwise Epic — so the effective Epic rate is
 * (1 - SECRET_RATE) * EPIC_RATE and every pack still deals at least one Rare.
 *
 * Official per-card odds are not published, so every card inside a tier has
 * the same weight. Iconic Rares, Nova Rares, starter exclusives, and promos
 * are not in this pool.
 */

import type { CardDefinition } from "@tcg/cyberpunk-types";

/**
 * Same shape as `@tcg/shared/pack-simulator`'s PackSimulator. Cyberpunk cards
 * does not depend on that package; callers use these methods directly.
 */
interface PackDefinition {
  name: string;
  slots: { slotType: string; count: number }[];
}
interface PackSetInfo {
  id: string;
  name: string;
  code?: string;
}
interface PackSlot {
  slotType: string;
  cardRef: string;
}
interface PackResult {
  setId: string;
  slots: PackSlot[];
  seed?: string;
}
interface PackSimulator {
  readonly packDefinition: PackDefinition;
  getAvailableSets(): PackSetInfo[];
  generatePack(setId: string, seed?: string): PackResult;
  resolveCard(cardRef: string): CardDefinition | undefined;
}
import { getMergedCyberpunkCards, getMergedCyberpunkCardsById } from "../merged.ts";

export const CYBERPUNK_RETAIL_PACK_SET = "welcometonightcityretail";
export const CYBERPUNK_PACK_COMMON_SLOTS = 7;
export const CYBERPUNK_PACK_UNCOMMON_SLOTS = 3;
export const CYBERPUNK_PACK_RARE_SLOTS = 2;
export const CYBERPUNK_SIX_PACK_COUNT = 6;

/** Published rate: Epic Rares appear in about 1 of 4 packs. */
export const CYBERPUNK_PACK_EPIC_RATE = 1 / 4;
/** Published rate: Secret Rares appear in about 1 of 24 packs. */
export const CYBERPUNK_PACK_SECRET_RATE = 1 / 24;

const MAX_COMMON_CARDS_PER_COLOR = 2;

type RareUpgradeTier = "Rare" | "Epic" | "Secret";

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

interface RetailPackPool {
  common: CardDefinition[];
  uncommon: CardDefinition[];
  rare: CardDefinition[];
  epic: CardDefinition[];
  secret: CardDefinition[];
}

function retailPackPool(): RetailPackPool {
  const pool: RetailPackPool = { common: [], uncommon: [], rare: [], epic: [], secret: [] };
  for (const card of getMergedCyberpunkCards()) {
    if (card.set.code !== CYBERPUNK_RETAIL_PACK_SET) continue;
    if (card.legality !== "legal") continue;
    if (card.rarity === "Common") pool.common.push(card);
    else if (card.rarity === "Uncommon") pool.uncommon.push(card);
    else if (card.rarity === "Rare") pool.rare.push(card);
    else if (card.rarity === "Epic") pool.epic.push(card);
    else if (card.rarity === "Secret") pool.secret.push(card);
  }
  return pool;
}

function groupByColor(cards: readonly CardDefinition[]): Map<string, CardDefinition[]> {
  const byColor = new Map<string, CardDefinition[]>();
  for (const card of cards) {
    const list = byColor.get(card.color);
    if (list) list.push(card);
    else byColor.set(card.color, [card]);
  }
  return byColor;
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    const temp = result[index]!;
    result[index] = result[swap]!;
    result[swap] = temp;
  }
  return result;
}

/**
 * One slot per color first, then round-robin extras capped at
 * `maxPerColor`, so every color appears at least once and no color
 * exceeds the cap.
 */
function colorPlan(colors: readonly string[], count: number, maxPerColor: number): string[] {
  if (colors.length === 0 || colors.length * maxPerColor < count) {
    throw new Error("Cyberpunk retail pack pool cannot satisfy the color constraints");
  }
  const plan = [...colors];
  let next = 0;
  while (plan.length < count) {
    plan.push(colors[next % colors.length]!);
    next += 1;
  }
  return plan;
}

function pickDistinct(
  pool: readonly CardDefinition[],
  taken: Set<string>,
  random: () => number,
): CardDefinition {
  const remaining = pool.filter((card) => !taken.has(card.canonicalId));
  if (remaining.length === 0) {
    throw new Error("Cyberpunk retail pack pool ran out of distinct cards for a slot");
  }
  const index = Math.min(remaining.length - 1, Math.floor(random() * remaining.length));
  const card = remaining[index]!;
  taken.add(card.canonicalId);
  return card;
}

/**
 * One upgrade roll per pack: Secret takes precedence at its published rate,
 * otherwise Epic rolls at its published rate; the rest of the time both
 * rare-or-better slots stay Rare.
 */
function rollUpgradeTier(random: () => number): RareUpgradeTier {
  if (random() < CYBERPUNK_PACK_SECRET_RATE) return "Secret";
  if (random() < CYBERPUNK_PACK_EPIC_RATE) return "Epic";
  return "Rare";
}

function upgradedPool(pool: RetailPackPool, tier: RareUpgradeTier): CardDefinition[] {
  switch (tier) {
    case "Rare":
      return pool.rare;
    case "Epic":
      return pool.epic;
    case "Secret":
      return pool.secret;
    default: {
      const unhandled: never = tier;
      throw new Error(`Unhandled rare upgrade tier: ${String(unhandled)}`);
    }
  }
}

class CyberpunkPackSimulator implements PackSimulator {
  readonly packDefinition: PackDefinition = {
    name: "Welcome to Night City",
    slots: [
      { slotType: "common", count: CYBERPUNK_PACK_COMMON_SLOTS },
      { slotType: "uncommon", count: CYBERPUNK_PACK_UNCOMMON_SLOTS },
      { slotType: "rarePlus", count: CYBERPUNK_PACK_RARE_SLOTS },
    ],
  };

  getAvailableSets(): PackSetInfo[] {
    return [
      {
        id: CYBERPUNK_RETAIL_PACK_SET,
        name: "Welcome to Night City — Retail",
        code: CYBERPUNK_RETAIL_PACK_SET,
      },
    ];
  }

  generatePack(setId: string, seed?: string): PackResult {
    if (setId !== CYBERPUNK_RETAIL_PACK_SET) {
      throw new Error(`Cyberpunk packs are only available for ${CYBERPUNK_RETAIL_PACK_SET}`);
    }
    const random = mulberry32(hashSeed(seed ?? "cyberpunk-pack"));
    const pool = retailPackPool();
    const taken = new Set<string>();
    const slots: PackSlot[] = [];

    const commonByColor = groupByColor(pool.common);
    const commonColors = shuffled([...commonByColor.keys()], random);
    for (const color of colorPlan(
      commonColors,
      CYBERPUNK_PACK_COMMON_SLOTS,
      MAX_COMMON_CARDS_PER_COLOR,
    )) {
      slots.push({
        slotType: "common",
        cardRef: pickDistinct(commonByColor.get(color) ?? [], taken, random).canonicalId,
      });
    }

    const uncommonByColor = groupByColor(pool.uncommon);
    const uncommonColors = shuffled([...uncommonByColor.keys()], random).slice(
      0,
      CYBERPUNK_PACK_UNCOMMON_SLOTS,
    );
    if (uncommonColors.length < CYBERPUNK_PACK_UNCOMMON_SLOTS) {
      throw new Error("Cyberpunk retail pack pool cannot satisfy the uncommon color constraints");
    }
    for (const color of uncommonColors) {
      slots.push({
        slotType: "uncommon",
        cardRef: pickDistinct(uncommonByColor.get(color) ?? [], taken, random).canonicalId,
      });
    }

    const upgradeTier = rollUpgradeTier(random);
    slots.push({
      slotType: "rarePlus",
      cardRef: pickDistinct(pool.rare, taken, random).canonicalId,
    });
    slots.push({
      slotType: "rarePlus",
      cardRef: pickDistinct(upgradedPool(pool, upgradeTier), taken, random).canonicalId,
    });

    return { setId, slots, seed };
  }

  resolveCard(cardRef: string): CardDefinition | undefined {
    return getMergedCyberpunkCardsById().get(cardRef);
  }
}

export function createCyberpunkPackSimulator(): PackSimulator {
  return new CyberpunkPackSimulator();
}
