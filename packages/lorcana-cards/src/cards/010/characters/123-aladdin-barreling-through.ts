import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinBarrelingThrough: CharacterCard = {
  id: "1tr",
  cardType: "character",
  name: "Aladdin",
  version: "Barreling Through",
  fullName: "Aladdin - Barreling Through",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nReckless (This character can't quest and must challenge each turn if able.)\nONLY THE BOLD While there's a card under this character, your characters with Reckless gain \"{E} — Gain 1 lore.\"",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 0,
  cardNumber: 123,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ed0e8b252efd03eae187446ea108525112c0df0b",
  },
  abilities: [
    {
      id: "1tr-1",
      type: "keyword",
      keyword: "Boost",
      value: 1,
      text: "Boost 1 {I}",
    },
    {
      id: "1tr-2",
      type: "keyword",
      keyword: "Reckless",
      text: "Reckless",
    },
    {
      id: "1tr-3",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: 'ONLY THE BOLD While there\'s a card under this character, your characters with Reckless gain "{E} — Gain 1 lore."',
    },
  ],
  classifications: ["Storyborn", "Hero", "Whisper"],
};
