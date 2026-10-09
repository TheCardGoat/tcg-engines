import type { CharacterCard } from "@tcg/op-types";
import { st13CurlyDadan006I18n } from "./st13-006-curly-dadan.i18n.ts";
export const st13CurlyDadan006: CharacterCard = {
  id: "ST13-006",
  canonicalId: "ST13-006",
  slug: "curly-dadan/st13-006",
  name: "Curly.Dadan",
  printings: [
    {
      id: "ST13-006",
      artId: "ST13-006",
      setCode: "ST13",
      collectorNumber: "006",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST13-006.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST13",
  cost: 5,
  power: 4000,
  counter: 1000,
  traits: ["Mountain Bandits"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Play up to 1 each of [Sabo], [Portgas.D.Ace], and [Monkey.D.Luffy] with a cost of 2 from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "playGrouped",
            source: {
              player: "self",
              zone: "hand",
            },
            groups: [
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Sabo",
                  },
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 2,
                  },
                ],
              },
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Portgas.D.Ace",
                  },
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 2,
                  },
                ],
              },
              {
                count: {
                  amount: 1,
                  upTo: true,
                },
                filters: [
                  {
                    filter: "name",
                    value: "Monkey.D.Luffy",
                  },
                  {
                    filter: "cost",
                    comparison: "eq",
                    value: 2,
                  },
                ],
              },
            ],
            playStates: {
              single: "active",
              multiple: ["active", "active", "active"],
              byGroup: true,
            },
          },
        ],
      },
    ],
  },
  i18n: st13CurlyDadan006I18n,
};
