import type { CharacterCard } from "@tcg/op-types";
import { st22EdwardNewgate003I18n } from "./st22-003-edward-newgate.i18n.ts";
export const st22EdwardNewgate003: CharacterCard = {
  id: "ST22-003",
  canonicalId: "ST22-003",
  slug: "edward-newgate/st22-003",
  name: "Edward.Newgate",
  printings: [
    {
      id: "ST22-003",
      artId: "ST22-003",
      setCode: "ST22",
      collectorNumber: "003",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-003.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 9,
  power: 10000,
  traits: ["The Four Emperors", "Whitebeard Pirates"],
  attribute: "special",
  effect:
    '[Double Attack] (This card deals 2 damage.) [On Play] Reveal 1 card from the top of your deck. If that card\'s type includes "Whitebeard Pirates", draw 2 cards.',
  effects: {
    keywords: ["doubleAttack"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealFromDeck",
            player: "self",
            count: 1,
            ifRevealedCardMatches: {
              filters: [
                {
                  filter: "trait",
                  value: "Whitebeard Pirates",
                  match: "includes",
                },
              ],
              actions: [
                {
                  action: "draw",
                  player: "self",
                  amount: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st22EdwardNewgate003I18n,
};
