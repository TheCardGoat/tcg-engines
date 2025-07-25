/**
 * This file maps effect types to example card text snippets.
 * These examples help translate game text into programmatic effect types.
 */

export const effectTypeMapping = {
  // Card state modification effects
  addKeyword: [
    "Chosen character gains Challenger +2 this turn.",
    "Chosen character gains Evasive until the start of your next turn.",
    "Chosen character gains Rush this turn.",
    "Chosen character gains Support this turn.",
    "Chosen character gains Resist +2 until the start of your next turn.",
    "Chosen character gains Ward until the start of your next turn.",
  ],

  removeKeyword: [
    "This character loses Reckless this turn.",
    "Chosen character loses Challenger until the start of your next turn.",
    "Remove all keywords from chosen character until end of turn.",
  ],

  modifyStat: [
    "Chosen character gets +2 {S} this turn.",
    "Chosen character gets -2 {S} this turn.",
    "All opposing characters get -1 {S} until the start of your next turn.",
    "This character gets +1 {S} for each other character you have in play.",
    "Chosen character gets +1 {L} this turn.",
  ],

  dealDamage: [
    "Deal 1 damage to chosen character.",
    "Deal 2 damage to chosen character.",
    "Deal 3 damage to chosen character.",
    "Deal 1 damage to each opposing character.",
    "Put 1 damage counter on chosen character.",
  ],

  removeDamage: [
    "Remove up to 1 damage from chosen character.",
    "Remove up to 2 damage from chosen character.",
    "Remove up to 3 damage from chosen character.",
    "Remove up to 2 damage from each of your characters.",
    "Remove all damage from chosen character.",
  ],

  moveDamage: [
    "Move 1 damage counter from chosen character to chosen opposing character.",
    "Move up to 2 damage counters from chosen character to chosen opposing character.",
    "Move 1 damage counter from each damaged character you have in play to chosen opposing character.",
  ],

  preventDamage: [
    "Chosen character takes no damage from challenges this turn.",
    "Prevent all damage that would be dealt to chosen character this turn.",
    "If chosen character would be dealt damage this turn, prevent 2 of that damage.",
  ],

  exert: [
    "Exert chosen character.",
    "Exert chosen opposing character.",
    "Exert all opposing characters.",
    "Exert chosen damaged character.",
  ],

  ready: [
    "Ready chosen character.",
    "Ready chosen character of yours.",
    "Ready all your characters.",
    "Ready another chosen character of yours.",
  ],

  preventReady: [
    "Chosen character can't ready at the start of their next turn.",
    "Chosen opposing character can't ready at the start of their next turn.",
    "Characters exerted this way do not ready at the start of their next turn.",
  ],

  challengeRestriction: [
    "This character can challenge ready characters.",
    "This character can't challenge unless you have a Captain character in play.",
    "Characters with cost 3 or less can't challenge this character.",
    "Damaged characters can't challenge your characters.",
    "This character can't be challenged.",
  ],

  questRestriction: [
    "This character can't quest for the rest of this turn.",
    "Chosen opposing character can't quest during their next turn.",
    "This character can't quest unless you have another Seven Dwarfs character in play.",
  ],

  // Zone movement effects
  banish: [
    "Banish chosen character.",
    "Banish chosen item.",
    "Banish chosen damaged character.",
    "Banish all opposing characters with 2 {S} or less.",
  ],

  return: [
    "Return chosen character to their player's hand.",
    "Return chosen damaged character to their player's hand.",
    "Return chosen character with cost 2 or less to their player's hand.",
    "Return all other exerted characters to their players' hands.",
  ],

  moveToLocation: [
    "Move a character of yours to a location for free.",
    "Move up to 2 characters of yours to the same location for free.",
  ],

  putIntoInkwell: [
    "Put the top card of your deck into your inkwell facedown and exerted.",
    "Put a card from your hand into your inkwell facedown and exerted.",
    "Put chosen character of yours into your inkwell facedown and exerted.",
    "Put chosen character into their player's inkwell facedown and exerted.",
  ],

  search: [
    "Search your deck for a card named Wrong Lever! and reveal it to all players. Put that card into your hand and shuffle your deck.",
    "Search your deck for a character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
    "Search your deck for a character card with cost 3 or less and reveal it to all players. Put that card into your hand and shuffle your deck.",
  ],

  reveal: [
    "Reveal the top card of your deck.",
    "Chosen opponent reveals their hand.",
    "Each player reveals their hand.",
    "You may reveal a song card in your hand to gain 1 lore.",
  ],

  lookAt: [
    "Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    "Look at the top 3 cards of your deck and put them back in any order.",
    "Look at the top 4 cards of your deck. Put one on the top of your deck and the rest on the bottom.",
    "Look at each opponent's hand.",
  ],

  shuffle: ["Shuffle your deck.", "Then shuffle your deck."],

  // Card flow effects
  draw: [
    "Draw a card.",
    "Draw 2 cards.",
    "Draw 3 cards.",
    "Each player draws 3 cards.",
    "If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
  ],

  discard: [
    "Choose and discard a card.",
    "Each opponent chooses and discards a card.",
    "Discard your hand.",
    "Chosen opponent reveals their hand and discards a non-character card of your choice.",
  ],

  topOrBottom: [
    "Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    "Put the rest on the bottom of your deck in any order.",
  ],

  playCard: [
    "You may play that character for free.",
    "Play a character card with cost 5 or less from your discard for free.",
    "You may play an item for free.",
  ],

  costReduction: [
    "You pay 1 {I} less for the next character you play this turn.",
    "You pay 2 {I} less for the next item you play this turn.",
    "You pay 1 {I} less to play Seven Dwarfs characters.",
    "If you have a location here, you pay 2 {I} less to move a character of yours here.",
  ],

  // Game state effects
  gainLore: [
    "Gain 1 lore.",
    "Gain 2 lore.",
    "Gain 3 lore.",
    "Gain lore equal to the {L} of chosen opposing character.",
  ],

  loseLore: [
    "Each opponent loses 1 lore.",
    "Chosen opponent loses 1 lore.",
    "Each opponent loses 2 lore.",
  ],

  // Conditional effects
  ifThenElse: [
    "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
    "If you used Shift to play them, they get +4 {S} this turn.",
    "At the start of your turn, if this character has no damage, draw a card.",
    "If an effect would cause you to discard one or more cards, you don't discard.",
  ],

  chooseOne: [
    "Choose one:\\n- Banish chosen item.\\n- Deal 2 damage to chosen damaged character.",
    "When this character is banished, choose one:\\n- Put 2 damage counters on all opposing characters.\\n- Banish all opposing items.\\n- Banish all opposing locations.",
    "At the start of your turn, choose one: \\n• Each player draws a card. \\n• Each player chooses and discards a card.",
  ],

  optional: [
    "You may draw a card.",
    "You may deal 2 damage to chosen damaged character.",
    "You may put this card into your inkwell facedown and exerted.",
    "You may remove up to 2 damage from chosen character.",
  ],

  // Player choice effects
  chooseTarget: [
    "Chosen character gets +2 {S} this turn.",
    "Chosen opposing character gets -2 {S} this turn.",
    "Chosen character gains Challenger +2 this turn.",
    "Deal 2 damage to chosen character.",
  ],

  // Utility effects
  resolveTriggeredAbility: [
    "Whenever this character quests, you may draw a card.",
    "When this character is banished, gain 1 lore.",
    "At the start of your turn, if you have a character here, gain 1 lore.",
    "When you play this character, you may deal 2 damage to chosen damaged character.",
  ],
};
