import type { CharacterCard } from "@tcg/lorcana-types";

export const zeusMissingHisSpark: CharacterCard = {
  abilities: [
    {
      id: "gow-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "gow-2",
      text: "I NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
      type: "static",
    },
  ],
  cardNumber: 193,
  cardType: "character",
  classifications: ["Storyborn", "King", "Deity", "Whisper"],
  cost: 3,
  externalIds: {
    ravensburger: "3c2843037115624815f788a3839c897be567da2b",
  },
  franchise: "Hercules",
  fullName: "Zeus - Missing His Spark",
  id: "gow",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Zeus",
  set: "010",
  strength: 2,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nI NEED MORE THUNDERBOLTS! While there's a card under this character, he gets +2 {S} and +2 {W}.",
  version: "Missing His Spark",
  willpower: 3,
};
