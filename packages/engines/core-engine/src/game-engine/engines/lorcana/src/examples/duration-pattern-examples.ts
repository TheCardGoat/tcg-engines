/**
 * This file maps different duration patterns found in card texts.
 * These examples help identify how long effects last in the game.
 */

export const durationPatternExamples = {
  // Effects that last until end of current turn
  thisTurn: [
    "Chosen character gets +2 {S} this turn.",
    "Chosen character gains Challenger +2 this turn.",
    "All opposing characters get -1 {S} this turn.",
    "Your characters gain Rush this turn.",
    "Chosen character can't quest for the rest of this turn.",
    "Ready chosen character. They can't quest for the rest of this turn.",
    "Your characters can challenge ready characters this turn.",
  ],

  // Effects that last until start of next turn
  untilStartOfNextTurn: [
    "Chosen character gains Ward until the start of your next turn.",
    "Chosen character gains Resist +2 until the start of your next turn.",
    "Your characters can't be challenged until the start of your next turn.",
    "All opposing characters get -1 {S} until the start of your next turn.",
    "Chosen opposing character can't quest during their next turn.",
    "Chosen opposing character can't ready at the start of their next turn.",
  ],

  // Effects that last until a specific phase
  untilPhase: [
    "Chosen character can't challenge during their next turn.",
    "Characters exerted this way do not ready at the start of their next turn.",
    "Chosen character gains Reckless during their next turn.",
    "Characters can't exert to sing songs until the start of your next turn.",
    "Opposing characters can't ready at the start of their turn.",
  ],

  // Permanent effects (no duration specified)
  permanent: [
    "This character gets +1 {S} for each other character you have in play.",
    "While you have a character named Minnie Mouse in play, this character gets +2 {S}.",
    "This character can challenge ready characters.",
    "This character can't be challenged.",
    "Your Pirate characters gain Resist +1.",
    "Your other characters gain Ward.",
    "Opponents need 25 lore to win the game.",
  ],

  // Conditional duration (lasts while a condition is true)
  conditionalDuration: [
    "While this character has no damage, he gets +2 {S} and gains Support.",
    "While this character is exerted, your Pirate characters gain Resist +1.",
    "While this character has damage, she gets +3 {S}.",
    "While you have another character in play, this character gets +2 {S}.",
    "While you have 3 or more Puppy characters in play, this character gets +2 {S} and +2 {L}.",
    "While this character is at a location, it gets +2 {S}.",
    "While this character is being challenged, the challenging character gets -1 {S}.",
  ],

  // One-time effects
  oneTime: [
    "When you play this character, gain 1 lore.",
    "When this character is banished, deal 5 damage to each opposing character.",
    "Once during your turn, whenever one of your characters sings a song, you may ready those characters.",
    "Once during your turn, whenever a card is put into your inkwell, deal 2 damage to each character in play.",
    "Once per turn, when this character moves to a location, gain lore equal to that location's {L}.",
  ],

  // Next action modification
  nextAction: [
    "You pay 1 {I} less for the next character you play this turn.",
    "You pay 2 {I} less for the next item you play this turn.",
    "You pay 1 {I} less for the next action you play this turn.",
    "Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.",
    "Whenever this character quests, you pay 1 {I} less for the next location you play this turn.",
  ],

  // During specific turn
  duringTurn: [
    "During your turn, this character gains Evasive.",
    "During your turn, whenever a card is put into your inkwell, you may draw a card.",
    "During an opponent's turn, whenever one of your characters is banished, you may draw a card.",
    "During your turn, whenever this character banishes another character in a challenge, you may draw a card.",
  ],
};
