import type { CharacterCard } from "@tcg/lorcana-types";

export const theCarpenterDinnerCompanion: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
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
        type: "optional",
      },
      id: "pff-1",
      name: "I'LL GET YOU!",
      text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 44,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 2,
  externalIds: {
    ravensburger: "5ba5435695ac12a2a4f8697877c36e2691c34826",
  },
  franchise: "Alice in Wonderland",
  fullName: "The Carpenter - Dinner Companion",
  id: "pff",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "The Carpenter",
  set: "006",
  strength: 1,
  text: "I'LL GET YOU! When this character is banished, you may exert chosen character.",
  version: "Dinner Companion",
  willpower: 1,
};
