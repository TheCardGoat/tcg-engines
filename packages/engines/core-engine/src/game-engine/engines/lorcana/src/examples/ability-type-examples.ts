/**
 * This file provides examples of different ability types found in Lorcana.
 * Each ability type is categorized and accompanied by examples from actual card texts.
 */

export const abilityTypeExamples = {
  // Activated abilities - have a cost and effect, generally formatted as "{cost} - {effect}"
  ACTIVATED: [
    "{E} – Chosen character gets +3 {S} this turn.",
    "{E} – Deal 1 damage to chosen character.",
    "{E}, 1 {I} – Chosen character gains Challenger +2 this turn.",
    "{E}, 2 {I} – Chosen Hero character gains Challenger +2 and Evasive this turn.",
    "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
    "{E}, {E} one of your characters – Ready chosen character. They can't quest for the rest of this turn.",
    "{E}, Banish one of your items – Draw a card.",
    "{E}, Choose and discard a card - Ready this character. He can't quest for the rest of this turn.",
    "{E}, Banish this character − Banish chosen character.",
    "{E}, 2 {I}, Banish one of your items – Deal 5 damage to chosen character.",
  ],

  // Triggered abilities - respond to a specific condition or game event
  TRIGGERED: [
    "When you play this character, gain 1 lore.",
    "Whenever this character quests, chosen opposing character gets -2 {S} until the start of your next turn.",
    "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
    "Whenever this character challenges another character, gain 1 lore.",
    "During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
    "At the start of your turn, if you have a character here, gain 1 lore.",
    "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
    "When this character is banished, deal 5 damage to each opposing character.",
    "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
  ],

  // Static abilities - continuous effects that don't need a trigger
  STATIC: [
    "This character gets +1 {S} for each other character you have in play.",
    "This character gets +1 {L} for each item you have in play.",
    "While this character has no damage, he gets +2 {S} and gains Support.",
    "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "While you have a Puppy character in play, this character gets +1 {W}.",
    "This character can challenge ready characters.",
    "This character can't be challenged.",
    "Your characters with Evasive gain Rush.",
    "Characters with cost 3 or less can't challenge this character.",
    "Your other characters gain Ward.",
  ],

  // Keyword abilities - named abilities that represent a specific game mechanic
  KEYWORD: [
    "Challenger +2",
    "Resist +1",
    "Rush",
    "Evasive",
    "Bodyguard",
    "Ward",
    "Reckless",
    "Singer 5",
    "Support",
    "Vanish",
    "Shift 3",
  ],

  // Replacement effects - replace one game event with another
  REPLACEMENT: [
    "If an effect would cause you to discard one or more cards, you don't discard.",
    "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
    "If you used Shift to play this character, remove all damage from him.",
    "If an effect would cause you to discard one or more cards from your hand during an opponent's turn, you don't discard.",
  ],
};
