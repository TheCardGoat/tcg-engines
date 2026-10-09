import type { CharacterCard } from "@tcg/op-types";
import { st30Mr3Galdino014I18n } from "./st30-014-mr-3-galdino.i18n.ts";
export const st30Mr3Galdino014: CharacterCard = {
  id: "ST30-014",
  canonicalId: "ST30-014",
  slug: "mr-3-galdino/st30-014",
  name: "Mr.3(Galdino)",
  printings: [
    {
      id: "ST30-014",
      artId: "ST30-014",
      setCode: "ST30",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST30-014.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST30",
  cost: 2,
  traits: ["Impel Down", "Former Baroque Works"],
  power: 3000,
  attribute: "special",
  counter: 2000,
  effect:
    "[Activate: Main] You may rest this Character: Give up to 2 of your Characters with 6000 base power up to 2 rested DON!! cards each.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        optional: true,
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 2,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "eq",
                  value: 6000,
                },
              ],
            },
            count: {
              amount: 2,
              upTo: true,
            },
            distribution: "each",
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: st30Mr3Galdino014I18n,
};
