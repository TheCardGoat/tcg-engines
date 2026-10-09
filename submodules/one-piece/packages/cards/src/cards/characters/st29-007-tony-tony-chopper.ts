import type { CharacterCard } from "@tcg/op-types";
import { st29TonyTonyChopper007I18n } from "./st29-007-tony-tony-chopper.i18n.ts";
export const st29TonyTonyChopper007: CharacterCard = {
  id: "ST29-007",
  canonicalId: "ST29-007",
  slug: "tony-tony-chopper/st29-007",
  name: "Tony Tony.Chopper",
  printings: [
    {
      id: "ST29-007",
      artId: "ST29-007",
      setCode: "ST29",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-007.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal", "Egghead", "Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[On K.O.] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 card from your hand to the top of your Life cards.",
  trigger: "Up to 1 of your [Monkey.D.Luffy] cards gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onKo",
        costs: [
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
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Monkey.D.Luffy",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: st29TonyTonyChopper007I18n,
};
