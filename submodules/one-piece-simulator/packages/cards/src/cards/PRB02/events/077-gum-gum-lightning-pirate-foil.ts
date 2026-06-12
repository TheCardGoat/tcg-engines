import type { EventCard } from "@tcg/op-types";
import { prb02GumGumLightningPirateFoil077I18n } from "./077-gum-gum-lightning-pirate-foil.i18n.ts";

export const prb02GumGumLightningPirateFoil077: EventCard = {
  id: "OP09-077",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "PRB02",
  cost: 2,
  traits: ["Straw Hat Crew The Four Emperors"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-077_r2.jpg",
      imageId: "OP09-077_r2",
    },
  ],
  effect:
    "[Main] DON!! 2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with 6000 power or less.[Trigger] Add up to 1 DON!! card from your DON!! deck and set it as active.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
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
                  filter: "power",
                  comparison: "lte",
                  value: 6000,
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
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "active",
          },
        ],
      },
    ],
  },
  i18n: prb02GumGumLightningPirateFoil077I18n,
};
