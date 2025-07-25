/**
 * This file maps different ways players are referenced in card texts.
 */

export const playerReferenceExamples = {
  // Self references (first person)
  selfReferences: [
    "Your characters gain Rush this turn.",
    "Your Pirate characters gain Resist +1.",
    "Your other characters gain Ward.",
    "If you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "If you have 3 or more other characters in play, gain 2 lore.",
    "You may draw a card.",
    "You pay 1 {I} less for the next character you play this turn.",
    "Discard your hand.",
    "Shuffle your deck.",
  ],

  // Opponent references (second/third person)
  opponentReferences: [
    "Each opponent loses 1 lore.",
    "Chosen opponent loses 1 lore.",
    "Each opponent chooses and discards a card.",
    "Chosen opponent reveals their hand and discards a non-character card of your choice.",
    "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
    "If an opponent has more cards in their hand than you, you may draw a card.",
    "At the start of your turn, if you have a character with more {S} than each opposing character in play, each opponent loses 1 lore.",
    "Opponents need 25 lore to win the game.",
  ],

  // All player references
  allPlayerReferences: [
    "Each player draws 3 cards.",
    "Each player discards their hand and draws 7 cards.",
    "Each player plays with the top card of their deck face up.",
    "Each player may reveal a character card from their hand and play it for free.",
    "Each player chooses one of their characters and returns that card to their hand.",
  ],

  // Player choice targets
  playerChoiceTargets: [
    "Chosen player reveals their hand.",
    "Look at the top 4 cards of chosen player's deck.",
    "Put the top 3 cards of chosen player's deck into their discard.",
    "Chosen player draws 5 cards.",
  ],

  // Controller references
  controllerReferences: [
    "Return chosen character to their player's hand.",
    "Return chosen character with cost 2 or less to their player's hand.",
    "Put chosen character into their player's inkwell facedown and exerted.",
    "Chosen player reveals their hand.",
    "Whenever a character is banished while here, you may put that card into your inkwell facedown and exerted.",
  ],

  // Active player references
  activePlayerReferences: [
    "During your turn, this character gains Evasive.",
    "During your turn, whenever a card is put into your inkwell, you may draw a card.",
    "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    "At the start of your turn, if this character has no damage, draw a card.",
    "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
  ],

  // Non-active player references
  nonActivePlayerReferences: [
    "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
    "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
    "Characters can't exert to sing songs until the start of your next turn.",
  ],

  // Targeting specific players by stats/conditions
  conditionalPlayerTargets: [
    "If an opponent has more cards in their hand than you, you may draw a card.",
    "While you have more cards in hand than each opponent, this character gets +2 {L}.",
    "At the end of your turn, if chosen opponent has more cards in their hand than you, you may draw cards until you have the same number.",
    "Each opponent with more Lore than you loses 2 Lore.",
    "At the start of your turn, if you have a character with more {S} than each opposing character in play, each opponent loses 1 lore.",
    "While an opponent has 10 or more lore, this character gets +6 {S}.",
  ],

  // Turn order references
  turnOrderReferences: [
    "At the start of your turn, if this character has no damage, draw a card.",
    "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
    "At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
    "Chosen character gains Reckless during their next turn.",
    "Chosen opposing character can't quest during their next turn.",
    "During your next turn, you may play one additional card.",
    "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
  ],
};
