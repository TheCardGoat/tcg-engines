import { beforeEach, describe, expect, it, test } from "bun:test";
import type { LorcanaAbility } from "../../ability-types";
import { AbilityBuilder } from "../ability-builder";

export const actionTexts: Array<
  [string, LorcanaAbility[], boolean | undefined]
> = [
  [
    "All opposing characters get -2 {S} until the start of your next turn.",
    [],
    true,
  ],
  ["Banish all characters.", [], true],
  ["Banish all items.", [], true],
  [
    "Banish any number of your items, then draw a card for each item banished this way.",
    [],
    true,
  ],
  ["Banish chosen character of yours to banish chosen character.", [], true],
  ["Banish chosen character who was challenged this turn.", [], true],
  ["Banish chosen character with 2 {S} or less.", [], true],
  ["Banish chosen character with 5 {S} or more.", [], true],
  [
    "Banish chosen character, then return an item card from your discard to your hand.",
    [],
    true,
  ],
  ["Banish chosen character.", [], true],
  ["Banish chosen character. Draw a card.", [], true],
  ["Banish chosen damaged character.", [], true],
  [
    "Banish chosen item of yours to deal 5 damage to chosen character.",
    [],
    true,
  ],
  ["Banish chosen item. Draw a card.", [], true],
  ["Banish chosen item. Its owner gains 2 lore.", [], true],
  ["Banish chosen item.", [], true],
  ["Banish chosen location or item.", [], true],
  ["Banish chosen Villain of yours to banish chosen character.", [], true],
  [
    "Banish one of your characters with **Reckless** to banish chosen character with less {S} than that character.",
    [],
    true,
  ],
  [
    "Choose one:\n• Deal 1 damage to each opposing character without **Evasive**.\n• Deal 3 damage to each opposing character with **Evasive**.",
    [],
    true,
  ],
  [
    "Choose one:\n• Remove up to 3 damage from chosen character.\n• Remove up to 3 damage from each of your characters with Bodyguard.",
    [],
    true,
  ],
  [
    "Choose one:\n- Draw 2 cards.\n- Each opponent chooses and discards a card.",
    [],
    true,
  ],
  [
    "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
    [],
    true,
  ],
  [
    "Choose one:\n\n· Deal 2 damage to chosen character.\n\n· Banish chosen item.",
    [],
    true,
  ],
  [
    "Choose one:\n· Banish chosen item.\n· Deal 2 damage to chosen damaged character.",
    [],
    true,
  ],
  [
    "Choose one:\n* Ready chosen item.\n* Ready chosen Robot character. They can't quest for the rest of this turn.",
    [],
    true,
  ],
  ["Chosen character can challenge ready characters this turn.", [], true],
  [
    "Chosen character can't challenge during their next turn. Draw a card.",
    [],
    true,
  ],
  [
    "Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Evasive** until the start of your next turn. _Only characters with Evasive can challenge them.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Resist** +1 and **Evasive** this turn. _(Damage dealt to them is reduced by 1. They can challenge characters with Evasive.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Resist** +2 until the start of your next turn. If a Hero character is chosen, they may also challenge ready characters this turn. _(Damage dealt to them is reduced by 2.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
    [],
    true,
  ],
  [
    "Chosen character gains **Ward** and **Evasive** until the start of your next turn. _(Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)_",
    [],
    true,
  ],
  [
    "Chosen character gains Bodyguard until the start of your next turn.",
    [],
    true,
  ],
  [
    "Chosen character gains Evasive until the start of your next turn.",
    [],
    true,
  ],
  [
    "Chosen character gains Resist +2 until the start of your next turn. Draw a card. (Damage dealt to them is reduced by 2.)",
    [],
    true,
  ],
  ["Chosen character gains Support this turn. Draw a card.", [], true],
  ["Chosen character gets +1 {L} this turn.", [], true],
  [
    "Chosen character gets +1 {S} this turn for each character you have in play.",
    [],
    true,
  ],
  ["Chosen character gets +1 {S} this turn. Draw a card.", [], true],
  [
    "Chosen character gets +2 {S} this turn. If a Pirate character is chosen, they get +3 {S} instead.",
    [],
    true,
  ],
  [
    "Chosen character gets +2 {S} this turn. If a Villain character is chosen, they get +3 {S} instead.",
    [],
    true,
  ],
  ["Chosen character gets +2 {S} this turn.", [], true],
  [
    "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
    [],
    true,
  ],
  ["Chosen character gets -2 {S} this turn. Draw a card.", [], true],
  ["Chosen character gets -2 {S} this turn.", [], true],
  ["Chosen character gets -3 {S} this turn.", [], true],
  ["Chosen character gets -4 {S} until the start of your next turn.", [], true],
  ["Chosen damaged character gets +3 {S} this turn.", [], true],
  [
    "Chosen exerted character can't ready at the start of their next turn.",
    [],
    true,
  ],
  [
    "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
    [],
    true,
  ],
  ["Chosen opponent loses 1 lore. Gain 1 lore.", [], true],
  [
    "Chosen opponent reveals their hand and discards a non-character card of your choice.",
    [],
    true,
  ],
  [
    "Chosen character of yours can't be challenged until the start of your next turn.",
    [],
    true,
  ],
  [
    "Chosen character of yours gets +2 {S} this turn. They may move to a location for free.",
    [],
    true,
  ],
  [
    "Count the number of characters you have in play. Chosen character loses {S} equal to that number until the start of your next turn.",
    [],
    true,
  ],
  [
    "Count the number of characters you have in play. You pay that amount of {I} less for the next character you play this turn.",
    [],
    true,
  ],
  [
    "Deal 1 damage to chosen character for each exerted character you have in play.",
    [],
    true,
  ],
  [
    "Deal 1 damage to chosen character of yours. They gain **Rush** and get +1 {S} this turn. _(They can challenge the turn they're played.)_",
    [],
    true,
  ],
  ["Deal 1 damage to chosen character. Draw a card.", [], true],
  [
    "Deal 1 damage to each opposing character. You may banish chosen location.",
    [],
    true,
  ],
  ["Deal 1 damage to up to 2 chosen characters.", [], true],
  [
    "Deal 2 damage to chosen character of yours to deal 2 damage to another chosen character.",
    [],
    true,
  ],
  ["Deal 2 damage to chosen character or location.", [], true],
  ["Deal 2 damage to chosen character. Draw a card.", [], true],
  [
    "Deal 2 damage to chosen character. Then, you may choose and discard a card to deal 2 damage to another chosen character.",
    [],
    true,
  ],
  ["Deal 2 damage to chosen character.", [], true],
  ["Deal 2 damage to chosen damaged character.", [], true],
  ["Deal 2 damage to each opposing character.", [], true],
  ["Deal 3 damage to the chosen character.", [], true],
  ["Deal 5 damage to chosen character or location.", [], true],
  [
    "Deal damage to chosen character equal to the number of characters you have in play.",
    [],
    true,
  ],
  ["Draw 2 cards, then choose and discard 2 cards.", [], true],
  ["Draw 2 cards, then choose and discard a card.", [], true],
  ["Draw 2 cards.", [], true],
  [
    "Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.",
    [],
    true,
  ],
  ["Draw 3 cards.", [], true],
  [
    "Draw a card. Chosen character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_",
    [],
    true,
  ],
  [
    "Draw a card. Chosen character gains **Reckless** during their next turn._(They can't quest and must challenge if able.)_",
    [],
    true,
  ],
  [
    "Draw a card. Chosen character of yours gets +5 {S} this turn. At the end of your turn, banish them.",
    [],
    true,
  ],
  [
    "Draw a card. Shuffle up to 3 cards from your opponent's discard into your opponent's deck.",
    [],
    true,
  ],
  ["Each opponent chooses and banishes one of their characters.", [], true],
  ["Each opponent chooses and discards 2 cards.", [], true],
  ["Each opponent chooses and discards a card.", [], true],
  ["Each opponent chooses and discards a card. Draw a card.", [], true],
  [
    "Each opponent chooses and exerts one of their characters. Those characters can't ready at the start of their next turn.",
    [],
    true,
  ],
  [
    "Each opponent chooses one of their characters and deals 2 damage to them.",
    [],
    true,
  ],
  [
    "Each opponent chooses one of their characters and deals 4 damage to them.",
    [],
    true,
  ],
  ["Each opponent loses 1 lore.", [], true],
  [
    "Each opponent may chose and discard a card. For each opponent who doesn't, you gain 2 lore.",
    [],
    true,
  ],
  [
    "Each opponent may choose and discard a card. For each opponent who doesn't, you draw a card.",
    [],
    true,
  ],
  [
    "Each opponent puts the top 2 cards of their deck into their discard.",
    [],
    true,
  ],
  ["Each opponent reveals their hand. Draw a card.", [], true],
  [
    "Each player chooses one of their characters and puts them into their inkwell facedown and exerted.",
    [],
    true,
  ],
  ["Each player discards their hand and draws 7 cards.", [], true],
  ["Each player draws 3 cards.", [], true],
  [
    "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
    [],
    true,
  ],
  [
    "Each player may reveal a character card from their hand and play it for free.",
    [],
    true,
  ],
  [
    "Each player may reveal a character card from their hand and play it for free.",
    [],
    true,
  ],
  [
    "Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Exert all opposing characters. Whenever one of your characters banishes another character in a challenge this turn, gain 2 lore.",
    [],
    true,
  ],
  [
    "Exert chosen character. Then, you may choose and discard a card. If you do, the exerted character can't ready at the start of their next turn.",
    [],
    true,
  ],
  [
    "Exert chosen opposing character. Then chosen character of yours gains **Challenger** +2 this turn. (They get +2 {S} while challenging.)",
    [],
    true,
  ],
  ["Exert chosen opposing character.", [], true],
  [
    "{E} one of your characters to deal damage equal to their {S} to chosen character.",
    [],
    true,
  ],
  [
    "For each Sorcerer character you have in play, you pay 1 {I} less to play this action.\nDraw 2 cards.",
    [],
    true,
  ],
  ["Gain 1 lore for each damaged character opponents have in play.", [], true],
  ["Gain 1 lore. Draw a card.", [], true],
  ["Gain 2 lore.", [], true],
  [
    "Gain lore equal to the damage on chosen character, then banish them.",
    [],
    true,
  ],
  [
    "If chosen opponent has more cards in their hand than you, draw cards until you have the same number.",
    [],
    true,
  ],
  [
    "If you have no cards in your hand, draw until you have 3 cards in your hand. Otherwise, choose and discard any number of cards, then draw that many cards.",
    [],
    true,
  ],
  [
    "Look at the top 2 cards of your deck. Put one into your hand and the other into your inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
    [],
    true,
  ],
  [
    "Look at the top 3 cards of your deck. Put them back on the top of your deck in any order.",
    [],
    true,
  ],
  [
    "Look at the top 3 cards of your deck. You may reveal a character, item, or location card with cost 6 or less and play it for free. Put the rest on the bottom of your deck in any order.",
    [],
    true,
  ],
  [
    "Look at the top 4 cards of chosen player's deck. Put one on the top of their deck and the rest on the bottom of their deck in any order.",
    [],
    true,
  ],
  [
    "Look at the top 4 cards of your deck. You may reveal a character card and put it into your hand. Put the rest on the bottom of your deck in any order.",
    [],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. Put any number of them on the top or the bottom of your deck in any order. Gain 1 lore.",
    [],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. Put one into your hand and the rest on the bottom of your deck in any order.",
    [],
    true,
  ],
  [
    "Look at the top 5 cards of your deck. You may reveal up to 1 Madrigal character card and up to 1 song card and put them into your hand. Put the rest on the top of your deck in any order.",
    [],
    true,
  ],
  [
    "Move 1 damage counter from chosen character to chosen opposing character. Draw a card.",
    [],
    true,
  ],
  [
    "Move 1 damage counter from chosen character to chosen opposing character.",
    [],
    true,
  ],
  [
    "Move 1 damage counter from each damaged character you have in play to chosen opposing character. Draw a card for each damage counter moved this way.",
    [],
    true,
  ],
  ["Move up to 2 characters of yours to the same location for free.", [], true],
  [
    "Name a card. Return all character cards with that name from your discard to your hand.",
    [],
    true,
  ],
  [
    "\nChosen opposing character can't quest during their next turn. Draw a card.",
    [],
    true,
  ],
  [
    "Play a character card with cost 5 or less from your discard for free.",
    [],
    true,
  ],
  [
    "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
    [],
    true,
  ],
  ["Put 1 damage counter on chosen character.", [], true],
  [
    "Put all opposing characters with 2 {S} or less on the bottom of their players' decks in any order.",
    [],
    true,
  ],
  [
    "Put chosen character into their player's inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Put chosen character of yours into your inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Put chosen exerted character into their player's inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Put chosen item or location into its player's inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Put the top card of your deck into your inkwell facedown and exerted.",
    [],
    true,
  ],
  [
    "Put up to 2 cards from your discard into your inkwell, facedown and exerted.",
    [],
    true,
  ],
  [
    "Ready all your characters and deal 1 damage to each of them. They can't quest for the rest of this turn.",
    [],
    true,
  ],
  [
    "Ready all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
    [],
    true,
  ],
  [
    "Ready all your characters. They can't quest for the rest of this turn.",
    [],
    true,
  ],
  [
    "Ready all your characters. They gain Reckless this turn. (They can't quest and must challenge if able.)",
    [],
    true,
  ],
  [
    "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location {L}.",
    [],
    true,
  ],
  [
    "Ready chosen character of yours. They can't quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.",
    [],
    true,
  ],
  [
    "Ready chosen character. They can't quest for the rest of this turn.",
    [],
    true,
  ],
  ["Ready chosen character.", [], true],
  [
    "Ready chosen damaged character of yours. They can't quest for the rest of this turn. Draw a card.",
    [],
    true,
  ],
  ["Remove up to 1 damage from each of your characters.", [], true],
  ["Remove up to 2 damage from any number of chosen characters.", [], true],
  ["Remove up to 2 damage from chosen character.", [], true],
  [
    "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
    [],
    true,
  ],
  [
    "Remove up to 3 damage from chosen character or location. Draw a card.",
    [],
    true,
  ],
  ["Remove up to 3 damage from chosen character. Draw a card.", [], true],
  [
    "Remove up to 3 damage from chosen character and ready them. They can't quest or challenge for the rest of this turn.",
    [],
    true,
  ],
  ["Remove up to 3 damage from chosen character.", [], true],
  ["Remove up to 3 damage from chosen location.", [], true],
  ["Remove up to 3 damage from each of your characters.", [], true],
  ["Remove up to 3 damage from one of your locations or characters.", [], true],
  ["Remove up to 4 damage from chosen character. Draw a card.", [], true],
  ["Remove up to 4 damage from chosen character.", [], true],

  [
    "Return a character card from your discard to your hand. Then remove up to 2 damage from chosen character.",
    [],
    true,
  ],
  ["Return a character card from your discard to your hand.", [], true],
  [
    "\nReturn a character card with cost 2 or less from your discard to your hand.",
    [],
    true,
  ],
  [
    "Return a character or item with cost 2 or less to their player's hand.",
    [],
    true,
  ],
  [
    "Return a character, item or location with cost 2 or less to their player's hand.",
    [],
    true,
  ],
  ["Return an action card from your discard to your hand.", [], true],
  ["Return an item card from your discard to your hand.", [], true],
  [
    "Return chosen character of yours to your hand to play another character with the same cost or less for free.",
    [],
    true,
  ],
  [
    "Return chosen character of yours to your hand to return another chosen character to their player's hand.",
    [],
    true,
  ],
  [
    "Return chosen character of yours to your hand. Exert chosen character.",
    [],
    true,
  ],
  [
    "Return chosen character to their player's hand, then that player discards a card at random.",
    [],
    true,
  ],
  ["Return chosen character to their player's hand.", [], true],
  [
    "Return chosen character with 2 {S} or less to their player's hand. Return a character card from your discard to your hand.",
    [],
    true,
  ],
  ["Return chosen damaged character to their player's hand.", [], true],
  ["Return up to 2 item cards from your discard into your hand.", [], true],
  [
    "Reveal the top 2 cards of your deck. Put revealed character cards into your hand. Put the rest on the bottom of your deck in any order.",
    [],
    true,
  ],
  [
    "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
    [],
    true,
  ],
  [
    "Shuffle chosen card from your discard into your deck. Reveal the top card of your deck. If it has the same name as the chosen card, you may play the revealed card for free. Otherwise, put it into your hand.",
    [],
    true,
  ],
  [
    "Shuffle chosen character, item, or location into their player's deck. That player draws 2 cards.",
    [],
    true,
  ],
  [
    "Sing Together 6\nRemove up to 3 damage from any number of chosen characters. All opposing characters get -3 {S} this turn.",
    [],
    true,
  ],
  [
    "Sing Together 7\nChoose any number of players. They discard their hands and draw 3 cards each.",
    [],
    true,
  ],
  [
    "Sing Together 8\nReady all your characters. For the rest of this turn, they take no damage from challenges and can't quest.",
    [],
    true,
  ],
  [
    "Sing Together 8\nReturn up to 2 chosen characters with 3 {S} or less each to their player's hand.",
    [],
    true,
  ],
  [
    "Sing Together 9 (Any number of your or your teammates' characters with total cost 9 or more may {E} to sing this song for free.)\nReturn up to 3 character cards from your discard to your hand. You pay 2 {I} less for the next character you play this turn.",
    [],
    true,
  ],
  [
    "Sing Together 9\nFor each character that sang this song, draw a card and gain 1 lore.",
    [],
    true,
  ],
  [
    "This turn, you may put an additional card from your hand into your inkwell facedown. Draw a card.",
    [],
    true,
  ],
  [
    "Up to 2 chosen characters can't ready at the start of their next turn. Draw a card.",
    [],
    true,
  ],
  ["Up to 2 chosen characters get -1 {S} this turn. Draw a card.", [], true],
  [
    "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
    [],
    true,
  ],
  ["Whenever one of your characters quests this turn, gain 1 lore.", [], true],
  ["You may play a character with cost 5 or less for free.", [], true],
  [
    "Your characters can't be challenged until the start of your next turn.",
    [],
    true,
  ],
  [
    "Your characters gain **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
    [],
    true,
  ],
  [
    "Your characters gain Challenger +2 and 'When this character is banished in a challenge, return this card to your hand' this turn.",
    [],
    true,
  ],
  [
    "Your characters gain {E}, 1 {I} – Deal 1 damage to chosen character this turn.",
    [],
    true,
  ],
  [
    "Your characters get +2 {S} this turn. \nWhenever one of your characters with **Reckless** challenges another character this turn, gain 2 lore.",
    [],
    true,
  ],
  ["Your characters get +2 {S} this turn.", [], true],
  [
    "Your characters get +3 {S} this turn while challenging a location.",
    [],
    true,
  ],
  [
    "Your Inventor characters gain **Resist** +6 this turn. Then, put this card into your inkwell facedown and exerted. _(Damage dealt to them is reduced by 6.)_",
    [],
    true,
  ],
  [
    'Your Pirate characters gain "{E} – Banish chosen damaged character" this turn.',
    [],
    true,
  ],
  [
    "**Sing Together** 6 _(Any number of your of your teammates' characters with total cost 6 or more may {E} to sing this song for free.)_\n\n\nEach opponent loses 2 lore. You gain 2 lore.",
    [],
    true,
  ],
  [
    "**Sing Together** 7 _(Any number of your of your teammates' characters with total cost 7 or more may {E} to sing this song for free.)_\n\n\nLook at the top 5 cards of your deck. You may reveal up to 2 character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    [],
    true,
  ],
  [
    "**Sing Together** 8 _(Any number of your of your teammates' characters with total cost 8 or more may {E} to sing this song for free.)_\n\n\nLook at the top 7 cards of your deck. Put 2 into your hand. Put the rest on the bottom of your deck in any order.",
    [],
    true,
  ],
  [
    "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nChosen player draws 5 cards.",
    [],
    true,
  ],
  [
    "**Sing Together** 10 _(Any number of your of your teammates' characters with total cost 10 or more may {E} to sing this song for free.)_\n\n\nDeal 3 damage to up to 3 chosen characters and/or locations.",
    [],
    true,
  ],
];

test.each(actionTexts)(
  "AbilityBuilder.fromText(%s)",
  (text: string, expected: LorcanaAbility[], skip?: boolean) => {
    if (skip) {
      return;
    }

    const ability = AbilityBuilder.fromText(text);
    expect(ability).toEqual(expected);
  },
);
