/**
 * Star Wars: Unlimited pack simulator adapter.
 *
 * Implements the cross-game `@tcg/shared/pack-simulator` contract using
 * the booster structure described in the official Spark of Rebellion preview:
 * https://starwarsunlimited.com/articles/boosting-ahead-of-release
 */

import type {
  PackDefinition,
  PackResult,
  PackSetInfo,
  PackSimulator,
  PackSlot,
} from "@tcg/shared/pack-simulator";
import type {
  SwuAspect,
  SwuCard,
  SwuCardType,
  SwuRarity,
  SwuSet,
} from "@tcg/star-wars-unlimited-types";
import type { SwuSetDefinition } from "../data/sets.ts";
import {
  RARE_PLUS_DISTRIBUTION,
  SWU_ASPECTS,
  SWU_PACK_DEFINITION,
  SWU_RARITIES,
  VARIANT_DISTRIBUTION,
} from "./constants.ts";
import { createSeededRandom, type RandomFn } from "./random.ts";

export * from "./constants.ts";
export { createSeededRandom };

export interface SwuPackSimulatorOptions {
  cards: SwuCard[];
  sets?: Record<string, SwuSetDefinition>;
}

interface Pool {
  leaders: SwuCard[];
  bases: SwuCard[];
  commons: SwuCard[];
  uncommons: SwuCard[];
  rares: SwuCard[];
  legendaries: SwuCard[];
  all: SwuCard[];
}

function pickRandom<T>(items: T[], random: RandomFn): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(random() * items.length)];
}

function shuffle<T>(items: T[], random: RandomFn): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function cardSetCode(card: SwuCard): string {
  return card.setId?.set.toLowerCase() ?? "";
}

function isPlayableCard(card: SwuCard): boolean {
  return card.cardType !== "leader" && card.cardType !== "base" && card.cardType !== "token";
}

function buildPool(cards: SwuCard[], setId?: string): Pool {
  const normalizedSetId = setId?.toLowerCase().replace(/^set/, "");
  const filtered = normalizedSetId
    ? cards.filter((card) => cardSetCode(card) === normalizedSetId)
    : cards;

  const all = filtered.filter((card) => card.cardType !== "token");

  return {
    leaders: all.filter((card) => card.cardType === "leader"),
    bases: all.filter((card) => card.cardType === "base"),
    commons: all.filter((card) => isPlayableCard(card) && card.rarity === SWU_RARITIES.COMMON),
    uncommons: all.filter((card) => isPlayableCard(card) && card.rarity === SWU_RARITIES.UNCOMMON),
    rares: all.filter((card) => isPlayableCard(card) && card.rarity === SWU_RARITIES.RARE),
    legendaries: all.filter(
      (card) => isPlayableCard(card) && card.rarity === SWU_RARITIES.LEGENDARY,
    ),
    all,
  };
}

function pickForSlot(pool: Pool, slotType: string, random: RandomFn): SwuCard | undefined {
  switch (slotType) {
    case "leader":
      return pickRandom(pool.leaders, random);
    case "base":
      return pickRandom(pool.bases, random);
    case "common":
      return pickRandom(pool.commons, random);
    case "uncommon":
      return pickRandom(pool.uncommons, random);
    case "rarePlus": {
      const isLegendary = random() < RARE_PLUS_DISTRIBUTION.LEGENDARY_CHANCE;
      return isLegendary ? pickRandom(pool.legendaries, random) : pickRandom(pool.rares, random);
    }
    case "foil":
      return pickRandom(pool.all, random);
    default:
      return undefined;
  }
}

function applyVariants(slots: PackSlot<SwuCard>[], random: RandomFn): void {
  for (const slot of slots) {
    slot.variants = [];

    if (random() < VARIANT_DISTRIBUTION.HYPERSPACE_CHANCE_PER_CARD) {
      slot.variants.push("hyperspace");
    }

    if (slot.slotType === "leader" && random() < VARIANT_DISTRIBUTION.SHOWCASE_CHANCE_PER_LEADER) {
      slot.variants.push("showcase");
    }
  }

  // The foil slot is always foil and tagged as such in variants.
  const foilSlot = slots.find((slot) => slot.slotType === "foil");
  if (foilSlot) {
    foilSlot.foil = true;
    foilSlot.variants = foilSlot.variants ?? [];
    if (!foilSlot.variants.includes("foil")) {
      foilSlot.variants.push("foil");
    }
  }
}

function inferAspect(card: SwuCard): SwuAspect | undefined {
  if (card.aspects && card.aspects.length > 0) {
    return card.aspects[0];
  }
  return undefined;
}

export class SwuPackSimulator implements PackSimulator<SwuCard, SwuCard> {
  readonly packDefinition: PackDefinition = SWU_PACK_DEFINITION;

  constructor(private readonly options: SwuPackSimulatorOptions) {}

  getAvailableSets(): PackSetInfo[] {
    const setMap = this.options.sets ?? {};
    const cardsBySet = new Map<string, SwuCard[]>();

    for (const card of this.options.cards) {
      const code = cardSetCode(card);
      if (!code) continue;
      const list = cardsBySet.get(code) ?? [];
      list.push(card);
      cardsBySet.set(code, list);
    }

    return Object.values(setMap).map((set) => ({
      id: set.id,
      name: set.name,
      code: set.code,
      releaseDate: set.releaseDate,
      totalCards: cardsBySet.get(set.id)?.length ?? 0,
    }));
  }

  generatePack(setId: string, seed?: string): PackResult<SwuCard> {
    const random = createSeededRandom(seed);
    const pool = buildPool(this.options.cards, setId);
    const slots: PackSlot<SwuCard>[] = [];

    for (const slotDef of this.packDefinition.slots) {
      for (let i = 0; i < slotDef.count; i++) {
        let card = pickForSlot(pool, slotDef.slotType, random);

        // Fallback to the full pool if the dedicated pool is empty.
        if (!card) {
          card = pickRandom(pool.all, random);
        }

        if (!card) {
          throw new Error(`SWU pack simulator: no card available for slot "${slotDef.slotType}"`);
        }

        slots.push({
          slotType: slotDef.slotType,
          cardRef: card,
          foil: false,
        });
      }
    }

    applyVariants(slots, random);

    return {
      setId,
      seed,
      slots: shuffle(slots, random),
    };
  }

  resolveCard(cardRef: SwuCard): SwuCard | undefined {
    return cardRef;
  }
}

export function createSwuPackSimulator(
  options: SwuPackSimulatorOptions,
): PackSimulator<SwuCard, SwuCard> {
  return new SwuPackSimulator(options);
}
