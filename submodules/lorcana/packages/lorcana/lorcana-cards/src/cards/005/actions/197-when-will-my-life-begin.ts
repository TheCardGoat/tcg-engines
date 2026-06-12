import type { ActionCard } from "@tcg/lorcana-types";
import { whenWillMyLifeBeginI18n } from "./197-when-will-my-life-begin.i18n";

export const whenWillMyLifeBegin: ActionCard = {
  id: "6iQ",
  canonicalId: "ci_6iQ",
  reprints: ["set5-197"],
  cardType: "action",
  name: "When Will My Life Begin?",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 197,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_f4219fc0ab3a47ed9fc0b3f5f705f597",
    tcgPlayer: 559754,
  },
  text: "Chosen character can't challenge during their next turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "their-next-turn",
            restriction: "cant-challenge",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "restriction",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "1ay-1",
      text: "Chosen character can't challenge during their next turn. Draw a card.",
      type: "action",
    },
  ],
  i18n: whenWillMyLifeBeginI18n,
};
