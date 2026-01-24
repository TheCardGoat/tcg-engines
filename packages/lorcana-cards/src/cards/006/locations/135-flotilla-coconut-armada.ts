import type { LocationCard } from "@tcg/lorcana-types";

export const flotillaCoconutArmada: LocationCard = {
  id: "1vh",
  cardType: "location",
  name: "Flotilla",
  version: "Coconut Armada",
  fullName: "Flotilla - Coconut Armada",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
  cost: 2,
  moveCost: 2,
  lore: 0,
  cardNumber: 135,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f40f46317aaadee496baadf72cdd1f7a5f6c411d",
  },
  abilities: [
    {
      id: "1vh-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "lose-lore",
          amount: 1,
          target: "EACH_OPPONENT",
        },
      },
      text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
    },
  ],
};
