import type { CharacterCard } from "@tcg/op-types";
import { op01Carrot009I18n } from "./009-carrot.i18n.ts";

export const op01Carrot009: CharacterCard = {
  id: "OP01-009",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Minks"],
  attribute: "strike",
  effect: "[Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op01Carrot009I18n,
};
