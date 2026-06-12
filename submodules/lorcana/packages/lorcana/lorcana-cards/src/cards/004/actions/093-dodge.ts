import type { ActionCard } from "@tcg/lorcana-types";
import { dodgeI18n } from "./093-dodge.i18n";

export const dodge: ActionCard = {
  id: "IoO",
  canonicalId: "ci_IoO",
  reprints: ["set4-093"],
  cardType: "action",
  name: "Dodge!",
  inkType: ["emerald"],
  set: "004",
  cardNumber: 93,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_d02ae657899e4523a0db31c20bdb03e9",
    tcgPlayer: 550584,
  },
  text: "Chosen character gains Ward and Evasive until the start of your next turn. (Opponents can't choose them except to challenge. Only characters with Evasive can challenge them.)",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "until-start-of-next-turn",
            keyword: "Ward",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
          },
          {
            duration: "until-start-of-next-turn",
            keyword: "Evasive",
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "2c5-1",
      text: "Chosen character gains Ward and Evasive until the start of your next turn.",
      type: "action",
    },
  ],
  i18n: dodgeI18n,
};
