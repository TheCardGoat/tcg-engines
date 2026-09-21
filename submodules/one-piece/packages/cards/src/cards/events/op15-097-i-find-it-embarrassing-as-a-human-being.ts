import type { EventCard } from "@tcg/op-types";
import { op15IFindItEmbarrassingAsAHumanBeing097I18n } from "./op15-097-i-find-it-embarrassing-as-a-human-being.i18n.ts";

export const op15IFindItEmbarrassingAsAHumanBeing097: EventCard = {
  id: "OP15-097",
  canonicalId: "OP15-097",
  slug: "i-find-it-embarrassing-as-a-human-being/op15-097",
  name: "I Find It Embarrassing as a Human Being",
  printings: [
    {
      id: "OP15-097",
      artId: "OP15-097",
      setCode: "OP15",
      collectorNumber: "097",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-097_Ry6RptY.jpg",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP15",
  cost: 1,
  trigger: "Activate this card's [Main] effect.",
  traits: ["Straw Hat Crew"],
  effect:
    "[Main] If you have 10 or more cards in your trash, up to 1 of your opponent's Characters with a base cost of 5 or less cannot attack until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "zoneCount",
            player: "self",
            zone: "trash",
            comparison: "gte",
            value: 10,
          },
        ],
        actions: [
          {
            action: "cannotAttack",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "baseCost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            duration: "untilEndOfOpponentNextEndPhase",
          },
        ],
      },
    ],
  },
  i18n: op15IFindItEmbarrassingAsAHumanBeing097I18n,
};
