import type { LocationCard } from "@tcg/lorcana-types";
import { tianasPalaceJazzRestaurantI18n } from "./034-tianas-palace-jazz-restaurant.i18n";

export const tianasPalaceJazzRestaurant: LocationCard = {
  id: "MoB",
  canonicalId: "ci_MoB",
  reprints: ["set3-034"],
  cardType: "location",
  name: "Tiana's Palace",
  version: "Jazz Restaurant",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "003",
  cardNumber: 34,
  rarity: "uncommon",
  cost: 3,
  willpower: 8,
  moveCost: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_ed1ca708595f44a49f40680e20635ff5",
    tcgPlayer: 537408,
  },
  text: [
    {
      title: "NIGHT OUT",
      description: "Characters can't be challenged while here.",
    },
  ],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "CHARACTERS_HERE",
        type: "restriction",
      },
      id: "1hy-1",
      name: "NIGHT OUT",
      text: "NIGHT OUT Characters can't be challenged while here.",
      type: "static",
    },
  ],
  i18n: tianasPalaceJazzRestaurantI18n,
};
