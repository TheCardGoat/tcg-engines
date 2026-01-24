import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraSecretKeeper: CharacterCard = {
  id: "1af",
  cardType: "character",
  name: "Megara",
  version: "Secret Keeper",
  fullName: "Megara - Secret Keeper",
  inkType: ["emerald"],
  franchise: "Hercules",
  set: "010",
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nI'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 86,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "04a61e5282af9e9f2fbac7f4793e129af04930c8",
  },
  abilities: [
    {
      id: "1af-1",
      type: "keyword",
      keyword: "Boost",
      value: 1,
      text: "Boost 1 {I}",
    },
    {
      id: "1af-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "I'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
    },
  ],
  classifications: ["Storyborn", "Ally", "Whisper"],
};
