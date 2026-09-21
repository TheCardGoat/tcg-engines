import type { CharacterCard } from "@tcg/op-types";
import { op17Rockstar034I18n } from "./op17-034-rockstar.i18n.ts";

export const op17Rockstar034: CharacterCard = {
  id: "OP17-034",
  canonicalId: "OP17-034",
  slug: "rockstar/op17-034",
  name: "Rockstar",
  printings: [
    {
      id: "OP17-034",
      artId: "OP17-034",
      setCode: "OP17",
      collectorNumber: "034",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP17-034_GeKuUHN.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP17",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "slash",
  effect:
    "[Activate: Main] [Once Per Turn] If your opponent's Leader has 6000 power or more, set up to 1 of your DON!! cards as active. Then, your {Red-Haired Pirates} type Leader's base power becomes 6000 until the end of your opponent's next End Phase.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        oncePerTurn: true,
        conditions: [
          {
            condition: "hasCard",
            player: "opponent",
            zone: "leader",
            filters: [
              {
                filter: "power",
                comparison: "gte",
                value: 6000,
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
          },
          {
            action: "setBasePower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Red-Haired Pirates",
                  match: "includes",
                },
              ],
            },
            value: 6000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op17Rockstar034I18n,
};
