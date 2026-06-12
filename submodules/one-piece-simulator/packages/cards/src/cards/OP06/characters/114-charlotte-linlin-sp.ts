import type { CharacterCard } from "@tcg/op-types";
import { op06CharlotteLinlinSp114I18n } from "./114-charlotte-linlin-sp.i18n.ts";

export const op06CharlotteLinlinSp114: CharacterCard = {
  id: "OP03-114",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "OP06",
  cost: 10,
  power: 12000,
  traits: ["The Four Emperors Big Mom Pirates"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the [Big Mom Pirates] type, add up to 1 card from the top of your deck to the top of your Life cards. Then, trash up to 1 card from the top of your opponent's Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Big Mom Pirates",
          },
        ],
        actions: [
          {
            action: "addToLife",
            target: {
              player: "self",
              zones: ["deck"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            position: "top",
          },
          {
            action: "removeFromLife",
            player: "opponent",
            count: {
              amount: 1,
              upTo: true,
            },
            destination: "trash",
          },
        ],
      },
    ],
  },
  i18n: op06CharlotteLinlinSp114I18n,
};
