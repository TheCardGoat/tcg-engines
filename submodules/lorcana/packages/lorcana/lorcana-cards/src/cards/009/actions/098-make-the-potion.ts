import type { ActionCard } from "@tcg/lorcana-types";
import { makeThePotionI18n } from "./098-make-the-potion.i18n";

export const makeThePotion: ActionCard = {
  id: "qSX",
  canonicalId: "ci_SBd",
  slug: "lorcana-ci_SBd",
  printings: [
    {
      id: "set9-098",
      artId: "set9-098",
      setCode: "set9",
      collectorNumber: "98",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set4-094", "set9-098"],
  cardType: "action",
  name: "Make the Potion",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 98,
  rarity: "common",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5ecd4f8d0e8f44f8bda2b3986c6da49a",
    tcgPlayer: "650036",
  },
  text: "Choose one: • Banish chosen item. • Deal 2 damage to chosen damaged character.",
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
