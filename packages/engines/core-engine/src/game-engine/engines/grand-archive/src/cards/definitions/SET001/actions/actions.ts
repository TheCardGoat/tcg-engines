/**
 * Grand Archive SET001 Action Cards
 *
 * Spell cards with immediate effects
 */

import type { ActionCard } from "../../cardTypes";

/**
 * Flame Burst - Basic Fire Action
 */
export const flameBurst: ActionCard = {
  id: "SET001-ACTION-001",
  name: "Flame Burst",
  type: "action",
  set: "SET001",
  number: 21,
  rarity: "common",
  element: "fire",
  reserveCost: 1,
  speed: "fast",
  subtypes: ["Spell"],
  text: "Deal 2 damage to target champion or ally.",
  abilities: [
    {
      type: "static",
      effect: "Deal 2 damage to target champion or ally.",
    },
  ],
  implemented: true,
};

/**
 * Healing Spring - Basic Water Action
 */
export const healingSpring: ActionCard = {
  id: "SET001-ACTION-002",
  name: "Healing Spring",
  type: "action",
  set: "SET001",
  number: 22,
  rarity: "common",
  element: "water",
  reserveCost: 1,
  speed: "fast",
  subtypes: ["Spell"],
  text: "Heal 3 damage from target champion or ally.",
  abilities: [
    {
      type: "static",
      effect: "Heal 3 damage from target champion or ally.",
    },
  ],
  implemented: true,
};

/**
 * Gust of Wind - Basic Wind Action
 */
export const gustOfWind: ActionCard = {
  id: "SET001-ACTION-003",
  name: "Gust of Wind",
  type: "action",
  set: "SET001",
  number: 23,
  rarity: "common",
  element: "wind",
  reserveCost: 1,
  speed: "fast",
  subtypes: ["Spell"],
  text: "Return target ally to its owner's hand.",
  abilities: [
    {
      type: "static",
      effect: "Return target ally to its owner's hand.",
    },
  ],
  implemented: true,
};

/**
 * Arcane Insight - Advanced Element Action
 */
export const arcaneInsight: ActionCard = {
  id: "SET001-ACTION-004",
  name: "Arcane Insight",
  type: "action",
  set: "SET001",
  number: 24,
  rarity: "uncommon",
  element: "arcane",
  reserveCost: 2,
  memoryCost: 1,
  speed: "slow",
  subtypes: ["Spell"],
  text: "Draw 2 cards, then discard a card.",
  abilities: [
    {
      type: "static",
      effect: "Draw 2 cards, then discard a card.",
    },
  ],
  implemented: true,
};

/**
 * Dispel Magic - Norm Action
 */
export const dispelMagic: ActionCard = {
  id: "SET001-ACTION-005",
  name: "Dispel Magic",
  type: "action",
  set: "SET001",
  number: 25,
  rarity: "common",
  element: "norm",
  reserveCost: 2,
  speed: "fast",
  subtypes: ["Spell"],
  text: "Counter target fast action or activated ability.",
  abilities: [
    {
      type: "static",
      effect: "Counter target fast action or activated ability.",
    },
  ],
  implemented: true,
};

/**
 * Export all action cards
 */
export const ACTIONS: Record<string, ActionCard> = {
  [flameBurst.id]: flameBurst,
  [healingSpring.id]: healingSpring,
  [gustOfWind.id]: gustOfWind,
  [arcaneInsight.id]: arcaneInsight,
  [dispelMagic.id]: dispelMagic,
};
