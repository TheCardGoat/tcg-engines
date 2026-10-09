import type { CharacterCard } from "@tcg/op-types";
import { st22Jozu006I18n } from "./st22-006-jozu.i18n.ts";
export const st22Jozu006: CharacterCard = {
  id: "ST22-006",
  canonicalId: "ST22-006",
  slug: "jozu/st22-006",
  name: "Jozu",
  printings: [
    {
      id: "ST22-006",
      artId: "ST22-006",
      setCode: "ST22",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST22-006.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST22",
  cost: 7,
  power: 8000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "strike",
  effect:
    '[On Play] Reveal 1 card from the top of your deck. If that card\'s type includes "Whitebeard Pirates", draw 2 cards and trash 1 card from your hand.',
  effects: {
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
                {
                  action: "trashFromHand",
                  player: "self",
                  amount: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st22Jozu006I18n,
};
