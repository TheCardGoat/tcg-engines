import type { ActionCard } from "@tcg/lorcana-types";
import { pouncingPracticeI18n } from "./176-pouncing-practice.i18n";

export const pouncingPractice: ActionCard = {
  id: "kf3",
  canonicalId: "ci_kf3",
  reprints: ["set8-176"],
  cardType: "action",
  name: "Pouncing Practice",
  inkType: ["sapphire"],
  franchise: "Lion King",
  set: "008",
  cardNumber: 176,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_80199d9b642b481ba9a0b3435f1756de",
    tcgPlayer: 631469,
  },
  text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn. (They can challenge characters with Evasive.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "this-turn",
            modifier: -2,
            stat: "strength",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "modify-stat",
          },
          {
            duration: "this-turn",
            keyword: "Evasive",
            target: {
              selector: "chosen",
              count: 1,
              owner: "you",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "59j-1",
      text: "Chosen character gets -2 {S} this turn. Chosen character of yours gains Evasive this turn.",
      type: "action",
    },
  ],
  i18n: pouncingPracticeI18n,
};
