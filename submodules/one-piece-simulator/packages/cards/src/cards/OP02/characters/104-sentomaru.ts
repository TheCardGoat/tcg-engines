import type { CharacterCard } from "@tcg/op-types";
import { op02Sentomaru104I18n } from "./104-sentomaru.i18n.ts";

export const op02Sentomaru104: CharacterCard = {
  id: "OP02-104",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Navy"],
  attribute: "slash",
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
  i18n: op02Sentomaru104I18n,
};
