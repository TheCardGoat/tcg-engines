import type { ActionCard } from "@tcg/lorcana-types";
import { hypnotizeI18n } from "./098-hypnotize.i18n";

export const hypnotize: ActionCard = {
  id: "Sez",
  canonicalId: "ci_Sez",
  reprints: ["set2-098"],
  cardType: "action",
  name: "Hypnotize",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "002",
  cardNumber: 98,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_1391eb60b4054ac9a02e6b1f0e150c0f",
    tcgPlayer: 518790,
  },
  text: "Each opponent chooses and discards a card. Draw a card.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            amount: 1,
            chosen: true,
            target: "EACH_OPPONENT",
            type: "discard",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
      },
    },
  ],
  i18n: hypnotizeI18n,
};
