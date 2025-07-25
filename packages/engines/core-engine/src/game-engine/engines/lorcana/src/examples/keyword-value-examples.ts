/**
 * This file maps different keywords and their value representations in card texts.
 * These examples show how keywords can have variable numerical values.
 */

export const keywordValueExamples = {
  // Challenger with different values
  challenger: [
    "Challenger +1",
    "Challenger +2",
    "Challenger +3",
    "Challenger +4",
    "Chosen character gains Challenger +2 this turn.",
    "Your other characters gain Challenger +1.",
    "This character gains Challenger +3 this turn.",
    "While you have another Pirate character in play, this character gains Challenger +3.",
    "While you have a character named Hades in play, this character gains Challenger +2.",
  ],

  // Resist with different values
  resist: [
    "Resist +1",
    "Resist +2",
    "Resist +3",
    "Chosen character gains Resist +1 until the start of your next turn.",
    "Chosen character gains Resist +2 until the start of your next turn.",
    "Your Pirate characters gain Resist +2 this turn.",
    "This character gains Resist +1 for each other Knight character you have in play.",
    "While this character has no damage, it gains Resist +2.",
    "Whenever one of your characters challenges, they gain Resist +2 during that challenge.",
  ],

  // Shift with different values
  shift: [
    "Shift 1",
    "Shift 2",
    "Shift 3",
    "Shift 4",
    "Shift 5",
    "Shift 6",
    "Shift 7",
    "You pay 1{I} less to play characters using their Shift ability.",
    "You may pay 3 {I} to play this on top of one of your characters named Jasmine.",
    "You may pay 4 {I} to play this on top of one of your characters named Donald Duck.",
    "Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)",
    "Universal Shift 4 (You may pay 4 {I} to play this on top of any one of your characters.)",
  ],

  // Singer with different values
  singer: [
    "Singer 3",
    "Singer 4",
    "Singer 5",
    "Singer 6",
    "Singer 7",
    "Singer 9",
    "This character counts as cost 3 to sing songs.",
    "This character counts as cost 5 to sing songs.",
    "This character counts as cost 6 to sing songs.",
    "While you have a character named Gazelle in play, this character gains Singer 6.",
    "For Singer ability",
  ],

  // Sing Together with different values
  singTogether: [
    "Sing Together 5",
    "Sing Together 6",
    "Sing Together 7",
    "Sing Together 8",
    "Sing Together 9",
    "Sing Together 10",
    "Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.",
    "Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.",
    "Any number of your or your teammates' characters with total cost 10 or more may {E} to sing this song for free.",
  ],

  // Song cost values
  songCost: [
    "(A character with cost 1 or more can {E} to sing this song for free.)",
    "(A character with cost 2 or more can {E} to sing this song for free.)",
    "(A character with cost 3 or more can {E} to sing this song for free.)",
    "(A character with cost 4 or more can {E} to sing this song for free.)",
    "(A character with cost 5 or more can {E} to sing this song for free.)",
    "(A character with cost 6 or more can {E} to sing this song for free.)",
    "(A character with cost 7 or more can {E} to sing this song for free.)",
  ],

  // Keywords without values
  keywordsWithoutValues: [
    "Rush",
    "Evasive",
    "Bodyguard",
    "Ward",
    "Reckless",
    "Support",
    "Vanish",
    "Chosen character gains Rush this turn.",
    "Chosen character gains Evasive until the start of your next turn.",
    "Chosen character gains Ward until the start of your next turn.",
    "Chosen character gains Reckless during their next turn.",
    "Your characters gain Support this turn.",
  ],
};
