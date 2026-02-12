import type { CharacterCard } from "@tcg/lorcana-types";

export const baymaxArmoredCompanion: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "12n-1",
      name: "THE TREATMENT IS WORKING When you play this character and",
      text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Robot"],
  cost: 5,
  externalIds: {
    ravensburger: "8b5b13c2943342369d72422e5cc509b8583ffe42",
  },
  franchise: "Big Hero 6",
  fullName: "Baymax - Armored Companion",
  id: "12n",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Baymax",
  set: "006",
  strength: 2,
  text: "THE TREATMENT IS WORKING When you play this character and whenever he quests, you may remove up to 2 damage from another chosen character of yours. Gain 1 lore for each 1 damage removed this way.",
  version: "Armored Companion",
  willpower: 6,
};
