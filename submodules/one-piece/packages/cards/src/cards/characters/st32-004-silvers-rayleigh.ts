import type { CharacterCard } from "@tcg/op-types";
import { st32SilversRayleigh004I18n } from "./st32-004-silvers-rayleigh.i18n.ts";
export const st32SilversRayleigh004: CharacterCard = {
  id: "ST32-004",
  canonicalId: "ST32-004",
  slug: "silvers-rayleigh/st32-004",
  name: "Silvers Rayleigh",
  printings: [
    {
      id: "ST32-004",
      artId: "ST32-004",
      setCode: "ST32",
      collectorNumber: "004",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST32-004.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "ST32",
  cost: 4,
  traits: ["Former Roger Pirates"],
  power: 5000,
  counter: 1000,
  attribute: "slash",
  effect:
    "If your Leader has the <Slash> attribute, this Character gains [Rush: Character]. (This card can attack Characters on the turn in which it is played.) [On Play] Rest up to 2 of your opponent's Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
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
    permanentEffects: [
      {
        conditions: [
          {
            condition: "leaderAttribute",
            attribute: "slash",
          },
        ],
        actions: [
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rushCharacter",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: st32SilversRayleigh004I18n,
};
