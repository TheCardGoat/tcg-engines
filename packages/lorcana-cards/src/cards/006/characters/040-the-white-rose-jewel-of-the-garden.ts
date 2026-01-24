import type { CharacterCard } from "@tcg/lorcana-types";

export const theWhiteRoseJewelOfTheGarden: CharacterCard = {
  id: "1v8",
  cardType: "character",
  name: "The White Rose",
  version: "Jewel of the Garden",
  fullName: "The White Rose - Jewel of the Garden",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 40,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f24c96bb99a75300d87a9bca53bc799622d05a06",
  },
  abilities: [
    {
      id: "1v8-1",
      type: "triggered",
      name: "THE BEAUTY OF THE WORLD",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn"],
};
