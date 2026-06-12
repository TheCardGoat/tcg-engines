import type { LocationCard } from "@tcg/lorcana-types";
import { theWallBorderFortressI18n } from "./203-the-wall-border-fortress.i18n";

export const theWallBorderFortress: LocationCard = {
  id: "a8H",
  canonicalId: "ci_oUR",
  reprints: ["set4-203"],
  cardType: "location",
  name: "The Wall",
  version: "Border Fortress",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 203,
  rarity: "rare",
  cost: 4,
  willpower: 8,
  moveCost: 2,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_ae2a969b746542268ff0bcfc735ea367",
    tcgPlayer: 550536,
  },
  text: [
    {
      title: "PROTECT THE REALM",
      description:
        "While you have an exerted character here, your other locations can't be challenged.",
    },
  ],
  abilities: [
    {
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
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        restriction: "cant-be-challenged",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          cardTypes: ["location"],
          zones: ["play"],
          excludeSelf: true,
        },
        type: "restriction",
      },
      id: "1rp-1",
      name: "PROTECT THE REALM",
      text: "PROTECT THE REALM While you have an exerted character here, your other locations can't be challenged.",
      type: "static",
    },
  ],
  i18n: theWallBorderFortressI18n,
};
