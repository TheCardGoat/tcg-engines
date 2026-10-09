import type { CharacterCard } from "@tcg/op-types";
import { st17Crocodile001I18n } from "./st17-001-crocodile.i18n.ts";
export const st17Crocodile001: CharacterCard = {
  id: "ST17-001",
  canonicalId: "ST17-001",
  slug: "crocodile/st17-001",
  name: "Crocodile",
  printings: [
    {
      id: "ST17-001",
      artId: "ST17-001",
      setCode: "ST17",
      collectorNumber: "001",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST17-001.png",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "ST17",
  cost: 4,
  traits: ["The Seven Warlords of the Sea", "Baroque Works"],
  power: 5000,
  attribute: "special",
  counter: 1000,
  effect:
    "[On Play] Reveal 1 card from the top of your deck. If that card is a {The Seven Warlords of the Sea} type card, draw 2 cards and place 1 card from your hand at the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "revealTopDeckCard",
            player: "self",
            conditional: {
              filters: [
                {
                  filter: "trait",
                  value: "The Seven Warlords of the Sea",
                  match: "exact",
                },
              ],
              actions: [
                {
                  action: "draw",
                  player: "self",
                  amount: 2,
                },
                {
                  action: "returnToDeck",
                  target: {
                    player: "self",
                    zones: ["hand"],
                    count: {
                      amount: 1,
                    },
                  },
                  position: "top",
                },
              ],
            },
            finalPosition: "top",
          },
        ],
      },
    ],
  },
  i18n: st17Crocodile001I18n,
};
