import type { CharacterCard } from "@tcg/lorcana-types";

export const theCarpenterDinnerCompanion: CharacterCard = {
  id: "pff",
  cardType: "character",
  name: "The Carpenter",
  version: "Dinner Companion",
  fullName: "The Carpenter - Dinner Companion",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 44,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5ba5435695ac12a2a4f8697877c36e2691c34826",
  },
  abilities: [
    {
      id: "pff-1",
      type: "triggered",
      name: "I'LL GET YOU!",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "exert",
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
      text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
    },
  ],
  classifications: ["Storyborn"],
};
