import type { LocationCard } from "@tcg/lorcana-types";

export const flotillaCoconutArmada: LocationCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "lose-lore",
          amount: 1,
          target: "EACH_OPPONENT",
        },
        type: "conditional",
      },
      id: "1vh-1",
      text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
      type: "action",
    },
  ],
  cardNumber: 135,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "f40f46317aaadee496baadf72cdd1f7a5f6c411d",
  },
  franchise: "Moana",
  fullName: "Flotilla - Coconut Armada",
  id: "1vh",
  inkType: ["ruby"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Flotilla",
  set: "006",
  text: "TINY THIEVES At the start of your turn, if you have a character here, all opponents lose 1 lore and you gain lore equal to the lore lost this way.",
  version: "Coconut Armada",
};
