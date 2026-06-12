import type { ActionCard } from "@tcg/lorcana-types";
import { riseOfTheTitansI18n } from "./198-rise-of-the-titans.i18n";

export const riseOfTheTitans: ActionCard = {
  id: "uvL",
  canonicalId: "ci_uvL",
  reprints: ["set3-198"],
  cardType: "action",
  name: "Rise of the Titans",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 198,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_d36e3111ff2a40f4916b08b01de3cbeb",
    tcgPlayer: 537609,
  },
  text: "Banish chosen location or item.",
  abilities: [
    {
      effect: {
        target: "CHOSEN_ITEM_OR_LOCATION",
        type: "banish",
      },
      type: "action",
    },
  ],
  i18n: riseOfTheTitansI18n,
};
