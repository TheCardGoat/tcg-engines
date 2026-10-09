import type { CharacterCard } from "@tcg/op-types";
import { st32RoronoaZoro005I18n } from "./st32-005-roronoa-zoro.i18n.ts";
export const st32RoronoaZoro005: CharacterCard = {
  id: "ST32-005",
  canonicalId: "ST32-005",
  slug: "roronoa-zoro/st32-005",
  name: "Roronoa Zoro",
  printings: [
    {
      id: "ST32-005",
      artId: "ST32-005",
      setCode: "ST32",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST32-005.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST32",
  cost: 1,
  traits: ["Supernovas", "Straw Hat Crew"],
  power: 2000,
  counter: 2000,
  attribute: "slash",
  effect:
    "[Rush: Character] (This card can attack Characters on the turn in which it is played.) [On Play] If your Leader has the <Slash> attribute, rest up to 1 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    keywords: ["rushCharacter"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderAttribute",
            attribute: "slash",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: st32RoronoaZoro005I18n,
};
