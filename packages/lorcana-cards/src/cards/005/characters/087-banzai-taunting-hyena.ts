import type { CharacterCard } from "@tcg/lorcana-types";

export const banzaiTauntingHyena: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "exert",
        },
        type: "optional",
      },
      id: "16q-1",
      text: "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 87,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Hyena"],
  cost: 2,
  externalIds: {
    ravensburger: "99fe726d4ae141e3026532d3a15a14a8de9b72c6",
  },
  franchise: "Lion King",
  fullName: "Banzai - Taunting Hyena",
  id: "16q",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Banzai",
  set: "005",
  strength: 2,
  text: "HERE KITTY, KITTY, KITTY When you play this character, you may exert chosen damaged character.",
  version: "Taunting Hyena",
  willpower: 2,
};
