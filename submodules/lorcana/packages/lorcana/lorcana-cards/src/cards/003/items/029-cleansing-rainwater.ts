import type { ItemCard } from "@tcg/lorcana-types";
import { cleansingRainwaterI18n } from "./029-cleansing-rainwater.i18n";

export const cleansingRainwater: ItemCard = {
  id: "fol",
  canonicalId: "ci_fol",
  reprints: ["set3-029"],
  cardType: "item",
  name: "Cleansing Rainwater",
  inkType: ["amber"],
  franchise: "Raya and the Last Dragon",
  set: "003",
  cardNumber: 29,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_46df24a1b90a460d8572440c007f0af5",
    tcgPlayer: 537406,
  },
  text: [
    {
      title: "ANCIENT POWER",
      description: "Banish this item — Remove up to 2 damage from each of your characters.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        amount: { type: "up-to", value: 2 },
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "you",
          selector: "all",
          zones: ["play"],
        },
        type: "remove-damage",
      },
      id: "w7f-1",
      name: "ANCIENT POWER",
      text: "ANCIENT POWER Banish this item — Remove up to 2 damage from each of your characters.",
      type: "activated",
    },
  ],
  i18n: cleansingRainwaterI18n,
};
