import type { ItemCard } from "@tcg/lorcana-types";

export const potionOfMight: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          type: "if",
          expression: "a Villain character is chosen",
        },
        then: {
          type: "modify-stat",
          stat: "strength",
          modifier: 4,
          target: "CHOSEN_CHARACTER",
        },
        type: "conditional",
      },
      id: "6dr-1",
      text: "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
      type: "activated",
    },
  ],
  cardNumber: 132,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "1700b318b54e8ea7f92fdc144a34b8f49e65ff5b",
  },
  franchise: "Snow White",
  id: "6dr",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Potion of Might",
  set: "005",
  text: "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
};
