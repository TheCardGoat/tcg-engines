import type { CharacterCard } from "@tcg/op-types";
import { op01Speed104I18n } from "./104-speed.i18n.ts";

export const op01Speed104: CharacterCard = {
  id: "OP01-104",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP01",
  cost: 2,
  power: 3000,
  counter: 1000,
  trigger: "Play this card.",
  traits: ["Animal Kingdom Pirates SMILE"],
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
  i18n: op01Speed104I18n,
};
