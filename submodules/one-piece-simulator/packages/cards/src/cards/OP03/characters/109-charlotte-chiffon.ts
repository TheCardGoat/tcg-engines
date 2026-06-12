import type { CharacterCard } from "@tcg/op-types";
import { op03CharlotteChiffon109I18n } from "./109-charlotte-chiffon.i18n.ts";

export const op03CharlotteChiffon109: CharacterCard = {
  id: "OP03-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP03",
  cost: 2,
  power: 3000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] You may trash 1 card from the top or bottom of your Life cards: Add up to 1 card from the top of your deck to the top of your Life cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
        ],
        optional: true,
      },
    ],
  },
  i18n: op03CharlotteChiffon109I18n,
};
