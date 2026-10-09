import type { CharacterCard } from "@tcg/op-types";
import { pUlti077I18n } from "./p-077-ulti.i18n.ts";
export const pUlti077: CharacterCard = {
  id: "P-077",
  canonicalId: "P-077",
  slug: "ulti/p-077",
  name: "Ulti",
  printings: [
    {
      id: "P-077",
      artId: "P-077",
      setCode: "P",
      collectorNumber: "077",
      rarity: "P",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/P-077.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "P",
  setId: "P",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[Once Per Turn] When 2 or more DON!! cards on your field are returned to your DON!! deck, add up to 1 DON!! card from your DON!! deck and rest it. Then, set up to 1 of your purple Stages as active.",
  effects: {
    effects: [
      {
        trigger: "whenDonReturned",
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["stage"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "purple",
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
        eventFilter: {
          minimumAmount: 2,
        },
      },
    ],
  },
  i18n: pUlti077I18n,
};
