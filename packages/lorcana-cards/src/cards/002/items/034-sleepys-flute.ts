import type { ItemCard } from "@tcg/lorcana-types";

export const sleepysFlute: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        condition: {
          type: "if",
          expression: "you played a song this turn",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
        type: "conditional",
      },
      id: "1aa-1",
      text: "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.",
      type: "activated",
    },
  ],
  cardNumber: 34,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "a88b678ed05a863099cb73f4b15ef9a23ded6195",
  },
  franchise: "Snow White",
  id: "1aa",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "Sleepy's Flute",
  set: "002",
  text: "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.",
};
