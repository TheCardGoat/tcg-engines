import type { ActionCard } from "@tcg/lorcana-types";
import { educationOrEliminationI18n } from "./097-education-or-elimination.i18n";

export const educationOrElimination: ActionCard = {
  id: "y2L",
  canonicalId: "ci_y2L",
  reprints: ["set11-097"],
  cardType: "action",
  name: "Education or Elimination",
  inkType: ["emerald"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 97,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_69c74f5a7fcb431290622e2321e786fe",
    tcgPlayer: 676208,
  },
  text: [
    {
      title: "Choose one:",
    },
    {
      title:
        "* Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
    },
    {
      title: "* Banish chosen damaged character.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Choose one: Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn. Banish chosen damaged character.",
      effect: {
        type: "choice",
        optionLabels: [
          "Draw a card. Chosen character of yours gets +1 {L} and gains Evasive until the start of your next turn.",
          "Banish chosen damaged character.",
        ],
        options: [
          {
            type: "sequence",
            steps: [
              {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
              {
                type: "modify-stat",
                stat: "lore",
                modifier: 1,
                duration: "until-start-of-next-turn",
                target: "CHOSEN_CHARACTER_OF_YOURS",
              },
              {
                type: "gain-keyword",
                keyword: "Evasive",
                duration: "until-start-of-next-turn",
                target: {
                  ref: "previous-target",
                },
              },
            ],
          },
          {
            type: "banish",
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
        ],
      },
    },
  ],
  i18n: educationOrEliminationI18n,
};
