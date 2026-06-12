import type { LocationCard } from "@tcg/lorcana-types";
import { zootopiaTundratownI18n } from "./034-zootopia-tundratown.i18n";

export const zootopiaTundratown: LocationCard = {
  id: "tpz",
  canonicalId: "ci_tpz",
  reprints: ["set11-034"],
  cardType: "location",
  name: "Zootopia",
  version: "Tundratown",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "011",
  cardNumber: 34,
  rarity: "common",
  cost: 1,
  willpower: 5,
  moveCost: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7a26dcac46ba4e0291bf8bedaec4923d",
    tcgPlayer: 674833,
  },
  i18n: zootopiaTundratownI18n,
};
