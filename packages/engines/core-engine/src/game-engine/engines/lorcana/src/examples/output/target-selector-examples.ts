/**
 * This file maps different target selector patterns found in card texts.
 * These examples help identify how cards select their targets.
 */

export const targetSelectorExamples = {
  // Single chosen targets
  chosenCharacter: [
    "Chosen character gets +2 {S} this turn.",
    "Chosen character gains Challenger +2 this turn.",
    "Deal 2 damage to chosen character.",
    "Remove up to 2 damage from chosen character.",
    "Return chosen character to their player's hand.",
    "Banish chosen character.",
  ],

  // Targeting specific character types
  chosenSpecificCharacter: [
    "Chosen opposing character gets -2 {S} this turn.",
    "Chosen character of yours gets +3 {S} this turn.",
    "Chosen damaged character gets +3 {S} this turn.",
    "Chosen character with no damage gains Resist +2 until the start of your next turn.",
    "Chosen damaged opposing character can't quest during their next turn.",
    "Chosen Hero character gets +2 {S} this turn.",
    "Chosen Puppy character gets +1 {L} this turn.",
  ],

  // Targeting by card type
  chosenCardType: [
    "Banish chosen item.",
    "Banish chosen location.",
    "Return chosen character, item, or location with cost 2 or less to their player's hand.",
    "Banish chosen damaged character.",
    "Exert chosen opposing item. It can't ready at the start of its next turn.",
    "Banish chosen opposing character with 2 {S} or less.",
  ],

  // Self-referential targeting
  selfReferential: [
    "This character gets +1 {S} for each other character you have in play.",
    "While this character has no damage, he gets +2 {S} and gains Support.",
    "This character can challenge ready characters.",
    "This character can't be challenged.",
    "This character gains Challenger +2 this turn.",
    "When this character is banished, gain 1 lore.",
  ],

  // Multiple or all targets
  multipleTargets: [
    "All opposing characters get -1 {S} until the start of your next turn.",
    "Ready all your characters.",
    "Exert all opposing characters.",
    "Deal 1 damage to each opposing character.",
    "Your characters gain Rush this turn.",
    "Your Pirate characters gain Resist +1.",
    "Your other characters gain Ward.",
    "Opposing characters can't quest during their next turn.",
    "Banish all opposing characters with 2 {S} or less.",
  ],

  // Targeting by ownership/control
  targetByOwnership: [
    "Your characters gain Rush this turn.",
    "Your Pirate characters gain Resist +1.",
    "Opposing characters can't quest during their next turn.",
    "Each opponent loses 1 lore.",
    "Chosen opponent loses 1 lore.",
    "Each player draws a card.",
    "Each opponent chooses and discards a card.",
    "Each player discards their hand and draws 7 cards.",
    "Your characters with Evasive gain Rush.",
  ],

  // Targeting with quantity restrictions
  targetWithQuantity: [
    "Up to 2 chosen characters get -1 {S} this turn.",
    "Deal 1 damage to up to 2 chosen characters.",
    "Remove up to 3 damage from chosen character.",
    "Remove up to 1 damage from each of your characters.",
    "Return up to 2 character cards with cost 2 or less each from your discard to your hand.",
    "Remove up to 2 damage from each of your characters with Bodyguard.",
  ],

  // Location-based targeting
  locationBasedTargets: [
    "Characters get +1 {S} while here.",
    "Characters gain Rush while here.",
    "Characters gain Ward and Evasive while here.",
    "Characters with Support get +1 {L} and +2 {W} while here.",
    "While this character is at a location, it gets +2 {S}.",
    "Whenever a character quests while here, remove up to 2 damage from them.",
  ],

  // Player targeting
  playerTarget: [
    "Each player draws a card.",
    "Each opponent loses 1 lore.",
    "Chosen opponent loses 1 lore.",
    "Each player discards their hand and draws 7 cards.",
    "Chosen player reveals their hand.",
    "Look at the top 4 cards of chosen player's deck.",
    "Each player plays with the top card of their deck face up.",
  ],

  // Cost-based targeting
  costBasedTargets: [
    "Banish chosen character with cost 3 or less.",
    "Return chosen character with cost 2 or less to their player's hand.",
    "Characters with cost 3 or less can't challenge this character.",
    "Return a character card with cost 2 or less from your discard to your hand.",
    "You may play a character with cost 5 or less for free.",
    "Search your deck for a character card with cost 3 or less and reveal it to all players.",
  ],

  // Stat-based targeting
  statBasedTargets: [
    "Banish chosen opposing character with 2 {S} or less.",
    "Banish chosen character with 5 {S} or more.",
    "While this character has 3 {S} or more, she gets +2 {L}.",
    "Whenever you play a character with 5 {S} or more, you may exert them to gain 2 lore.",
    "Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
  ],
};
