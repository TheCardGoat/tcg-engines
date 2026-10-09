import type { CharacterCard } from "@tcg/op-types";
import { st17BoaHancock004I18n } from "./st17-004-boa-hancock.i18n.ts";
export const st17BoaHancock004: CharacterCard = {
  id: "ST17-004",
  canonicalId: "ST17-004",
  slug: "boa-hancock/st17-004",
  name: "Boa Hancock",
  printings: [
    {
      id: "ST17-004",
      artId: "ST17-004",
      setCode: "ST17",
      collectorNumber: "004",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST17-004.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "ST17",
  cost: 4,
  traits: ["The Seven Warlords of the Sea", "Kuja Pirates"],
  power: 6000,
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Look at 3 cards from the top of your deck and place them at the top or bottom of your deck in any order. Then, give up to 1 rested DON!! card to 1 of your {The Seven Warlords of the Sea} type Leader or Character cards.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 3,
            position: "topOrBottom",
          },
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
                  filter: "trait",
                  value: "The Seven Warlords of the Sea",
                  match: "exact",
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
      },
    ],
  },
  i18n: st17BoaHancock004I18n,
};
