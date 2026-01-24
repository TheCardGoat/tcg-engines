import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloObedientRaven: CharacterCard = {
  id: "1vn",
  cardType: "character",
  name: "Diablo",
  version: "Obedient Raven",
  fullName: "Diablo - Obedient Raven",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "006",
  text: "FLY, MY PET! When this character is banished, you may draw a card.",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "f3ce8367f80305c407529f4e5600ff95c7d60c92",
  },
  abilities: [
    {
      id: "1vn-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "FLY, MY PET! When this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
