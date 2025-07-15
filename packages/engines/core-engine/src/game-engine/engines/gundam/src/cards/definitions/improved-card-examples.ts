/**
 * Example card definitions using the improved type system
 *
 * This file demonstrates how to define Gundam cards using the enhanced
 * type system with better ability and effect modeling.
 */

import type {
  ActivatedAbility,
  ContinuousAbility,
  GundamBaseCard,
  GundamCommandCard,
  GundamPilotCard,
  GundamUnitCard,
  KeywordAbility,
  TriggeredAbility,
} from "./improved-card-types";

// ============================================================================
// UNIT CARD EXAMPLES
// ============================================================================

/**
 * Example: Gundam with multiple keyword effects and a complex triggered ability
 * Based on GD01-001 from the import data
 */
export const gundam: GundamUnitCard = {
  id: "GD01-001",
  implemented: true,
  name: "Gundam",
  cost: 3,
  level: 4,
  number: 1,
  type: "unit",
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  zones: ["space", "earth"],
  traits: ["earth federation", "white base team"],
  linkRequirement: ["Amuro Ray"],
  ap: 3,
  hp: 3,
  sourceTitle: "Mobile Suit Gundam",

  // Keyword effects (passive abilities)
  keywords: [
    { keyword: "repair", value: 1 }, // All white Base Team units gain <Repair 1>
  ],

  abilities: [
    // Continuous ability that affects other units
    {
      timing: "constant",
      text: "All your (white Base Team) Units gain <Repair 1>.",
      targets: [
        {
          type: "friendly-unit",
          amount: "all",
          filters: [
            {
              property: "trait",
              operator: "contains",
              value: "white base team",
            },
          ],
        },
      ],
      effects: [
        {
          type: "modify-stats",
          stat: "hp",
          modifier: 1,
          duration: "permanent",
          target: {
            type: "friendly-unit",
            amount: "all",
            filters: [
              {
                property: "trait",
                operator: "contains",
                value: "white base team",
              },
            ],
          },
        },
      ],
    } as ContinuousAbility,

    // Triggered ability when paired - simplified to avoid complex conditions
    {
      timing: "when-paired",
      text: "If you have 2 or more other Units in play, draw 1.",
      effects: [
        {
          type: "draw-cards",
          amount: 1,
        },
      ],
    } as TriggeredAbility,
  ],
};

/**
 * Example: Unicorn Gundam with complex deployment conditions
 * Based on GD01-002 from the import data
 */
export const unicornGundamDestroyMode: GundamUnitCard = {
  id: "GD01-002",
  implemented: true,
  name: "Unicorn Gundam (Destroy Mode)",
  type: "unit",
  cost: 6,
  level: 7,
  number: 2,
  color: "blue",
  set: "GD01",
  rarity: "legendary",
  zones: ["space", "earth"],
  traits: ["civilian"],
  linkRequirement: ["Banagher Links"],
  ap: 5,
  hp: 4,
  sourceTitle: "Mobile Suit Gundam Unicorn",

  keywords: [],

  abilities: [
    // Special deployment ability - simplified
    {
      timing: "deploy",
      text: 'When playing this card from your hand, you may destroy 1 of your Link Units with "Unicorn Mode" in its card name that is Lv.5. If you do, play this card as if it has 0 Lv. and cost.',
      effects: [
        {
          type: "deploy-unit",
          costReduction: 6,
        },
      ],
    } as TriggeredAbility,

    // Attack ability
    {
      timing: "attack",
      text: "Choose 1 enemy Unit. Rest it.",
      targets: [
        {
          type: "enemy-unit",
          amount: 1,
        },
      ],
      effects: [
        {
          type: "rest-unit",
          target: {
            type: "enemy-unit",
            amount: 1,
          },
        },
      ],
    } as TriggeredAbility,
  ],
};

/**
 * Example: Guncannon with repair keyword and conditional triggered ability
 */
export const guncannon: GundamUnitCard = {
  id: "GD01-004",
  implemented: true,
  name: "Guncannon | RX-77",
  type: "unit",
  cost: 2,
  level: 3,
  number: 4,
  color: "blue",
  set: "GD01",
  rarity: "rare",
  zones: ["space", "earth"],
  traits: ["earth federation", "white base team"],
  linkRequirement: ["white base team"],
  ap: 2,
  hp: 3,

  keywords: [{ keyword: "repair", value: 1 }],

  abilities: [
    {
      timing: "when-paired",
      text: "Choose 1 enemy Unit with 2 or less HP. Rest it.",
      targets: [
        {
          type: "enemy-unit",
          amount: 1,
          filters: [{ property: "hp", operator: "less-equal", value: 2 }],
        },
      ],
      effects: [
        {
          type: "rest-unit",
          target: {
            type: "enemy-unit",
            amount: 1,
            filters: [{ property: "hp", operator: "less-equal", value: 2 }],
          },
        },
      ],
    } as TriggeredAbility,
  ],
};

// ============================================================================
// PILOT CARD EXAMPLES
// ============================================================================

/**
 * Example: Pilot card with stat modifiers and abilities
 */
export const amuroRay: GundamPilotCard = {
  id: "GD01-050",
  implemented: true,
  name: "Amuro Ray",
  type: "pilot",
  cost: 1,
  level: 2,
  number: 50,
  color: "blue",
  set: "GD01",
  rarity: "super_rare",
  traits: ["earth federation", "newtype"],
  apModifier: 1,
  hpModifier: 1,

  abilities: [
    {
      timing: "during-pair",
      text: "This Unit gains <First Strike>.",
      duration: "while-paired",
      effects: [
        {
          type: "modify-stats",
          stat: "ap",
          modifier: 0, // First strike doesn't modify stats, it's a timing change
          duration: "permanent",
          target: { type: "paired-unit" },
        },
      ],
    } as ContinuousAbility,
  ],
};

// ============================================================================
// COMMAND CARD EXAMPLES
// ============================================================================

/**
 * Example: Main phase command card
 */
export const tacticalStrike: GundamCommandCard = {
  id: "ST01-100",
  implemented: true,
  name: "Tactical Strike",
  type: "command",
  cost: 2,
  level: 1,
  number: 100,
  color: "blue",
  set: "ST01",
  rarity: "common",

  abilities: [
    {
      timing: "main",
      text: "Choose 1 enemy Unit. Deal 2 damage to it.",
      targets: [
        {
          type: "enemy-unit",
          amount: 1,
        },
      ],
      effects: [
        {
          type: "deal-damage",
          amount: 2,
          damageType: "effect",
          target: {
            type: "enemy-unit",
            amount: 1,
          },
        },
      ],
    },
  ],
};

/**
 * Example: Action command card - simplified to avoid burst timing issue
 */
export const emergencyRepairs: GundamCommandCard = {
  id: "ST01-101",
  implemented: true,
  name: "Emergency Repairs",
  type: "command",
  cost: 1,
  level: 1,
  number: 101,
  color: "blue",
  set: "ST01",
  rarity: "uncommon",

  abilities: [
    {
      timing: "action",
      text: "Choose 1 of your Units. It recovers 2 HP.",
      targets: [
        {
          type: "friendly-unit",
          amount: 1,
        },
      ],
      effects: [
        {
          type: "heal-damage",
          amount: 2,
          target: {
            type: "friendly-unit",
            amount: 1,
          },
        },
      ],
    },
  ],
};

// ============================================================================
// BASE CARD EXAMPLES
// ============================================================================

/**
 * Example: Base card with activated ability
 */
export const jaburoBase: GundamBaseCard = {
  id: "ST01-200",
  implemented: true,
  name: "Jaburo Base",
  type: "base",
  cost: 3,
  level: 2,
  number: 200,
  color: "blue",
  set: "ST01",
  rarity: "rare",
  zones: ["earth"],
  traits: ["earth federation", "stronghold"],
  ap: 0,
  hp: 4,

  abilities: [
    {
      timing: "activate-main",
      text: "【Activate･Main】 Rest this Base: Search your deck for 1 (Earth Federation) Unit card with cost 3 or less, reveal it, and add it to your hand. Then shuffle your deck.",
      cost: [{ type: "rest-self" }],
      effects: [
        {
          type: "search-deck",
          filters: [
            {
              property: "trait",
              operator: "contains",
              value: "earth federation",
            },
            { property: "cost", operator: "less-equal", value: 3 },
          ],
          amount: 1,
          reveal: true,
        },
      ],
    } as ActivatedAbility,
  ],
};

// ============================================================================
// UTILITY FUNCTIONS FOR CARD CREATION
// ============================================================================

/**
 * Helper function to create keyword abilities
 */
export const createKeywordAbility = (
  keyword: KeywordAbility["keyword"]["keyword"],
  value?: number,
): KeywordAbility => ({
  timing: "constant",
  keyword: { keyword, value },
  text: `<${keyword.charAt(0).toUpperCase() + keyword.slice(1)}${value ? ` ${value}` : ""}>`,
  effects: [],
});

/**
 * Helper function to create simple triggered abilities
 */
export const createTriggeredAbility = (
  timing: TriggeredAbility["timing"],
  text: string,
  effects: TriggeredAbility["effects"],
): TriggeredAbility => ({
  timing,
  text,
  effects,
});

/**
 * Helper function to create activated abilities with costs
 */
export const createActivatedAbility = (
  timing: ActivatedAbility["timing"],
  text: string,
  cost: ActivatedAbility["cost"],
  effects: ActivatedAbility["effects"],
): ActivatedAbility => ({
  timing,
  text,
  cost,
  effects,
});
