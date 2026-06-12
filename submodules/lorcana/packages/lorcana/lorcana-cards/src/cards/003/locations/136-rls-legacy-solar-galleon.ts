import type { LocationCard } from "@tcg/lorcana-types";
import { rlsLegacySolarGalleonI18n } from "./136-rls-legacy-solar-galleon.i18n";

export const rlsLegacySolarGalleon: LocationCard = {
  id: "Lt1",
  canonicalId: "ci_Rim",
  reprints: ["set3-136"],
  cardType: "location",
  name: "RLS Legacy",
  version: "Solar Galleon",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 136,
  rarity: "rare",
  cost: 4,
  willpower: 8,
  moveCost: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_7c421033c14c40e7a5be957ba42bb1b7",
    tcgPlayer: 539167,
  },
  text: [
    {
      title: "THIS IS OUR SHIP",
      description: "Characters gain Evasive while here.",
    },
    {
      title: "HEAVE TOGETHER NOW",
      description:
        "If you have a character here, you pay 2 {I} less to move a character of yours here.",
    },
  ],
  abilities: [
    {
      id: "Lt1-1",
      name: "THIS IS OUR SHIP",
      effect: {
        keyword: "Evasive",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
      },
      text: "THIS IS OUR SHIP Characters gain Evasive while here.",
      type: "static",
    },
    {
      id: "Lt1-2",
      name: "HEAVE TOGETHER NOW",
      type: "static",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
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
        filter: {
          cardType: "character",
        },
        location: "here",
        reduction: 2,
        type: "move-cost-reduction",
      },
      text: "HEAVE TOGETHER NOW If you have a character here, you pay 2 {I} less to move a character of yours here.",
    },
  ],
  i18n: rlsLegacySolarGalleonI18n,
};
