import type { ItemCard } from "@tcg/lorcana-types";

export const LanternUndefined: ItemCard = {
  id: "ub2",
  cardType: "item",
  name: "Lantern",
  version: "undefined",
  fullName: "Lantern - undefined",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**BIRTHDAY LIGHTS** {E} - You pay 1 {I} less for the next character you play this turn.",
  cost: 2,
  cardNumber: 33,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**BIRTHDAY LIGHTS** {E} - You pay 1 {I} less for the next character you play this turn.",
      id: "ub2-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
};
