import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaFierceProtector: CharacterCard = {
  id: "x49",
  cardType: "character",
  name: "Elsa",
  version: "Fierce Protector",
  fullName: "Elsa - Fierce Protector",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "008",
  text: "ICE OVER 1 {I} , Choose and discard a card — Exert chosen opposing character.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 60,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "775c816a0fe0858fa844bcd9f89cadaf3aff5d14",
  },
  abilities: [
    {
      id: "x49-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "discard",
        amount: 1,
        target: "CONTROLLER",
        chosen: true,
      },
      text: "ICE OVER 1 {I} , Choose and discard a card — Exert chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
};
