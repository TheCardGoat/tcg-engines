import type { LocationCard } from "@tcg/lorcana-types";
import { mauisPlaceOfExileHiddenIslandI18n } from "./204-mauis-place-of-exile-hidden-island.i18n";

export const mauisPlaceOfExileHiddenIsland: LocationCard = {
  id: "X29",
  canonicalId: "ci_jZZ",
  slug: "lorcana-ci_jZZ",
  printings: [
    {
      id: "set9-204",
      artId: "set9-204",
      setCode: "set9",
      collectorNumber: "204",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set3-202", "set9-204"],
  cardType: "location",
  name: "Maui's Place of Exile",
  version: "Hidden Island",
  inkType: ["steel"],
  franchise: "Moana",
  set: "009",
  cardNumber: 204,
  rarity: "uncommon",
  cost: 2,
  willpower: 5,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_f2169b618849493a969102f760825622",
    tcgPlayer: "650136",
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
