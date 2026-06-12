import type { CharacterCard } from "@tcg/op-types";
import { op04Suleiman085I18n } from "./085-suleiman.i18n.ts";

export const op04Suleiman085: CharacterCard = {
  id: "OP04-085",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "slash",
  effect:
    "[On Play] [When Attacking] If your Leader has the [Dressrosa] type, give up to 1 of your opponent's Characters -2 cost during this turn. Then, trash 1 card from the top of your deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
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
            value: -2,
            duration: "thisTurn",
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Dressrosa",
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
            value: -2,
            duration: "thisTurn",
          },
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op04Suleiman085I18n,
};
