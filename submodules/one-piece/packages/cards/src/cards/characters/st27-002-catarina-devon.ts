import type { CharacterCard } from "@tcg/op-types";
import { st27CatarinaDevon002I18n } from "./st27-002-catarina-devon.i18n.ts";
export const st27CatarinaDevon002: CharacterCard = {
  id: "ST27-002",
  canonicalId: "ST27-002",
  slug: "catarina-devon/st27-002",
  name: "Catarina Devon",
  printings: [
    {
      id: "ST27-002",
      artId: "ST27-002",
      setCode: "ST27",
      collectorNumber: "002",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST27-002.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST27",
  cost: 1,
  traits: ["Blackbeard Pirates"],
  power: 1000,
  attribute: "special",
  counter: 2000,
  effect:
    "[Activate: Main] You may trash this Character: If your Leader has the {Blackbeard Pirates} type, give up to 1 of your opponent's Characters −1 cost during this turn. [On K.O.] Draw 1 card.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
            condition: {
              condition: "leaderTrait",
              trait: "Blackbeard Pirates",
              match: "exact",
            },
          },
        ],
        optional: true,
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: st27CatarinaDevon002I18n,
};
