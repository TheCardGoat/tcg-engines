import type { ItemCard } from "@tcg/lorcana-types";

export const potionOfMight: ItemCard = {
  id: "6dr",
  cardType: "item",
  name: "Potion of Might",
  inkType: ["ruby"],
  franchise: "Snow White",
  set: "005",
  text: "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1700b318b54e8ea7f92fdc144a34b8f49e65ff5b",
  },
  abilities: [
    {
      id: "6dr-1",
      type: "activated",
      effect: {
        type: "conditional",
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
      },
      text: "VILE CONCOCTION 1 {I}, Banish this item — Chosen character gets +3 {S} this turn. If a Villain character is chosen, they get +4 {S} instead.",
    },
  ],
};
