import type { CharacterCard } from "@tcg/lorcana-types";

export const theWhiteRoseJewelOfTheGarden: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1v8-1",
      name: "THE BEAUTY OF THE WORLD",
      text: "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 40,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 3,
  externalIds: {
    ravensburger: "f24c96bb99a75300d87a9bca53bc799622d05a06",
  },
  franchise: "Alice in Wonderland",
  fullName: "The White Rose - Jewel of the Garden",
  id: "1v8",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The White Rose",
  set: "006",
  strength: 3,
  text: "THE BEAUTY OF THE WORLD When you play this character, gain 1 lore.",
  version: "Jewel of the Garden",
  willpower: 3,
};
