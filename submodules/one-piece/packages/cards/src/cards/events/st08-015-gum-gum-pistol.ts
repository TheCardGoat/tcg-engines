import type { EventCard } from "@tcg/op-types";
import { st08GumGumPistol015I18n } from "./st08-015-gum-gum-pistol.i18n.ts";
export const st08GumGumPistol015: EventCard = {
  id: "ST08-015",
  canonicalId: "ST08-015",
  slug: "gum-gum-pistol/st08-015",
  name: "Gum-Gum Pistol",
  printings: [
    {
      id: "ST08-015",
      artId: "ST08-015",
      setCode: "ST08",
      collectorNumber: "015",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-015.png",
    },
  ],
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Straw Hat Crew"],
  cost: 3,
  effect: "[Main] K.O. up to 1 of your opponent's Characters with a cost of 2 or less.",
  trigger: "Draw 1 card.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
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
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st08GumGumPistol015I18n,
};
