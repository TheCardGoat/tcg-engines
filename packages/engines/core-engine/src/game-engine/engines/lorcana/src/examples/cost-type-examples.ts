/**
 * This file maps different cost types to their text representations in card texts.
 * These examples help identify cost patterns in card abilities.
 */

export const costTypeExamples = {
  // Exert costs
  exert: [
    "{E} – Chosen character gets +3 {S} this turn.",
    "{E} – Deal 1 damage to chosen character.",
    "{E} – You may draw a card.",
    "{E} – Return chosen exerted character to their player's hand.",
    "{E} – Chosen opposing character can't challenge during their next turn.",
  ],

  // Exert other cards
  exertOther: [
    "{E} one of your characters – Ready another chosen character of yours.",
    "{E} one of your Ally characters – Draw a card.",
    "{E} one of your Villain characters – Deal 2 damage to chosen character.",
    "{E} one of your Pirate characters – Chosen character gets +2 {S} this turn.",
    "{E} any number of your characters – For each character exerted this way, gain 2 lore.",
  ],

  // Ink costs
  inkCost: [
    "{E}, 1 {I} – Chosen character gains Challenger +2 this turn.",
    "{E}, 2 {I} – Ready chosen character.",
    "{E}, 1 {I} – If you have 2 or more characters in play, gain 1 lore.",
    "2 {I} – Banish chosen character with cost 2 or less.",
    "3 {I} – Draw a card.",
  ],

  // Banish costs
  banishSelf: [
    "{E}, Banish this character – Banish chosen character.",
    "Banish this character – Draw 2 cards.",
    "Banish this character – Deal 2 damage to each opposing character.",
    "Banish this item – Chosen character gains Ward until the start of your next turn.",
    "Banish this item – Remove up to 2 damage from chosen character.",
  ],

  // Banish other costs
  banishOther: [
    "{E}, Banish one of your items – Draw a card.",
    "{E}, Banish one of your Ally characters – Deal 3 damage to chosen character.",
    "{E}, Banish one of your characters – Banish chosen damaged character.",
    "{E}, Banish one of your Floodborn characters – Ready chosen character.",
    "{E}, 2 {I}, Banish one of your items – Deal 5 damage to chosen character.",
  ],

  // Discard costs
  discard: [
    "{E}, Choose and discard a card – Ready this character. He can't quest for the rest of this turn.",
    "{E}, Choose and discard a card – Draw a card.",
    "{E}, Choose and discard a card – Chosen character gets +2 {S} and gains Rush this turn.",
    "Choose and discard 2 cards – Put the top card of your deck into your inkwell facedown and exerted.",
    "Choose and discard a character card – Ready chosen character.",
  ],

  // Combinations of costs
  combinedCosts: [
    "{E}, 2 {I}, Banish one of your items – Deal 5 damage to chosen character.",
    "{E}, Choose and discard a card, 1 {I} – Return chosen character to their player's hand.",
    "{E}, {E} one of your characters, 2 {I} – Banish chosen character with cost 3 or less.",
    "{E}, Choose and discard 2 cards – Banish chosen item.",
    "{E}, Banish one of your characters, Choose and discard a card – Chosen character gets +4 {S} and gains Evasive this turn.",
  ],

  // Song costs (special case for Singer ability)
  songCosts: [
    "(A character with cost 2 or more can {E} to sing this song for free.)",
    "(A character with cost 3 or more can {E} to sing this song for free.)",
    "(A character with cost 4 or more can {E} to sing this song for free.)",
    "Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)",
    "Sing Together 5 (Any number of your or your teammates' characters with total cost 5 or more may {E} to sing this song for free.)",
  ],

  // Put into inkwell costs
  putIntoInkwell: [
    "{E}, Put a card from your hand into your inkwell facedown and exerted – Draw 2 cards.",
    "{E}, Put the top card of your deck into your inkwell facedown and exerted – Deal 2 damage to chosen character.",
    "{E}, Put this character into your inkwell facedown and exerted – Return chosen character to their player's hand.",
  ],

  // Return to hand costs
  returnToHand: [
    "{E}, Return one of your characters to your hand – Draw a card.",
    "{E}, Return this character to your hand – Deal 2 damage to chosen character.",
    "{E}, Return one of your Ally characters to your hand – Chosen opposing character gets -2 {S} this turn.",
  ],

  // Pay life costs (rare but exists in some card games)
  payLife: [
    "{E}, Lose 1 lore – Draw a card.",
    "{E}, Lose 2 lore – Ready chosen character.",
    "{E}, Each player loses 1 lore – Banish chosen damaged character.",
  ],
};
