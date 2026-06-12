import type { ItemCard } from "@tcg/lorcana-types";
import { wildcatsWrenchI18n } from "./031-wildcats-wrench.i18n";

export const wildcatsWrench: ItemCard = {
  id: "vtL",
  canonicalId: "ci_vtL",
  reprints: ["set3-031"],
  cardType: "item",
  name: "Wildcat's Wrench",
  inkType: ["amber"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 31,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_e46266028977431da15b820d9f665664",
    tcgPlayer: 538229,
  },
  text: [
    {
      title: "REBUILD",
      description: "{E} — Remove up to 2 damage from chosen location.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: { type: "up-to", value: 2 },
        target: {
          cardTypes: ["location"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "1wk-1",
      name: "REBUILD",
      text: "REBUILD {E} — Remove up to 2 damage from chosen location.",
      type: "activated",
    },
  ],
  i18n: wildcatsWrenchI18n,
};
