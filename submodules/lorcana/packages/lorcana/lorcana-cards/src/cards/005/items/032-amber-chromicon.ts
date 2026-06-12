import type { ItemCard } from "@tcg/lorcana-types";
import { amberChromiconI18n } from "./032-amber-chromicon.i18n";

export const amberChromicon: ItemCard = {
  id: "1vP",
  canonicalId: "ci_1vP",
  reprints: ["set5-032"],
  cardType: "item",
  name: "Amber Chromicon",
  inkType: ["amber"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 32,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a849716500754889824d4a9aeb2c6b84",
    tcgPlayer: 560093,
  },
  text: [
    {
      title: "AMBER LIGHT",
      description: "{E} — Remove up to 1 damage from each of your characters.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: { type: "up-to", value: 1 },
        target: "YOUR_CHARACTERS",
        type: "remove-damage",
      },
      id: "1yv-1",
      name: "AMBER LIGHT",
      text: "AMBER LIGHT {E} — Remove up to 1 damage from each of your characters.",
      type: "activated",
    },
  ],
  i18n: amberChromiconI18n,
};
