import type { LocationCard } from "@tcg/lorcana-types";
import { theBeanstalkOnwardAndUpwardI18n } from "./102-the-beanstalk-onward-and-upward.i18n";

export const theBeanstalkOnwardAndUpward: LocationCard = {
  id: "JEn",
  canonicalId: "ci_JEn",
  slug: "lorcana-ci_JEn",
  printings: [
    {
      id: "set14-102",
      artId: "set14-102",
      setCode: "set14",
      collectorNumber: "102",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-102"],
  cardType: "location",
  name: "The Beanstalk",
  version: "Onward and Upward",
  inkType: ["emerald"],
  set: "014",
  cardNumber: 102,
  rarity: "rare",
  cost: 1,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: true,
  text: [
    {
      title: "The Distant Reaches",
      description: "Characters get +1 {S} and gain Evasive while here.",
    },
  ],
  abilities: [
    {
      id: "JEn-1",
      name: "The Distant Reaches",
      text: "The Distant Reaches Characters get +1 {S} while here.",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
    {
      id: "JEn-2",
      name: "The Distant Reaches",
      text: "The Distant Reaches Characters gain Evasive while here.",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "all",
          count: "all",
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "same-location-as-source",
            },
          ],
        },
      },
    },
  ],
  i18n: theBeanstalkOnwardAndUpwardI18n,
};
