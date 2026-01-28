/**
 * Riftbound Card Examples
 *
 * Example card definitions to validate the ability JSON schema.
 * These examples are based on real card text from the game.
 */

import type {
  Ability,
  ActivatedAbility,
  KeywordAbility,
  SpellAbility,
  StaticAbility,
  TriggeredAbility,
} from "../abilities";
import type {
  BattlefieldCard,
  createCardId,
  EquipmentCard,
  GearCard,
  SpellCard,
  UnitCard,
} from "./card-types";

// ============================================================================
// Unit Card Examples
// ============================================================================

/**
 * Example: Unit with Assault and Accelerate
 *
 * Card Text:
 * [Accelerate] (You may pay :rb_energy_1::rb_rune_fury: as an additional cost to have me enter ready.)
 * [Assault 2] (+2 Might while I'm an attacker.)
 * When you play me, discard 2.
 */
export const AGGRESSIVE_WARRIOR_EXAMPLE: UnitCard = {
  id: "aggressive-warrior" as UnitCard["id"],
  name: "Aggressive Warrior",
  cardType: "unit",
  might: 4,
  energyCost: 3,
  powerCost: ["fury"],
  tags: ["Warrior"],
  abilities: [
    {
      type: "keyword",
      keyword: "Accelerate",
      cost: { energy: 1, power: ["fury"] },
    },
    {
      type: "keyword",
      keyword: "Assault",
      value: 2,
    },
    {
      type: "triggered",
      trigger: { event: "play-self" },
      effect: { type: "discard", amount: 2, player: "self" },
    },
  ],
};

/**
 * Example: Unit with Tank and triggered ability
 *
 * Card Text:
 * [Tank] (I must be assigned combat damage first.)
 * When you play me, draw 1.
 */
export const STALWART_DEFENDER_EXAMPLE: UnitCard = {
  id: "stalwart-defender" as UnitCard["id"],
  name: "Stalwart Defender",
  cardType: "unit",
  might: 3,
  energyCost: 2,
  powerCost: ["body"],
  abilities: [
    {
      type: "keyword",
      keyword: "Tank",
    },
    {
      type: "triggered",
      trigger: { event: "play-self" },
      effect: { type: "draw", amount: 1 },
    },
  ],
};

/**
 * Example: Unit with Ganking and movement trigger
 *
 * Card Text:
 * [Ganking] (I can move from battlefield to battlefield.)
 * When I move to a battlefield, play a 1 Might Recruit unit token here.
 */
export const MOBILE_SCOUT_EXAMPLE: UnitCard = {
  id: "mobile-scout" as UnitCard["id"],
  name: "Mobile Scout",
  cardType: "unit",
  might: 2,
  energyCost: 2,
  powerCost: ["order"],
  abilities: [
    {
      type: "keyword",
      keyword: "Ganking",
    },
    {
      type: "triggered",
      trigger: { event: "move-to-battlefield", on: "self" },
      effect: {
        type: "create-token",
        token: { name: "Recruit", type: "unit", might: 1 },
        location: "here",
      },
    },
  ],
};

/**
 * Example: Unit with Deathknell
 *
 * Card Text:
 * [Deathknell] — Draw 1. (When I die, get the effect.)
 */
export const DYING_SAGE_EXAMPLE: UnitCard = {
  id: "dying-sage" as UnitCard["id"],
  name: "Dying Sage",
  cardType: "unit",
  might: 2,
  energyCost: 2,
  powerCost: ["mind"],
  abilities: [
    {
      type: "keyword",
      keyword: "Deathknell",
      effect: { type: "draw", amount: 1 },
    },
  ],
};

/**
 * Example: Unit with conditional keywords (While Mighty)
 *
 * Card Text:
 * While I'm [Mighty], I have [Deflect], [Ganking], and [Shield]. (I'm Mighty while I have 5+ Might.)
 */
export const MIGHTY_CHAMPION_EXAMPLE: UnitCard = {
  id: "mighty-champion" as UnitCard["id"],
  name: "Mighty Champion",
  cardType: "unit",
  might: 4,
  energyCost: 4,
  powerCost: ["body", "body"],
  abilities: [
    {
      type: "static",
      condition: { type: "while-mighty" },
      effect: {
        type: "grant-keywords",
        keywords: ["Deflect", "Ganking", "Shield"],
        target: "self",
      },
    },
  ],
};

/**
 * Example: Unit with Legion
 *
 * Card Text:
 * [Legion] — When you play me, buff me. (If I don't have a buff, I get a +1 Might buff. Get the effect if you've played another card this turn.)
 */
export const LEGION_SOLDIER_EXAMPLE: UnitCard = {
  id: "legion-soldier" as UnitCard["id"],
  name: "Legion Soldier",
  cardType: "unit",
  might: 2,
  energyCost: 1,
  powerCost: ["order"],
  abilities: [
    {
      type: "keyword",
      keyword: "Legion",
      effect: { type: "buff", target: "self" },
      condition: { type: "legion" },
    },
  ],
};

/**
 * Example: Unit with static Might modifier
 *
 * Card Text:
 * Other friendly units here have +1 Might.
 */
export const INSPIRING_LEADER_EXAMPLE: UnitCard = {
  id: "inspiring-leader" as UnitCard["id"],
  name: "Inspiring Leader",
  cardType: "unit",
  might: 3,
  energyCost: 3,
  powerCost: ["order"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "modify-might",
        amount: 1,
        target: {
          type: "unit",
          controller: "friendly",
          location: "here",
          excludeSelf: true,
        },
      },
    },
  ],
};

/**
 * Example: Unit with attack trigger
 *
 * Card Text:
 * When I attack, deal 3 to all enemy units here.
 */
export const SWEEPING_STRIKER_EXAMPLE: UnitCard = {
  id: "sweeping-striker" as UnitCard["id"],
  name: "Sweeping Striker",
  cardType: "unit",
  might: 4,
  energyCost: 4,
  powerCost: ["fury", "fury"],
  abilities: [
    {
      type: "triggered",
      trigger: { event: "attack", on: "self" },
      effect: {
        type: "damage",
        amount: 3,
        target: {
          type: "unit",
          controller: "enemy",
          location: "here",
          quantity: "all",
        },
      },
    },
  ],
};

// ============================================================================
// Spell Card Examples
// ============================================================================

/**
 * Example: Action spell with damage
 *
 * Card Text:
 * [Action] (Play on your turn or in showdowns.)
 * Deal 3 to a unit at a battlefield.
 */
export const LIGHTNING_STRIKE_EXAMPLE: SpellCard = {
  id: "lightning-strike" as SpellCard["id"],
  name: "Lightning Strike",
  cardType: "spell",
  timing: "action",
  energyCost: 2,
  powerCost: ["fury"],
  abilities: [
    {
      type: "spell",
      timing: "action",
      effect: {
        type: "damage",
        amount: 3,
        target: { type: "unit", location: "battlefield" },
      },
    },
  ],
};

/**
 * Example: Reaction spell with Repeat
 *
 * Card Text:
 * [Reaction] (Play any time, even before spells and abilities resolve.)
 * [Repeat] :rb_energy_2: (You may pay the additional cost to repeat this spell's effect.)
 * Give a unit +2 Might this turn.
 */
export const BATTLE_SURGE_EXAMPLE: SpellCard = {
  id: "battle-surge" as SpellCard["id"],
  name: "Battle Surge",
  cardType: "spell",
  timing: "reaction",
  energyCost: 1,
  repeatCost: { energy: 2 },
  abilities: [
    {
      type: "spell",
      timing: "reaction",
      repeat: { energy: 2 },
      effect: {
        type: "modify-might",
        amount: 2,
        target: { type: "unit" },
        duration: "turn",
      },
    },
  ],
};

/**
 * Example: Hidden spell
 *
 * Card Text:
 * [Hidden] (Hide now for :rb_rune_rainbow: to react with later for :rb_energy_0:.)
 * [Action] (Play on your turn or in showdowns.)
 * Kill a unit at a battlefield.
 */
export const HIDDEN_ASSASSINATION_EXAMPLE: SpellCard = {
  id: "hidden-assassination" as SpellCard["id"],
  name: "Hidden Assassination",
  cardType: "spell",
  timing: "action",
  energyCost: 4,
  powerCost: ["chaos"],
  hasHidden: true,
  abilities: [
    {
      type: "keyword",
      keyword: "Hidden",
    },
    {
      type: "spell",
      timing: "action",
      effect: {
        type: "kill",
        target: { type: "unit", location: "battlefield" },
      },
    },
  ],
};

/**
 * Example: Counter spell
 *
 * Card Text:
 * [Reaction] (Play any time, even before spells and abilities resolve.)
 * Counter a spell.
 */
export const COUNTERSPELL_EXAMPLE: SpellCard = {
  id: "counterspell" as SpellCard["id"],
  name: "Counterspell",
  cardType: "spell",
  timing: "reaction",
  energyCost: 3,
  powerCost: ["mind"],
  abilities: [
    {
      type: "spell",
      timing: "reaction",
      effect: {
        type: "counter",
        target: "spell",
      },
    },
  ],
};

// ============================================================================
// Equipment Card Examples
// ============================================================================

/**
 * Example: Equipment with Equip cost
 *
 * Card Text:
 * [Equip] :rb_rune_fury: (:rb_rune_fury:: Attach this to a unit you control.)
 * +2 Might
 */
export const FURY_BLADE_EXAMPLE: EquipmentCard = {
  id: "fury-blade" as EquipmentCard["id"],
  name: "Fury Blade",
  cardType: "equipment",
  energyCost: 2,
  mightBonus: 2,
  equipCost: { power: ["fury"] },
  abilities: [
    {
      type: "keyword",
      keyword: "Equip",
      cost: { power: ["fury"] },
    },
  ],
};

/**
 * Example: Equipment with Quick-Draw
 *
 * Card Text:
 * [Quick-Draw] (This has [Reaction]. When you play it, attach it to a unit you control.)
 * [Equip] :rb_rune_calm: (:rb_rune_calm:: Attach this to a unit you control.)
 * +1 Might
 */
export const QUICK_SHIELD_EXAMPLE: EquipmentCard = {
  id: "quick-shield" as EquipmentCard["id"],
  name: "Quick Shield",
  cardType: "equipment",
  energyCost: 1,
  mightBonus: 1,
  hasQuickDraw: true,
  equipCost: { power: ["calm"] },
  abilities: [
    {
      type: "keyword",
      keyword: "Quick-Draw",
    },
    {
      type: "keyword",
      keyword: "Equip",
      cost: { power: ["calm"] },
    },
  ],
};

// ============================================================================
// Gear Card Examples
// ============================================================================

/**
 * Example: Gold token (gear)
 *
 * Card Text:
 * :rb_exhaust:: [Reaction] — [Add] :rb_energy_1:. (Abilities that add resources can't be reacted to.)
 */
export const GOLD_TOKEN_EXAMPLE: GearCard = {
  id: "gold-token" as GearCard["id"],
  name: "Gold",
  cardType: "gear",
  isToken: true,
  abilities: [
    {
      type: "activated",
      cost: { exhaust: true },
      timing: "reaction",
      effect: { type: "add-resource", energy: 1 },
    },
  ],
};

// ============================================================================
// Battlefield Card Examples
// ============================================================================

/**
 * Example: Battlefield with conquer trigger
 *
 * Card Text:
 * When you conquer here, draw 1.
 */
export const ANCIENT_LIBRARY_EXAMPLE: BattlefieldCard = {
  id: "ancient-library" as BattlefieldCard["id"],
  name: "Ancient Library",
  cardType: "battlefield",
  abilities: [
    {
      type: "triggered",
      trigger: { event: "conquer", on: "controller" },
      effect: { type: "draw", amount: 1 },
    },
  ],
};

/**
 * Example: Battlefield with hold trigger
 *
 * Card Text:
 * When you hold here, you may channel 1 rune exhausted.
 */
export const MYSTIC_NEXUS_EXAMPLE: BattlefieldCard = {
  id: "mystic-nexus" as BattlefieldCard["id"],
  name: "Mystic Nexus",
  cardType: "battlefield",
  abilities: [
    {
      type: "triggered",
      trigger: { event: "hold", on: "controller" },
      optional: true,
      effect: { type: "channel", amount: 1, exhausted: true },
    },
  ],
};

/**
 * Example: Battlefield with static effect
 *
 * Card Text:
 * Units here have [Ganking]. (They can move from battlefield to battlefield.)
 */
export const CROSSROADS_EXAMPLE: BattlefieldCard = {
  id: "crossroads" as BattlefieldCard["id"],
  name: "Crossroads",
  cardType: "battlefield",
  abilities: [
    {
      type: "static",
      effect: {
        type: "grant-keyword",
        keyword: "Ganking",
        target: { type: "unit", location: "here", quantity: "all" },
      },
    },
  ],
};

// ============================================================================
// Complex Card Examples
// ============================================================================

/**
 * Example: Complex unit with multiple abilities
 *
 * Card Text:
 * [Deflect 2] (Opponents must pay :rb_rune_rainbow::rb_rune_rainbow: to choose me with a spell or ability.)
 * [Weaponmaster] (When you play me, you may [Equip] one of your Equipment to me for :rb_rune_rainbow: less, even if it's already attached.)
 * I have +1 Might for each friendly gear.
 */
export const MASTER_ARMORER_EXAMPLE: UnitCard = {
  id: "master-armorer" as UnitCard["id"],
  name: "Master Armorer",
  cardType: "unit",
  might: 3,
  energyCost: 4,
  powerCost: ["body", "order"],
  abilities: [
    {
      type: "keyword",
      keyword: "Deflect",
      value: 2,
    },
    {
      type: "keyword",
      keyword: "Weaponmaster",
    },
    {
      type: "static",
      effect: {
        type: "modify-might",
        amount: { count: { type: "gear", controller: "friendly" } },
        target: "self",
      },
    },
  ],
};

/**
 * Example: Unit with choice effect
 *
 * Card Text:
 * Spend my buff: Choose one you've not chosen this turn —
 * * Deal 2 to a unit at a battlefield.
 * * Stun a unit at a battlefield.
 * * Ready me.
 * * Give me [Ganking] this turn.
 */
export const VERSATILE_WARRIOR_EXAMPLE: UnitCard = {
  id: "versatile-warrior" as UnitCard["id"],
  name: "Versatile Warrior",
  cardType: "unit",
  might: 3,
  energyCost: 3,
  powerCost: ["chaos"],
  abilities: [
    {
      type: "activated",
      cost: { spend: "buff" },
      effect: {
        type: "choice",
        notChosenThisTurn: true,
        options: [
          {
            label: "Deal 2 to a unit at a battlefield",
            effect: {
              type: "damage",
              amount: 2,
              target: { type: "unit", location: "battlefield" },
            },
          },
          {
            label: "Stun a unit at a battlefield",
            effect: {
              type: "stun",
              target: { type: "unit", location: "battlefield" },
            },
          },
          {
            label: "Ready me",
            effect: { type: "ready", target: "self" },
          },
          {
            label: "Give me [Ganking] this turn",
            effect: {
              type: "grant-keyword",
              keyword: "Ganking",
              target: "self",
              duration: "turn",
            },
          },
        ],
      },
    },
  ],
};

/**
 * Example: Unit with conditional cost reduction
 *
 * Card Text:
 * I cost :rb_energy_2: less for each of your [Mighty] units. (A unit is Mighty while it has 5+ Might.)
 * [Accelerate] (You may pay :rb_energy_1::rb_rune_body: as an additional cost to have me enter ready.)
 */
export const MIGHTY_REINFORCEMENT_EXAMPLE: UnitCard = {
  id: "mighty-reinforcement" as UnitCard["id"],
  name: "Mighty Reinforcement",
  cardType: "unit",
  might: 5,
  energyCost: 6,
  powerCost: ["body"],
  abilities: [
    {
      type: "static",
      effect: {
        type: "modify-might", // This should be a cost modifier, but using modify-might as placeholder
        amount: -2,
        target: "self",
      },
      condition: {
        type: "count",
        target: { type: "unit", controller: "friendly", filter: "mighty" },
        comparison: { gte: 1 },
      },
    },
    {
      type: "keyword",
      keyword: "Accelerate",
      cost: { energy: 1, power: ["body"] },
    },
  ],
};

// ============================================================================
// Export all examples
// ============================================================================

export const CARD_EXAMPLES = {
  // Units
  AGGRESSIVE_WARRIOR: AGGRESSIVE_WARRIOR_EXAMPLE,
  STALWART_DEFENDER: STALWART_DEFENDER_EXAMPLE,
  MOBILE_SCOUT: MOBILE_SCOUT_EXAMPLE,
  DYING_SAGE: DYING_SAGE_EXAMPLE,
  MIGHTY_CHAMPION: MIGHTY_CHAMPION_EXAMPLE,
  LEGION_SOLDIER: LEGION_SOLDIER_EXAMPLE,
  INSPIRING_LEADER: INSPIRING_LEADER_EXAMPLE,
  SWEEPING_STRIKER: SWEEPING_STRIKER_EXAMPLE,
  MASTER_ARMORER: MASTER_ARMORER_EXAMPLE,
  VERSATILE_WARRIOR: VERSATILE_WARRIOR_EXAMPLE,
  MIGHTY_REINFORCEMENT: MIGHTY_REINFORCEMENT_EXAMPLE,

  // Spells
  LIGHTNING_STRIKE: LIGHTNING_STRIKE_EXAMPLE,
  BATTLE_SURGE: BATTLE_SURGE_EXAMPLE,
  HIDDEN_ASSASSINATION: HIDDEN_ASSASSINATION_EXAMPLE,
  COUNTERSPELL: COUNTERSPELL_EXAMPLE,

  // Equipment
  FURY_BLADE: FURY_BLADE_EXAMPLE,
  QUICK_SHIELD: QUICK_SHIELD_EXAMPLE,

  // Gear
  GOLD_TOKEN: GOLD_TOKEN_EXAMPLE,

  // Battlefields
  ANCIENT_LIBRARY: ANCIENT_LIBRARY_EXAMPLE,
  MYSTIC_NEXUS: MYSTIC_NEXUS_EXAMPLE,
  CROSSROADS: CROSSROADS_EXAMPLE,
} as const;
