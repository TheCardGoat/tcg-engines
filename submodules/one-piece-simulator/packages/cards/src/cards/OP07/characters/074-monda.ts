import type { CharacterCard } from "@tcg/op-types";
import { op07Monda074I18n } from "./074-monda.i18n.ts";

export const op07Monda074: CharacterCard = {
  id: "OP07-074",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Animal Foxy Pirates"],
  attribute: "strike",
  effect:
    "[Activate: Main] You may trash this Character: If your Leader has the [Foxy Pirates] type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Foxy Pirates",
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
  i18n: op07Monda074I18n,
};
