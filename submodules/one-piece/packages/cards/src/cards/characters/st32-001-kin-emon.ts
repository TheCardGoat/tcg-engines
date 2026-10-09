import type { CharacterCard } from "@tcg/op-types";
import { st32KinEmon001I18n } from "./st32-001-kin-emon.i18n.ts";
export const st32KinEmon001: CharacterCard = {
  id: "ST32-001",
  canonicalId: "ST32-001",
  slug: "kin-emon/st32-001",
  name: "Kin'emon",
  printings: [
    {
      id: "ST32-001",
      artId: "ST32-001",
      setCode: "ST32",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST32-001.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST32",
  cost: 1,
  traits: ["Land of Wano", "The Akazaya Nine"],
  power: 2000,
  counter: 1000,
  attribute: "slash",
  effect:
    "[On Play] You may rest your <Slash> attribute Leader or 1 of your DON!! cards: Draw 2 cards and trash 1 card from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        optional: true,
        alternativeCosts: [
          [
            {
              cost: "restCards",
              amount: 1,
              filters: [
                {
                  filter: "cardCategory",
                  value: "leader",
                },
                {
                  filter: "attribute",
                  value: "slash",
                },
              ],
            },
          ],
          [
            {
              cost: "restDon",
              amount: 1,
            },
          ],
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st32KinEmon001I18n,
};
