import type { CharacterCard } from "@tcg/op-types";
import { op05RikuDoldoIii090I18n } from "./090-riku-doldo-iii.i18n.ts";

export const op05RikuDoldoIii090: CharacterCard = {
  id: "OP05-090",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] / [On K.O.] Up to 1 of your [Dressrosa] type Characters gains +2000 power during this turn.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "onKo",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Dressrosa",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op05RikuDoldoIii090I18n,
};
