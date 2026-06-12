import type { ActionCard } from "@tcg/lorcana-types";
import { fireTheCannonsI18n } from "./197-fire-the-cannons.i18n";

export const fireTheCannons: ActionCard = {
  id: "BFV",
  canonicalId: "ci_Ots",
  reprints: ["set1-197", "set9-200"],
  cardType: "action",
  name: "Fire the Cannons!",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 197,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5056d5a4da8e4d9bb329620e1e77329b",
    tcgPlayer: 650133,
  },
  text: "Deal 2 damage to chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "deal-damage",
        amount: 2,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: fireTheCannonsI18n,
};
