import type { ItemCard } from "@tcg/lorcana-types";
import { healingDecanterI18n } from "./030-healing-decanter.i18n";

export const healingDecanter: ItemCard = {
  id: "5HB",
  canonicalId: "ci_5HB",
  reprints: ["set5-030"],
  cardType: "item",
  name: "Healing Decanter",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 30,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_af887c9fbbbf4e12bf91a9d221681e71",
    tcgPlayer: 560645,
  },
  text: [
    {
      title: "RENEWING ESSENCE",
      description: "{E} — Remove up to 2 damage from chosen character.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: { type: "up-to", value: 2 },
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      id: "el0-1",
      name: "RENEWING ESSENCE",
      text: "RENEWING ESSENCE {E} — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
  ],
  i18n: healingDecanterI18n,
};
