import type { CharacterCard } from "@tcg/op-types";
import { st09FugetsuOmusubi009I18n } from "./st09-009-fugetsu-omusubi.i18n.ts";
export const st09FugetsuOmusubi009: CharacterCard = {
  id: "ST09-009",
  canonicalId: "ST09-009",
  slug: "fugetsu-omusubi/st09-009",
  name: "Fugetsu Omusubi",
  printings: [
    {
      id: "ST09-009",
      artId: "ST09-009",
      setCode: "ST09",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-009.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 3,
  traits: ["Land of Wano"],
  power: 4000,
  attribute: "slash",
  counter: 1000,
  trigger:
    "[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
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
                  value: 1,
                },
              ],
            },
          },
          {
            action: "addThisCardToHand",
          },
        ],
      },
    ],
  },
  i18n: st09FugetsuOmusubi009I18n,
};
