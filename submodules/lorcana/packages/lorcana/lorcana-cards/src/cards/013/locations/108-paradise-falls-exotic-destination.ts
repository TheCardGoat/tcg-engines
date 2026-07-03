import type { LocationCard } from "@tcg/lorcana-types";
import { paradiseFallsExoticDestinationI18n } from "./108-paradise-falls-exotic-destination.i18n";

export const paradiseFallsExoticDestination: LocationCard = {
  id: "g5D",
  canonicalId: "ci_g5D",
  slug: "lorcana-ci_g5D",
  printings: [
    {
      id: "set13-108",
      artId: "set13-108",
      setCode: "set13",
      collectorNumber: "108",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-108"],
  cardType: "location",
  name: "Paradise Falls",
  version: "Exotic Destination",
  inkType: ["emerald"],
  franchise: "Up",
  set: "013",
  cardNumber: 108,
  rarity: "rare",
  cost: 4,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Quite a Sight",
      description: "While you have a character here, this location gets +3 {L}.",
    },
  ],
  abilities: [
    {
      type: "static",
      name: "QUITE A SIGHT",
      text: "QUITE A SIGHT While you have a character here, this location gets +3 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 3,
        target: "SELF",
      },
    },
  ],
  i18n: paradiseFallsExoticDestinationI18n,
};
