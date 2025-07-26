/**
 * This file provides examples of different trigger timings found in Lorcana.
 * Each timing is categorized and accompanied by examples from actual card texts.
 */

export const triggerTimingExamples = {
  // Character Entry Triggers
  ON_PLAY: [
    "When you play this character, gain 1 lore.",
    "When you play this character, you may draw a card.",
    "When you play this character, chosen opposing character gets -2 {S} this turn.",
    "When you play this character, each opponent loses 1 lore.",
    "When you play this character, you may deal 2 damage to chosen damaged character.",
    "When you play this character, chosen character gains Ward until the start of your next turn.",
  ],

  WHENEVER_YOU_PLAY_CHARACTER: [
    "Whenever you play a character, this character gets +1 {S} this turn.",
    "Whenever you play another character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
    "Whenever you play a character with cost 5 or more, you may exert them to gain 2 lore.",
    "Whenever you play another character, they gain Rush, Reckless, and Evasive this turn.",
  ],

  WHENEVER_OPPONENT_PLAYS_CHARACTER: [
    "When an opponent plays a character, return this character to your hand.",
    "Whenever an opponent plays a character, deal 1 damage to this character.",
  ],

  // Quest-Related Triggers
  WHENEVER_THIS_CHARACTER_QUESTS: [
    "Whenever this character quests, you may draw a card.",
    "Whenever this character quests, chosen opposing character gets -2 {S} until the start of your next turn.",
    "Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
    "Whenever this character quests, chosen opposing character can't quest during their next turn.",
    "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
    "Whenever this character quests, you may remove up to 2 damage from chosen character.",
  ],

  WHENEVER_CHARACTER_QUESTS: [
    "Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
    "Whenever one of your characters quests while at a location, draw a card.",
    "Whenever a character quests while here, remove up to 2 damage from them.",
  ],

  // Challenge-Related Triggers
  WHENEVER_THIS_CHARACTER_CHALLENGES: [
    "Whenever this character challenges another character, gain 1 lore.",
    "Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
    'Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.',
    "Whenever this character challenges another character, your other characters get +1 {L} this turn.",
  ],

  WHENEVER_CHARACTER_CHALLENGES: [
    "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
    "Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
    "Whenever one of your characters challenges another character, if it's the second challenge this turn, you gain 3 lore.",
    "Whenever one of your characters challenges, you may move 1 damage counter from chosen character to chosen opposing character.",
  ],

  WHEN_THIS_CHARACTER_IS_CHALLENGED: [
    "Whenever this character is challenged, the challenging player chooses and discards a card.",
    "Whenever this character is challenged, you may draw a card.",
    "Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
    "While this character is being challenged, the challenging character gets -1 {S}.",
  ],

  WHENEVER_YOUR_CHARACTER_IS_CHALLENGED: [
    "Whenever one of your characters is challenged, you may put the top card of your deck into your inkwell facedown and exerted.",
    "Whenever a character of yours is challenged while this character is exerted, the challenging character gets -3 {S} this turn unless their player pays 3 {I}.",
  ],

  // Banish-Related Triggers
  WHEN_THIS_CHARACTER_IS_BANISHED: [
    "When this character is banished, deal 5 damage to each opposing character.",
    "When this character is banished, you may draw a card.",
    "When this character is banished, gain 1 lore.",
    "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    "When this character is banished in a challenge, return this card to your hand.",
  ],

  WHEN_THIS_CHARACTER_IS_BANISHED_IN_CHALLENGE: [
    "When this character is banished in a challenge, return this card to your hand.",
    "When this character is challenged and banished, banish the challenging character.",
    "When this character is challenged and banished, you may return chosen character to their player's hand.",
    "When this character is banished in a challenge, return this card to your hand and gain 1 lore.",
  ],

  WHENEVER_CHARACTER_IS_BANISHED: [
    "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    "During your turn, whenever one of your characters banishes another character in a challenge, gain 2 lore.",
    "During an opponent's turn, whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it's a character card with cost 5 or less, you may play that character for free.",
    "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
    "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
  ],

  // Turn Phase Triggers
  START_OF_TURN: [
    "At the start of your turn, if this character has no damage, draw a card.",
    "At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
    "At the start of your turn, if an opposing character has damage, gain 1 lore.",
    "At the start of your turn, if you have a character with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
    "At the start of your turn, if you have a character here, gain 1 lore.",
    "At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
  ],

  END_OF_TURN: [
    "At the end of your turn, if this character is exerted, you may ready another chosen character of yours and remove all damage from them.",
    "At the end of your turn, if this character is exerted, you may ready your other characters.",
    "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
    "At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
    "At the end of your turn, put all the cards in your hand on the bottom of your deck in any order.",
    "At the end of each opponent's turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
  ],

  // Action-Related Triggers
  WHENEVER_YOU_PLAY_ACTION: [
    "Whenever you play an action, this character gets +2 {S} this turn.",
    "Whenever you play an action, you may give chosen character +2 {S} this turn.",
    "Whenever you play an action while this character is exerted, gain 1 lore.",
    "Whenever you play a second action in a turn, gain 3 lore.",
    "Whenever you play an action, gain 1 lore.",
  ],

  WHENEVER_YOU_PLAY_SONG: [
    "Whenever you play a song, you may draw a card.",
    "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
    "Whenever this character sings a song, you may draw a card for each character you have in play.",
    "Whenever one of your characters sings a song, you may ready those characters.",
    "Whenever one or more of your characters sings a song, gain 1 lore.",
    "Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
    "Whenever one of your characters sings a song, chosen opponent reveals their hand.",
    "Whenever one of your characters sings a song, you may search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  ],

  WHENEVER_YOU_PLAY_ITEM: [
    "Whenever you play an item, this character gets +1 {L} this turn.",
    "Whenever you play an item, you may ready this character.",
    "Whenever you play another item, you may pay 1 {I} to draw a card.",
  ],

  // Inkwell-Related Triggers
  WHENEVER_CARD_TO_INKWELL: [
    "During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
    "During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
    "During your turn, whenever a card is put into your inkwell, you may give chosen character -2 {S} this turn.",
    "During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
    "During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
    "During your turn, whenever a card is put into your inkwell, you may draw a card, then choose and discard a card.",
    "Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
  ],

  // Damage-Related Triggers
  WHEN_CHARACTER_IS_DAMAGED: [
    "When this character is damaged, deal the same amount of damage to a chosen opposing character.",
    "During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.",
  ],

  // Ready-Related Triggers
  WHENEVER_YOU_READY_THIS_CHARACTER: [
    "Once during your turn, whenever you ready this character, you may draw a card.",
    "Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
    "Whenever this character is ready, they gain +1 {S} for each damage on them.",
  ],

  // Special Triggers
  WHILE_CONDITION: [
    "While this character has 3 {S} or more, she gets +2 {L}.",
    "While this character has no damage, he gets +2 {S} and gains Support.",
    "While you have a character named Hades in play, this character gains Challenger +2.",
    "While you have a Puppy character in play, this character gets +1 {W}.",
    "While you have another character in play, this character gets +2 {S}.",
    "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
    "While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
    "While this character has damage, she gets +3 {S}.",
  ],

  NEXT_TURN_RESTRICTIONS: [
    "Chosen opposing character can't quest during their next turn.",
    "Chosen opposing character can't challenge during their next turn.",
    "Chosen opposing character can't ready at the start of their next turn.",
    "Chosen character gains Reckless during their next turn.",
    "Opposing damaged characters gain Reckless during their next turn.",
  ],
};
