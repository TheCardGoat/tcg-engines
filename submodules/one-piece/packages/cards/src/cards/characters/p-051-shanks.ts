import type { CharacterCard } from "@tcg/op-types";
import { pShanks051I18n } from "./p-051-shanks.i18n.ts";
export const pShanks051: CharacterCard = {
  id: "P-051",
  canonicalId: "P-051",
  slug: "shanks/p-051",
  name: "Shanks",
  printings: [
    {
      id: "P-051",
      artId: "P-051",
      setCode: "P",
      collectorNumber: "051",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-051.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "P",
  setId: "P",
  cost: 7,
  traits: ["Red-Haired Pirates"],
  power: 9000,
  attribute: "slash",
  effect:
    "[When Attacking] You may trash any number of cards from your hand. This Character gains +1000 power during this battle for every card trashed.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: "all",
            upTo: true,
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 0,
            valuePerPreviousActionTarget: 1000,
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: pShanks051I18n,
};
