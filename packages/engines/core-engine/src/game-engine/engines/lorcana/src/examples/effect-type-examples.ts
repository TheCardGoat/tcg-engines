/**
 * This file provides concrete examples of different effect types found in the game.
 * Each effect type is categorized and accompanied by examples from actual card texts.
 */

export const effectTypeExamples = {
  // Resource Management
  DRAW_CARDS: [
    "Draw a card.",
    "Draw 2 cards.",
    "Draw 3 cards.",
    "Each player draws 3 cards.",
    "If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
  ],

  DISCARD_CARDS: [
    "Choose and discard a card.",
    "Each opponent chooses and discards a card.",
    "Discard your hand.",
    "Each player discards their hand and draws 7 cards.",
    "Chosen opponent reveals their hand and discards a non-character card of your choice.",
  ],

  GAIN_LORE: [
    "Gain 1 lore.",
    "Gain 2 lore.",
    "Gain 3 lore.",
    "Each opponent loses 1 lore and you gain 1 lore.",
    "Gain lore equal to the {L} of chosen opposing character.",
    "Gain lore equal to that location's {L}.",
  ],

  REDUCE_INK_COST: [
    "You pay 1 {I} less for the next character you play this turn.",
    "You pay 2 {I} less for the next item you play this turn.",
    "You pay 1 {I} less for the next action you play this turn.",
    "You pay 1 {I} less to play Seven Dwarfs characters.",
    "If you have a location here, you pay 2 {I} less to move a character of yours here.",
  ],

  // Card Movement
  INKWELL_MANIPULATION: [
    "Put the top card of your deck into your inkwell facedown and exerted.",
    "Put a card from your hand into your inkwell facedown and exerted.",
    "Put chosen character of yours into your inkwell facedown and exerted.",
    "When this character is banished, you may put this card into your inkwell facedown and exerted.",
    "Put all Puppy character cards from your discard into your inkwell facedown and exerted.",
  ],

  RETURN_TO_HAND: [
    "Return chosen character to their player's hand.",
    "Return chosen damaged character to their player's hand.",
    "Return one of your other characters to your hand.",
    "Return chosen character with cost 2 or less to their player's hand.",
    "Return all other exerted characters to their players' hands.",
  ],

  PLAY_FROM_DISCARD: [
    "Play a character card with cost 5 or less from your discard for free.",
    "Return a character card with cost 2 or less from your discard to your hand.",
    "You may play that character for free.",
    "Return a Racer character card with cost 6 or less from your discard to your hand.",
    "Return an action card from your discard to your hand.",
  ],

  // Combat/Character Stats
  MODIFY_STRENGTH: [
    "Chosen character gets +2 {S} this turn.",
    "Chosen character gets -2 {S} this turn.",
    "Chosen opposing character gets -3 {S} this turn.",
    "This character gets +1 {S} for each other character you have in play.",
    "All opposing characters get -2 {S} until the start of your next turn.",
  ],

  ADD_ABILITY: [
    "Chosen character gains Challenger +2 this turn.",
    "Chosen character gains Evasive until the start of your next turn.",
    "Chosen character gains Rush this turn.",
    "Chosen character gains Support this turn.",
    "Chosen character gains Resist +2 until the start of your next turn.",
    "Chosen character gains Ward until the start of your next turn.",
  ],

  DEAL_DAMAGE: [
    "Deal 1 damage to chosen character.",
    "Deal 2 damage to chosen character.",
    "Deal 3 damage to chosen character.",
    "Deal 5 damage to chosen character or location.",
    "Deal 1 damage to each opposing character.",
    "Put 1 damage counter on chosen character.",
  ],

  REMOVE_DAMAGE: [
    "Remove up to 1 damage from chosen character.",
    "Remove up to 2 damage from chosen character.",
    "Remove up to 3 damage from chosen character.",
    "Remove up to 2 damage from each of your characters.",
    "Remove up to 1 damage from each of your Puppy characters.",
  ],

  // Control Effects
  EXERT: [
    "Exert chosen character.",
    "Exert chosen opposing character.",
    "Exert all opposing characters.",
    "Exert chosen opposing item. It can't ready at the start of its next turn.",
    "Exert chosen damaged character.",
  ],

  READY: [
    "Ready chosen character.",
    "Ready chosen character. They can't quest for the rest of this turn.",
    "Ready all your characters. They can't quest for the rest of this turn.",
    "Ready this character. He can't quest for the rest of this turn.",
    "Ready another chosen character of yours.",
  ],

  BANISH: [
    "Banish chosen character.",
    "Banish chosen item.",
    "Banish chosen damaged character.",
    "Banish chosen character with cost 3 or less.",
    "Banish chosen opposing character with 2 {S} or less.",
    "Banish all opposing characters with 2 {S} or less.",
  ],

  // Deck Manipulation
  DECK_MANIPULATION: [
    "Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    "Look at the top 3 cards of your deck and put them back in any order.",
    "Look at the top 4 cards of your deck. Put one on the top of your deck and the rest on the bottom.",
    "Look at the top 5 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    "Reveal the top card of your deck. If it's a character card, you may play that character for free.",
  ],

  SEARCH_DECK: [
    "Search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
    "Search your deck for a character card and reveal that card to all players. Put that card into your hand and shuffle your deck.",
    "Search your deck for a character card with cost 3 or less and reveal that card to all players. Put that card into your hand and shuffle your deck.",
    "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
    "Search your deck for an item card or a Robot character card and reveal it to all players. Shuffle your deck and put that card on top of it.",
  ],

  // Movement and Location Effects
  CHARACTER_MOVEMENT: [
    "Move a character of yours to a location for free.",
    "Move up to 2 characters of yours to the same location for free.",
    "Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
    "While this character is at a location, it gets +2 {S}.",
    "Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
  ],

  // Conditional Effects
  CONDITIONAL_EFFECT: [
    "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
    "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "During your turn, if you've played 3 or more actions this turn, you may play this character for free.",
    "While you have an item in play, this character can't be challenged.",
    "While you have no cards in your hand, this character can challenge ready characters.",
    "At the start of your turn, if you have a character with more {S} than each opposing character in play, each opponent loses 1 lore and you gain lore equal to the lore lost.",
  ],

  // Restriction Effects
  QUEST_CHALLENGE_RESTRICTION: [
    "This character can't challenge unless you have a Captain character in play.",
    "This character can't challenge the turn they're played.",
    "This character can challenge ready characters.",
    "Damaged characters can't challenge your characters.",
    "Characters with cost 3 or less can't challenge this character.",
    "This character can't quest or challenge for the rest of this turn.",
    "Chosen opposing character can't quest during their next turn.",
    "This character can't quest unless you have another Seven Dwarfs character in play.",
    "Characters can't exert to sing songs until the start of your next turn.",
  ],

  // Special Abilities
  TRIGGERED_EFFECT: [
    "Whenever this character quests, chosen opposing character gets -2 {S} until the start of your next turn.",
    "Whenever this character challenges another character, gain 1 lore.",
    "Whenever you play a song, you may draw a card.",
    "When you play this character, you may draw a card.",
    "Whenever you play an item, this character gets +1 {L} this turn.",
    "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
    "When this character is banished, gain 2 lore.",
    "Whenever one of your characters with Bodyguard is banished, you may draw a card.",
  ],

  LOOK_AT_HAND: [
    "Look at each opponent's hand.",
    "Chosen opponent reveals their hand.",
    "Each player reveals their hand.",
  ],

  // Item Effects
  ITEM_EFFECT: [
    "Banish this item – Remove up to 2 damage from chosen character.",
    "Banish this item – Chosen character gains Resist +2 until the start of your next turn.",
    "{E} – You pay 2 {I} less for the next action you play this turn.",
    "{E}, 2 {I} – Chosen character gets -2 {S} this turn.",
    "{E}, Banish this item – Banish chosen Dragon character.",
    "When you play this item, you may draw a card.",
  ],

  // Location Effects
  LOCATION_EFFECT: [
    "Characters get +1 {S} while here.",
    "Characters gain Rush while here.",
    "Characters gain Ward and Evasive while here.",
    "Characters with Support get +1 {L} and +2 {W} while here.",
    "At the start of your turn, if you have a character here, gain 1 lore.",
    "During your turn, the first time you move a character here, you may deal 1 damage to chosen character.",
    "Whenever a character quests while here, remove up to 2 damage from them.",
    "Each player plays with the top card of their deck face up.",
  ],

  // Song Effects
  SONG_EFFECT: [
    "(A character with cost 2 or more can {E} to sing this song for free.)",
    "(A character with cost 3 or more can {E} to sing this song for free.)",
    "Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
  ],

  // Move Damage Counters
  MOVE_DAMAGE: [
    "Move 1 damage counter from chosen character to chosen opposing character.",
    "Move up to 2 damage counters from chosen character to chosen opposing character.",
    "Move 1 damage counter from each damaged character you have in play to chosen opposing character.",
  ],
};
