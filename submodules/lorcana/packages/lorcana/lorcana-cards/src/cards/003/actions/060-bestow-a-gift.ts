import type { ActionCard } from "@tcg/lorcana-types";
import { bestowAGiftI18n } from "./060-bestow-a-gift.i18n";

export const bestowAGift: ActionCard = {
  id: "3hQ",
  canonicalId: "ci_3hQ",
  reprints: ["set3-060"],
  cardType: "action",
  name: "Bestow a Gift",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "003",
  cardNumber: 60,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f3f30e7e137c4336a2551abfa4b4eeaf",
    tcgPlayer: 537626,
  },
  text: "Move 1 damage counter from chosen character to chosen opposing character.",
  abilities: [
    {
      type: "action",
      text: "Move 1 damage counter from chosen character to chosen opposing character.",
      effect: {
        type: "move-damage",
        amount: 1,
        from: "CHOSEN_CHARACTER",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: bestowAGiftI18n,
};
