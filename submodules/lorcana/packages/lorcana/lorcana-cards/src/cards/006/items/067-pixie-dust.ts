import type { ItemCard } from "@tcg/lorcana-types";
import { pixieDustI18n } from "./067-pixie-dust.i18n";

export const pixieDust: ItemCard = {
  id: "lTK",
  canonicalId: "ci_lTK",
  reprints: ["set6-067"],
  cardType: "item",
  name: "Pixie Dust",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  cardNumber: 67,
  rarity: "uncommon",
  cost: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_030f9799a2ef4cc0afedc46a03650e70",
    tcgPlayer: 583854,
  },
  text: [
    {
      title: "FAITH AND TRUST",
      description:
        "{E}, {2} {I} — Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Challenger",
            value: 2,
            duration: "until-start-of-next-turn",
            target: "CHOSEN_CHARACTER",
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
      id: "100-1",
      name: "FAITH AND TRUST",
      text: "FAITH AND TRUST {E}, 2 {I} — Chosen character gains Challenger +2 and Evasive until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: pixieDustI18n,
};
