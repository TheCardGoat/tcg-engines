import type { EventCard } from "@tcg/op-types";
import { prb02DragonBreathPirateFoil017I18n } from "./017-dragon-breath-pirate-foil.i18n.ts";

export const prb02DragonBreathPirateFoil017: EventCard = {
  id: "OP07-017",
  cardType: "event",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 2,
  traits: ["Revolutionary Army"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-017_r1.jpg",
      imageId: "OP07-017_r1",
    },
  ],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with 3000 power or less and up to 1 of your opponent's Stages with a cost of 1 or less.[Trigger] Activate this card's [Main] effect.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "activateEffect",
            effectTrigger: "main",
          },
        ],
      },
    ],
  },
  i18n: prb02DragonBreathPirateFoil017I18n,
};
