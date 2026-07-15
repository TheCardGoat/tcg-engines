import type { CharacterCard } from "@tcg/lorcana-types";

export const buckyNuttyRascal: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "17v-1",
      name: "POP!",
      text: "POP! When this character is banished in a challenge, you may draw a card.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 60,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "9e2af09893b0ca662b9ffaf6ed3e829170c038b7",
  },
  franchise: "Emperors New Groove",
  fullName: "Bucky - Nutty Rascal",
  id: "17v",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Bucky",
  set: "007",
  strength: 3,
  text: "POP! When this character is banished in a challenge, you may draw a card.",
  version: "Nutty Rascal",
  willpower: 2,
};
