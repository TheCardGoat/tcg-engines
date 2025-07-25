/**
 * This file maps how card types and game zones are referenced in card texts.
 */

export const cardTypesZonesExamples = {
  // Character references
  characterReferences: [
    "Chosen character gets +2 {S} this turn.",
    "This character gets +1 {S} for each other character you have in play.",
    "Chosen opposing character gets -2 {S} this turn.",
    "Chosen character of yours gets +3 {S} this turn.",
    "Return chosen character to their player's hand.",
    "Banish chosen character.",
    "Your characters gain Rush this turn.",
    "Your Pirate characters gain Resist +1.",
  ],

  // Item references
  itemReferences: [
    "Banish chosen item.",
    "When you play this item, you may draw a card.",
    "{E}, Banish one of your items – Draw a card.",
    "Banish this item – Chosen character gains Ward until the start of your next turn.",
    "Whenever you play an item, this character gets +1 {L} this turn.",
    "Whenever you play an item, you may ready this character.",
  ],

  // Location references
  locationReferences: [
    "Banish chosen location.",
    "Characters get +1 {S} while here.",
    "Characters gain Rush while here.",
    "Move a character of yours to a location for free.",
    "While this character is at a location, it gets +2 {S}.",
    "Remove up to 2 damage from chosen location.",
  ],

  // Action references
  actionReferences: [
    "Whenever you play an action, this character gets +2 {S} this turn.",
    "Whenever you play an action, gain 1 lore.",
    "Whenever you play an action that isn't a song, chosen opposing character gains Reckless.",
    "You pay 1 {I} less for the next action you play this turn.",
    "Whenever you play a second action in a turn, gain 3 lore.",
  ],

  // Song references
  songReferences: [
    "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
    "Whenever you play a song, you may draw a card.",
    "Whenever this character sings a song, you may draw a card for each character you have in play.",
    "Whenever one of your characters sings a song, you may ready those characters.",
    "Whenever one or more of your characters sings a song, gain 1 lore.",
    "(A character with cost 3 or more can {E} to sing this song for free.)",
    "Characters can't exert to sing songs until the start of your next turn.",
  ],

  // Zone: Hand
  handZoneReferences: [
    "Return chosen character to their player's hand.",
    "Return chosen damaged character to their player's hand.",
    "Discard your hand.",
    "Chosen opponent reveals their hand and discards a non-character card of your choice.",
    "If you have no cards in your hand, draw a card for each Ally character you have in play.",
    "Each player discards their hand and draws 7 cards.",
    "Put all the cards in your hand on the bottom of your deck in any order.",
  ],

  // Zone: Play
  playZoneReferences: [
    "This character gets +1 {S} for each other character you have in play.",
    "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "While you have a Puppy character in play, this character gets +1 {W}.",
    "If you have 3 or more other characters in play, gain 2 lore.",
    "When this character leaves play, look at the top 2 cards of your deck.",
    "While you have an item in play, this character can't be challenged.",
  ],

  // Zone: Inkwell
  inkwellZoneReferences: [
    "Put the top card of your deck into your inkwell facedown and exerted.",
    "Put a card from your hand into your inkwell facedown and exerted.",
    "During your turn, whenever a card is put into your inkwell, you may draw a card.",
    "Put chosen character into their player's inkwell facedown and exerted.",
    "Put chosen character of yours into your inkwell facedown and exerted.",
    "Each player exerts all the cards in their inkwell.",
    "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
  ],

  // Zone: Discard
  discardZoneReferences: [
    "Return a character card with cost 2 or less from your discard to your hand.",
    "Play a character card with cost 5 or less from your discard for free.",
    "Return an action card from your discard to your hand.",
    "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
    "Return a Racer character card with cost 6 or less from your discard to your hand.",
    "Return an item card from your discard to your hand.",
    "Put the top 3 cards of chosen player's deck into their discard.",
  ],

  // Zone: Deck
  deckZoneReferences: [
    "Look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    "Look at the top 3 cards of your deck and put them back in any order.",
    "Search your deck for a character card and reveal it to all players. Put that card into your hand and shuffle your deck.",
    "Put the rest on the bottom of your deck in any order.",
    "Each player plays with the top card of their deck face up.",
    "Reveal the top card of your deck. If it's a character card, you may play that character for free.",
    "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
  ],

  // Card classification references
  classificationReferences: [
    "Your Puppy characters get +1 {W}.",
    "Your Pirate characters gain Resist +1.",
    "Your Hero characters get +1 {S}.",
    "Your Villain characters gain Support.",
    "Your other Illusion characters gain Challenger +1.",
    "If you have an Ally character in play, you may draw a card.",
    "Return an Illusion character card from your discard to your hand.",
    "Banish chosen Dragon character.",
    "Chosen Racer character gets +4 {S} this turn.",
    "Your Princess characters gain Ward.",
    "Your Knight characters gain Challenger +1.",
    "Chosen Hero character gets +2 {S} this turn.",
  ],
};
