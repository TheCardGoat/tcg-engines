import type { ItemCard } from "@tcg/lorcana-types";
import { eyeOfTheFatesI18n } from "./167-eye-of-the-fates.i18n";

export const eyeOfTheFates: ItemCard = {
  id: "xSb",
  canonicalId: "ci_xSb",
  reprints: ["set1-167"],
  cardType: "item",
  name: "Eye of the Fates",
  inkType: ["sapphire"],
  franchise: "Hercules",
  set: "001",
  cardNumber: 167,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_2c6eae027003403c832a8463afbb6ec0",
    tcgPlayer: 508825,
  },
  text: [
    {
      title: "SEE THE FUTURE",
      description: "{E} — Chosen character gets +1 {L} this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1mp-1",
      name: "SEE THE FUTURE",
      text: "SEE THE FUTURE {E} — Chosen character gets +1 {L} this turn.",
      type: "activated",
    },
  ],
  i18n: eyeOfTheFatesI18n,
};
