import type { ActionCard } from "@tcg/lorcana-types";
import { improviseI18n } from "./099-improvise.i18n";

export const improvise: ActionCard = {
  id: "EPR",
  canonicalId: "ci_nRj",
  reprints: ["set2-099", "set9-096"],
  cardType: "action",
  name: "Improvise",
  inkType: ["emerald"],
  franchise: "Mulan",
  set: "002",
  cardNumber: 99,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_856e21edc8814f10863eae7f75635f23",
    tcgPlayer: 650034,
  },
  text: "Chosen character gets +1 {S} this turn. Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "strength",
            modifier: 1,
            duration: "this-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: improviseI18n,
};
