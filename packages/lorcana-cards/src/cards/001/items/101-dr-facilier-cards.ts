import type { ItemCard } from "@tcg/lorcana-types";

export const drFacilierundefined: ItemCard = {
  id: "s8n",
  cardType: "item",
  name: "Dr. Facilier",
  version: "undefined",
  fullName: "Dr. Facilier - undefined",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
  cost: 2,
  cardNumber: 101,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
      id: "s8n-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
};
