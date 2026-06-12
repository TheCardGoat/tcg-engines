import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Queen032I18n } from "./032-queen.i18n.ts";

export const op14eb04Queen032: CharacterCard = {
  id: "EB04-032",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP14EB04",
  cost: 1,
  power: 1000,
  counter: 1000,
  traits: ["Animal Kingdom Pirates"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 {Animal Kingdom Pirates} type card from your hand: Draw 2 cards. [Activate: Main] [Once Per Turn] You may rest 2 of your DON!! cards: If your Leader has the {Animal Kingdom Pirates} type, add up to 1 DON!! card from your DON!! deck and rest it.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op14eb04Queen032I18n,
};
