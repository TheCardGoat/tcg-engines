import type { LocationCard } from "@tcg/lorcana-types";

export const tianasPalaceJazzRestaurant: LocationCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-be-challenged",
        target: "SELF",
      },
      id: "1hy-1",
      text: "NIGHT OUT Characters can't be challenged while here.",
      type: "action",
    },
  ],
  cardNumber: 34,
  cardType: "location",
  cost: 3,
  externalIds: {
    ravensburger: "c279e0883210f8f220e5fe8ac1b7f74b5404072f",
  },
  franchise: "Princess and the Frog",
  fullName: "Tiana's Palace - Jazz Restaurant",
  id: "1hy",
  inkType: ["amber"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 2,
  name: "Tiana's Palace",
  set: "003",
  text: "NIGHT OUT Characters can't be challenged while here.",
  version: "Jazz Restaurant",
};
