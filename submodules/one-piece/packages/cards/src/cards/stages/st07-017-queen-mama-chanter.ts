import type { StageCard } from "@tcg/op-types";
import { st07QueenMamaChanter017I18n } from "./st07-017-queen-mama-chanter.i18n.ts";
export const st07QueenMamaChanter017: StageCard = {
  id: "ST07-017",
  canonicalId: "ST07-017",
  slug: "queen-mama-chanter/st07-017",
  name: "Queen Mama Chanter",
  printings: [
    {
      id: "ST07-017",
      artId: "ST07-017",
      setCode: "ST07",
      collectorNumber: "017",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST07-017.png",
    },
  ],
  cardType: "stage",
  color: ["yellow"],
  rarity: "C",
  setId: "ST07",
  cost: 2,
  traits: ["Big Mom Pirates", "Homies"],
  effect:
    "[Activate: Main] You may rest this Stage and add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 of your Characters with a cost of 3 to the top of the owner's Life cards face-up.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "addLifeToHand",
            amount: 1,
            position: "choice",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 3,
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st07QueenMamaChanter017I18n,
};
