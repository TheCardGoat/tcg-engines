import type { CharacterCard } from "@tcg/lorcana";

export const buckyNuttyRascal: CharacterCard = {
  id: "17v",
  cardType: "character",
  name: "Bucky",
  version: "Nutty Rascal",
  fullName: "Bucky - Nutty Rascal",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "POP! When this character is banished in a challenge, you may draw a card.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 60,
  inkable: true,
  externalIds: {
    ravensburger: "9e2af09893b0ca662b9ffaf6ed3e829170c038b7",
  },
  abilities: [
    {
      id: "17v-1",
      text: "POP! When this character is banished in a challenge, you may draw a card.",
      name: "POP!",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
