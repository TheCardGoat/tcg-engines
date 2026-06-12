import type { ActionCard } from "@tcg/lorcana-types";
import { baboomI18n } from "./196-ba-boom.i18n";

export const baboom: ActionCard = {
  id: "GSJ",
  canonicalId: "ci_GSJ",
  reprints: ["set3-196"],
  cardType: "action",
  name: "Ba-Boom!",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 196,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_8355f42d81564fc288c8e67b0f04628c",
    tcgPlayer: 537636,
  },
  text: "Deal 2 damage to chosen character or location.",
  abilities: [
    {
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER_OR_LOCATION",
        type: "deal-damage",
      },
      type: "action",
    },
  ],
  i18n: baboomI18n,
};
