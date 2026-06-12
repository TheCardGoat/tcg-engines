import type { LocationCard } from "@tcg/lorcana-types";
import { theBitterwoodUndergroundForestI18n } from "./135-the-bitterwood-underground-forest.i18n";

export const theBitterwoodUndergroundForest: LocationCard = {
  id: "XY0",
  canonicalId: "ci_XY0",
  reprints: ["set10-135"],
  cardType: "location",
  name: "The Bitterwood",
  version: "Underground Forest",
  inkType: ["ruby"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 135,
  rarity: "rare",
  cost: 4,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_d694639a68614bcc8d3a482c1f5c5da1",
    tcgPlayer: 658882,
  },
  text: [
    {
      title: "GATHER RESOURCES",
      description:
        "Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "g5d-1",
      name: "GATHER RESOURCES Once",
      text: "GATHER RESOURCES Once during your turn, whenever you move a character with 5 {S} or more here, you may draw a card.",
      trigger: {
        event: "move",
        on: {
          cardType: "character",
          controller: "you",
          filters: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 5,
            },
            {
              type: "at-location",
              location: "this",
            },
          ],
        },
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "first-time-each-turn",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theBitterwoodUndergroundForestI18n,
};
