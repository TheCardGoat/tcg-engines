import type { ItemCard } from "@tcg/lorcana-types";
import { dinglehopperI18n } from "./032-dinglehopper.i18n";

export const dinglehopper: ItemCard = {
  id: "hoX",
  canonicalId: "ci_hoX",
  reprints: ["set1-032"],
  cardType: "item",
  name: "Dinglehopper",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 32,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4ab0c55e07324d30903f51b7bbd41c8d",
    tcgPlayer: 492733,
  },
  text: [
    {
      title: "STRAIGHTEN HAIR",
      description: "{E} — Remove up to 1 damage from chosen character.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: { type: "up-to", value: 1 },
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      id: "7r6-1",
      name: "STRAIGHTEN HAIR",
      text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
      type: "activated",
    },
  ],
  i18n: dinglehopperI18n,
};
