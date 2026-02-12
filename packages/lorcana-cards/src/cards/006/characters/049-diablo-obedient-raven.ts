import type { CharacterCard } from "@tcg/lorcana-types";

export const diabloObedientRaven: CharacterCard = {
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
      id: "1vn-1",
      text: "FLY, MY PET! When this character is banished, you may draw a card.",
      type: "action",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "f3ce8367f80305c407529f4e5600ff95c7d60c92",
  },
  franchise: "Sleeping Beauty",
  fullName: "Diablo - Obedient Raven",
  id: "1vn",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Diablo",
  set: "006",
  strength: 0,
  text: "FLY, MY PET! When this character is banished, you may draw a card.",
  version: "Obedient Raven",
  willpower: 1,
};
