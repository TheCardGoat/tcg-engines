import type { CharacterCard } from "@tcg/op-types";
import { st11Uta002I18n } from "./st11-002-uta.i18n.ts";
export const st11Uta002: CharacterCard = {
  id: "ST11-002",
  canonicalId: "ST11-002",
  slug: "uta/st11-002",
  name: "Uta",
  printings: [
    {
      id: "ST11-002",
      artId: "ST11-002",
      setCode: "ST11",
      collectorNumber: "002",
      rarity: "SR",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST11-002.png",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "ST11",
  traits: ["Music", "FILM"],
  cost: 3,
  power: 4000,
  counter: 1000,
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [End of Your Turn] You may trash 1 Event from your hand: Set up to 1 of your {FILM} type Characters as active.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "endOfYourTurn",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "cardCategory",
                value: "event",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "FILM",
                  match: "exact",
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: st11Uta002I18n,
};
