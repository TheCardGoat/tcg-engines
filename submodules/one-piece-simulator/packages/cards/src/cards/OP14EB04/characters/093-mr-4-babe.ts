import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Mr4Babe093I18n } from "./093-mr-4-babe.i18n.ts";

export const op14eb04Mr4Babe093: CharacterCard = {
  id: "OP14-093",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Baroque Works"],
  attribute: "strike",
  effect:
    '[Blocker]\n[On K.O.] Add up to 1 Character card with a type including "Baroque Works" and a cost of 8 or less from your trash to your hand.',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onKo",
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cardCategory",
                  value: "character",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Mr4Babe093I18n,
};
