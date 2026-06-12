import type { CharacterCard } from "@tcg/op-types";
import { op04Tom061I18n } from "./061-tom.i18n.ts";

export const op04Tom061: CharacterCard = {
  id: "OP04-061",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP04",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Fish-Man Water Seven"],
  attribute: "wisdom",
  effect:
    "[Activate:Main] You may trash this Character: If your Leader has the [Water Seven] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Water Seven",
          },
        ],
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op04Tom061I18n,
};
