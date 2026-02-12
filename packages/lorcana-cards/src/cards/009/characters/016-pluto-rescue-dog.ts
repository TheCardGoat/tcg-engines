import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoRescueDog: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 3,
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
      id: "141-1",
      name: "TO THE RESCUE",
      text: "TO THE RESCUE When you play this character, you may remove up to 3 damage from chosen character of yours.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 16,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "90509aa765f200ec9ee3743bb833e8fd9c8dfbb2",
  },
  fullName: "Pluto - Rescue Dog",
  id: "141",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pluto",
  set: "009",
  strength: 4,
  text: "TO THE RESCUE When you play this character, you may remove up to 3 damage from chosen character of yours.",
  version: "Rescue Dog",
  willpower: 5,
};
