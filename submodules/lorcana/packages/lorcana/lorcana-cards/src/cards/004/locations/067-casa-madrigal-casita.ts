import type { LocationCard } from "@tcg/lorcana-types";
import { casaMadrigalCasitaI18n } from "./067-casa-madrigal-casita.i18n";

export const casaMadrigalCasita: LocationCard = {
  id: "oye",
  canonicalId: "ci_Onk",
  reprints: ["set4-067", "set9-068"],
  cardType: "location",
  name: "Casa Madrigal",
  version: "Casita",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 67,
  rarity: "common",
  cost: 1,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_3badd6eb64ca49b18e7ee2cefea06b46",
    tcgPlayer: 650010,
  },
  text: [
    {
      title: "OUR HOME",
      description: "At the start of your turn, if you have a character here gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "115-1",
      name: "OUR HOME",
      text: "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
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
        amount: 1,
        type: "gain-lore",
      },
    },
  ],
  i18n: casaMadrigalCasitaI18n,
};
