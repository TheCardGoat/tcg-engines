import type { CharacterCard } from "@tcg/lorcana-types";

export const puaPotbelliedBuddy: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          intoDeck: "owner",
          target: "SELF",
          type: "shuffle-into-deck",
        },
        type: "optional",
      },
      id: "19j-1",
      name: "ALWAYS THERE",
      text: "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "a41b9d6c76e9b057ca90c96cd1935027b2a84c1e",
  },
  franchise: "Moana",
  fullName: "Pua - Potbellied Buddy",
  id: "19j",
  inkType: ["amethyst"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Pua",
  set: "003",
  strength: 2,
  text: "ALWAYS THERE When this character is banished, you may shuffle this card into your deck.",
  version: "Potbellied Buddy",
  willpower: 2,
};
