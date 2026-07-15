import type { CharacterCard } from "@tcg/lorcana-types";

export const megaraSecretKeeper: CharacterCard = {
  abilities: [
    {
      id: "1af-1",
      keyword: "Boost",
      text: "Boost 1 {I}",
      type: "keyword",
      value: 1,
    },
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1af-2",
      text: "I'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
      type: "static",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Whisper"],
  cost: 3,
  externalIds: {
    ravensburger: "04a61e5282af9e9f2fbac7f4793e129af04930c8",
  },
  franchise: "Hercules",
  fullName: "Megara - Secret Keeper",
  id: "1af",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Megara",
  set: "010",
  strength: 3,
  text: "Boost 1 {I} (Once during your turn, you may pay 1 {I} to put the top card of your deck facedown under this character.)\nI'LL BE FINE While there's a card under this character, she gets +1 {L} and gains \"Whenever this character is challenged, each opponent chooses and discards a card.\"",
  version: "Secret Keeper",
  willpower: 4,
};
