import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Ran114I18n } from "./114-ran.i18n.ts";

export const op14eb04Ran114: CharacterCard = {
  id: "OP14-114",
  cardType: "character",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger: "If your Leader has the {Kuja Pirates} type, play this card.",
  traits: ["Kuja Pirates"],
  attribute: "ranged",
  effect:
    "[Activate: Main] [Once Per Turn] Give up to 1 rested DON!! card to 1 of your {Kuja Pirates} type Leader or Character cards.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Kuja Pirates",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Ran114I18n,
};
