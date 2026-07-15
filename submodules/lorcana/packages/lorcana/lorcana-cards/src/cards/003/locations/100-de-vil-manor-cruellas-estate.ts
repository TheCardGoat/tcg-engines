import type { LocationCard } from "@tcg/lorcana-types";
import { deVilManorCruellasEstateI18n } from "./100-de-vil-manor-cruellas-estate.i18n";

export const deVilManorCruellasEstate: LocationCard = {
  id: "3bo",
  canonicalId: "ci_3bo",
  slug: "lorcana-ci_3bo",
  printings: [
    {
      id: "set3-100",
      artId: "set3-100",
      setCode: "set3",
      collectorNumber: "100",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set3-100"],
  cardType: "location",
  name: "De Vil Manor",
  version: "Cruella's Estate",
  inkType: ["emerald"],
  franchise: "101 Dalmatians",
  set: "003",
  cardNumber: 100,
  rarity: "common",
  cost: 1,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_7ddf29d6110e4ccf838fa1ae76bbe034",
    tcgPlayer: "534090",
  },
  i18n: deVilManorCruellasEstateI18n,
};
