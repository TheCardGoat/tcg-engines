/**
 * Disney Lorcana pack simulator adapter.
 *
 * Implements the cross-game `@tcg/shared/pack-simulator` contract using
 * Lorcana-specific booster rules ported from the lorcanito sealed generator.
 */

import type {
  PackDefinition,
  PackResult,
  PackSetInfo,
  PackSimulator,
  PackSlot,
} from "@tcg/shared/pack-simulator";
import type { LorcanaCard } from "@tcg/lorcana-types";
import type { SetDefinition } from "../data";
import {
  FOIL_DISTRIBUTION,
  LORCANA_INK_TYPES,
  LORCANA_PACK_DEFINITION,
  LORCANA_RARITIES,
  RARE_PLUS_DISTRIBUTION,
  type LorcanaInkType,
} from "./constants.ts";
import { createSeededRandom, type RandomFn } from "./random.ts";

export * from "./constants.ts";
export { createSeededRandom };

function cardSetToSetId(cardSet: string): string {
  const num = Number.parseInt(cardSet, 10);
  return Number.isNaN(num) ? cardSet.toLowerCase() : `set${num}`;
}

function normalizeSetId(input: string, sets: Record<string, SetDefinition>): string | undefined {
  // Already a card set field like "005".
  if (/^\d{3}$/.test(input)) {
    return input;
  }

  // Set definition id like "set5" -> "005".
  const fromDef = sets[input];
  if (fromDef) {
    const num = Number.parseInt(fromDef.id.replace(/^set/, ""), 10);
    if (!Number.isNaN(num)) {
      return String(num).padStart(3, "0");
    }
  }

  // Set code like "SSK" -> look up by code.
  const byCode = Object.values(sets).find((set) => set.code.toLowerCase() === input.toLowerCase());
  if (byCode) {
    const num = Number.parseInt(byCode.id.replace(/^set/, ""), 10);
    if (!Number.isNaN(num)) {
      return String(num).padStart(3, "0");
    }
  }

  return undefined;
}

function isValidPackCard(card: LorcanaCard): boolean {
  // Exclude promo/epic/iconic/challenge special treatments from standard packs.
  if (card.specialRarity && card.specialRarity !== "enchanted") {
    return false;
  }
  return true;
}

function getCardInkTypes(card: LorcanaCard): LorcanaInkType[] {
  return card.inkType.filter((ink): ink is LorcanaInkType =>
    LORCANA_INK_TYPES.includes(ink as LorcanaInkType),
  );
}

function hasInkType(card: LorcanaCard, ink: LorcanaInkType): boolean {
  return getCardInkTypes(card).includes(ink);
}

function pickRandomCard(candidates: LorcanaCard[], random: RandomFn): LorcanaCard | undefined {
  if (candidates.length === 0) return undefined;
  return candidates[Math.floor(random() * candidates.length)];
}

function getCardsByRarity(pool: LorcanaCard[], rarity: string): LorcanaCard[] {
  return pool.filter((card) => card.rarity === rarity);
}

function getRandomCardByRarity(
  rarity: string,
  pool: LorcanaCard[],
  random: RandomFn,
  colorConstraint?: LorcanaInkType,
  excludedColors?: LorcanaInkType[],
): LorcanaCard | undefined {
  let candidates = getCardsByRarity(pool, rarity);

  if (colorConstraint) {
    candidates = candidates.filter((card) => hasInkType(card, colorConstraint));
  }

  if (excludedColors && excludedColors.length > 0) {
    candidates = candidates.filter(
      (card) => !getCardInkTypes(card).some((color) => excludedColors.includes(color)),
    );
  }

  if (candidates.length > 0) {
    return pickRandomCard(candidates, random);
  }

  // Fallback cascade when the constrained pool is empty.
  if (rarity === LORCANA_RARITIES.ENCHANTED) {
    return getRandomCardByRarity(LORCANA_RARITIES.LEGENDARY, pool, random);
  }
  if (rarity === LORCANA_RARITIES.LEGENDARY) {
    return getRandomCardByRarity(LORCANA_RARITIES.SUPER_RARE, pool, random);
  }
  if (rarity === LORCANA_RARITIES.SUPER_RARE) {
    return getRandomCardByRarity(LORCANA_RARITIES.RARE, pool, random);
  }
  if (rarity === LORCANA_RARITIES.RARE) {
    return getRandomCardByRarity(LORCANA_RARITIES.UNCOMMON, pool, random);
  }
  if (rarity === LORCANA_RARITIES.UNCOMMON) {
    return getRandomCardByRarity(LORCANA_RARITIES.COMMON, pool, random);
  }
  if (pool.length > 0) {
    return pickRandomCard(pool, random);
  }

  return undefined;
}

function rollFoilRarity(random: RandomFn): string {
  const roll = random() * 100;
  if (roll < FOIL_DISTRIBUTION.ENCHANTED) return LORCANA_RARITIES.ENCHANTED;
  if (roll < FOIL_DISTRIBUTION.LEGENDARY) return LORCANA_RARITIES.LEGENDARY;
  if (roll < FOIL_DISTRIBUTION.SUPER_RARE) return LORCANA_RARITIES.SUPER_RARE;
  if (roll < FOIL_DISTRIBUTION.RARE) return LORCANA_RARITIES.RARE;
  if (roll < FOIL_DISTRIBUTION.UNCOMMON) return LORCANA_RARITIES.UNCOMMON;
  return LORCANA_RARITIES.COMMON;
}

function rollRarePlusRarity(random: RandomFn): string {
  const roll = random();
  if (roll < RARE_PLUS_DISTRIBUTION.LEGENDARY_CHANCE) {
    return LORCANA_RARITIES.LEGENDARY;
  }
  if (roll < RARE_PLUS_DISTRIBUTION.LEGENDARY_CHANCE + RARE_PLUS_DISTRIBUTION.SUPER_RARE_CHANCE) {
    return LORCANA_RARITIES.SUPER_RARE;
  }
  return LORCANA_RARITIES.RARE;
}

export interface LorcanaPackSimulatorOptions {
  cards: LorcanaCard[];
  sets?: Record<string, SetDefinition>;
}

class LorcanaPackSimulator implements PackSimulator<LorcanaCard, string> {
  readonly packDefinition: PackDefinition = {
    name: LORCANA_PACK_DEFINITION.name,
    slots: [...LORCANA_PACK_DEFINITION.slots],
  };

  readonly #cards: LorcanaCard[];
  readonly #sets: Record<string, SetDefinition>;

  constructor(options: LorcanaPackSimulatorOptions) {
    this.#cards = options.cards;
    this.#sets = options.sets ?? {};
  }

  getAvailableSets(): PackSetInfo[] {
    const seen = new Set<string>();
    const result: PackSetInfo[] = [];

    for (const card of this.#cards) {
      if (!card.set) continue;
      const setDefId = cardSetToSetId(card.set);
      const setDef = this.#sets[setDefId];
      if (!setDef || seen.has(setDefId)) continue;

      seen.add(setDefId);
      result.push({
        id: setDefId,
        name: setDef.name,
        code: setDef.code,
        sortNumber: setDef.sortNumber,
      });
    }

    return result.sort((a, b) => (a.sortNumber ?? 0) - (b.sortNumber ?? 0));
  }

  generatePack(setId: string, seed?: string): PackResult<string> {
    const random = createSeededRandom(seed);
    const cardSetId = normalizeSetId(setId, this.#sets) ?? setId;
    const allFromSet = this.#cards.filter(
      (card) => card.set === cardSetId && isValidPackCard(card),
    );

    const pool = allFromSet.length > 0 ? allFromSet : this.#cards;
    const slots: PackSlot<string>[] = [];

    // Commons: at least one of each ink color.
    const shuffledInks = [...LORCANA_INK_TYPES].sort(() => random() - 0.5);
    const guaranteedCommons = Math.min(
      LORCANA_PACK_DEFINITION.slots[0].count,
      LORCANA_INK_TYPES.length,
    );

    for (let i = 0; i < guaranteedCommons; i++) {
      const ink = shuffledInks[i];
      if (!ink) break;
      const card = getRandomCardByRarity(LORCANA_RARITIES.COMMON, pool, random, ink);
      if (card) {
        slots.push({ slotType: LORCANA_RARITIES.COMMON, cardRef: card.id });
      }
    }

    const remainingCommons = LORCANA_PACK_DEFINITION.slots[0].count - slots.length;
    for (let i = 0; i < remainingCommons; i++) {
      const card = getRandomCardByRarity(LORCANA_RARITIES.COMMON, pool, random);
      if (card) {
        slots.push({ slotType: LORCANA_RARITIES.COMMON, cardRef: card.id });
      }
    }

    // Uncommons: no more than one card per ink color.
    const usedUncommonColors: LorcanaInkType[] = [];
    for (let i = 0; i < LORCANA_PACK_DEFINITION.slots[1].count; i++) {
      const card = getRandomCardByRarity(
        LORCANA_RARITIES.UNCOMMON,
        pool,
        random,
        undefined,
        usedUncommonColors,
      );
      if (card) {
        slots.push({ slotType: LORCANA_RARITIES.UNCOMMON, cardRef: card.id });
        for (const ink of getCardInkTypes(card)) {
          if (!usedUncommonColors.includes(ink)) {
            usedUncommonColors.push(ink);
          }
        }
      }
    }

    // Rare+ slots.
    for (let i = 0; i < LORCANA_PACK_DEFINITION.slots[2].count; i++) {
      const rarity = rollRarePlusRarity(random);
      const card = getRandomCardByRarity(rarity, pool, random);
      if (card) {
        slots.push({ slotType: rarity, cardRef: card.id });
      }
    }

    // Foil slot.
    const foilRarity = rollFoilRarity(random);
    const foilCard = getRandomCardByRarity(foilRarity, pool, random);
    if (foilCard) {
      slots.push({
        slotType: foilRarity,
        cardRef: foilCard.id,
        foil: true,
      });
    }

    return { setId, slots, seed };
  }

  resolveCard(cardRef: string): LorcanaCard | undefined {
    return this.#cards.find((card) => card.id === cardRef);
  }
}

export function createLorcanaPackSimulator(
  options: LorcanaPackSimulatorOptions,
): PackSimulator<LorcanaCard, string> {
  return new LorcanaPackSimulator(options);
}
