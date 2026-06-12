import type { ActionCard } from "@tcg/lorcana-types";
import { holdStillI18n } from "./028-hold-still.i18n";

export const holdStill: ActionCard = {
  id: "T4i",
  canonicalId: "ci_T4i",
  reprints: ["set2-028"],
  cardType: "action",
  name: "Hold Still",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 28,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7672e43ea7ac4d9a8a51e463a77b6358",
    tcgPlayer: 527726,
  },
  text: "Remove up to 4 damage from chosen character.",
  abilities: [
    {
      type: "action",
      effect: {
        amount: { type: "up-to", value: 4 },
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
    },
  ],
  i18n: holdStillI18n,
};
