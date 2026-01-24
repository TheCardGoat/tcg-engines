import type { CharacterCard } from "@tcg/lorcana-types";

export const zeusMissingHisSpark: CharacterCard = {
  id: "gow",
  cardType: "character",
  name: "Zeus",
  version: "Missing His Spark",
  fullName: "Zeus - Missing His Spark",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nI NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 193,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3c2843037115624815f788a3839c897be567da2b",
  },
  abilities: [
    {
      id: "gow-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "gow-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
    },
  ],
  classifications: ["Storyborn", "King", "Deity", "Whisper"],
};
