import type { CharacterCard } from "@tcg/op-types";
import { st09UzukiTempura002I18n } from "./st09-002-uzuki-tempura.i18n.ts";
export const st09UzukiTempura002: CharacterCard = {
  id: "ST09-002",
  canonicalId: "ST09-002",
  slug: "uzuki-tempura/st09-002",
  name: "Uzuki Tempura",
  printings: [
    {
      id: "ST09-002",
      artId: "ST09-002",
      setCode: "ST09",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST09-002.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST09",
  cost: 4,
  traits: ["Land of Wano"],
  power: 5000,
  attribute: "slash",
  counter: 1000,
  trigger:
    "[Trigger] Rest up to 1 of your opponent's Characters with a cost of 2 or less and add this card to your hand.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
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
          {
            action: "addThisCardToHand",
          },
        ],
      },
    ],
  },
  i18n: st09UzukiTempura002I18n,
};
