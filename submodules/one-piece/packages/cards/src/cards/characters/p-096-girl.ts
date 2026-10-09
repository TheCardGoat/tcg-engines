import type { CharacterCard } from "@tcg/op-types";
import { pGirl096I18n } from "./p-096-girl.i18n.ts";
export const pGirl096: CharacterCard = {
  id: "P-096",
  canonicalId: "P-096",
  slug: "girl/p-096",
  name: "Girl",
  printings: [
    {
      id: "P-096",
      artId: "P-096",
      setCode: "P",
      collectorNumber: "096",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-096.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Sabaody Archipelago"],
  attribute: "wisdom",
  effect:
    "[On Play] Draw 1 card and trash 1 card from your hand. [Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your [Nami] cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "name",
                  value: "Nami",
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
  i18n: pGirl096I18n,
};
