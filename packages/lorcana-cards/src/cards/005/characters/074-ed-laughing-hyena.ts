import type { CharacterCard } from "@tcg/lorcana-types";

export const edLaughingHyena: CharacterCard = {
  id: "1ez",
  cardType: "character",
  name: "Ed",
  version: "Laughing Hyena",
  fullName: "Ed - Laughing Hyena",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 74,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b7b8cf126ca56fb72ae47f7dc67180a793b855e2",
  },
  abilities: [
    {
      id: "1ez-1",
      type: "triggered",
      name: "CAUSE A PANIC",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
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
      text: "CAUSE A PANIC When you play this character, you may deal 2 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Hyena"],
};
