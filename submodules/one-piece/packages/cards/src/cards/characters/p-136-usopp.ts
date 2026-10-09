import type { CharacterCard } from "@tcg/op-types";
import { pUsopp136I18n } from "./p-136-usopp.i18n.ts";
export const pUsopp136: CharacterCard = {
  id: "P-136",
  canonicalId: "P-136",
  slug: "usopp/p-136",
  name: "Usopp",
  printings: [
    {
      id: "P-136",
      artId: "P-136",
      setCode: "P",
      collectorNumber: "136",
      rarity: "P",
      imageUrl: "https://asia-en.onepiece-cardgame.com/images/cardlist/card/P-136.png",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "P",
  setId: "P",
  cost: 1,
  power: 2000,
  counter: 2000,
  attribute: "ranged",
  traits: ["Straw Hat Crew"],
  effect:
    "[Activate: Main] You may rest this Character: Give up to 1 rested DON!! card to your {Straw Hat Crew} type Leader or 1 of your Characters.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "anyOf",
                  filters: [
                    {
                      filter: "allOf",
                      filters: [
                        {
                          filter: "cardCategory",
                          value: "leader",
                        },
                        {
                          filter: "trait",
                          value: "Straw Hat Crew",
                          match: "exact",
                        },
                      ],
                    },
                    {
                      filter: "cardCategory",
                      value: "character",
                    },
                  ],
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
        costs: [
          {
            cost: "restThisCard",
          },
        ],
      },
    ],
  },
  i18n: pUsopp136I18n,
};
