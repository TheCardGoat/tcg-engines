import type { ActionCard } from "@tcg/lorcana-types";
import { forceOfAGreatTyphoonI18n } from "./128-force-of-a-great-typhoon.i18n";

export const forceOfAGreatTyphoon: ActionCard = {
  id: "f7h",
  canonicalId: "ci_f7h",
  reprints: ["set11-128"],
  cardType: "action",
  name: "Force of a Great Typhoon",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "011",
  cardNumber: 128,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_dbff3559ccd647889b1fb934994a2d02",
    tcgPlayer: 674694,
  },
  text: "Chosen character gets +5 {S} this turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen character gets +5 {S} this turn.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 5,
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: forceOfAGreatTyphoonI18n,
};
