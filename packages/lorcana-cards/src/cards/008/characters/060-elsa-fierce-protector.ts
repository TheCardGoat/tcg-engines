import type { CharacterCard } from "@tcg/lorcana-types";

export const elsaFierceProtector: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 1,
        chosen: true,
        target: "CONTROLLER",
        type: "discard",
      },
      id: "x49-1",
      text: "ICE OVER 1 {I} , Choose and discard a card — Exert chosen opposing character.",
      type: "activated",
    },
  ],
  cardNumber: 60,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  cost: 4,
  externalIds: {
    ravensburger: "775c816a0fe0858fa844bcd9f89cadaf3aff5d14",
  },
  franchise: "Frozen",
  fullName: "Elsa - Fierce Protector",
  id: "x49",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Elsa",
  set: "008",
  strength: 3,
  text: "ICE OVER 1 {I} , Choose and discard a card — Exert chosen opposing character.",
  version: "Fierce Protector",
  willpower: 4,
};
