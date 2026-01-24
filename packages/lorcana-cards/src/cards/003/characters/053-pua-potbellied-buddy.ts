import type { CharacterCard } from "@tcg/lorcana-types";

export const puaPotbelliedBuddy: CharacterCard = {
  id: "19j",
  cardType: "character",
  name: "Pua",
  version: "Potbellied Buddy",
  fullName: "Pua - Potbellied Buddy",
  inkType: ["amethyst"],
  franchise: "Moana",
  set: "003",
  text: "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  cardNumber: 53,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a41b9d6c76e9b057ca90c96cd1935027b2a84c1e",
  },
  abilities: [
    {
      id: "19j-1",
      type: "triggered",
      name: "ALWAYS THERE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "shuffle-into-deck",
          target: "SELF",
          intoDeck: "owner",
        },
        chooser: "CONTROLLER",
      },
      text: "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
