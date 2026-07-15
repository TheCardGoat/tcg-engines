import type { ActionCard } from "@tcg/lorcana-types";
import { fireTheCannonsI18n } from "./200-fire-the-cannons.i18n";

export const fireTheCannons: ActionCard = {
  id: "K1w",
  canonicalId: "ci_Ots",
  slug: "lorcana-ci_Ots",
  printings: [
    {
      id: "set9-200",
      artId: "set9-200",
      setCode: "set9",
      collectorNumber: "200",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-197", "set9-200"],
  cardType: "action",
  name: "Fire the Cannons!",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "009",
  cardNumber: 200,
  rarity: "common",
  cost: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_5056d5a4da8e4d9bb329620e1e77329b",
    tcgPlayer: "650133",
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
