import type { CharacterCard } from "@tcg/lorcana-types";

export const aladdinBarrelingThrough: CharacterCard = {
  abilities: [
    {
      id: "1tr-1",
      keyword: "Boost",
      text: "Boost 1 {I}",
      type: "keyword",
      value: 1,
    },
    {
      id: "1tr-2",
      keyword: "Reckless",
      text: "Reckless",
      type: "keyword",
    },
    {
      cost: { exert: true },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1tr-3",
      text: 'ONLY THE BOLD While there\'s a card under this character, your characters with Reckless gain "{E} — Gain 1 lore."',
      type: "activated",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Whisper"],
  cost: 3,
  externalIds: {
    ravensburger: "ed0e8b252efd03eae187446ea108525112c0df0b",
  },
  franchise: "Aladdin",
  fullName: "Aladdin - Barreling Through",
  id: "1tr",
  inkType: ["ruby"],
  inkable: true,
  lore: 0,
  missingTests: true,
  name: "Aladdin",
  set: "010",
  strength: 4,
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nReckless (This character can't quest and must challenge each turn if able.)\nONLY THE BOLD While there's a card under this character, your characters with Reckless gain \"{E} — Gain 1 lore.\"",
  version: "Barreling Through",
  willpower: 4,
};
