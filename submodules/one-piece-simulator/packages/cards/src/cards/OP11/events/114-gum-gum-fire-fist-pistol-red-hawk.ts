import type { EventCard } from "@tcg/op-types";
import { op11GumGumFireFistPistolRedHawk114I18n } from "./114-gum-gum-fire-fist-pistol-red-hawk.i18n.ts";

export const op11GumGumFireFistPistolRedHawk114: EventCard = {
  id: "OP11-114",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP11",
  cost: 1,
  traits: ["Straw Hat Crew"],
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-114_p1.jpg",
      imageId: "OP11-114_p1",
    },
  ],
  effect:
    "[Main] You may rest 3 of your DON!! cards: If you and your opponent have a total of 5 or more Life cards, K.O. up to 1 of your opponent's Characters with a base cost of 5 or less.\n[Counter] Up to 1 of your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "gte",
            value: 5,
          },
        ],
        actions: [
          {
            action: "ko",
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
          },
        ],
        optional: true,
      },
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op11GumGumFireFistPistolRedHawk114I18n,
};
