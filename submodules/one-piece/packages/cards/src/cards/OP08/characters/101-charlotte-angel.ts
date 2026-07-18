import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteAngel101I18n } from "./101-charlotte-angel.i18n.ts";

export const op08CharlotteAngel101: CharacterCard = {
  id: "OP08-101",
  canonicalId: "OP08-101",
  slug: "charlotte-angel",
  name: "Charlotte Angel",
  printings: [
    {
      id: "OP08-101",
      artId: "OP08-101",
      setCode: "OP08",
      collectorNumber: "101",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-101.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "slash",
  effect:
    "[Activate:Main] [Once Per Turn] You may trash 1 card from the top of your Life cards: If your Leader has the [Big Mom Pirates] type, add 1 card from the top of your deck to the top of your Life cards at the end of this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "trashLife",
            amount: 1,
            position: "top",
          },
        ],
        actions: [
          {
            action: "delayed",
            timing: "endOfThisTurn",
            actions: [
              {
                action: "addToLife",
                target: {
                  player: "self",
                  zones: ["deck"],
                  count: {
                    amount: 1,
                  },
                },
                position: "top",
              },
            ],
            condition: {
              condition: "leaderTrait",
              trait: "Big Mom Pirates",
              match: "includes",
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op08CharlotteAngel101I18n,
};
