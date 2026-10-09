import type { ItemCard } from "@tcg/lorcana-types";
import { hyperiaCityExpressI18n } from "./201-hyperia-city-express.i18n";

export const hyperiaCityExpress: ItemCard = {
  id: "lTH",
  canonicalId: "ci_lTH",
  slug: "lorcana-ci_lTH",
  printings: [
    {
      id: "set14-201",
      artId: "set14-201",
      setCode: "set14",
      collectorNumber: "201",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-201"],
  cardType: "item",
  name: "Hyperia City Express",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "014",
  cardNumber: 201,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  abilities: [
    {
      id: "lTH-1",
      name: "EASY COMMUTE",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "move-to-location",
        character: "CHOSEN_CHARACTER_OF_YOURS",
        location: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
        },
        cost: "free",
      },
      text: "EASY COMMUTE {E} — Move a character of yours to a location for free.",
    },
    {
      id: "lTH-2",
      name: "STYLISH CONVENIENCE",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["location"],
          filter: [
            {
              type: "has-classification",
              classification: "Hyperia City",
            },
          ],
        },
      },
      text: "STYLISH CONVENIENCE Your Hyperia City locations get +2 {W}.",
    },
  ],
  externalIds: {
    lorcast: "crd_72af6d90932844239513539d4ed3f705",
  },
  text: [
    {
      title: "EASY COMMUTE",
      description: "{E} — Move a character of yours to a location for free.",
    },
    {
      title: "STYLISH CONVENIENCE",
      description: "Your Hyperia City locations get +2 {W}.",
    },
  ],
  i18n: hyperiaCityExpressI18n,
};
