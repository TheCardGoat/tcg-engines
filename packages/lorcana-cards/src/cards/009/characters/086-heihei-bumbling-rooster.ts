import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiBumblingRooster: CharacterCard = {
  abilities: [
    {
      effect: {
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
        type: "conditional",
      },
      id: "td9-1",
      name: "FATTEN YOU UP",
      text: "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 86,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "69d8809376697e97b2de10221febd0aee79c5d45",
  },
  franchise: "Moana",
  fullName: "Heihei - Bumbling Rooster",
  id: "td9",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Heihei",
  set: "009",
  strength: 2,
  text: "FATTEN YOU UP When you play this character, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Bumbling Rooster",
  willpower: 3,
};
