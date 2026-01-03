import type { ItemCard } from "@tcg/lorcana-types";

export const StolenScimitar: ItemCard = {
  id: "17q",
  cardType: "item",
  name: "Stolen Scimitar",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "001",
  text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
  cost: 2,
  cardNumber: 102,
  inkable: true,
  externalIds: {
    ravensburger: "9d9f18605fc706396f03e12b4ffa1fdb3fcbf504",
  },
  abilities: [
    {
      id: "17q-1",
      text: "SLASH {E} — Chosen character gets +1 {S} this turn. If a character named Aladdin is chosen, he gets +2 {S} instead.",
      name: "SLASH",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            target: "CHOSEN_CHARACTER",
            duration: "this-turn",
          },
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 2,
            target: "SELF",
            duration: "this-turn",
          },
        ],
      },
    },
  ],
};
