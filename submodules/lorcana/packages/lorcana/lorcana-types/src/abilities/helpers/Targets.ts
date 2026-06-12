/**
 * Target Helpers for Lorcana Abilities
 *
 * Provides a fluent API for building target definitions.
 * These helpers make it easy to construct common target patterns.
 *
 * @example
 * ```typescript
 * const target = Targets.Self();
 * const target = Targets.ChallengedCharacter();
 * const target = Targets.YourCharacters();
 * ```
 */

import type { CardTarget, CharacterTarget, PlayerTarget } from "../target-types";

export const Targets = {
  // ========================================================================
  // Self/Controller Targets
  // ========================================================================

  /**
   * "This character" or "this card"
   */
  Self: (): CardTarget => "SELF",

  /**
   * "You" (for player-targeted effects)
   */
  Controller: (): PlayerTarget => "CONTROLLER",

  /**
   * "Your opponent"
   */
  Opponent: (): PlayerTarget => "OPPONENT",

  // ========================================================================
  // Character Targets
  // ========================================================================

  /**
   * "Chosen character"
   */
  ChosenCharacter: (): CharacterTarget => "CHOSEN_CHARACTER",

  /**
   * "Challenged character"
   */
  ChallengedCharacter: (): CharacterTarget => "CHALLENGED_CHARACTER",

  /**
   * "Challenging character"
   */
  ChallengingCharacter: (): CharacterTarget => "CHALLENGING_CHARACTER",

  // ========================================================================
  // Your Characters
  // ========================================================================

  /**
   * "Your characters"
   */
  YourCharacters: (): CharacterTarget => "YOUR_CHARACTERS",

  /**
   * "Your other characters"
   */
  YourOtherCharacters: (): CharacterTarget => "YOUR_OTHER_CHARACTERS",

  // ========================================================================
  // Opponent Characters
  // ========================================================================

  /**
   * "Opponent's characters"
   */
  OpponentCharacters: (): CharacterTarget => "ALL_OPPOSING_CHARACTERS",

  /**
   * "Opposing characters"
   */
  OpposingCharacters: (): CharacterTarget => "OPPOSING_CHARACTERS",

  // ========================================================================
  // Classification-based Targets
  // ========================================================================

  /**
   * "Your Musketeer characters"
   */
  YourMusketeers: (): CharacterTarget => "YOUR_MUSKETEER_CHARACTERS",

  /**
   * "Your Villain characters"
   */
  YourVillains: (): CharacterTarget => "YOUR_VILLAIN_CHARACTERS",

  /**
   * "Your Broom characters"
   */
  YourBrooms: (): CharacterTarget => "YOUR_BROOM_CHARACTERS",

  /**
   * "Your other Steel characters"
   */
  YourOtherSteelCharacters: (): CharacterTarget => "YOUR_OTHER_STEEL_CHARACTERS",

  /**
   * "Your other Amethyst characters"
   */
  YourOtherAmethystCharacters: (): CharacterTarget => "YOUR_OTHER_AMETHYST_CHARACTERS",

  // ========================================================================
  // Zone-based Targets
  // ========================================================================

  /**
   * "Character from discard"
   */
  CharacterFromDiscard: (): CharacterTarget => "CHOSEN_CHARACTER_IN_DISCARD",

  /**
   * "Characters at this location"
   */
  CharactersHere: (): CharacterTarget => "CHARACTERS_HERE",

  // ========================================================================
  // All/Each Targets
  // ========================================================================

  /**
   * "All characters"
   */
  AllCharacters: (): CharacterTarget => "ALL_CHARACTERS",

  /**
   * "All your characters"
   */
  AllYourCharacters: (): CharacterTarget => "YOUR_CHARACTERS",

  /**
   * "All opponent characters"
   */
  AllOpponentCharacters: (): CharacterTarget => "ALL_OPPOSING_CHARACTERS",

  // ========================================================================
  // Item Targets
  // ========================================================================

  /**
   * "Your items"
   */
  YourItems: (): CardTarget => "YOUR_ITEMS",

  /**
   * "Chosen item"
   */
  ChosenItem: (): CardTarget => "CHOSEN_ITEM",

  // ========================================================================
  // Location Targets
  // ========================================================================

  /**
   * "Your locations"
   */
  YourLocations: (): CardTarget => "YOUR_LOCATIONS",

  /**
   * "Chosen location"
   */
  ChosenLocation: (): CardTarget => "CHOSEN_LOCATION",

  // ========================================================================
  // Generic Targets
  // ========================================================================

  /**
   * "Any character"
   */
  AnyCharacter: (): CharacterTarget => "ALL_CHARACTERS",

  /**
   * "All characters"
   */
  AllCharactersTarget: (): CharacterTarget => "ALL_CHARACTERS",
};
