import type { LocationCard } from "@tcg/lorcana-types";
import { fangRiverCityI18n } from "./101-fang-river-city.i18n";

export const fangRiverCity: LocationCard = {
  id: "AJB",
  canonicalId: "ci_AJB",
  reprints: ["set3-101"],
  cardType: "location",
  name: "Fang",
  version: "River City",
  inkType: ["emerald"],
  franchise: "Raya and the Last Dragon",
  set: "003",
  cardNumber: 101,
  rarity: "rare",
  cost: 4,
  willpower: 6,
  moveCost: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6438731e38f642b38a24a0b566078fa3",
    tcgPlayer: 533884,
  },
  text: [
    {
      title: "SURROUNDED BY WATER",
      description:
        "Characters gain Ward and Evasive while here. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Ward",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
      },
      type: "static",
    },
    {
      effect: {
        keyword: "Evasive",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
      },
      type: "static",
    },
  ],
  i18n: fangRiverCityI18n,
};
