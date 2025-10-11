import { allGundamCards } from "../../src/cards/definitions/cards";
import type {
  GundamitoCard,
  GundamitoUnitCard,
} from "../../src/cards/definitions/cardTypes";

/**
 * Get all cards from a specific set
 */
export const getCardsBySet = (setCode: string): GundamitoCard[] => {
  return allGundamCards.filter((card) => card.set === setCode);
};

/**
 * Get all cards of a specific type
 */
export const getCardsByType = (
  type: "unit" | "pilot" | "command" | "base" | "resource",
): GundamitoCard[] => {
  return allGundamCards.filter((card) => card.type === type);
};

/**
 * Get all cards of a specific color (excludes resource cards which have no color)
 */
export const getCardsByColor = (
  color: "blue" | "white" | "red" | "green" | "black" | "yellow",
): GundamitoCard[] => {
  return allGundamCards.filter(
    (card) =>
      card.type !== "resource" && "color" in card && card.color === color,
  );
};

/**
 * Get cards by cost (exact or range) - excludes resource cards which have no cost
 */
export const getCardsByCost = (
  minCost: number,
  maxCost?: number,
): GundamitoCard[] => {
  if (maxCost === undefined) {
    return allGundamCards.filter(
      (card) =>
        card.type !== "resource" && "cost" in card && card.cost === minCost,
    );
  }
  return allGundamCards.filter(
    (card) =>
      card.type !== "resource" &&
      "cost" in card &&
      card.cost !== undefined &&
      card.cost >= minCost &&
      card.cost <= maxCost,
  );
};

/**
 * Get units by AP (exact or range)
 */
export const getUnitsByAP = (
  minAP: number,
  maxAP?: number,
): GundamitoUnitCard[] => {
  const units = allGundamCards.filter(
    (card) => card.type === "unit",
  ) as GundamitoUnitCard[];

  if (maxAP === undefined) {
    return units.filter((unit) => unit.ap === minAP);
  }
  return units.filter((unit) => unit.ap >= minAP && unit.ap <= maxAP);
};

/**
 * Get units by HP (exact or range)
 */
export const getCardsByHP = (
  minHP: number,
  maxHP?: number,
): GundamitoUnitCard[] => {
  const units = allGundamCards.filter(
    (card) => card.type === "unit",
  ) as GundamitoUnitCard[];

  if (maxHP === undefined) {
    return units.filter((unit) => unit.hp === minHP);
  }
  return units.filter((unit) => unit.hp >= minHP && unit.hp <= maxHP);
};

/**
 * Get cards with specific keyword/ability type
 */
export const getCardsByKeyword = (keyword: string): GundamitoCard[] => {
  return allGundamCards.filter((card) => {
    if (
      !("abilities" in card && card.abilities) ||
      card.abilities.length === 0
    ) {
      return false;
    }
    return card.abilities.some((ability) => {
      // Check for abilityType field (legacy structure)
      if (
        "abilityType" in ability &&
        ability.abilityType === keyword.toLowerCase()
      ) {
        return true;
      }
      // Check for effects array with keyword field (new structure)
      if ("effects" in ability && Array.isArray(ability.effects)) {
        return ability.effects.some(
          (effect) =>
            effect.type === "keyword" &&
            effect.keyword?.toLowerCase() === keyword.toLowerCase(),
        );
      }
      return false;
    });
  });
};

/**
 * Get cards with specific trait
 */
export const getCardsByTrait = (trait: string): GundamitoCard[] => {
  return allGundamCards.filter((card) => {
    if (card.type === "unit" || card.type === "pilot") {
      return card.traits?.some((t) => t.toLowerCase() === trait.toLowerCase());
    }
    return false;
  });
};

/**
 * Get a random card from the catalog, optionally filtered by criteria
 */
export const getRandomCard = (
  criteria?: Partial<{
    type: "unit" | "pilot" | "command" | "base" | "resource";
    color: "blue" | "white" | "red" | "green" | "black" | "yellow";
    set: string;
    minCost: number;
    maxCost: number;
  }>,
): GundamitoCard => {
  let filteredCards = [...allGundamCards];

  if (criteria?.type) {
    filteredCards = filteredCards.filter((card) => card.type === criteria.type);
  }

  if (criteria?.color) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type !== "resource" &&
        "color" in card &&
        card.color === criteria.color,
    );
  }

  if (criteria?.set) {
    filteredCards = filteredCards.filter((card) => card.set === criteria.set);
  }

  if (criteria?.minCost !== undefined) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type !== "resource" &&
        "cost" in card &&
        card.cost !== undefined &&
        card.cost >= (criteria.minCost ?? 0),
    );
  }

  if (criteria?.maxCost !== undefined) {
    filteredCards = filteredCards.filter(
      (card) =>
        card.type !== "resource" &&
        "cost" in card &&
        card.cost !== undefined &&
        card.cost <= (criteria.maxCost ?? 999),
    );
  }

  if (filteredCards.length === 0) {
    throw new Error("No cards match the specified criteria");
  }

  const randomIndex = Math.floor(Math.random() * filteredCards.length);
  return filteredCards[randomIndex];
};

/**
 * Get card by ID
 */
export const getCardById = (id: string): GundamitoCard | undefined => {
  return allGundamCards.find((card) => card.id === id);
};

/**
 * Statistics about the card catalog
 */
export const getCatalogStats = () => {
  const byType = {
    unit: getCardsByType("unit").length,
    pilot: getCardsByType("pilot").length,
    command: getCardsByType("command").length,
    base: getCardsByType("base").length,
    resource: getCardsByType("resource").length,
  };

  const bySet = {
    ST01: getCardsBySet("ST01").length,
    ST02: getCardsBySet("ST02").length,
    ST04: getCardsBySet("ST04").length,
    GD01: getCardsBySet("GD01").length,
  };

  const byColor = {
    blue: getCardsByColor("blue").length,
    white: getCardsByColor("white").length,
    red: getCardsByColor("red").length,
    green: getCardsByColor("green").length,
    black: getCardsByColor("black").length,
    yellow: getCardsByColor("yellow").length,
  };

  return {
    total: allGundamCards.length,
    byType,
    bySet,
    byColor,
  };
};
