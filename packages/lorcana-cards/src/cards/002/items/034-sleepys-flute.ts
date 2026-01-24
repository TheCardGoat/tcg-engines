import type { ItemCard } from "@tcg/lorcana-types";

export const sleepysFlute: ItemCard = {
  id: "1aa",
  cardType: "item",
  name: "Sleepy's Flute",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 34,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "a88b678ed05a863099cb73f4b15ef9a23ded6195",
  },
  abilities: [
    {
      id: "1aa-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you played a song this turn",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.",
    },
  ],
};
