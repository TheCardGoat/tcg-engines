/**
 * Grand Archive SET001 Ally Cards
 *
 * Basic ally cards for testing and development
 */

import type { AllyCard } from "../../cardTypes";

/**
 * Fire Salamander - Basic Fire Ally
 */
export const fireSalamander: AllyCard = {
  id: "SET001-ALLY-001",
  name: "Fire Salamander",
  type: "ally",
  set: "SET001",
  number: 11,
  rarity: "common",
  element: "fire",
  reserveCost: 2,
  power: 2,
  life: 1,
  subtypes: ["Beast", "Salamander"],
  text: "A small but fierce creature that embodies the essence of fire.",
  abilities: [
    {
      type: "triggered",
      effect:
        "When this ally enters the field, deal 1 damage to target champion or ally.",
      timing: "On enter",
    },
  ],
  keywords: ["Stealth"],
  implemented: true,
};

/**
 * Water Sprite - Basic Water Ally
 */
export const waterSprite: AllyCard = {
  id: "SET001-ALLY-002",
  name: "Water Sprite",
  type: "ally",
  set: "SET001",
  number: 12,
  rarity: "common",
  element: "water",
  reserveCost: 1,
  power: 1,
  life: 2,
  subtypes: ["Spirit", "Sprite"],
  text: "A playful water spirit that aids in healing and protection.",
  abilities: [
    {
      type: "activated",
      cost: "Rest this ally",
      effect: "Heal 1 damage from target champion or ally.",
    },
  ],
  implemented: true,
};

/**
 * Wind Hawk - Basic Wind Ally
 */
export const windHawk: AllyCard = {
  id: "SET001-ALLY-003",
  name: "Wind Hawk",
  type: "ally",
  set: "SET001",
  number: 13,
  rarity: "common",
  element: "wind",
  reserveCost: 2,
  power: 2,
  life: 1,
  subtypes: ["Bird", "Hawk"],
  text: "A swift predator that soars through the skies with grace.",
  keywords: ["Flying"],
  abilities: [
    {
      type: "static",
      effect: "This ally can attack champions directly.",
    },
  ],
  implemented: true,
};

/**
 * Stone Golem - Norm Ally
 */
export const stoneGolem: AllyCard = {
  id: "SET001-ALLY-004",
  name: "Stone Golem",
  type: "ally",
  set: "SET001",
  number: 14,
  rarity: "common",
  element: "norm",
  reserveCost: 3,
  power: 1,
  life: 4,
  subtypes: ["Construct", "Golem"],
  text: "A sturdy guardian carved from ancient stone.",
  keywords: ["Taunt"],
  abilities: [
    {
      type: "static",
      effect: "This ally has +1 life for each other ally you control.",
    },
  ],
  implemented: true,
};

/**
 * Arcane Scholar - Advanced Element Ally
 */
export const arcaneScholar: AllyCard = {
  id: "SET001-ALLY-005",
  name: "Arcane Scholar",
  type: "ally",
  set: "SET001",
  number: 15,
  rarity: "uncommon",
  element: "arcane",
  reserveCost: 3,
  memoryCost: 1,
  power: 2,
  life: 2,
  subtypes: ["Human", "Scholar"],
  text: "A learned mage who has unlocked the secrets of arcane magic.",
  abilities: [
    {
      type: "triggered",
      effect:
        "When this ally enters the field, look at the top 3 cards of your deck. Put one into your hand and the rest on the bottom of your deck.",
      timing: "On enter",
    },
    {
      type: "activated",
      cost: "Exhaust, pay 1 memory",
      effect: "Draw a card.",
    },
  ],
  implemented: true,
};

/**
 * Export all ally cards
 */
export const ALLIES: Record<string, AllyCard> = {
  [fireSalamander.id]: fireSalamander,
  [waterSprite.id]: waterSprite,
  [windHawk.id]: windHawk,
  [stoneGolem.id]: stoneGolem,
  [arcaneScholar.id]: arcaneScholar,
};
