import type { ActionCard } from "@tcg/lorcana-types";
import { undermineI18n } from "./117-undermine.i18n";

export const undermine: ActionCard = {
  id: "p0c",
  canonicalId: "ci_p0c",
  reprints: ["set8-117"],
  cardType: "action",
  name: "Undermine",
  inkType: ["emerald", "ruby"],
  franchise: "Atlantis",
  set: "008",
  cardNumber: 117,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_056bd71d4a064d9a890c5558a88de654",
    tcgPlayer: 631426,
  },
  text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            chosen: true,
            from: "hand",
            target: "OPPONENT",
            type: "discard",
          },
          {
            chosenBy: "you",
            duration: "this-turn",
            modifier: 2,
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
        ],
        type: "sequence",
      },
      id: "z6k-1",
      text: "Chosen opponent chooses and discards a card. Chosen character gets +2 {S} this turn.",
      type: "action",
    },
  ],
  i18n: undermineI18n,
};
