/**
 * This file maps trigger timing enums to example card text snippets.
 * Each trigger timing corresponds to specific phrases found on cards.
 */

export const triggerTimingMapping = {
  // Character play triggers
  onPlay: [
    "When you play this character, gain 1 lore.",
    "When you play this character, chosen opposing character gets -2 {S} this turn.",
    "When you play this character, you may deal 2 damage to chosen damaged character.",
    "When you play this character, you may draw a card.",
  ],

  onPlayCharacter: [
    "Whenever you play a character, this character gets +1 {S} this turn.",
    "Whenever you play another character, look at the top card of your deck.",
    "Whenever you play a Floodborn character, if you used Shift to play them, you may draw a card.",
  ],

  onPlayItem: [
    "Whenever you play an item, this character gets +1 {L} this turn.",
    "Whenever you play an item, you may ready this character.",
    "Whenever you play an item, this character gets +2 {S} this turn.",
  ],

  onPlayAction: [
    "Whenever you play an action, this character gets +2 {S} this turn.",
    "Whenever you play an action that isn't a song, chosen opposing character gains Reckless.",
    "Whenever you play an action that isn't a song, you may ready chosen Pirate character.",
  ],

  onPlaySong: [
    "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
    "Whenever you play a song, you may draw a card.",
    "Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
  ],

  // Quest triggers
  onQuest: [
    "Whenever this character quests, you may draw a card.",
    "Whenever this character quests, chosen opposing character gets -2 {S} until the start of your next turn.",
    "Whenever this character quests, gain lore equal to the {L} of chosen opposing character.",
    "Whenever this character quests, you pay 1 {I} less for the next character you play this turn.",
  ],

  onCharacterQuests: [
    "Whenever one of your Ally characters quests, you may remove up to 2 damage from this character.",
    "Whenever a character quests while here, remove up to 2 damage from them.",
    "Whenever your other characters quest, they gain Support this turn.",
  ],

  // Inkwell triggers
  onPutIntoInkwell: [
    "During your turn, whenever a card is put into your inkwell, you may move 1 damage counter from chosen character to chosen opposing character.",
    "During your turn, whenever a card is put into your inkwell, chosen character gains Evasive until the start of your next turn.",
    "During your turn, whenever a card is put into your inkwell, you may remove up to 2 damage from chosen character.",
  ],

  // Challenge triggers
  onChallenge: [
    "Whenever this character challenges another character, gain 1 lore.",
    "Whenever this character challenges another character, another chosen character of yours gets +3 {S} this turn.",
    "Whenever this character challenges another character, your other characters get +1 {L} this turn.",
  ],

  onChallenged: [
    "Whenever this character is challenged, the challenging player chooses and discards a card.",
    "Whenever this character is challenged, you may draw a card.",
    "Whenever this character is challenged, the challenging player may choose and discard a card. If they don't, you gain 2 lore.",
  ],

  onCharacterChallenges: [
    "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
    "Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
    "Whenever one of your characters challenges another character, if it's the second challenge this turn, you gain 3 lore.",
  ],

  // Banish triggers
  onBanish: [
    "When this character is banished, deal 5 damage to each opposing character.",
    "When this character is banished, you may draw a card.",
    "When this character is banished, gain 1 lore.",
    "When this character is banished, you may put this card into your inkwell facedown and exerted.",
  ],

  onBanishInChallenge: [
    "When this character is banished in a challenge, return this card to your hand.",
    "When this character is challenged and banished, banish the challenging character.",
    "When this character is banished in a challenge, return this card to your hand and gain 1 lore.",
  ],

  onOtherBanished: [
    "Whenever one of your other characters is banished, gain 1 lore.",
    "During an opponent's turn, whenever one of your other characters is banished, gain 1 lore.",
    "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
  ],

  // Damage triggers
  onDamage: [
    "When this character is damaged, deal the same amount of damage to a chosen opposing character.",
    "Whenever this character is damaged, they get +1 {S}.",
  ],

  onDealDamage: [
    "When this character deals damage, gain 1 lore.",
    "Whenever this character deals damage to another character, draw a card.",
  ],

  onDamageRemoved: [
    "Whenever damage is removed from this character, gain 1 lore.",
    "Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
  ],

  // Movement triggers
  onMove: [
    "When this character moves, draw a card.",
    "When this character moves to a location, gain 1 lore.",
  ],

  onReady: [
    "Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
    "Once during your turn, whenever you ready this character, you may draw a card.",
  ],

  onExert: [
    "Whenever you exert this character, gain 1 lore.",
    "Whenever this character is exerted, they gain Resist +1.",
  ],

  // Card flow triggers
  onCardDrawn: [
    "Whenever you draw a card, gain 1 lore.",
    "Whenever you draw a card, this character gains Challenger +1 for this turn.",
  ],

  onDiscard: [
    "Whenever you discard a card, gain 1 lore.",
    "Whenever you discard a card, you may deal 1 damage to chosen opposing character.",
  ],

  onOpponentDiscard: [
    "Whenever an opponent discards a card, draw a card.",
    "Whenever an opponent discards a card, gain 1 lore.",
  ],

  // Turn phase triggers
  startOfTurn: [
    "At the start of your turn, if this character has no damage, draw a card.",
    "At the start of your turn, if this character is at a location, draw a card and gain 1 lore.",
    "At the start of your turn, if you have a character here, gain 1 lore.",
  ],

  endOfTurn: [
    "At the end of your turn, if this character is exerted, you may ready another chosen character of yours.",
    "At the end of your turn, if you didn't put any cards into your inkwell this turn, banish this character.",
    "At the end of your turn, you may remove up to 1 damage from each of your other characters.",
  ],

  // Zone change triggers
  whenLeaves: [
    "When this character leaves play, look at the top 2 cards of your deck.",
    "When this character leaves play, gain 1 lore.",
  ],

  onMoveToLocation: [
    "When this character moves to a location, it gets +2 {S} this turn.",
    "Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
  ],

  // State-based triggers
  whileAtLocation: [
    "While this character is at a location, it gets +2 {S}.",
    "While this character is at a location, it gains Ward.",
  ],

  whileExerted: [
    "While this character is exerted, your Pirate characters gain Resist +1.",
    "While this character is exerted, opposing characters can't exert to sing songs.",
    "While this character is exerted, he gains Resist +1.",
  ],

  whileHasDamage: [
    "While this character has damage, she gets +3 {S}.",
    "While this character has damage, opposing characters can't challenge it.",
  ],

  whileNoDamage: [
    "While this character has no damage, he gets +2 {S} and gains Support.",
    "While this character has no damage, it gains Resist +2.",
  ],

  whileCharacterInPlay: [
    "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "While you have a Puppy character in play, this character gets +1 {W}.",
    "While you have another character in play, this character gets +2 {S}.",
  ],

  whileChallenging: [
    "While this character is challenging, it gains Resist +2.",
    "While this character is challenging, opposing characters can't be readied.",
  ],

  whileChallenged: [
    "While this character is being challenged, the challenging character gets -1 {S}.",
    "While this character is being challenged, your other characters gain Resist +1.",
  ],

  // Special triggers
  onShift: [
    "When you play a Floodborn character using Shift, you may draw a card.",
    "If you used Shift to play this character, you may deal 2 damage to chosen character.",
    "If you used Shift to play them, they get +4 {S} this turn.",
  ],
};
