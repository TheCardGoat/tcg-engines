import type { LeaderCard } from "@tcg/op-types";
import { op08TonyTonyChopper001I18n } from "./001-tony-tony-chopper.i18n.ts";

export const op08TonyTonyChopper001: LeaderCard = {
  id: "OP08-001",
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "OP08",
  power: 4,
  life: 1,
  traits: ["5000"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-001_p1.jpg",
      imageId: "OP08-001_p1",
    },
  ],
  effect:
    "[Activate:Main] [Once Per Turn] Give up to 3 of your [Animal] or [Drum Kingdom] type Characters up to 1 rested DON!! card each.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 3,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Animal",
                },
                {
                  filter: "trait",
                  value: "Drum Kingdom",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08TonyTonyChopper001I18n,
};
