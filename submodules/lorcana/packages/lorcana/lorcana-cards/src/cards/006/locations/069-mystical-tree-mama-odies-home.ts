import type { LocationCard } from "@tcg/lorcana-types";
import { mysticalTreeMamaOdiesHomeI18n } from "./069-mystical-tree-mama-odies-home.i18n";

export const mysticalTreeMamaOdiesHome: LocationCard = {
  id: "6Fu",
  canonicalId: "ci_6Fu",
  reprints: ["set6-069"],
  cardType: "location",
  name: "Mystical Tree",
  version: "Mama Odie's Home",
  inkType: ["amethyst"],
  franchise: "Princess and the Frog",
  set: "006",
  cardNumber: 69,
  rarity: "rare",
  cost: 2,
  willpower: 7,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_9119b44cfe67444288a32f23009541e8",
    tcgPlayer: 586978,
  },
  text: [
    {
      title: "NOT BAD",
      description:
        "At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.",
    },
    {
      title: "HARD-EARNED WISDOM",
      description:
        "At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "4wd-1",
      name: "NOT BAD",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          from: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            filter: [
              {
                type: "same-location-as-source",
              },
            ],
          },
          to: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "move-damage",
        },
        type: "optional",
      },
      text: "NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.",
      type: "triggered",
    },
    {
      id: "4wd-2",
      name: "HARD-EARNED WISDOM",
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
            {
              type: "has-name",
              name: "Mama Odie",
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
      text: "HARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
      type: "triggered",
    },
  ],
  i18n: mysticalTreeMamaOdiesHomeI18n,
};
