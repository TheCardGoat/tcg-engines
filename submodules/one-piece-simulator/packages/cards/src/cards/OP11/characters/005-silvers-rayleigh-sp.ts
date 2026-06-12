import type { CharacterCard } from "@tcg/op-types";
import { op11SilversRayleighSp005I18n } from "./005-silvers-rayleigh-sp.i18n.ts";

export const op11SilversRayleighSp005: CharacterCard = {
  id: "OP09-005",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Roger Pirates"],
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)\n[On Play] If your opponent has 2 or more Characters with a base power of 5000 or more, draw 2 cards and trash 1 card from your hand.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "zoneCount",
            player: "opponent",
            zone: "character",
            comparison: "gte",
            value: 2,
            filters: [
              {
                filter: "basePower",
                comparison: "gte",
                value: 5000,
              },
            ],
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
    ],
  },
  i18n: op11SilversRayleighSp005I18n,
};
