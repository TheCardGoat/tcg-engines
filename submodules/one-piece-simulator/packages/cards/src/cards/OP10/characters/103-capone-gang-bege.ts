import type { CharacterCard } from "@tcg/op-types";
import { op10CaponeGangBege103I18n } from "./103-capone-gang-bege.i18n.ts";

export const op10CaponeGangBege103: CharacterCard = {
  id: "OP10-103",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP10",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Firetank Pirates Supernovas"],
  attribute: "ranged",
  effect:
    '[On Play] You may add 1 card from the top or bottom of your Life cards to your hand: Add up to 1 "Supernovas" type Character card from your hand to the top of your Life cards face-up.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Supernovas",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
            position: "top",
            faceUp: true,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10CaponeGangBege103I18n,
};
