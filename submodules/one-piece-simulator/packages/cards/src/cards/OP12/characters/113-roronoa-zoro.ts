import type { CharacterCard } from "@tcg/op-types";
import { op12RoronoaZoro113I18n } from "./113-roronoa-zoro.i18n.ts";

export const op12RoronoaZoro113: CharacterCard = {
  id: "OP12-113",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP12",
  cost: 5,
  power: 6000,
  counter: 1000,
  trigger:
    "K.O. up to 1 of your opponent's Characters with a cost of 1 or less and add this card to your hand.",
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "slash",
  effect:
    '[On K.O.] If your Leader has the "Supernovas" type, play up to 1 "Supernovas" type Character card with a cost of 4 or less from your hand rested.',
  effects: {
    effects: [
      {
        trigger: "onKo",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Supernovas",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "trait",
                value: "Supernovas",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            playState: "rested",
          },
        ],
      },
    ],
  },
  i18n: op12RoronoaZoro113I18n,
};
