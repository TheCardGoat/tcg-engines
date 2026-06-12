import type { LocationCard } from "@tcg/lorcana-types";
import { mauisPlaceOfExileHiddenIslandI18n } from "./202-mauis-place-of-exile-hidden-island.i18n";

export const mauisPlaceOfExileHiddenIsland: LocationCard = {
  id: "8P7",
  canonicalId: "ci_jZZ",
  reprints: ["set3-202", "set9-204"],
  cardType: "location",
  name: "Maui's Place of Exile",
  version: "Hidden Island",
  inkType: ["steel"],
  franchise: "Moana",
  set: "003",
  cardNumber: 202,
  rarity: "rare",
  cost: 2,
  willpower: 5,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_f2169b618849493a969102f760825622",
    tcgPlayer: 650136,
  },
  text: [
    {
      title: "ISOLATED",
      description: "Characters gain Resist +1 while here.",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
        value: 1,
      },
      id: "s6w-1",
      name: "ISOLATED",
      text: "ISOLATED Characters gain Resist +1 while here.",
      type: "static",
    },
  ],
  i18n: mauisPlaceOfExileHiddenIslandI18n,
};
