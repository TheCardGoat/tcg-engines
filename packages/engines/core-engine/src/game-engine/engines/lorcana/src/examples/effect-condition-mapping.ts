/**
 * This file maps effect condition types to example card text snippets.
 * These examples help translate game conditions into programmatic condition types.
 */

export const effectConditionMapping = {
  // Keyword-based conditions
  hasKeyword: [
    "If chosen character has Evasive",
    "While this character has Rush",
    "If that character has Bodyguard",
    "Characters with Evasive gain Rush.",
    "If the chosen character has Ward",
  ],

  // Damage-based conditions
  hasDamage: [
    "While this character has damage, she gets +3 {S}.",
    "When you play this character, you may deal 2 damage to chosen damaged character.",
    "If chosen character has damage",
    "Return chosen damaged character to their player's hand.",
    "While this character has no damage, he gets +2 {S} and gains Support.",
    "If one of your characters was damaged this turn, gain 1 lore.",
  ],

  // Card presence conditions
  hasCardInPlay: [
    "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "While you have a Puppy character in play, this character gets +1 {W}.",
    "This character can't challenge unless you have a Captain character in play.",
    "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
    "If you have an Ally character in play, you may draw a card.",
    "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
  ],

  // Hand-based conditions
  hasCardsInHand: [
    "If you have no cards in your hand, draw a card for each Ally character you have in play.",
    "While you have no cards in your hand, this character can challenge ready characters.",
    "If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
    "While you have more cards in hand than each opponent, this character gets +2 {L}.",
    "If an opponent has more cards in their hand than you, you may draw a card.",
  ],

  // Zone count conditions
  hasZoneCount: [
    "If you have 3 or more other characters in play, gain 2 lore.",
    "For each character you have in play, you pay {I} less to play this character.",
    "While you have 2 or more other exerted characters in play, this character gets +2 {L}.",
    "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
    "If you have 2 or more characters in play, gain 1 lore.",
    "Put a character card with cost 4 or less from your discard into your inkwell facedown and exerted.",
  ],

  // Stat comparison conditions
  statComparison: [
    "While this character has 3 {S} or more, she gets +2 {L}.",
    "Banish chosen opposing character with 5 {S} or more.",
    "While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
    "While this character has 7 {S} or more, he gets +2 {L}.",
    "Whenever this character quests while he has 5 {S} or more, return chosen character with 2 {S} or less to their player's hand.",
    "Characters with cost 3 or less can't challenge this character.",
  ],

  // Player lore comparison
  playerHasMoreLore: [
    "While an opponent has 10 or more lore, this character gets +6 {S}.",
    "At the end of your turn, if you have a character in play with 5 {S} or more, gain 2 lore. If that character has 10 {S} or more, gain 5 lore instead.",
    "Each opponent with more Lore than you loses 2 Lore.",
    "When you play this character, if an opponent has more cards in their hand than you, draw a card.",
  ],
};
