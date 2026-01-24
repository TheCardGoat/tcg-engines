import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxArmoredCompanion: CharacterCard = {
  id: "12n",
  cardType: "character",
  name: "Baymax",
  version: "Armored Companion",
  fullName: "Baymax - Armored Companion",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "8b5b13c2943342369d72422e5cc509b8583ffe42",
  },
  abilities: [
    {
      id: "12n-1",
      type: "triggered",
      name: "THE TREATMENT IS WORKING When you play this character and",
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Robot"],
};
