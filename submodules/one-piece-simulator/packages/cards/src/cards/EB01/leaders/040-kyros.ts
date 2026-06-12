import type { LeaderCard } from "@tcg/op-types";
import { eb01Kyros040I18n } from "./040-kyros.i18n.ts";

export const eb01Kyros040: LeaderCard = {
  id: "EB01-040",
  cardType: "leader",
  color: ["black", "yellow"],
  rarity: "L",
  setId: "EB01",
  power: 5000,
  life: 4,
  traits: ["Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-040_p1.jpg",
      imageId: "EB01-040_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] You may turn 1 card from the top of your Life cards face-up: K.O. up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "turnLifeFaceUp",
            count: 1,
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
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: eb01Kyros040I18n,
};
