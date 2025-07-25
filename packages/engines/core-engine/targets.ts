/**
 * This file defines all the possible targets for card abilities in the Lorcana card game.
 */

export enum CharacterTarget {
  // Single specific character targets
  CHOSEN_CHARACTER = "chosen_character",
  CHOSEN_YOUR_CHARACTER = "chosen_your_character",
  CHOSEN_OPPOSING_CHARACTER = "chosen_opposing_character",
  CHOSEN_DAMAGED_CHARACTER = "chosen_damaged_character",
  CHOSEN_YOUR_DAMAGED_CHARACTER = "chosen_your_damaged_character",
  CHOSEN_OPPOSING_DAMAGED_CHARACTER = "chosen_opposing_damaged_character",
  CHOSEN_CHARACTER_COST_X_OR_LESS = "chosen_character_cost_x_or_less",
  CHOSEN_CHARACTER_STRENGTH_X_OR_LESS = "chosen_character_strength_x_or_less",
  CHOSEN_CHARACTER_NO_DAMAGE = "chosen_character_no_damage",
  CHOSEN_CHARACTER_AT_LOCATION = "chosen_character_at_location",
  CHOSEN_READIED_CHARACTER = "chosen_readied_character",
  CHOSEN_EXERTED_CHARACTER = "chosen_exerted_character",
  CHOSEN_CHALLENGING_CHARACTER = "chosen_challenging_character",
  CHOSEN_CHARACTER_WITH_ABILITY = "chosen_character_with_ability",

  // Multiple character targets
  ALL_CHARACTERS = "all_characters",
  ALL_OPPOSING_CHARACTERS = "all_opposing_characters",
  ALL_YOUR_CHARACTERS = "all_your_characters",
  ALL_OTHER_CHARACTERS = "all_other_characters",
  ALL_YOUR_OTHER_CHARACTERS = "all_your_other_characters",
  ALL_OTHER_OPPOSING_CHARACTERS = "all_other_opposing_characters",
  YOUR_TRAIT_CHARACTERS = "your_trait_characters",
  YOUR_CHARACTERS_WITH_ABILITY = "your_characters_with_ability",
  CHARACTERS_WITH_NAME = "characters_with_name",
  CHARACTERS_WITH_TRAIT = "characters_with_trait",
  CHARACTERS_AT_LOCATIONS = "characters_at_locations",
  CHARACTERS_WITH_COST = "characters_with_cost",
  CHARACTERS_WITH_STRENGTH = "characters_with_strength",
  CHARACTERS_WITH_ABILITY = "characters_with_ability",
  CHALLENGING_CHARACTER = "challenging_character",

  // Character states
  DAMAGED_CHARACTERS = "damaged_characters",
  UNDAMAGED_CHARACTERS = "undamaged_characters",
  READY_CHARACTERS = "ready_characters",
  EXERTED_CHARACTERS = "exerted_characters",
}

export enum ItemTarget {
  CHOSEN_ITEM = "chosen_item",
  CHOSEN_YOUR_ITEM = "chosen_your_item",
  CHOSEN_OPPOSING_ITEM = "chosen_opposing_item",
  ITEMS_WITH_COST = "items_with_cost",
  ALL_ITEMS = "all_items",
  ITEMS_WITH_NAME = "items_with_name",
}

export enum LocationTarget {
  CHOSEN_LOCATION = "chosen_location",
  CHOSEN_YOUR_LOCATION = "chosen_your_location",
  CHOSEN_OPPOSING_LOCATION = "chosen_opposing_location",
  ALL_LOCATIONS = "all_locations",
  NAMED_LOCATION = "named_location",
  DAMAGED_LOCATION = "damaged_location",
}

export enum PlayerTarget {
  YOU = "you",
  CHOSEN_OPPONENT = "chosen_opponent",
  ALL_OPPONENTS = "all_opponents",
  ALL_PLAYERS = "all_players",
  CHOSEN_PLAYER = "chosen_player",
  CHALLENGING_PLAYER = "challenging_player",
  PLAYERS_WITH_ATTRIBUTE = "players_with_attribute",
}

export enum CardTarget {
  CARDS_IN_HAND = "cards_in_hand",
  CARDS_IN_DISCARD = "cards_in_discard",
  CARDS_IN_DECK = "cards_in_deck",
  CARDS_IN_INKWELL = "cards_in_inkwell",
  TOP_CARDS_OF_DECK = "top_cards_of_deck",
  CARDS_WITH_NAME = "cards_with_name",
  CARDS_WITH_TYPE = "cards_with_type",
  CARDS_WITH_TRAIT = "cards_with_trait",
  CARDS_WITH_COST = "cards_with_cost",
}

export enum ZoneTarget {
  HAND = "hand",
  DECK = "deck",
  DISCARD = "discard",
  INKWELL = "inkwell",
  PLAY_AREA = "play_area",
}

export enum CombinedTarget {
  CHARACTERS_ITEMS_LOCATIONS_WITH_COST_X_OR_LESS = "characters_items_locations_with_cost_x_or_less",
  CHALLENGING_CHARACTER_AND_PLAYER = "challenging_character_and_player",
  BOTH_PLAYERS = "both_players",
  CHARACTER_OR_LOCATION = "character_or_location",
  DAMAGED_CHARACTER_OR_LOCATION = "damaged_character_or_location",
}

/**
 * Type that represents any possible target in the game
 */
export type Target =
  | CharacterTarget
  | ItemTarget
  | LocationTarget
  | PlayerTarget
  | CardTarget
  | ZoneTarget
  | CombinedTarget;

/**
 * Interface that represents the target specification with any needed parameters
 */
export interface TargetSpecification {
  targetType: Target;
  parameters?: {
    cost?: number;
    strength?: number;
    count?: number;
    name?: string;
    trait?: string;
    ability?: string;
    // Add other parameter types as needed
  };
}
