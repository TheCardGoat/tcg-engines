import type { ActionCard } from "@tcg/lorcana-types";
import { makeThePotionI18n } from "./094-make-the-potion.i18n";

export const makeThePotion: ActionCard = {
  id: "Ttp",
  canonicalId: "ci_SBd",
  reprints: ["set4-094", "set9-098"],
  cardType: "action",
  name: "Make the Potion",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "004",
  cardNumber: 94,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5ecd4f8d0e8f44f8bda2b3986c6da49a",
    tcgPlayer: 650036,
  },
  text: [
    {
      title: "Choose one:",
    },
    {
      title: "• Banish chosen item.",
    },
    {
      title: "• Deal 2 damage to chosen damaged character.",
    },
  ],
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
          {
            type: "deal-damage",
            amount: 2,
            target: "CHOSEN_DAMAGED_CHARACTER",
          },
        ],
      },
    },
  ],
  i18n: makeThePotionI18n,
};
