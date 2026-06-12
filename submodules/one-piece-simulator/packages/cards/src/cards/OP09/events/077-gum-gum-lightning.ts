import type { EventCard } from "@tcg/op-types";
import { op09GumGumLightning077I18n } from "./077-gum-gum-lightning.i18n.ts";

export const op09GumGumLightning077: EventCard = {
  id: "OP09-077",
  cardType: "event",
  color: ["purple"],
  rarity: "UC",
  setId: "OP09",
  cost: 2,
  trigger: "Add up to 1 DON!! card from your DON!! deck and set it as active.",
  traits: ["Straw Hat Crew The Four Emperors"],
  effect:
    "[Main] DON!! 2 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with 6000 power or less.",
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
    ],
  },
  i18n: op09GumGumLightning077I18n,
};
