import type { LeaderCard } from "@tcg/op-types";
import { op12SilversRayleigh001I18n } from "./001-silvers-rayleigh.i18n.ts";

export const op12SilversRayleigh001: LeaderCard = {
  id: "OP12-001",
  cardType: "leader",
  color: ["red"],
  rarity: "L",
  setId: "OP12",
  power: 5000,
  life: 5,
  traits: ["Former Roger Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-001_p1_z6pLkgf.jpg",
      imageId: "OP12-001_p1",
    },
  ],
  effect:
    "Under the rules of this game, you cannot include cards with a cost of 5 or more in your deck.\n[Activate: Main] [Once Per Turn] You may reveal 2 Events from your hand: Up to 1 of your Characters with 4000 base power or less gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op12SilversRayleigh001I18n,
};
