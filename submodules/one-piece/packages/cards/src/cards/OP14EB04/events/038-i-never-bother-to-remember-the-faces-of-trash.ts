import type { EventCard } from "@tcg/op-types";
import { op14eb04INeverBotherToRememberTheFacesOfTrash038I18n } from "./038-i-never-bother-to-remember-the-faces-of-trash.i18n.ts";

export const op14eb04INeverBotherToRememberTheFacesOfTrash038: EventCard = {
  id: "OP14-038",
  canonicalId: "OP14-038",
  slug: "i-never-bother-to-remember-the-faces-of-trash",
  name: "I Never Bother to Remember the Faces of Trash",
  printings: [
    {
      id: "OP14-038",
      artId: "OP14-038",
      setCode: "OP14EB04",
      collectorNumber: "038",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP14-038_0NkYUoY.jpg",
    },
  ],
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 1,
  traits: ["The Seven Warlords of the Sea"],
  effect:
    "[Main] You may rest 2 of your cards: Draw 1 card and rest up to 1 of your opponent's Characters with 7000 base power or less. [Counter] Your Leader gains +3000 power during this battle.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 2,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 7000,
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
              },
            },
            value: 3000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op14eb04INeverBotherToRememberTheFacesOfTrash038I18n,
};
