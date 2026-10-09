import type { CharacterCard } from "@tcg/op-types";
import { st05Carina005I18n } from "./st05-005-carina.i18n.ts";

export const st05Carina005: CharacterCard = {
  id: "ST05-005",
  canonicalId: "ST05-005",
  slug: "carina/st05-005",
  name: "Carina",
  printings: [
    {
      id: "ST05-005",
      artId: "ST05-005",
      setCode: "ST05",
      collectorNumber: "005",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST05-005.png",
    },
  ],
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "ST05",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["FILM", "Grantesoro"],
  attribute: "wisdom",
  effect:
    "[Activate: Main] [Once Per Turn] You may rest this Character and trash 1 {FILM} type card from your hand: If your opponent has more DON!! cards on their field than you, add 2 DON!! cards from your DON!! deck and rest them.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
          {
            cost: "trashFromHand",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "FILM",
                match: "exact",
              },
            ],
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 2,
            },
            state: "rested",
            condition: {
              condition: "donFieldComparison",
              selfComparison: "lt",
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: st05Carina005I18n,
};
