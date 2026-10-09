import type { CharacterCard } from "@tcg/op-types";
import { st16Gordon002I18n } from "./st16-002-gordon.i18n.ts";
export const st16Gordon002: CharacterCard = {
  id: "ST16-002",
  canonicalId: "ST16-002",
  slug: "gordon/st16-002",
  name: "Gordon",
  printings: [
    {
      id: "ST16-002",
      artId: "ST16-002",
      setCode: "ST16",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST16-002.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST16",
  cost: 2,
  traits: ["FILM"],
  power: 0,
  attribute: "wisdom",
  counter: 1000,
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Your Opponent's Attack] You may trash any number of {Music} type cards from your hand. Your Leader or 1 of your Characters gains +1000 power during this battle for every card trashed.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onOpponentAttack",
        actions: [
          {
            action: "trashFromHand",
            player: "self",
            amount: "all",
            upTo: true,
            filters: [
              {
                filter: "trait",
                value: "Music",
                match: "exact",
              },
            ],
          },
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            value: 0,
            valuePerPreviousActionTarget: 1000,
            duration: "thisBattle",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st16Gordon002I18n,
};
