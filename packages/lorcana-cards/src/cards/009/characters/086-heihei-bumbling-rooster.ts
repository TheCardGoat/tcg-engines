import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiBumblingRooster: CharacterCard = {
  id: "td9",
  cardType: "character",
  name: "Heihei",
  version: "Bumbling Rooster",
  fullName: "Heihei - Bumbling Rooster",
  inkType: ["emerald"],
  franchise: "Moana",
  set: "009",
  text: "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 86,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "69d8809376697e97b2de10221febd0aee79c5d45",
  },
  abilities: [
    {
      id: "td9-1",
      type: "triggered",
      name: "FATTEN YOU UP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "an opponent has more cards in their inkwell than you",
        },
        then: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
      text: "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
